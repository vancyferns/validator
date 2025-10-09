import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import requests
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)

# Get both API keys from your .env file
EMAIL_API_KEY = os.getenv('ABSTRACT_API_KEY')
PHONE_API_KEY = os.getenv('PHONE_API_KEY') # <-- New key for phone verification

# API endpoint URLs
EMAIL_API_URL = "https://emailreputation.abstractapi.com/v1/"
PHONE_API_URL = "https://phoneintelligence.abstractapi.com/v1/" # <-- New URL

# --- Your existing Email Verification API (no changes needed) ---
@app.route('/api/verify-email', methods=['GET'])
def verify_email_api():
    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email parameter is required"}), 400
    
    if not EMAIL_API_KEY:
        return jsonify({"error": "Email API key is not configured on the server"}), 500

    try:
        # (Your existing multi-factor logic for email remains here)
        params = {'api_key': EMAIL_API_KEY, 'email': email}
        response = requests.get(EMAIL_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
        # ... (rest of your email logic) ...
        status = data.get('email_deliverability', {}).get('status')
        if status != 'deliverable':
             return jsonify({"quality": "Bad/Invalid", "recommendation": "Email is not deliverable."})
        # ... etc.
        return jsonify({"quality": "Excellent", "recommendation": "Email is valid, reputable, and safe to use."})

    except requests.exceptions.HTTPError as http_err:
        return jsonify({"quality": "Error", "recommendation": f"API request failed: {http_err}"}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"quality": "Error", "recommendation": f"A network error occurred: {str(e)}"}), 503

# --- NEW: Phone Verification API Endpoint ---
@app.route('/api/verify-phone', methods=['GET'])
def verify_phone_api():
    phone = request.args.get('phone')
    if not phone:
        return jsonify({"error": "Phone parameter is required"}), 400
    
    if not PHONE_API_KEY:
        return jsonify({"error": "Phone API key is not configured on the server"}), 500

    try:
        params = {'api_key': PHONE_API_KEY, 'phone': phone}
        response = requests.get(PHONE_API_URL, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    
    except requests.exceptions.HTTPError as http_err:
        return jsonify({"error": f"API request failed: {http_err}"}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"A network error occurred: {str(e)}"}), 503

if __name__ == '__main__':
    app.run(debug=True)