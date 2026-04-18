from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.weather_api import weather_api
# Import the prediction function from  ML script
from models.premium_model import predict_weekly_premium
import firebase_admin
from firebase_admin import firestore
import random

router = APIRouter()
db = firestore.client()

class QuoteRequest(BaseModel):
    location_name: str
    lat: float
    lon: float

@router.post("/calculate_premium")
async def calculate_premium(request: QuoteRequest):
    # 1. Fetch live risk data (Rainfall, AQI, etc.)
    weather_data = weather_api.get_real_time_risk_data(request.lat, request.lon)
    
    # 2. Fetch the Zone Multiplier from FIRESTORE (The "Truth")
    try:
        doc_ref = db.collection("risk_factors").document(request.location_name)
        doc = doc_ref.get()
        
        if doc.exists:
            zone_info = doc.to_dict()
            # This is the 1.42 or 1.46 we need!
            multiplier = zone_info.get("total_risk_multiplier", 1.0)
        else:
            # Fallback if zone isn't in DB
            multiplier = 1.1 
    except Exception as e:
        print(f"Firestore Error: {e}")
        multiplier = 1.1

    # 3. CALL THE ML MODEL (The "Brain")
    # We pass the multiplier we found in Firestore into the AI
    ml_input = {
        "zone_multiplier": multiplier,
        "predicted_rainfall_mm": weather_data.get("rainfall_mm", 0),
        "active_curfew_days": 0, # Mocked for now
        "market_closure_risk": 0.1, # Mocked for now
        "avg_traffic_congestion": 5 # Mocked for now
    }
    
    # The AI now calculates the price based on your new ₹34-base model
    ai_predicted_price = predict_weekly_premium(ml_input)

    # 4. Apply the Final Capping Logic (The "Safety")
    # Even if AI goes crazy, we cap it at 51
    final_premium = min(ai_predicted_price, 51.0)

    return {
        "location": request.location_name,
        "weekly_premium": round(final_premium, 2),
        "payout_estimate": round(final_premium * 0.85, 2), 
        "risk_analysis": {
            "current_condition": weather_data.get("condition"),
            "zone_multiplier": multiplier,
            "rainfall": weather_data.get("rainfall_mm", 0),
            "ai_confidence": "High"
        },
        "quote_id": f"PRSH-{random.randint(1000, 9999)}"
    }