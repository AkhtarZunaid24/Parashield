import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import warnings
import joblib
import os

# --- CRITICAL FIX FOR CLOUD DEPLOYMENT ---
import matplotlib
matplotlib.use('Agg') # Force non-interactive backend (No GUI needed)
import matplotlib.pyplot as plt

warnings.filterwarnings('ignore')

# Dynamically get the exact folder where this script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_FILENAME = os.path.join(SAVE_DIR, 'dynamic_fraud_model.pkl')

def train_and_save_model():
    """Generates data, trains the pipeline, and saves the artifacts."""
    print("🚀 Initializing Fraud Detection Training Pipeline...")
    
    # 1. Generate Mock Claim Data
    np.random.seed(42)
    num_claims = 5000
    
    distance_km = np.random.uniform(0, 3, num_claims) 
    time_since_last_hr = np.random.uniform(48, 720, num_claims) 
    weather_mismatch = np.random.uniform(0, 5, num_claims) 
    claim_hour_of_day = np.random.randint(8, 23, num_claims) 
    accelerometer_flatline_index = np.random.uniform(0.0, 0.2, num_claims) 

    num_frauds = 250 
    distance_km[-num_frauds:] = np.random.uniform(15, 80, num_frauds) 
    time_since_last_hr[-num_frauds:] = np.random.uniform(0.1, 5, num_frauds) 
    weather_mismatch[-num_frauds:] = np.random.uniform(40, 100, num_frauds) 
    claim_hour_of_day[-num_frauds:] = np.random.randint(1, 5, num_frauds) 
    accelerometer_flatline_index[-num_frauds:] = np.random.uniform(0.8, 1.0, num_frauds) 

    df = pd.DataFrame({
        'distance_from_trigger_zone_km': distance_km,
        'time_since_last_claim_hr': time_since_last_hr,
        'weather_api_mismatch_score': weather_mismatch,
        'claim_hour_of_day': claim_hour_of_day,
        'accelerometer_flatline_index': accelerometer_flatline_index
    })

    # Save CSV
    csv_path = os.path.join(BASE_DIR, "mock_claims_data.csv")
    df.to_csv(csv_path, index=False)

    # 2. Build Pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('iso_forest', IsolationForest(contamination=0.05, random_state=42, n_estimators=300)) 
    ])
    pipeline.fit(df)

    # 3. Save Visualization (Headless)
    df['fraud_prediction'] = pipeline.predict(df)
    plt.figure(figsize=(10, 6))
    plt.hist(df['fraud_prediction'], bins=3, color='salmon', rwidth=0.8)
    plt.xticks([-1, 1], ['Fraud/Anomaly', 'Normal/Valid'])
    plt.ylabel('Number of Claims')
    plt.title('AI Fraud Detection: Anomaly Distribution')
    
    viz_path = os.path.join(BASE_DIR, "fraud_distribution.png")
    plt.savefig(viz_path)
    plt.close() # Important: Close the plot to free up memory!

    # 4. Save Model
    os.makedirs(SAVE_DIR, exist_ok=True)
    try:
        joblib.dump(pipeline, MODEL_FILENAME)
        print(f"✅ SUCCESS: Model saved at: {MODEL_FILENAME}")
    except Exception as e:
        print(f"⚠️ Warning: Could not save model to disk (Read-only FS?): {e}")
    
    return pipeline

# Load existing model OR train a new one
if os.path.exists(MODEL_FILENAME):
    print("📦 Loading existing Fraud Model...")
    pipeline = joblib.load(MODEL_FILENAME)
else:
    pipeline = train_and_save_model()

# 5. The Smart Evaluation Engine
def evaluate_claim_advanced(claim_data_dict, model_pipeline=pipeline):
    """API-facing function to score incoming claims."""
    # Ensure inputs are valid floats
    try:
        claim_df = pd.DataFrame([claim_data_dict])
        
        if claim_df['time_since_last_claim_hr'].iloc[0] < 12.0:
            return {"status": "REJECTED", "reason": "Duplicate claim filed within 12 hours.", "risk_score": 100}

        raw_score = model_pipeline.decision_function(claim_df)[0]
        risk_score = 100 * (0.5 - (raw_score / 0.6)) 
        risk_score = max(0, min(100, risk_score)) 
        
        if risk_score > 75:
            status, reason = "REJECTED", "Severe AI Anomaly Detected (Probable Telemetry/GPS Spoofing)"
        elif risk_score > 40:
            status, reason = "FLAGGED", "Moderate Anomaly. Sent to Admin Dashboard."
        else:
            status, reason = "APPROVED", "Claim parameters normal. Auto-initiating payout."
            
        return {"status": status, "reason": reason, "risk_score": round(risk_score, 1)}
    except Exception as e:
        return {"status": "ERROR", "reason": f"Internal Model Error: {str(e)}", "risk_score": 0}