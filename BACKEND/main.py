import os
import time
import logging

# 1. IMMEDIATE DEBUG PRINT
# If you don't see this in your terminal, your Python environment is stuck.
print("--- [DEBUG] Parashield API Process Starting ---")

import firebase_admin
from firebase_admin import credentials, firestore

# --- 2. FIREBASE INITIALIZATION (CRITICAL: MUST BE BEFORE ROUTERS) ---
print("--- [DEBUG] Initializing Firebase...")
if not firebase_admin._apps:
    cred_path = "serviceAccountKey.json"
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("--- [DEBUG] Firebase App Initialized.")
    else:
        print(f"--- [ERROR] {cred_path} NOT FOUND in {os.getcwd()}")

# Define DB so it can be used locally
db = firestore.client()

# --- 3. NOW IMPORT LOCAL ROUTERS ---
# We wait until now because these files try to talk to the DB immediately
print("--- [DEBUG] Importing local routers and services...")
try:
    from api.quote_routes import router as quote_router
    from api.claims_route import router as claim_router
    from services.weather_api import weather_api
    from services.mock_payment import payment_service
    print("--- [DEBUG] Imports successful.")
except Exception as e:
    print(f"--- [ERROR] Failed to import routers: {e}")

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- 4. FASTAPI SETUP ---
app = FastAPI(
    title="Parashield-ai",
    description="Intelligent Parametric Insurance Engine.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = str(round(process_time, 4))
    return response

# --- 5. ENDPOINTS & ROUTERS ---
@app.get("/api/v1/zones", tags=["Data Foundation"])
async def get_all_zones():
    zones_ref = db.collection("risk_factors").stream()
    return [{"id": doc.id, **doc.to_dict()} for doc in zones_ref]

app.include_router(quote_router, prefix="/api/v1/pricing", tags=["Dynamic Pricing Engine"])
app.include_router(claim_router, prefix="/api/v1/claims", tags=["Fraud Triage System"])

@app.get("/")
async def read_root():
    return {"message": "Parashield AI Core is Online", "docs": "/docs"}

# --- 6. STARTUP ---
if __name__ == "__main__":
    print("--- [DEBUG] Launching Uvicorn Server...")
    # Using 'app' object directly for better debugging on local Windows
    uvicorn.run(app, host="127.0.0.1", port=8000)