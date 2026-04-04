import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os



# 1. Generate Advanced Mock Data (Environmental + Social)
np.random.seed(42)
num_records = 3000 

data = {
    # Environmental Factors
    'predicted_rainfall_mm': np.random.uniform(0, 200, num_records), 
    'predicted_temp_c': np.random.uniform(20, 48, num_records),
    'visibility_meters': np.random.uniform(200, 10000, num_records), 
    
    # Social & Infrastructure Factors
    'active_curfew_days': np.random.randint(0, 4, num_records), # 0 to 3 days of restricted movement
    'market_closure_risk': np.random.uniform(0.0, 1.0, num_records), # Probability of sudden strikes
    'avg_traffic_congestion': np.random.randint(1, 11, num_records), # 1 (empty) to 10 (gridlock)
    
    # Worker History
    'past_claims_count': np.random.randint(0, 5, num_records) 
}

df = pd.DataFrame(data)
# Save the synthetic training data for documentation/GitHub
csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "mock_training_data.csv")
df.to_csv(csv_path, index=False)
print(f"📊 Dataset saved for documentation at: {csv_path}")

# 2. Define the "Weekly Pricing" Target Variable Logic
# Base premium is ₹25/week. 
df['weekly_premium_inr'] = 25.0 

# Add environmental risk
df['weekly_premium_inr'] += (df['predicted_rainfall_mm'] * 0.12)
df.loc[df['predicted_temp_c'] > 42, 'weekly_premium_inr'] += 8
df.loc[df['visibility_meters'] < 1000, 'weekly_premium_inr'] += 12

# Add social/infrastructure risk
df['weekly_premium_inr'] += (df['active_curfew_days'] * 15.0) # Massive penalty for known curfews
df['weekly_premium_inr'] += (df['market_closure_risk'] * 20.0) 
df['weekly_premium_inr'] += (df['avg_traffic_congestion'] * 2.0)

# Add compounding risk multiplier (The true power of the model)
# e.g., Bad weather + High traffic = Disastrous delays
high_risk_combo = (df['predicted_rainfall_mm'] > 50) & (df['avg_traffic_congestion'] > 7)
df.loc[high_risk_combo, 'weekly_premium_inr'] *= 1.3 

# 3. Prepare Data & Build Pipeline
X = df.drop(columns=['weekly_premium_inr'])
y = df['weekly_premium_inr']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Gradient Boosting is excellent for finding complex, non-linear relationships
print("Training the Advanced Social & Environmental Risk Pipeline...")
pipeline = Pipeline([
    ('scaler', StandardScaler()), 
    ('gbr', GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=42))
])

pipeline.fit(X_train, y_train)

# 4. Evaluate Model Performance
predictions = pipeline.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"\n--- Model Performance ---")
print(f"Mean Absolute Error: ₹{mae:.2f}")
print(f"R-squared Score: {r2:.2f}")

# 5. Extract Feature Importance
gbr_model = pipeline.named_steps['gbr']
importances = gbr_model.feature_importances_
feature_names = X.columns

print("\n--- What drives the premium price? (Feature Importance) ---")
for name, importance in sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True):
    print(f"{name}: {importance*100:.1f}%")

# 6. Test a Real-World Hackathon Scenario
print("\n--- Running a Weekly Premium Prediction ---")
# Scenario: A worker facing a week with high likelihood of market closures due to a local strike, 
# moderate traffic, but clear weather.
new_worker_data = pd.DataFrame({
    'predicted_rainfall_mm': [0.0],
    'predicted_temp_c': [30.0],
    'visibility_meters': [10000.0], 
    'active_curfew_days': [1],          
    'market_closure_risk': [0.85],      
    'avg_traffic_congestion': [6],      
    'past_claims_count': [0]
})

predicted_premium = pipeline.predict(new_worker_data)
print(f"\nRecommended Weekly Premium for this social-risk forecast: ₹{predicted_premium[0]:.2f}")
print()



# 1. Dynamically get the exact folder where this script lives
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Build the path to the 'saved_models' folder safely
save_dir = os.path.join(BASE_DIR, "saved_models")
os.makedirs(save_dir, exist_ok=True)

# 3. Save the model
model_filename = os.path.join(save_dir, 'dynamic_premium_pipeline.pkl') # Change this name for the fraud model!
joblib.dump(pipeline, model_filename)

print(f"✅ SUCCESS: Model saved dynamically to: {model_filename}")

import matplotlib.pyplot as plt

plt.figure(figsize=(10, 6))
plt.barh(feature_names, importances, color='skyblue')
plt.xlabel('Importance Score')
plt.title('How Different Factors Affect the Weekly Premium')

viz_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "premium_importance.png")
plt.savefig(viz_path)
print(f"📈 Feature importance chart saved at: {viz_path}")
plt.show()