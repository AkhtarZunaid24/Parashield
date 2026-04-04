import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')
import joblib
import os
import matplotlib.pyplot as plt

# 1. Generate Enterprise-Grade Mock Claim Data
np.random.seed(42)
num_claims = 5000 # Increased for better manifold learning

# Generate NORMAL Claims
distance_km = np.random.uniform(0, 3, num_claims) 
time_since_last_hr = np.random.uniform(48, 720, num_claims) 
weather_mismatch = np.random.uniform(0, 5, num_claims) 
claim_hour_of_day = np.random.randint(8, 23, num_claims) # Normal working hours (8 AM - 11 PM)
# Sensor data: Normal movement means accelerometer varies while GPS varies
accelerometer_flatline_index = np.random.uniform(0.0, 0.2, num_claims) 

# Inject FRAUDULENT Claims (Spoofers, Emulators, Spammers)
num_frauds = 250 
distance_km[-num_frauds:] = np.random.uniform(15, 80, num_frauds) 
time_since_last_hr[-num_frauds:] = np.random.uniform(0.1, 5, num_frauds) # Duplicate claim prevention
weather_mismatch[-num_frauds:] = np.random.uniform(40, 100, num_frauds) 
claim_hour_of_day[-num_frauds:] = np.random.randint(1, 5, num_frauds) # Suspicious 3 AM claims
# THE SMOKING GUN: High flatline index means the phone is sitting on a desk while GPS "moves"
accelerometer_flatline_index[-num_frauds:] = np.random.uniform(0.8, 1.0, num_frauds) 

df = pd.DataFrame({
    'distance_from_trigger_zone_km': distance_km,
    'time_since_last_claim_hr': time_since_last_hr,
    'weather_api_mismatch_score': weather_mismatch,
    'claim_hour_of_day': claim_hour_of_day,
    'accelerometer_flatline_index': accelerometer_flatline_index
})

# Save the synthetic claims data for demonstration
csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock_claims_data.csv")
df.to_csv(csv_path, index=False)
print(f"📊 Claims dataset saved for demonstration at: {csv_path}")

# 2. Build the Anomaly Detection Pipeline
print("Training V3 Intelligent Fraud & Telemetry Pipeline...")
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('iso_forest', IsolationForest(contamination=0.05, random_state=42, n_estimators=300, max_samples='auto')) 
])

pipeline.fit(df)
# 1. Generate predictions first so the column exists
df['fraud_prediction'] = pipeline.predict(df)

# 2. NOW you can run the visualization code
plt.figure(figsize=(10, 6))
plt.hist(df['fraud_prediction'], bins=3, color='salmon', rwidth=0.8)
plt.xticks([-1, 1], ['Fraud/Anomaly', 'Normal/Valid'])
plt.ylabel('Number of Claims')
plt.title('AI Fraud Detection: Anomaly Distribution')

# Save and show
viz_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fraud_distribution.png")
plt.savefig(viz_path)
print(f"📈 Fraud detection chart saved at: {viz_path}")
plt.show()

# 3. The Smart Evaluation Engine
def evaluate_claim_advanced(claim_data_dict, model_pipeline):
    claim_df = pd.DataFrame([claim_data_dict])
    
    # Step A: Hard Rules (Duplicate claim prevention)
    if claim_df['time_since_last_claim_hr'].iloc[0] < 12.0:
        return {"status": "REJECTED", "reason": "Duplicate claim filed within 12 hours.", "risk_score": 100}

    # Step B: Get Anomaly Confidence Score from the AI
    # decision_function returns negative values for anomalies, positive for normal.
    # We will normalize this into a 0-100 Risk Score.
    raw_score = model_pipeline.decision_function(claim_df)[0]
    
    # Mathematical normalization mapping raw Isolation Forest scores to a 0-100 scale
    # (Assuming raw scores typically fall between -0.3 and +0.3)
    risk_score = 100 * (0.5 - (raw_score / 0.6)) 
    risk_score = max(0, min(100, risk_score)) # Clamp between 0 and 100
    
    # Step C: Tiered Resolution System
    if risk_score > 75:
        status = "REJECTED"
        reason = "Severe AI Anomaly Detected (Probable Telemetry/GPS Spoofing)"
    elif risk_score > 40:
        status = "FLAGGED"
        reason = "Moderate Anomaly. Sent to Admin Dashboard for manual review."
    else:
        status = "APPROVED"
        reason = "Claim parameters normal. Auto-initiating payout."
        
    return {"status": status, "reason": reason, "risk_score": round(risk_score, 1)}

# 4. Test Advanced Real-World Scenarios
print("\n--- Running AI Fraud Triage ---")

# Scenario 1: Honest worker stuck in a severe storm near Patia at 8 PM.
honest_claim = {
    'distance_from_trigger_zone_km': 0.5,
    'time_since_last_claim_hr': 336.0, # 2 weeks ago
    'weather_api_mismatch_score': 2.0, 
    'claim_hour_of_day': 20, # 8:00 PM
    'accelerometer_flatline_index': 0.1 # Phone is moving in their pocket/mount
}
print("\nScenario 1 (Honest Worker):")
print(evaluate_claim_advanced(honest_claim, pipeline))

# Scenario 2: The Emulator Spoofer
# GPS matches the storm zone perfectly, BUT the phone's accelerometer shows it's completely still.
spoofer_claim = {
    'distance_from_trigger_zone_km': 0.1, # Looks perfect on GPS!
    'time_since_last_claim_hr': 140.0, 
    'weather_api_mismatch_score': 0.0, # Perfectly matched the API
    'claim_hour_of_day': 14, 
    'accelerometer_flatline_index': 0.95 # FLAGGED: Phone is sitting flat on a desk via emulator
}
print("\nScenario 2 (Sophisticated Emulator Spoofer):")
print(evaluate_claim_advanced(spoofer_claim, pipeline))

# Scenario 3: The Suspicious Late Night Claim
# Moderate distance, weird hour for a traffic jam claim.
borderline_claim = {
    'distance_from_trigger_zone_km': 5.5,
    'time_since_last_claim_hr': 72.0, 
    'weather_api_mismatch_score': 15.0, 
    'claim_hour_of_day': 3, # 3:00 AM (Suspicious)
    'accelerometer_flatline_index': 0.4
}
print("\nScenario 3 (Borderline/Suspicious Context):")
print(evaluate_claim_advanced(borderline_claim, pipeline))



#Dynamically get the exact folder where this script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

save_dir = os.path.join(BASE_DIR, "saved_models")
os.makedirs(save_dir, exist_ok=True)

model_filename = os.path.join(save_dir, 'dynamic_fraud_model.pkl') 
joblib.dump(pipeline, model_filename)

print(f"✅ SUCCESS: Model saved dynamically to: {model_filename}")

# Create an Anomaly Score Chart
plt.figure(figsize=(10, 6))
# We'll plot risk scores for a sample to visualize the 'Fraud' vs 'Normal' gap
plt.hist(df['fraud_prediction'], bins=3, color='salmon', rwidth=0.8)
plt.xticks([-1, 1], ['Fraud/Anomaly', 'Normal/Valid'])
plt.ylabel('Number of Claims')
plt.title('AI Fraud Detection: Anomaly Distribution')

viz_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fraud_distribution.png")
plt.savefig(viz_path)
print(f"📈 Fraud detection chart saved at: {viz_path}")
plt.show()