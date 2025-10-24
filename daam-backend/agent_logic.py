from typing import TypedDict, List, Dict, Any, Optional, Literal
from langgraph.graph import StateGraph, END
from langchain_ollama import OllamaLLM
import httpx
import re
import json
from web3 import Web3
from web3.contract import Contract
from eth_typing import ChecksumAddress
from eth_utils.address import to_checksum_address
from event_bus import agent_bus, status_store
from portfolio import portfolio

# Agent State Type Definition
class AgentState(TypedDict):
    domains_to_check: List[str]
    domains_checked_count: int
    current_domain: str
    analysis_score: float
    risk_score: float
    decision: str

class AgentWorkflow:
    def __init__(self, w3: Web3, vault_contract: Contract, agent_address: str, agent_private_key: str):
        self.w3 = w3
        self.vault_contract = vault_contract
        self.agent_address: ChecksumAddress = to_checksum_address(agent_address)
        self.agent_private_key = agent_private_key
        
        # Initialize Ollama with fallback
        self.ollama_available = self._check_ollama_connection()
        if self.ollama_available:
            try:
                self.llm = OllamaLLM(model="llama3")
                print("✅ Ollama connection successful - using real LLM analysis")
            except Exception as e:
                print(f"⚠️  Ollama model loading failed: {e} - using mock analysis")
                self.ollama_available = False
        else:
            print("⚠️  Ollama not available - using mock analysis")
        
        # Store the compiled graph
        self.compiled_graph = self._build_graph()

    def _check_ollama_connection(self) -> bool:
        """Check if Ollama is running and accessible"""
        try:
            response = httpx.get("http://localhost:11434", timeout=3.0)
            return response.status_code == 200
        except:
            return False

    def _mock_domain_analysis(self, domain: str) -> float:
        """Generate realistic mock scores for demo purposes"""
        import hashlib
        hash_obj = hashlib.md5(domain.encode())
        hash_value = int(hash_obj.hexdigest()[:8], 16)
        normalized_score = (hash_value % 71) / 10.0  # 0.0 to 7.0 range
        return max(4.0, min(8.5, normalized_score + 2.5))  # Ensure reasonable range

    def _build_graph(self):
        """Build and compile the agent workflow graph"""
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("scan_market", self.scan_market)
        workflow.add_node("evaluate_domain", self.evaluate_domain)
        workflow.add_node("assess_risk", self.assess_risk)
        workflow.add_node("make_decision", self.make_decision)
        workflow.add_node("execute_purchase", self.execute_purchase)
        workflow.add_node("continue_or_end", self.continue_or_end)
        
        # Define edges
        workflow.set_entry_point("scan_market")
        workflow.add_edge("scan_market", "evaluate_domain")
        workflow.add_edge("evaluate_domain", "assess_risk")
        workflow.add_edge("assess_risk", "make_decision")
        workflow.add_conditional_edges(
            "make_decision",
            self.decision_router,
            {"buy": "execute_purchase", "pass": "continue_or_end"}
        )
        workflow.add_edge("execute_purchase", "continue_or_end")
        workflow.add_conditional_edges(
            "continue_or_end",
            self.continue_router,
            {"continue": "evaluate_domain", "end": END}
        )
        
        # Return the compiled graph
        return workflow.compile()

    def scan_market(self, state: AgentState) -> AgentState:
        """Scan the ENS market for available domains"""
        print("\n--- SCANNING MARKET (LIVE) ---")
        
        # Mock ENS domains for demo
        domains = [
            "jakewest.eth", "subgenre.eth", "loganwest.eth", "smartunlimitedofthewest.eth",
            "ai-jobs.eth", "chainthreat.eth", "sheaunti.eth", "42invest.eth",
            "alyssaputnam.eth", "arturdegen.eth", "cryptoking.eth", "defimaster.eth",
            "nftcollector.eth", "blockchainpro.eth", "ethereumdev.eth"
        ]
        
        print(f"Found {len(domains)} domains to analyze: {domains}")
        
        agent_bus.publish({
            "type": "domains",
            "domains": domains,
            "message": f"Loaded {len(domains)} domains for analysis"
        })
        
        status_store.update({
            "domains_found": len(domains),
            "progress": {"done": 0, "total": len(domains)}
        })
        
        return {**state, "domains_to_check": domains, "domains_checked_count": 0}

    def evaluate_domain(self, state: AgentState) -> AgentState:
        """Evaluate a domain's investment potential"""
        domains = state["domains_to_check"]
        checked_count = state["domains_checked_count"]
        
        if checked_count >= len(domains):
            return state
            
        current_domain = domains[checked_count]
        print(f"\n--- EVALUATING DOMAIN ({checked_count + 1}/{len(domains)}): {current_domain} ---")
        
        if self.ollama_available:
            prompt = f"""
            Evaluate the investment potential of the ENS domain '{current_domain}' on a scale of 1-10.
            Consider factors like brandability, memorability, commercial potential, and market demand.
            Respond with only a number between 1-10, followed by a brief explanation.
            """
            
            try:
                response = self.llm.invoke(prompt)
                print(f"LLM Raw Response: {repr(response)}")
                
                # Extract numeric score
                score_match = re.search(r'\b(\d+(?:\.\d+)?)\b', str(response))
                if score_match:
                    score = float(score_match.group(1))
                    score = max(1.0, min(10.0, score))  # Clamp to 1-10 range
                else:
                    score = 5.0  # Fallback
                    
            except Exception as e:
                print(f"LLM evaluation failed: {e}")
                score = self._mock_domain_analysis(current_domain)
        else:
            score = self._mock_domain_analysis(current_domain)
            
        print(f"Investment Score: {score}")
        
        # Update progress
        progress = {"done": checked_count + 1, "total": len(domains)}
        
        # Publish events
        agent_bus.publish({
            "type": "score",
            "domain": current_domain,
            "score": score,
            "message": f"Scored {current_domain}: {score}/10"
        })
        
        status_store.update({
            "current_domain": current_domain,
            "last_score": score,
            "progress": progress
        })
        
        return {
            **state,
            "current_domain": current_domain,
            "analysis_score": score,
            "domains_checked_count": checked_count + 1
        }

    def assess_risk(self, state: AgentState) -> AgentState:
        """Assess risk for the current domain"""
        score = state["analysis_score"]
        domain = state["current_domain"]
        
        print("\n--- ASSESSING RISK ---")
        
        # Risk is inverse of score (higher score = lower risk)
        risk_score = max(1.0, 10.0 - score)
        print(f"Risk Score: {risk_score}")
        
        agent_bus.publish({
            "type": "risk",
            "domain": domain,
            "risk": risk_score,
            "message": f"Risk assessment {domain}: {risk_score}/10"
        })
        
        status_store.update({"last_risk": risk_score})
        
        return {**state, "risk_score": risk_score}

    def make_decision(self, state: AgentState) -> AgentState:
        """Make buy/pass decision based on score and risk"""
        score = state["analysis_score"]
        risk = state["risk_score"]
        domain = state["current_domain"]
        
        print("\n--- MAKING DECISION ---")
        
        # Lower threshold for demo: buy if score >= 6.0
        if score >= 6.0 and risk <= 5.0:
            decision = "buy"
            print(f"DECISION: Score {score} is high enough for '{domain}'. Recommending to BUY.")
        else:
            decision = "pass"
            print(f"DECISION: Score {score} not high enough for '{domain}'. Recommending to pass.")
        
        agent_bus.publish({
            "type": "decision",
            "domain": domain,
            "decision": decision,
            "score": score,
            "risk": risk,
            "message": f"Decision {domain}: {decision} (score {score}, risk {risk})"
        })
        
        status_store.update({"last_decision": decision})
        
        return {**state, "decision": decision}

    def execute_purchase(self, state: AgentState) -> AgentState:
        """Execute domain purchase"""
        domain = state["current_domain"]
        score = state["analysis_score"]
        print(f"\n--- EXECUTING PURCHASE FOR {domain} ---")
        
        # Determine purchase amount based on score (0.01-0.05 ETH)
        value_eth = max(0.01, min(0.05, score * 0.005))
        
        try:
            # Simple transaction structure for demo
            transaction = {
                'to': self.vault_contract.address,
                'value': self.w3.to_wei(value_eth, 'ether'),
                'gas': 500000,
                'gasPrice': self.w3.to_wei('20', 'gwei'),
                'nonce': self.w3.eth.get_transaction_count(self.agent_address),
                'chainId': 11155111
            }
            
            # Sign and send transaction
            signed_txn = self.w3.eth.account.sign_transaction(transaction, self.agent_private_key)
            tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            tx_hash_hex = tx_hash.hex()
            
            print(f"Transaction sent: {tx_hash_hex}")
            
            # Publish transaction events
            agent_bus.publish({
                "type": "tx_sending",
                "domain": domain,
                "value_eth": value_eth,
                "tx_hash": tx_hash_hex,
                "message": f"Sending TX for {domain} value {value_eth} ETH"
            })
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            agent_bus.publish({
                "type": "tx_confirmed",
                "domain": domain,
                "tx_hash": tx_hash_hex,
                "block": receipt['blockNumber'],
                "message": f"TX confirmed: {tx_hash_hex} (block {receipt['blockNumber']})"
            })
            
            # Add to portfolio
            portfolio.add_domain(domain, value_eth, tx_hash_hex)
            
            # Update status store
            status_store.update({
                "last_tx_hash": tx_hash_hex,
                "last_purchase": domain,
                "last_purchase_value": value_eth
            })
            
            print(f"✅ Successfully purchased {domain} for {value_eth} ETH")
            
        except Exception as e:
            print(f"❌ Transaction failed: {e}")
            agent_bus.publish({
                "type": "tx_failed",
                "domain": domain,
                "error": str(e),
                "message": f"Transaction failed for {domain}: {str(e)}"
            })
        
        return state

    def continue_or_end(self, state: AgentState) -> AgentState:
        """Decide whether to continue or end the workflow"""
        print("\n--- ROUTER: CHECKING FOR MORE DOMAINS ---")
        return state

    def decision_router(self, state: AgentState) -> Literal["buy", "pass"]:
        """Route based on buy/pass decision"""
        decision = state["decision"]
        if decision in ["buy", "pass"]:
            return decision  # type: ignore
        return "pass"

    def continue_router(self, state: AgentState) -> Literal["continue", "end"]:
        """Route to continue or end based on remaining domains"""
        domains = state["domains_to_check"]
        checked_count = state["domains_checked_count"]
        
        if checked_count < len(domains):
            return "continue"
        else:
            return "end"

    def get_graph(self):
        """Get the compiled workflow graph"""
        return self.compiled_graph
