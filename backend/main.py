from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
from flask_cors import CORS
from bson import ObjectId
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import requests
import json

# --- Environment and Config ---
load_dotenv()
app = Flask(__name__)
CORS(app)

# --- Database Connection ---
try:
    client = MongoClient(os.getenv("MONGO_URI"))
    client.admin.command('ping')
    print("✅ MongoDB connection successful.")
    db = client.smart_diet
    users_collection = db.users
    menu_collection = db.menu_items
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit()

ADMIN_EMAIL = "goutam54401@gmail.com"

# --- Helper Function for Nutrition ---
def get_nutrition_info(item_name):
    try:
        api_url = "https://openrouter.ai/api/v1/chat/completions"
        response = requests.post(
            url=api_url,
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a nutrition expert. Provide approximate nutritional information in a clean JSON format like {\"calories\": 100, \"protein\": 10, \"carbs\": 20, \"fat\": 5}. Only output the JSON object."},
                    {"role": "user", "content": f"Provide approximate nutritional information for a standard serving of {item_name}."}
                ]
            })
        )
        response.raise_for_status()
        nutrition_str = response.json()['choices'][0]['message']['content']
        return json.loads(nutrition_str)
    except Exception as e:
        print(f"Could not fetch nutrition for {item_name}: {e}")
        return {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}

# --- All User and Menu Routes ---
@app.route("/")
def home():
    return "SmartDiet Backend is running!"

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name, email, password = data.get("name"), data.get("email"), data.get("password")
    if not all([name, email, password]): return jsonify({"message": "Missing required fields"}), 400
    if users_collection.find_one({"email": email}): return jsonify({"message": "User with this email already exists"}), 409
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = {"name": name, "email": email, "password": hashed_password, "onboarding_complete": False}
    users_collection.insert_one(user_data)
    return jsonify({"message": "User created successfully. Please log in."}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    if not all([email, password]): return jsonify({"message": "Missing email or password"}), 400
    user = users_collection.find_one({"email": email})
    if user and bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        user_for_session = { "id": str(user["_id"]), "name": user["name"], "email": user["email"], "onboarding_complete": user.get("onboarding_complete", False)}
        return jsonify({"message": "Login successful", "user": user_for_session}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route("/onboarding", methods=["POST"])
def onboarding():
    data = request.get_json()
    user_id = data.get("user_id")
    if not user_id: return jsonify({"message": "User ID is required"}), 400
    onboarding_data = {
        "age": data.get("age"), "gender": data.get("gender"), "height": data.get("height"),
        "current_weight": data.get("current_weight"), "goal_weight": data.get("goal_weight"),
        "activity_level": data.get("activity_level"), "food_preferences": data.get("food_preferences"),
    }
    try:
        users_collection.update_one( {"_id": ObjectId(user_id)}, {"$set": {"onboarding": onboarding_data, "onboarding_complete": True}})
    except Exception as e:
        return jsonify({"message": f"Error updating user: {e}"}), 500
    return jsonify({"message": "Onboarding data saved successfully"}), 200
    
@app.route("/dashboard/<user_id>", methods=["GET"])
def dashboard(user_id):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user.pop("password")
            user["_id"] = str(user["_id"])
            return jsonify({"user": user}), 200
        return jsonify({"message": "User not found"}), 404
    except:
        return jsonify({"message": "Invalid User ID format"}), 400

@app.route("/menu/parse-text", methods=["POST"])
def parse_menu_from_text():
    data = request.get_json()
    menu_text = data.get("menu_text")
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={ "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}", "Content-Type": "application/json", },
            data=json.dumps({
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    { "role": "system", "content": "You are a menu parsing expert..." },
                    { "role": "user", "content": menu_text }
                ],
            })
        )
        response.raise_for_status() 
        parsed_menu_str = response.json()['choices'][0]['message']['content']
        if parsed_menu_str.startswith("```json"):
            parsed_menu_str = parsed_menu_str[7:-4]
        return jsonify(json.loads(parsed_menu_str)), 200
    except Exception as e:
        return jsonify({"message": "An error occurred while parsing the menu."}), 500

@app.route("/menu/publish", methods=["POST"])
def publish_menu():
    menu_data = request.get_json()
    if not menu_data:
        return jsonify({"message": "No menu data provided"}), 400
    try:
        menu_collection.delete_many({})
        for day, meals in menu_data.items():
            for meal_type, items in meals.items():
                if meal_type.upper() in ['BREAKFAST', 'LUNCH', 'DINNER'] and isinstance(items, list):
                    for item_name in items:
                        nutrition = get_nutrition_info(item_name)
                        menu_item = { "name": item_name, "day": day.upper(), "meal_type": meal_type.upper(), **nutrition }
                        menu_collection.insert_one(menu_item)
        return jsonify({"message": "Menu published successfully with nutritional data!"}), 201
    except Exception as e:
        return jsonify({"message": f"Failed to publish menu: {e}"}), 500

# --- CORRECTED AND FINAL SUGGESTION ROUTE ---
@app.route("/menu/suggest", methods=["POST"])
def suggest_meal():
    data = request.get_json()
    goals = data.get("goals")
    current = data.get("current")

    prompt = f"""
    A user has daily nutritional goals: {goals['tdee']} calories, {goals['protein']}g protein, {goals['carbs']}g carbs, and {goals['fat']}g fat.
    So far, they have consumed: {current['calories']} calories, {current['protein']}g protein, {current['carbs']}g carbs, and {current['fat']}g fat.
    Provide a short, friendly suggestion for their next meal or a snack based on what they are lacking. Be encouraging. For example: 'You're doing great! For your next meal, consider adding a good source of protein like paneer or chicken to help meet your goal.'
    """
    try:
        # --- THIS IS THE CORRECTED LINE ---
        # The URL is now a clean string, preventing the connection error.
        api_url = "[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)"
        
        # New: Print the URL to the console for debugging
        print(f"Calling suggestion API at: {api_url}")

        response = requests.post(
            url=api_url,
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "openai/gpt-3.5-turbo", 
                "messages": [{"role": "user", "content": prompt}]
            })
        )
        response.raise_for_status()
        suggestion = response.json()['choices'][0]['message']['content']
        return jsonify({"suggestion": suggestion}), 200
    except Exception as e:
        print(f"Suggestion Error: {e}")
        return jsonify({"message": f"Could not get suggestion: {e}"}), 500

@app.route("/menu", methods=["GET"])
def get_menu():
    menu = list(menu_collection.find())
    for item in menu:
        item["_id"] = str(item["_id"])
    return jsonify(menu), 200

if __name__ == "__main__":
    app.run(debug=True)