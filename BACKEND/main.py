import time
import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Your existing routers
from api.quote_routes import router as quote_router
from api.claims_route import router as claim_router

# --- 1. IMPORT YOUR NEW SERVICES HERE ---
from services.weather_api import weather_api
from services.mock_payment import payment_service

logging.basicConfig(
    level = logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logger = logging.getLogger("Parashield-AI")

app = FastAPI(
    title="Parashield- ai",
    description=""" **Intelligent Parametric Insurance Engine for Delivery Partners.**
    
    This API powers the dynamic risk assessment and automated fraud triage 
    systems using state-of-the-art Machine Learning pipelines.""",
    version="1.0.0",
    contact= {
        "name" : "Parashield Engineering Team",
        "url" : "#github repo here"
    } 
)

# --- 2. FIXED CORS MIDDLEWARE ---
# BACKEND/main.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # The asterisk means "Allow Everything"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request : Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    # --- 3. FIXED HEADERS TYPO ---
    response.headers["X-Process-Time-Sec"] = str(round(process_time, 4))
    logger.info(f" {request.method} , {request.url.path} completed in process time {process_time:.4f}s")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request : Request, exc: Exception):
    logger.error(f"Critical error on {request.url.path} : {str(exc)}")
    return JSONResponse(
        status_code= status.HTTP_500_INTERNAL_SERVER_ERROR,
        content= {
            "status" : "error",
            "message" : "An unexpected internal server error occurred",
            "details" : str(exc)
        }
    )

app.include_router(quote_router, prefix="/api/v1/pricing", tags=["Dynamic Pricing Engine"])
app.include_router(claim_router, prefix="/api/v1/claims", tags=["Fraud Triage System"])

@app.get("/health", tags=["System Diagnostics"])
async def system_health():
    return{
        "status" : "operational",
        "services" : "Parashield-ai",
        "version" : "1.0.0",
        "timestamp" : time.time()
    }

# --- 4. THE LIVE PARAMETRIC TRIGGER ENDPOINT ---
@app.get("/api/v1/trigger-status", tags=["Live Parametric Triggers"])
def get_trigger_status(lat: float = 20.2961, lon: float = 85.8245, rider_id: str = "RIDER_8821"):
    # Fetch live weather for Bhubaneswar
    weather_data = weather_api.get_real_time_risk_data(lat, lon)
    
    response_payload = {
        "weather_data": weather_data,
        "payout_data": None
    }

    # If the weather hits your threshold, trigger the mock blockchain payout!
    if weather_data.get("is_trigger_met"):
        severity = "LOW"
        if weather_data.get("rainfall_mm", 0) > 25 or weather_data.get("aqi_score", 0) > 400:
            severity = "HIGH"
        elif weather_data.get("rainfall_mm", 0) > 15 or weather_data.get("aqi_score", 0) > 300:
            severity = "MEDIUM"

        payout_receipt = payment_service.trigger_automated_payout(
            rider_id=rider_id,
            severity=severity,
            trigger_reason=weather_data.get("trigger_reason")
        )
        response_payload["payout_data"] = payout_receipt

    return response_payload

@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Parashield AI Core is Online",
        "documentation": "/docs",
        "status": "Ready for Phase 2 Submission"
    }

if __name__ == "__main__":
    logger.info("🚀 Booting up Parashield AI Core...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)