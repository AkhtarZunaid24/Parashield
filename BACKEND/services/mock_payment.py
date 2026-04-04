import time
import random
import hashlib
from datetime import datetime

class MockPaymentService:
    def __init__(self):
        # We simulate routing payments through a fast L2 blockchain like Polygon
        self.network = "POLYGON_MAINNET"
        
        # The payout tiers we established for GigGuard
        self.payout_tiers = {
            "LOW": 200,    # e.g., Mild waterlogging
            "MEDIUM": 400, # e.g., Severe storm / AQI Hazard
            "HIGH": 720    # e.g., Full-day gridlock
        }

    def trigger_automated_payout(self, rider_id: str, severity: str, trigger_reason: str) -> dict:
        """
        Simulates the execution of a Parametric Smart Contract dispersing funds instantly.
        """
        severity = severity.upper()
        amount = self.payout_tiers.get(severity)

        if not amount:
            return {"status": "ERROR", "message": f"Invalid severity level: {severity}"}

        # Generate a hyper-realistic blockchain transaction hash (e.g., 0x4f8a...)
        raw_data = f"{rider_id}-{amount}-{time.time()}-{random.random()}".encode('utf-8')
        txn_hash = "0x" + hashlib.sha256(raw_data).hexdigest()

        # Print a dramatic log to the terminal for your demo recording
        print("\n" + "="*50)
        print("⚡ SMART CONTRACT TRIGGERED ⚡")
        print(f"Rider ID: {rider_id}")
        print(f"Reason:   {trigger_reason}")
        print(f"Amount:   ₹{amount} INR (Routed via USDC)")
        print(f"Txn Hash: {txn_hash}")
        print("="*50 + "\n")

        return {
            "payout_status": "SUCCESS",
            "transaction_hash": txn_hash,
            "rider_id": rider_id,
            "amount_inr": amount,
            "settlement_network": self.network,
            "timestamp": datetime.now().isoformat(),
            # A fake link that looks incredibly professional for a demo
            "block_explorer_url": f"https://polygonscan.com/tx/{txn_hash}", 
            "trigger_event": trigger_reason
        }

# Instantiate the singleton service
payment_service = MockPaymentService()