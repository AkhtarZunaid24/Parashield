import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os
import warnings

# --- CRITICAL FIX: Non-interactive backend for Wasmer/Cloud ---
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt

warnings.filterwarnings('ignore')

# 1. Setup Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVE_DIR = os.path.join(BASE_DIR, "saved_models")
MODEL_FILENAME = os.path.join(SAVE_DIR, 'dynamic_premium_pipeline.pkl')

def train_and_save_premium_model():
    print("🚀 Training the Advanced Social & Environmental Risk Pipeline...")
    
    # Generate Mock Data
    np.random.seed(42)
    num_records = 3000 
    data = {
        'predicted_rainfall_mm': np.random.uniform(0, 200, num_records), 
        'predicted_temp_c': np.random.uniform(20, 48, num_records),
        'visibility_meters': np.random.uniform(200, 10000, num_records), 
        'active_curfew_days': np.random.randint(0, 4, num_records),
        'market_closure_risk': np.random.uniform(0.0, 1.0, num_records),
        'avg_traffic_congestion': np.random.randint(1, 11, num_records),
        'past_claims_count': np.random.randint(0, 5, num_records) 
    }
    df = pd.DataFrame(data)
    
    # Target Variable Logic
    df['weekly_premium_inr'] = 25.0 
    df['weekly_premium_inr'] += (df['predicted_rainfall_mm'] * 0.12)
    df.loc[df['predicted_temp_c'] > 42, 'weekly_premium_inr'] += 8
    df.loc[df['visibility_meters'] < 1000, 'weekly_premium_inr'] += 12
    df['weekly_premium_inr'] += (df['active_curfew_days'] * 15.0)
    df['weekly_premium_inr'] += (df['market_closure_risk'] * 20.0) 
    df['weekly_premium_inr'] += (df['avg_traffic_congestion'] * 2.0)
    high_risk_combo = (df['predicted_rainfall_mm'] > 50) & (df['avg_traffic_congestion'] > 7)
    df.loc[high_risk_combo, 'weekly_premium_inr'] *= 1.3 

    X = df.drop(columns=['weekly_premium_inr'])
    y = df['weekly_premium_inr']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Build Pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()), 
        ('gbr', GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=42))
    ])
    pipeline.fit(X_train, y_train)

    # Save Visualization (Headless)
    importances = pipeline.named_steps['gbr'].feature_importances_
    feature_names = X.columns
    plt.figure(figsize=(10, 6))
    plt.barh(feature_names, importances, color='skyblue')
    plt.xlabel('Importance Score')
    plt.title('Risk Factor Weightage for Weekly Premium')
    
    viz_path = os.path.join(BASE_DIR, "premium_importance.png")
    plt.savefig(viz_path)
    plt.close() # Free up memory

    # Save Model
    os.makedirs(SAVE_DIR, exist_ok=True)
    try:
        joblib.dump(pipeline, MODEL_FILENAME)
        print(f"✅ SUCCESS: Model saved at: {MODEL_FILENAME}")
    except Exception as e:
        print(f"⚠️ Error saving model: {e}")
    
    return pipeline

# Load or Train
if os.path.exists(MODEL_FILENAME):
    print("📦 Loading existing Premium Model...")
    premium_pipeline = joblib.load(MODEL_FILENAME)
else:
    premium_pipeline = train_and_save_premium_model()

# 2. Prediction Function for API
def predict_weekly_premium(data_dict, model=premium_pipeline):
    try:
        input_df = pd.DataFrame([data_dict])
        prediction = model.predict(input_df)[0]
        return round(float(prediction), 2)
    except Exception as e:
        print(f"Prediction Error: {e}")
        return 25.0 # Return base premium as fallback