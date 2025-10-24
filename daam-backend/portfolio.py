import json
import os
from typing import List, Dict, Any
from datetime import datetime
from threading import Lock

class Portfolio:
    def __init__(self, data_file: str = "portfolio_data.json"):
        self.data_file = data_file
        self.lock = Lock()
        self.data = self._load_data()

    def _load_data(self) -> Dict[str, Any]:
        """Load portfolio data from file"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {
            "domains": [],
            "total_invested": 0.0,
            "total_value": 0.0,
            "last_updated": datetime.now().isoformat()
        }

    def _save_data(self):
        """Save portfolio data to file"""
        with open(self.data_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def add_domain(self, domain: str, purchase_price_eth: float, tx_hash: str):
        """Add a purchased domain to portfolio"""
        with self.lock:
            domain_entry = {
                "domain": domain,
                "purchase_price_eth": purchase_price_eth,
                "purchase_date": datetime.now().isoformat(),
                "tx_hash": tx_hash,
                "current_value_eth": purchase_price_eth
            }
            
            self.data["domains"].append(domain_entry)
            self.data["total_invested"] += purchase_price_eth
            self.data["total_value"] += purchase_price_eth
            self.data["last_updated"] = datetime.now().isoformat()
            
            self._save_data()

    def get_portfolio_summary(self) -> Dict[str, Any]:
        """Get portfolio summary with current values"""
        with self.lock:
            # Simulate price appreciation over time
            total_current_value = 0.0
            for domain in self.data["domains"]:
                days_owned = (datetime.now() - datetime.fromisoformat(domain["purchase_date"])).days
                appreciation = 1.0 + (days_owned * 0.002)  # 0.2% per day
                current_value = domain["purchase_price_eth"] * appreciation
                domain["current_value_eth"] = current_value
                total_current_value += current_value

            self.data["total_value"] = total_current_value
            
            # Convert ETH to USD (mock rate: 1 ETH = $2000)
            eth_to_usd = 2000
            
            return {
                "domains_owned": len(self.data["domains"]),
                "total_invested_eth": self.data["total_invested"],
                "total_invested_usd": self.data["total_invested"] * eth_to_usd,
                "total_value_eth": total_current_value,
                "total_value_usd": total_current_value * eth_to_usd,
                "profit_loss_eth": total_current_value - self.data["total_invested"],
                "profit_loss_usd": (total_current_value - self.data["total_invested"]) * eth_to_usd,
                "domains": self.data["domains"],
                "last_updated": datetime.now().isoformat()
            }

# Global portfolio instance
portfolio = Portfolio()
