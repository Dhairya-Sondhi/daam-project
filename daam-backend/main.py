import os
import json
from typing import Any, Dict, cast
from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from web3 import Web3
from eth_typing import ChecksumAddress
from eth_utils.address import to_checksum_address, is_checksum_address
from langchain_core.runnables.config import RunnableConfig
import uvicorn
import queue

from agent_logic import AgentWorkflow, AgentState
from event_bus import agent_bus, status_store
from portfolio import portfolio

# Load environment
load_dotenv()

# --- Validate Environment Variables ---
def get_required_env(key: str) -> str:
    """Get required environment variable or raise error"""
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"{key} is missing in .env")
    return value

# --- Web3 Setup ---
SEPOLIA_RPC_URL = get_required_env("SEPOLIA_RPC_URL")
AGENT_PRIVATE_KEY = get_required_env("AGENT_PRIVATE_KEY")
raw_addr = get_required_env("VAULT_CONTRACT_ADDRESS")

# Provider
w3 = Web3(Web3.HTTPProvider(SEPOLIA_RPC_URL))
if not w3.is_connected():
    raise RuntimeError("Web3 provider failed to connect. Check SEPOLIA_RPC_URL")

# Normalize address to checksum
vault_address: ChecksumAddress = to_checksum_address(raw_addr)
if not is_checksum_address(vault_address):
    raise RuntimeError(f"Invalid VAULT_CONTRACT_ADDRESS after checksum: {raw_addr}")

# Agent account/address
agent_account = w3.eth.account.from_key(AGENT_PRIVATE_KEY)
AGENT_ADDRESS = agent_account.address

# Load ABI
with open("abi.json", "r", encoding="utf-8") as f:
    vault_abi = json.load(f)
if not isinstance(vault_abi, (list, dict)):
    raise RuntimeError("abi.json must contain a JSON list/dict ABI")

# Contract instance
vault_contract = w3.eth.contract(address=vault_address, abi=vault_abi)

app = FastAPI()

# --- CORS ---
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _safe_node_output_value(node_output: Any, key: str, default: Any = "") -> Any:
    if isinstance(node_output, dict):
        return node_output.get(key, default)
    if isinstance(node_output, (list, tuple)) and node_output:
        if isinstance(node_output[0], dict):
            return node_output[0].get(key, default)
        return default
    return default

# --- Agent Container ---
class Agent:
    def __init__(self):
        self.status = "idle"
        self.current_task = "None"

        workflow_manager = AgentWorkflow(
            w3=w3,
            vault_contract=vault_contract,
            agent_address=AGENT_ADDRESS,
            agent_private_key=AGENT_PRIVATE_KEY,
        )
        self.compiled_graph = workflow_manager.get_graph()
        print(f"Agent initialized for address: {AGENT_ADDRESS}")
        print(f"Connected to Web3: {w3.is_connected()}")

    def start_background_task(self):
        """Long-running task executed in background."""
        self.status = "running"
        self.current_task = "scan_market"

        status_store.update({"status": "running", "current_task": "scan_market", "current_domain": ""})
        agent_bus.publish({"type": "start", "message": "Agent run started"})
        agent_bus.publish({"type": "step", "step": "scan_market", "message": "Scanning ENS markets"})

        # Fully-typed initial AgentState
        initial_state: AgentState = {
            "domains_to_check": [],
            "domains_checked_count": 0,
            "current_domain": "",
            "analysis_score": 0.0,
            "risk_score": 0.0,
            "decision": "pass",
        }

        # RunnableConfig compliant object
        config: RunnableConfig = {
            "recursion_limit": 50
        }

        try:
            # Use the compiled graph's stream method
            for event in self.compiled_graph.stream(initial_state, config=config):
                # Each event looks like {"node_name": node_output}
                node_name = list(event.keys())[0]
                node_output = list(event.values())[0]

                # Normalize for safe access
                current_domain = _safe_node_output_value(node_output, "current_domain", "")
                progress = _safe_node_output_value(node_output, "progress", None)

                # Update internal + shared state
                self.current_task = node_name
                status_store.update({
                    "current_task": node_name,
                    "current_domain": current_domain or status_store.get().get("current_domain", "")
                })

                # Emit step event
                agent_bus.publish({
                    "type": "step",
                    "step": node_name,
                    "domain": current_domain or None,
                    "message": node_name.replace("_", " ").title()
                })

                # Forward progress if provided by node
                if isinstance(progress, dict) and "done" in progress and "total" in progress:
                    agent_bus.publish({"type": "progress", "done": progress["done"], "total": progress["total"]})
                    status_store.update({"progress": {"done": progress["done"], "total": progress["total"]}})

                print(f"Agent state update: {self.current_task}")

            print("\n--- GRAPH EXECUTION COMPLETE ---")
            
        except Exception as e:
            print(f"❌ Agent execution failed: {e}")
            agent_bus.publish({"type": "error", "message": f"Agent execution failed: {str(e)}"})
            
        finally:
            self.status = "idle"
            self.current_task = "Finished"
            status_store.update({"status": "completed", "current_task": "None", "current_domain": ""})
            agent_bus.publish({"type": "complete", "message": "Agent run complete"})

    def stop(self):
        self.status = "stopped"
        status_store.update({"status": "stopped"})
        print("Agent process stopped.")

