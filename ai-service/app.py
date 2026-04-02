from flask import Flask, request, jsonify
import face_recognition
from flask_cors import CORS
from village_funds import get_village_funds_data

# OCR dependencies
import io
import re
from datetime import datetime
try:
    from PIL import Image
    import pytesseract
    import cv2
    import numpy as np
    OCR_AVAILABLE = True
except Exception:
    # OCR libs may not be installed in every environment; handle gracefully
    OCR_AVAILABLE = False

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


@app.route('/extract_dob', methods=['POST'])
def extract_dob():
    """Accepts an uploaded Aadhaar image (form field 'aadhaar') and returns a best-effort DOB in YYYY-MM-DD format.

    Returns JSON: { dob: 'YYYY-MM-DD' } or { dob: None, error: 'message' }
    """
    if not OCR_AVAILABLE:
        return jsonify({'dob': None, 'error': 'OCR libraries not installed on server (pytesseract/opencv/pillow)'}), 200

    if 'aadhaar' not in request.files:
        return jsonify({'dob': None, 'error': 'No file uploaded under field "aadhaar"'}), 200

    file = request.files['aadhaar']
    try:
        img_bytes = file.read()
        pil_img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

        # Convert to OpenCV image
        cv_img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        # Preprocess: grayscale, bilateral filter, adaptive threshold
        gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
        gray = cv2.bilateralFilter(gray, 9, 75, 75)
        # Use adaptive threshold to make text clearer
        th = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY, 11, 2)

        # Run OCR
        try:
            ocr_config = '--psm 6'
            text = pytesseract.image_to_string(th, config=ocr_config)
        except Exception as e:
            # As a fallback, run OCR on the original PIL image
            text = pytesseract.image_to_string(pil_img)

        # Normalize text
        normalized = text.replace('\n', ' ').replace('\r', ' ')

        # Common DOB patterns: dd/mm/yyyy, dd-mm-yyyy, dd mm yyyy, yyyy-mm-dd
        date_patterns = [r'(\d{2}[\/\-]\d{2}[\/\-]\d{4})',
                         r'(\d{2}\s\d{2}\s\d{4})',
                         r'(\d{4}[\/\-]\d{2}[\/\-]\d{2})',
                         r'(\d{2}[\/\-]\d{4})']

        candidate = None
        for pat in date_patterns:
            m = re.search(pat, normalized)
            if m:
                candidate = m.group(1)
                break

        dob_iso = None
        if candidate:
            # Try multiple parse formats
            formats = ['%d/%m/%Y', '%d-%m-%Y', '%d %m %Y', '%Y-%m-%d', '%d/%Y-%m']
            parsed = None
            # Clean candidate
            cand = candidate.strip()
            cand = cand.replace('.', '/')
            # Try common separators
            for fmt in ['%d/%m/%Y', '%d-%m-%Y', '%d %m %Y', '%Y-%m-%d']:
                try:
                    parsed = datetime.strptime(cand, fmt)
                    break
                except Exception:
                    continue

            if parsed:
                dob_iso = parsed.strftime('%Y-%m-%d')

        # Additionally try to find 'DOB' label followed by date
        if not dob_iso:
            m = re.search(r'DOB\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})', text, flags=re.IGNORECASE)
            if m:
                cand = m.group(1)
                # Normalize 2-digit years to 4-digit (assume 19xx/20xx heuristics)
                parts = re.split('[\/\-]', cand)
                try:
                    if len(parts[2]) == 2:
                        year = int(parts[2])
                        year = 1900 + year if year > 30 else 2000 + year
                        parts[2] = str(year)
                    parsed = datetime.strptime('/'.join(parts), '%d/%m/%Y')
                    dob_iso = parsed.strftime('%Y-%m-%d')
                except Exception:
                    pass

        return jsonify({'dob': dob_iso}), 200
    except Exception as e:
        return jsonify({'dob': None, 'error': str(e)}), 200


if __name__ == '__main__':
    app.run(port=5000)