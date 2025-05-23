# app.py
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import joblib
import numpy as np
import os
import pandas as pd
import traceback

app = Flask(__name__)
CORS(app) 

# Configure SQLite database for feedback storage
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sepsis.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Define a model to store user feedback
class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)

# Load the trained model and scaler from the models folder
MODEL_PATH = "models/sepsis_model.pkl"
SCALER_PATH = "models/scaler.pkl"
if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    models = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model and scaler loaded successfully.")
else:
    models, scaler = None, None
    print("⚠️ Warning: Model or scaler not found. Please run train_model.py first.")

class MockModel:
    def predict(self, X):
        return [(1 if (row['PR'] == 0 or row['M11'] > 30) else 0) for _, row in X.iterrows()]

model = MockModel()

# API Endpoint for Sepsis Prediction
@app.route("/api/predict", methods=["POST"])
def api_predict():
    if not models or not scaler:
        return jsonify({"error": "Model not available. Train the model first."}), 500

    try:
        data = request.json
        input_data = np.array([[data["PRG"], data["PL"], data["PR"], data["SK"], data["TS"], data["M11"], data["BD2"], data["Age"], data["Insurance"]]])
        print("Raw Input Data:", input_data)

        input_scaled = scaler.transform(input_data)
        print("Scaled Input Data:", input_scaled)

        probabilities = models.predict_proba(input_scaled)[0]
        print("Prediction Probabilities:", probabilities)

        #adjust from 0.5 to a lower value if needed
        threshold = 0.4
        prediction = 1 if probabilities[1] > threshold else 0
        print("Final Prediction (with threshold = {}):".format(threshold), prediction)

        return jsonify({"sepsis_risk": int(prediction), "probabilities": probabilities.tolist()})
    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"error": "Prediction failed: " + str(e)}), 400


@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    try:
        # 1️⃣ Check if a file is uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        # 2️⃣ Validate file extension
        if not file.filename.endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400

        # 3️⃣ Read CSV
        df = pd.read_csv(file)

        REQUIRED_FIELDS = ["PRG", "PL", "PR", "SK", "TS", "M11", "BD2", "Age", "Insurance"]

        # 4️⃣ Check missing columns
        missing_fields = [field for field in REQUIRED_FIELDS if field not in df.columns]
        if missing_fields:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_fields)}'}), 400

        # 5️⃣ Prepare data
        data = df[REQUIRED_FIELDS]

        # 6️⃣ Predict
        predictions = model.predict(data)

        # 7️⃣ Return prediction list
        return jsonify({'predictions': predictions})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# API Endpoint for Feedback Submission
@app.route("/api/feedback", methods=["POST"])
def api_feedback():
    try:
        data = request.json
        new_feedback = Feedback(name=data.get("name", "Anonymous"), feedback_text=data["feedbackText"])
        db.session.add(new_feedback)
        db.session.commit()
        return jsonify({"message": "Feedback submitted successfully!"})
    except Exception as e:
        return jsonify({"error": "Feedback submission failed: " + str(e)}), 400

# Initialize the database and run the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all() 
    app.run(debug=True, port=5000)
