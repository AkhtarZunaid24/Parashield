import firebase_admin
from firebase_admin import credentials, firestore

# 1. Setup the Connection
cred = credentials.Certificate("serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 2. YOUR ORIGINAL 15 ZONES DATA
# Structure: "Location": [EDF, SDF, TotalRisk]
zone_data = {
    "Acharya Vihar": [0.28, 0.18, 1.46],
    "Nayapalli": [0.27, 0.16, 1.43],
    "Patia": [0.20, 0.22, 1.42],
    "Old Town": [0.25, 0.12, 1.37],
    "Rasulgarh": [0.22, 0.15, 1.37],
    "Jayadev Vihar": [0.20, 0.15, 1.35],
    "Laxmisagar": [0.18, 0.12, 1.30],
    "Saheed Nagar": [0.12, 0.18, 1.30],
    "Khandagiri": [0.15, 0.12, 1.27],
    "Vani Vihar": [0.14, 0.12, 1.26],
    "Kalpana": [0.16, 0.10, 1.26],
    "VSS Nagar": [0.15, 0.08, 1.23],
    "Satyanagar": [0.10, 0.10, 1.20],
    "Sailashree Vihar": [0.08, 0.06, 1.14],
    "Kalinga Vihar": [0.06, 0.04, 1.10]
}

original_zones = list(zone_data.keys())

print("🚀 Starting Logic-Corrected Seed...")

# ---------- 3. RISK FACTORS ----------
for loc, values in zone_data.items():
    db.collection("risk_factors").document(loc).set({
        "edf": values[0],
        "sdf": values[1],
        "total_risk_multiplier": values[2],
        "city": "Bhubaneswar"
    })

# ---------- 4. USERS (40 Users) ----------
names = [
    "Parth", "Zunaid", "Sulagna", "Asutosh", "Prabhu", "Soham", "Anjini", "Subhrajyoti",
    "Swati", "Amisha", "Somesh", "Hapi", "Surya", "Badri", "Adi", "Shradha", "Aishwarya",
    "Shruti", "Abipsa", "Barsha", "Ipsita", "Aditi", "Soumi", "Saloni", "Anjali", "Lipra",
    "Rudra", "Bitu", "Bibhu", "Abhinas", "Sahil", "Yash", "Smita", "Pratik", "Mukesh",
    "Subhra", "Yashraj", "Jawed", "Najeeb", "Ranu"
]

for i in range(40):
    user_id = f"user{i+1}"
    assigned_location = original_zones[i % len(original_zones)]
    
    db.collection("users").document(user_id).set({
        "name": names[i],
        "location": assigned_location,
        "city": "Bhubaneswar"
    })

# ---------- 5. POLICIES, CLAIMS, & PAYOUTS ----------
BASE_PRICE = 34
MAX_CAP = 51

for i in range(1, 41):
    user_id = f"user{i}"
    # Find which zone this user is in to get their multiplier
    assigned_location = original_zones[(i-1) % len(original_zones)]
    multiplier = zone_data[assigned_location][2]

    # LOGIC: Premium = min(34 * Multiplier, 51)
    raw_premium = BASE_PRICE * multiplier
    final_premium = round(min(raw_premium, MAX_CAP), 2)
    
    # LOGIC: Payout = 85% of Weekly Premium
    payout_amount = round(final_premium * 0.85, 2)

    # Policy
    db.collection("active_policies").document(f"POL{i}").set({
        "user_id": user_id,
        "location": assigned_location,
        "premium_inr": final_premium,
        "status": "active"
    })
    
    # Claim
    db.collection("user_claims").document(f"CLM{i}").set({
        "user_id": user_id,
        "policy_id": f"POL{i}",
        "status": "pending" if i % 4 == 0 else "approved"
    })
    
    # Payout
    db.collection("payouts").document(f"PAY{i}").set({
        "user_id": user_id,
        "amount": payout_amount,
        "status": "paid" if i % 2 == 0 else "processing"
    })

print("🔥 SUCCESS: Database fixed with 34-51 INR Pricing & 85% Payout Logic.")