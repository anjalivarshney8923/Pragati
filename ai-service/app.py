import hashlib
import json
from flask import Flask, request, jsonify
from algosdk.v2client import algod
from algosdk import transaction, mnemonic

app = Flask(__name__)

# --- YOUR CONFIGURATION ---
ALGO_ADDRESS = "XFH3YTGVZ3HET7Z3Z2K5JB2GCXCA63J2EWRBGOR2N3XPAX3B56ATB2BCNM"
ALGO_MNEMONIC = "jewel ivory manage spirit twice behave orange toy floor cigar step kitten capital decorate slot equip siege work car glove deposit risk until above empty"

# AlgoNode Public TestNet API
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = "" 

# Initialize Client
algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

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

if __name__ == '__main__':
    # Running on port 5000 by default
    print("AI-Blockchain Service started on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)