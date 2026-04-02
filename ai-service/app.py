from flask import Flask, request, jsonify
import face_recognition
from flask_cors import CORS
from village_funds import get_village_funds_data

app = Flask(__name__)
CORS(app)


@app.route("/verify", methods=["POST"])
def verify():
    try:
        # load images from the uploaded files
        img1 = face_recognition.load_image_file(request.files["aadhaar"])
        img2 = face_recognition.load_image_file(request.files["selfie"])

        # extract face encodings
        enc1 = face_recognition.face_encodings(img1)
        enc2 = face_recognition.face_encodings(img2)

        if not enc1 or not enc2:
            return jsonify({"error": "No face detected in one or both images"}), 400

        enc1 = enc1[0]
        enc2 = enc2[0]

        distance = face_recognition.face_distance([enc1], enc2)[0]

        return jsonify({
            "match": bool(distance < 0.5),
            "confidence": float(1 - distance)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/village-funds/<village>/<year>/<sub_village>", methods=["GET"])
def village_funds(village, year, sub_village):
    try:
        data = get_village_funds_data(village, year, sub_village)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000)