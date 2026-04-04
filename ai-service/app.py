from dotenv import load_dotenv
import os

load_dotenv()

import hashlib
import json
import re
import cv2
import numpy as np
import face_recognition
from PIL import Image
import pytesseract
from flask import Flask, request, jsonify
from flask_cors import CORS
from algosdk.v2client import algod
from algosdk import transaction, mnemonic


app = Flask(__name__)
CORS(app)

# --- YOUR CONFIGURATION ---    
ALGO_ADDRESS = os.getenv("ALGO_SENDER_ADDRESS")
ALGO_MNEMONIC = os.getenv("ALGO_MNEMONIC")

# AlgoNode Public TestNet API
ALGOD_ADDRESS = os.getenv("ALGOD_SERVER")
ALGOD_TOKEN = os.getenv("ALGOD_API_KEY") 

# ✅ DEBUG PRINTS (ADD HERE)
print("ALGOD_ADDRESS:", ALGOD_ADDRESS)
print("ALGOD_TOKEN:", ALGOD_TOKEN)

# Initialize Client
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

@app.route('/village-funds/<village>/<year>/<sub_village>', methods=['GET'])
def village_funds(village, year, sub_village):
    try:
        import os, re
        import pandas as pd

        dataset_dir = os.path.join(os.path.dirname(__file__), '..', 'dataset')
        # find matching file: e.g. bhojpur_budget_allocation2023_2024.csv
        pattern = re.compile(rf'^{re.escape(village)}_budget_allocation{re.escape(year.replace("-", "_"))}.*\.csv$', re.IGNORECASE)
        matched = [f for f in os.listdir(dataset_dir) if pattern.match(f)]
        if not matched:
            return jsonify({'error': f'No data found for {village} {year}'}), 404

        filepath = os.path.join(dataset_dir, matched[0])
        df = pd.read_csv(filepath)
        df.columns = [c.strip() for c in df.columns]
        df = df.dropna(subset=[df.columns[0]])
        df = df[df[df.columns[0]].str.strip() != '']

        name_col = df.columns[0]
        rec_col  = df.columns[1]
        pay_col  = df.columns[2]

        def parse_amount(val):
            try:
                return float(str(val).replace(',', '').replace('₹', '').strip())
            except:
                return 0.0

        df['allocated'] = df[rec_col].apply(parse_amount)
        df['used']      = df[pay_col].apply(parse_amount)
        df['sub_village'] = df[name_col].str.strip()

        if sub_village != 'all':
            df = df[df['sub_village'].str.lower() == sub_village.lower()]

        bar_data = df[['sub_village', 'allocated', 'used']].to_dict(orient='records')
        total_allocated = df['allocated'].sum()
        total_used      = df['used'].sum()

        return jsonify({
            'bar_data': bar_data,
            'pie_data': [
                {'name': 'Funds Allocated', 'value': total_allocated},
                {'name': 'Funds Used',      'value': total_used},
            ],
            'total_allocated': total_allocated,
            'total_used':      total_used,
        }), 200
    except Exception as e:
        print(f'village_funds error: {e}')
        return jsonify({'error': str(e)}), 500



@app.route('/store-hash', methods=['POST'])
def store_hash():
    try:
        # Get complaint data from request
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # 1. Generate SHA-256 Hash
        # Ensure consistent ordering so the same data always generates the same hash
        data_string = json.dumps(data, sort_keys=True)
        complaint_hash = hashlib.sha256(data_string.encode()).hexdigest()

        # 2. Prepare Transaction
        params = algod_client.suggested_params()
        
        # We send 0 ALGO to ourselves just to store the hash in the "note" field
        # The note field must be bytes
        note = complaint_hash.encode() 
        
        unsigned_txn = transaction.PaymentTxn(
            sender=ALGO_ADDRESS,
            sp=params,
            receiver=ALGO_ADDRESS,
            amt=0,
            note=note
        )

        # 3. Sign the transaction
        private_key = mnemonic.to_private_key(ALGO_MNEMONIC)
        signed_txn = unsigned_txn.sign(private_key)

        # 4. Send to Network
        tx_id = algod_client.send_transaction(signed_txn)

        print(f"Transaction sent! ID: {tx_id}")

        return jsonify({
            "status": "success",
            "blockchainTxnId": tx_id,
            "hash": complaint_hash,
            "explorerUrl": f"https://testnet.algoscan.app/tx/{tx_id}"
        }), 200

    except Exception as e:
        print(f"Blockchain Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/calculate-hash', methods=['POST'])
def calculate_hash():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data supplied"}), 400
        
        # Consistent sorting/spacing for verification
        data_string = json.dumps(data, sort_keys=True)
        h = hashlib.sha256(data_string.encode()).hexdigest()
        
        return jsonify({"hash": h}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/extract_dob', methods=['POST'])
def extract_dob():
    try:
        file = request.files.get('aadhaar') or request.files.get('image')
        if not file:
            return jsonify({"error": "No image provided"}), 400

        img = Image.open(file.stream).convert('RGB')
        text = pytesseract.image_to_string(img)

        # Match common Aadhaar DOB formats: DD/MM/YYYY or DD-MM-YYYY or YYYY-MM-DD
        patterns = [
            r'(\d{2})[/\-](\d{2})[/\-](\d{4})',  # DD/MM/YYYY
            r'(\d{4})[/\-](\d{2})[/\-](\d{2})',  # YYYY-MM-DD
        ]
        dob = None
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                groups = match.groups()
                if len(groups[0]) == 4:
                    dob = f"{groups[0]}-{groups[1]}-{groups[2]}"
                else:
                    dob = f"{groups[2]}-{groups[1]}-{groups[0]}"
                break

        if dob:
            return jsonify({"dob": dob}), 200
        else:
            return jsonify({"dob": None, "message": "DOB not found in image"}), 200
    except Exception as e:
        print(f"extract_dob error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/verify', methods=['POST'])
def verify_face():
    try:
        aadhaar_file = request.files.get('aadhaar')
        selfie_file = request.files.get('selfie')
        if not aadhaar_file or not selfie_file:
            return jsonify({"error": "Both aadhaar and selfie images are required"}), 400

        aadhaar_img = face_recognition.load_image_file(aadhaar_file)
        selfie_img = face_recognition.load_image_file(selfie_file)

        aadhaar_encodings = face_recognition.face_encodings(aadhaar_img)
        selfie_encodings = face_recognition.face_encodings(selfie_img)

        if not aadhaar_encodings:
            return jsonify({"error": "No face found in Aadhaar image"}), 400
        if not selfie_encodings:
            return jsonify({"error": "No face found in selfie image"}), 400

        distance = face_recognition.face_distance([aadhaar_encodings[0]], selfie_encodings[0])[0]
        confidence = round(1 - float(distance), 4)
        match = confidence >= 0.05

        return jsonify({"match": match, "confidence": confidence}), 200
    except Exception as e:
        print(f"verify error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("AI-Blockchain Service started on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)