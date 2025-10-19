from flask import Flask, request, jsonify, send_file
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from passlib.hash import pbkdf2_sha256 as sha256
from flask_cors import CORS
from bson import ObjectId  # Important: To handle MongoDB's unique IDs
import matplotlib.pyplot as plt
import io

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for your frontend
CORS(app)

# --- Database Connection ---
# This code now tests the connection on startup.
try:
    client = MongoClient(os.getenv("MONGO_URI"))
    # The ping command is a simple way to verify the connection.
    client.admin.command('ping')
    print("✅ MongoDB connection successful.")
    db = client.smart_diet
    users_collection = db.users
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    exit()

# --- Routes ---

@app.route("/")
def home():
    """A simple route to confirm the backend is running."""
    return "SmartDiet Backend is running!"

@app.route("/signup", methods=["POST"])
def signup():
    """Handles new user registration."""
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"message": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User with this email already exists"}), 409

    hashed_password = sha256.hash(password)
    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "onboarding_complete": False  # Add a flag for the onboarding process
    }
    users_collection.insert_one(user_data)

    return jsonify({"message": "User created successfully. Please log in."}), 201

@app.route("/login", methods=["POST"])
def login():
    """Handles user login."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"message": "Missing email or password"}), 400

    user = users_collection.find_one({"email": email})

    if user and sha256.verify(password, user["password"]):
        # Prepare user data for the frontend, converting ObjectId to a string
        user_for_session = {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "onboarding_complete": user.get("onboarding_complete", False)
        }
        return jsonify({
            "message": "Login successful",
            "user": user_for_session
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route("/onboarding", methods=["POST"])
def onboarding():
    """Saves user's health and diet information."""
    data = request.get_json()
    user_id = data.get("user_id")
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
        
    onboarding_data = {
        "age": data.get("age"),
        "gender": data.get("gender"),
        "height": data.get("height"),
        "current_weight": data.get("current_weight"),
        "goal_weight": data.get("goal_weight"),
        "activity_level": data.get("activity_level"),
        "food_preferences": data.get("food_preferences"),
    }

    try:
        users_collection.update_one(
            {"_id": ObjectId(user_id)},  # Convert the string ID back to ObjectId for database query
            {"$set": {
                "onboarding": onboarding_data,
                "onboarding_complete": True
            }}
        )
    except Exception as e:
        return jsonify({"message": f"Error updating user: {e}"}), 500

    return jsonify({"message": "Onboarding data saved successfully"}), 200


@app.route("/dashboard/<user_id>", methods=["GET"])
def dashboard(user_id):
    """Fetches all data for a specific user to display on the dashboard."""
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Important: Remove the password before sending data to the frontend
            user.pop("password")
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return jsonify({"user": user}), 200
        else:
            return jsonify({"message": "User not found"}), 404
    except Exception:
        return jsonify({"message": "Invalid User ID format"}), 400

@app.route("/macronutrient_chart/<user_id>", methods=["GET"])
def macronutrient_chart(user_id):
    """Generates and returns a macronutrient distribution chart."""
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user or 'onboarding' not in user:
            return jsonify({"message": "User or onboarding data not found"}), 404

        onboarding = user['onboarding']
        
        # Basic BMR and TDEE calculation
        activity_multipliers = {
            'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 
            'active': 1.725, 'extra': 1.9
        }
        bmr = (10 * float(onboarding['current_weight'])) + (6.25 * float(onboarding['height'])) - (5 * float(onboarding['age']))
        bmr += 5 if onboarding['gender'] == 'male' else -161
        tdee = bmr * activity_multipliers.get(onboarding['activity_level'], 1.55)

        # Macronutrient goals (example percentages)
        macros = {
            'Protein (40%)': (tdee * 0.4) / 4,
            'Carbs (30%)': (tdee * 0.3) / 4,
            'Fat (30%)': (tdee * 0.3) / 9
        }

        # Plotting with Matplotlib
        fig, ax = plt.subplots()
        ax.bar(macros.keys(), macros.values(), color=['#3B82F6', '#8B5CF6', '#F59E0B'])
        ax.set_ylabel('Grams (g)')
        ax.set_title('Daily Macronutrient Goals')
        
        # Save to an in-memory buffer
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)

        return send_file(buf, mimetype='image/png')

    except Exception as e:
        return jsonify({"message": f"An error occurred: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True)