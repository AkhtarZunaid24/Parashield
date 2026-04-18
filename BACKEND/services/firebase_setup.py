import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

# 1. Locate the Service Account Key
# This assumes the .json file is in your BACKEND/ folder
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
key_path = os.path.join(base_dir, 'serviceAccountKey.json')

def initialize_firebase():
    """Initializes the Firebase Admin SDK if not already initialized."""
    try:
        # Check if already initialized to prevent errors during hot-reloads
        if not firebase_admin._apps:
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred)
            print("🛡️ Firebase Admin SDK initialized successfully.")
        return firestore.client(), auth
    except Exception as e:
        print(f"❌ Critical Error: Could not initialize Firebase Admin. {e}")
        return None, None

# Export these so you can import them in your routes (e.g., from services.firebase_admin import db)
db, firebase_auth = initialize_firebase()