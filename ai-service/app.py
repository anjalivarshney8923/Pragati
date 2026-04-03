from flask import Flask, request, jsonify
import face_recognition
from flask_cors import CORS
from village_funds import get_village_funds_data
from schemes_funds import get_schemes_funds_data

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


@app.route("/schemes-funds", methods=["GET"])
def schemes_funds():
    try:
        # Get query parameters
        state = request.args.get('state', 'all')
        district = request.args.get('district', 'all')
        village = request.args.get('village', 'all')
        scheme = request.args.get('scheme', 'all')
        year = request.args.get('year', 'all')
        work_type = request.args.get('work_type', 'all')

        data = get_schemes_funds_data(state, district, village, scheme, year, work_type)
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


@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    message = (data.get('message', '') or '').lower().strip()
    lang = (data.get('lang', 'en') or 'en').lower()

    responses = {
        'en': {
            'complaint': "To raise a complaint, go to 'Raise Complaint' in the sidebar. You can submit issues about water, electricity, roads, or sanitation anonymously.",
            'my complaint': "Track your complaints under 'My Complaints' in the sidebar. Each complaint shows status: Pending, In Progress, or Resolved.",
            'status': "Check complaint status under 'My Complaints'. Statuses: Pending, In Progress, or Resolved.",
            'fund': "Village fund details are under 'Village Funds'. View allocated vs used funds by village and year.",
            'expenditure': "Track village spending under 'Expenditure'. It shows a breakdown of spending categories.",
            'scheme': "Government schemes are listed under 'Government Schemes'. Filter by state, district, village, and year.",
            'register': "To register, click 'Register' on the login page. You need your Aadhaar card, a selfie, and mobile number for OTP.",
            'login': "Use your registered mobile number and password to log in.",
            'aadhaar': "Aadhaar is required during registration for identity verification via face matching.",
            'otp': "An OTP is sent to your registered mobile number during registration.",
            'panchayat': "Pragati is a digital platform for Gram Panchayat services: complaints, funds, and government schemes.",
            'help': "I can help with: complaints, village funds, expenditure, government schemes, registration, and login.",
            'hello': "Hello! I'm the Pragati assistant. How can I help you with village services today?",
            'hi': "Hello! I'm the Pragati assistant. How can I help you with village services today?",
            'namaste': "Namaste! I'm the Pragati assistant. How can I help you today?",
            'default': "I can help with Pragati services like complaints, village funds, government schemes, and registration. Please ask a specific question."
        },
        'hi': {
            'शिकायत': "शिकायत दर्ज करने के लिए साइडबार में 'शिकायत दर्ज करें' पर जाएं। पानी, बिजली, सड़क या स्वच्छता से जुड़ी समस्याएं गुमनाम रूप से दर्ज करें।",
            'complaint': "शिकायत दर्ज करने के लिए साइडबार में 'शिकायत दर्ज करें' पर जाएं।",
            'स्थिति': "'मेरी शिकायतें' में जाकर शिकायत की स्थिति देखें: लंबित, प्रगति में, या हल।",
            'निधि': "'ग्राम निधि' में गांव के आवंटित और उपयोग किए गए धन की जानकारी देखें।",
            'fund': "'ग्राम निधि' में गांव के आवंटित और उपयोग किए गए धन की जानकारी देखें।",
            'व्यय': "'व्यय' सेक्शन में देखें कि गांव का पैसा कहां खर्च हुआ।",
            'योजना': "'सरकारी योजनाएं' में सभी योजनाओं की जानकारी मिलेगी। राज्य, जिला और गांव के अनुसार फ़िल्टर करें।",
            'scheme': "'सरकारी योजनाएं' में सभी योजनाओं की जानकारी मिलेगी।",
            'पंजीकरण': "पंजीकरण के लिए 'यहाँ पंजीकरण करें' पर क्लिक करें। आधार कार्ड, सेल्फी और मोबाइल नंबर की जरूरत होगी।",
            'register': "पंजीकरण के लिए 'यहाँ पंजीकरण करें' पर क्लिक करें।",
            'लॉगिन': "अपने पंजीकृत मोबाइल नंबर और पासवर्ड से लॉगिन करें।",
            'आधार': "पंजीकरण के दौरान पहचान सत्यापन के लिए आधार कार्ड आवश्यक है।",
            'ओटीपी': "पंजीकरण के दौरान आपके मोबाइल पर OTP भेजा जाएगा।",
            'नमस्ते': "नमस्ते! मैं प्रगति सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
            'hello': "नमस्ते! मैं प्रगति सहायक हूं।",
            'hi': "नमस्ते! मैं प्रगति सहायक हूं।",
            'मदद': "मैं शिकायत, ग्राम निधि, व्यय, सरकारी योजनाएं और पंजीकरण में मदद कर सकता हूं।",
            'default': "मैं प्रगति सेवाओं जैसे शिकायत, ग्राम निधि, सरकारी योजनाएं और पंजीकरण में मदद कर सकता हूं।"
        }
    }

    lang_responses = responses.get(lang, responses['en'])
    reply = None
    for keyword, response in lang_responses.items():
        if keyword != 'default' and keyword in message:
            reply = response
            break

    if not reply:
        reply = lang_responses.get('default', responses['en']['default'])

    return jsonify({'reply': reply})


if __name__ == '__main__':
    app.run(port=5000)