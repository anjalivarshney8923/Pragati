import os
import hashlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from algosdk.v2client import algod
from algosdk import transaction, mnemonic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""  # No token needed for AlgoNode public endpoint
WALLET_ADDRESS = os.getenv("WALLET_ADDRESS")
WALLET_PRIVATE_KEY = os.getenv("WALLET_PRIVATE_KEY")

# Initialize Algorand Client
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

@app.route('/store-on-chain', methods=['POST'])
def store_on_chain():
    try:
        # Check if environment variables are set
        if not WALLET_ADDRESS or not WALLET_PRIVATE_KEY:
            return jsonify({"error": "Server configuration error: WALLET_ADDRESS or WALLET_PRIVATE_KEY not set"}), 500

        # Get data from request
        data = request.json
        if not data or 'complaint' not in data:
            return jsonify({"error": "Missing 'complaint' field in request body"}), 400

        complaint_text = data['complaint']
        if not isinstance(complaint_text, str):
            return jsonify({"error": "'complaint' must be a string"}), 400

        # 1. Generate SHA-256 hash of the complaint
        complaint_hash = hashlib.sha256(complaint_text.encode('utf-8')).hexdigest()

        # 2. Get suggested parameters for the transaction
        params = algod_client.suggested_params()

        # 3. Create a transaction
        # sender = my address
        # receiver = same address
        # amount = 0
        # note = hash
        unsigned_txn = transaction.PaymentTxn(
            sender=WALLET_ADDRESS,
            sp=params,
            receiver=WALLET_ADDRESS,
            amt=0,
            note=complaint_hash.encode()
        )

        # 4. Sign the transaction
        # If WALLET_PRIVATE_KEY is a mnemonic string
        if " " in WALLET_PRIVATE_KEY:
            private_key = mnemonic.to_private_key(WALLET_PRIVATE_KEY)
        else:
            # Assume it's already a private key
            private_key = WALLET_PRIVATE_KEY

        signed_txn = unsigned_txn.sign(private_key)

        # 5. Send transaction
        tx_id = algod_client.send_transaction(signed_txn)

        # 6. Return transaction ID
        return jsonify({
            "txId": tx_id
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Print configuration status for debugging
    if not WALLET_ADDRESS or not WALLET_PRIVATE_KEY:
        print("WARNING: WALLET_ADDRESS or WALLET_PRIVATE_KEY not found in .env")
    
    print("Blockchain Flask service running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
