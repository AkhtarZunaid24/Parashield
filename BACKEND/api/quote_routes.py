from fastapi import APIRouter
from pydantic import BaseModel
from services.weather_api import weather_api
import random

router = APIRouter()

class QuoteRequest(BaseModel):
    location_name: str
    lat: float
    lon: float

@router.post("/calculate_premium")
async def calculate_premium(request: QuoteRequest):
    # 1. Fetch live risk data for this specific location
    weather_data = weather_api.get_real_time_risk_data(request.lat, request.lon)
    
    # 2. AI Pricing Logic (Parametric Formula)
    # Base Price: ₹15 per shift
    # Risk Multiplier: Based on Rainfall and AQI
    base_premium = 15.0
    
    # Add ₹2 for every 5mm of rain
    rain_surcharge = (weather_data.get("rainfall_mm", 0) / 5) * 2.0
    
    # Add ₹5 if AQI is hazardous (>200)
    aqi_surcharge = 5.0 if weather_data.get("aqi_score", 0) > 300 else 0.0
    
    # Location Risk Factor (Mocked for different areas of Bhubaneswar)
    location_risks = {
    "Khandagiri": 1.2,
    "Patia": 1.0,
    "Nayapalli": 1.5,
    "Default": 1.1,
    "Acharya Vihar": 1.46,
    "Old Town": 1.37,
    "Rasulgarh": 1.37,
    "Jayadev Vihar": 1.35,
    "Laxmisagar": 1.30,
    "Saheed Nagar": 1.30,
    "Vani Vihar": 1.26,
    "Kalpana": 1.26,
    "VSS Nagar": 1.23,
    "Satyanagar": 1.20,
    "Sailashree Vihar": 1.14,
    "Kalinga Vihar": 1.10
    }
    risk_multiplier = location_risks.get(request.location_name, 1.1)

    final_premium = (base_premium + rain_surcharge + aqi_surcharge) * risk_multiplier
    
    return {
        "location": request.location_name,
        "daily_premium": round(final_premium, 2),
        "coverage_limit": 720, # Maximum payout for the shift
        "risk_analysis": {
            "current_condition": weather_data.get("condition"),
            "rainfall_impact": rain_surcharge,
            "aqi_impact": aqi_surcharge,
            "risk_multiplier": risk_multiplier
        },
        "quote_id": f"PRSH-{random.randint(1000, 9999)}"
    }