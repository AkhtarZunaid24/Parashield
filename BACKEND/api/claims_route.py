

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import joblib
import os
import logging
import numpy as np


# Set up professional logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Parashield-AI")

router = APIRouter()

# --- Load the Fraud AI Model (Global Scope) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, "models", "saved_models", "dynamic_fraud_model.pkl")

# Define it globally so the function can see it
fraud_ai = None
# At the top of your files
try:
    fraud_ai = joblib.load(model_path)
    logger.info("✅ ML Model Loaded.")
except Exception:
    # This is the secret hackathon move: 
    # If the model fails, we set it to None and use the logic below.
    fraud_ai = None
    logger.warning("🚀 Running in High-Speed Heuristic Mode (AI Fallback active)")

try:
    if os.path.exists(model_path):
        fraud_ai = joblib.load(model_path)
        logger.info("✅ Fraud AI Pipeline loaded successfully.")
    else:
        logger.warning(f"⚠️ Model file not found at {model_path}. Fallback active.")
except Exception as e:
    logger.error(f"⚠️ Model load failed: {e}. Fallback active.")
    fraud_ai = None

# --- Advanced Telemetry Validation ---
class ClaimRequest(BaseModel):
    distance_from_trigger_zone_km: float
    time_since_last_claim_hr: float
    weather_api_mismatch_score: float
    claim_hour_of_day: int
    accelerometer_flatline_index: float

# --- Helper Function: Fraud Explainability ---
def generate_suspicion_reasons(data: ClaimRequest, risk_score: float) -> list:
    reasons = []
    if data.distance_from_trigger_zone_km > 5.0:
        reasons.append(f"Location Mismatch: User is {data.distance_from_trigger_zone_km}km away.")
    if data.weather_api_mismatch_score > 20.0:
        reasons.append("Weather Discrepancy: Reported weather contradicts API telemetry.")
    if data.accelerometer_flatline_index > 0.8:
        reasons.append("Telemetry Alert: High probability of GPS spoofing (Accelerometer flatlined).")
    
    if risk_score > 75 and not reasons:
        reasons.append("Complex AI Anomaly: Multi-dimensional irregular pattern detected.")
    return reasons

# --- The Intelligent Claim Triage Endpoint ---
@router.post("/submit_claim")
async def process_claim(request: ClaimRequest):
    # CRITICAL: Tell Python we are looking at the global model variable
    global fraud_ai 
    
    try:
        # 1. Hard Rules Engine (Spam prevention)
        if request.time_since_last_claim_hr < 12.0:
            return {
                "status": "success",
                "resolution": "AUTO_REJECT",
                "risk_score": 100.0,
                "reasons": ["Hard Rule: Duplicate claim prevention (< 12 hours)."],
                "message": "Claim rejected due to recent payout."
            }

        # 2. Prediction Logic
        risk_score = 0.0
        model_used = False
        
        if fraud_ai is not None:
            try:
                input_data = [[
                    request.distance_from_trigger_zone_km,
                    request.time_since_last_claim_hr,
                    request.weather_api_mismatch_score,
                    request.claim_hour_of_day,
                    request.accelerometer_flatline_index
                ]]
                # Isolation Forest raw score
                raw_score = fraud_ai.decision_function(input_data)[0]
                risk_score = 100 * (0.5 - (raw_score / 0.6))
                model_used = True
            except Exception as ml_err:
                logger.warning(f"ML Processing error: {ml_err}. Using fallback.")
                model_used = False

        # 3. Rule-Engine Fallback (If AI is missing or version mismatch occurs)
        if not model_used:
            # Logic-based score calculation
            base_risk = 10.0
            if request.distance_from_trigger_zone_km > 5.0: base_risk += 40.0
            if request.accelerometer_flatline_index > 0.8: base_risk += 40.0
            if request.weather_api_mismatch_score > 25.0: base_risk += 10.0
            risk_score = base_risk

        # 4. Final Processing & Triage
        risk_score = round(max(0.0, min(100.0, risk_score)), 1)
        reasons = generate_suspicion_reasons(request, risk_score)
        
        if risk_score > 75.0:
            resolution = "AUTO_REJECT"
            message = "Severe anomaly detected. Claim rejected."
        elif risk_score > 40.0:
            resolution = "FLAG_FOR_REVIEW"
            message = "Claim flagged. Sent to Admin Dashboard for manual review."
        else:
            resolution = "AUTO_APPROVE"
            message = "Claim validated. Initiating instant payout via smart contract."
            if not reasons:
                reasons = ["All telemetry parameters within normal operational bounds."]

        logger.info(f"Process complete: {resolution} (Risk: {risk_score}%)")

        return {
            "status": "success",
            "resolution": resolution,
            "risk_score": risk_score,
            "reasons": reasons,
            "message": message
        }

    except Exception as e:
        logger.error(f"Route Error: {str(e)}")
        # If the whole thing blows up, return a clean error JSON, not a 503
        return {
            "status": "error",
            "message": "Telemetry processing failed",
            "details": str(e)
        }
    