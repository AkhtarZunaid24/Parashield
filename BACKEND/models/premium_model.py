import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt

# 1. Setup Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_FILENAME = os.path.join(SAVE_DIR, 'dynamic_premium_pipeline.pkl')

def train_and_save_premium_model():
    print("🚀 Training the Bhubaneswar-Synced Risk Pipeline...")
    
    np.random.seed(42)
    num_records = 5000 
    
    # NEW: We include the Total Risk Multiplier as a feature
    data = {
        'zone_multiplier': np.random.uniform(1.1, 1.46, num_records), # Sync with Firestore range
        'predicted_rainfall_mm': np.random.uniform(0, 100, num_records), 
        'active_curfew_days': np.random.randint(0, 2, num_records),
        'market_closure_risk': np.random.uniform(0.0, 1.0, num_records),
        'avg_traffic_congestion': np.random.randint(1, 10, num_records),
    }
    df = pd.DataFrame(data)
    
    # --- SYNCHRONIZED TARGET LOGIC ---
    BASE_PRICE = 34.0  # MATCHING YOUR BUSINESS LOGIC
    MAX_CAP = 51.0
    
    # 1. Apply Zone Multiplier first (The Firestore logic)
    df['weekly_premium_inr'] = BASE_PRICE * df['zone_multiplier']
    
    # 2. Add "Live" ML Risk Adjustments
    df['weekly_premium_inr'] += (df['predicted_rainfall_mm'] * 0.05)
    df['weekly_premium_inr'] += (df['active_curfew_days'] * 5.0)
    
    # 3. Apply the Cap
    df['weekly_premium_inr'] = df['weekly_premium_inr'].clip(upper=MAX_CAP)

    X = df.drop(columns=['weekly_premium_inr'])
    y = df['weekly_premium_inr']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()), 
        ('gbr', GradientBoostingRegressor(n_estimators=300, learning_rate=0.05, max_depth=4, random_state=42))
    ])
    pipeline.fit(X_train, y_train)

    # Save Model
    os.makedirs(SAVE_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_FILENAME)
    print(f"✅ SUCCESS: ML Model is now synced with ₹34 base and Firestore Multipliers.")
    return pipeline

# Load or Train
if os.path.exists(MODEL_FILENAME):
    premium_pipeline = joblib.load(MODEL_FILENAME)
else:
    premium_pipeline = train_and_save_premium_model()

def predict_weekly_premium(data_dict, model=premium_pipeline):
    try:
        input_df = pd.DataFrame([data_dict])
        prediction = model.predict(input_df)[0]
        # Final safety cap
        return round(float(min(prediction, 51.0)), 2)
    except Exception as e:
        return 34.0 # Fallback to base