daam_agent = Agent()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "DAAM Backend is running"}

@app.get("/agent/status")
def get_agent_status():
    return status_store.get()

@app.get("/agent/stream")
async def agent_stream(request: Request):
    """
    Server-Sent Events stream for real-time agent updates.
    """
    q = agent_bus.subscribe()

    async def gen():
        # Initial snapshot
        init = status_store.get()
        yield f"event: snapshot\ndata: {json.dumps(init)}\n\n"
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    item = q.get(timeout=1.0)
                    evt_type = item.get("type", "message")
                    yield f"event: {evt_type}\ndata: {json.dumps(item)}\n\n"
                except queue.Empty:
                    yield ": keep-alive\n\n"
        finally:
            agent_bus.unsubscribe(q)

    return StreamingResponse(gen(), media_type="text/event-stream")

@app.post("/agent/start")
def start_agent(background_tasks: BackgroundTasks):
    if daam_agent.status in ("idle", "stopped"):
        print("Starting agent in background...")
        background_tasks.add_task(daam_agent.start_background_task)
        return {"message": "Agent process started in the background."}
    return {"message": "Agent is already running."}

@app.post("/agent/stop")
def stop_agent():
    daam_agent.stop()
    return {"message": "Agent stopped successfully", "status": daam_agent.status, "current_task": "Stopped"}

@app.get("/portfolio")
def get_portfolio():
    try:
        summary = portfolio.get_portfolio_summary()
        return {
            "totalValueUSD": f"{summary['total_value_usd']:.2f}",
            "totalValueETH": f"{summary['total_value_eth']:.4f}",
            "totalInvestedUSD": f"{summary['total_invested_usd']:.2f}",
            "profitLossUSD": f"{summary['profit_loss_usd']:.2f}",
            "profitLossPercent": f"{(summary['profit_loss_eth'] / max(summary['total_invested_eth'], 0.001) * 100):.1f}%" if summary['total_invested_eth'] > 0 else "0.0%",
            "domainsOwned": summary['domains_owned'],
            "domains": summary['domains'],
            "lastUpdated": summary['last_updated']
        }
    except Exception as e:
        print(f"Portfolio error: {e}")
        return {
            "totalValueUSD": "0.00",
            "totalValueETH": "0.0000",
            "totalInvestedUSD": "0.00",
            "profitLossUSD": "0.00",
            "profitLossPercent": "0.0%",
            "domainsOwned": 0,
            "domains": [],
            "lastUpdated": ""
        }

@app.get("/contract/info")
def get_contract_info():
    try:
        owner = vault_contract.functions.owner().call()
        return {
            "contractAddress": vault_contract.address,
            "contractOwner": owner,
            "web3Connected": w3.is_connected(),
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
