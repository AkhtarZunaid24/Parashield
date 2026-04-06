import time
import logging
import os
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
        "url" : "https://github.com/AkhtarZunaid24/Parashield"
    } 
)

# --- 2. FIXED CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request : Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = str(round(process_time, 4))
    logger.info(f" {request.method} , {request.url.path} completed in {process_time:.4f}s")
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

@app.get("/api/v1/trigger-status", tags=["Live Parametric Triggers"])
def get_trigger_status(lat: float = 20.2961, lon: float = 85.8245, rider_id: str = "RIDER_8821"):
    weather_data = weather_api.get_real_time_risk_data(lat, lon)
    response_payload = {"weather_data": weather_data, "payout_data": None}

    if weather_data.get("is_trigger_met"):
        severity = "LOW"
        rainfall = weather_data.get("rainfall_mm", 0)
        aqi = weather_data.get("aqi_score", 0)
        
        if rainfall > 25 or aqi > 400: severity = "HIGH"
        elif rainfall > 15 or aqi > 300: severity = "MEDIUM"

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
        "status": "Ready for Phase 2 Submission",
        "location_context": "Bhubaneswar Operations"
    }

# --- 5. DYNAMIC STARTUP FOR WASMER ---
if __name__ == "__main__":
    # Wasmer provides a 'PORT' environment variable. If it's not there, use 8000 for local.
    port = int(os.environ.get("PORT", 8080))
    # On Wasmer, we must listen on 0.0.0.0
    host = "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1"
    
    logger.info(f"🚀 Booting up Parashield AI Core on {host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=False if os.environ.get("PORT") else True)