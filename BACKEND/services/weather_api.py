import os
import requests
from datetime import datetime
class WeatherService:
    def __init__ (self):
        self.api_key = os.getenv("WEATHERAPI_KEY", "2254f3d68d8f473b83f110139260304")
        self.base_url = "https://api.weatherapi.com/v1/current.json"
        self.MOCK_MODE = True
    
    def get_real_time_risk_data(self, lat:float, lon: float) -> dict:
        """
        FETCHING LIVE WEATHER UPDATES AND AQI DATA IN A SINGLE CALL
        evaluates against our parametric triggers
        """

        if self.MOCK_MODE:
            print("MOCK MODE ACTIVE: Simulating severe storm and hazardous aqi.")
            return{
                "timestamp": datetime.now().isoformat(),
                "location" : {"lat": lat, "lon": lon, "name" : "Bhubaneswar(stimulated)" },
                "temperature_celsius" : 32.0,
                "condition" : "Heavy Rain",
                "rainfall_mm" : 38.5,
                "aqi_score" : 342,
                "is_trigger_met" : True,
                "TRIGGER_REASON" : "CRITICAL RISK: Rainfall (38.5mm) and AQI (342) thresholds exceeded"
            }
        if self.api_key == "OUR_WEATHERAPI_HERE_TOO":
            print("Error: WeatherAPI key is missing!")
            return {"error" : "API key missing","is_trigger_met":False}
        try:
            params = {
                "key": self.api_key,
                "q" : f"{lat},{lon}",
                "aqi" : "yes"
            }
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            current = data.get("current", {})
            rainfall_mm = current.get("precip_mm", 0.0)
            aqi_score = round(current.get("air_quality", {}).get("pm2_5",0), 1)
            is_trigger_met = False 
            trigger_reasons = []
            if rainfall_mm >= 35.0:
                is_trigger_met = True
                trigger_reasons.append(f"Rainfall {rainfall_mm} > 35mm")
            if aqi_score >= 300:
                is_trigger_met = True
                trigger_reasons.append(f"High AQI index {aqi_score} > 300")
            return{
                "timestamp" : datetime.now().isoformat(),
                "location": {
                    "lat" : data.get("location", {}).get("lat"),
                    "lon": data.get("location", {}).get("lon"),
                    "name": data.get("location", {}).get("name")
                },
                "temperature_celsius" : current.get("temp_c"),
                "condition": current.get("condition", {}).get("text","unknown"),
                "rainfall_mm" : rainfall_mm,
                "aqi_score": aqi_score,
                "is_trigger_met": is_trigger_met,
                "trigger_reasons": " | ".join(trigger_reasons) if trigger_reasons else "Safe Operating Conditions"
            }
        except requests.exceptions.RequestException as e:
            print(f"WeatherAPI Error: {e}")
            return {"return" : str(e) ,"is_trigger_met": False}
weather_api = WeatherService()



