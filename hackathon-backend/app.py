import os
import fitz  # PyMuPDF for PDF extraction
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import json
import psycopg2
from config import Config

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Allow frontend to communicate with backend

# Set up Google API Key (retrieve it securely)
os.environ["GOOGLE_API_KEY"] = "AIzaSyCAePlqabCS1iBOlSBGSGtxKrOZ1I2lWKQ"  # Use environment variables for production
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Use environment variable for API key
genai.configure(api_key=GOOGLE_API_KEY)

# Directory for uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Extract text from PDF
def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text.strip()

# Extract resume data with Google Gemini
def extract_resume_data_with_gemini(text):
    """Extract structured data from resume text using Google Gemini."""
    prompt = f"""
    Extract key details from the following resume text and return structured JSON as mentioned below:

    Resume Text:
    {text}

    Required JSON format:
    {{
      "name": "",
      "contact": {{
        "email": "",
        "phone": "",
        "linkedin": "",
        "location": ""
      }},
      "summary": "",
      "experience": [
        {{
          "job_title": "",
          "company": "",
          "location": "",
          "start_date": "",
          "end_date": "",
          "responsibilities": []
        }}
      ],
      "education": [
        {{
          "degree": "",
          "university": "",
          "year": ""
        }}
      ],
      "skills": [],
      "certifications": []
    }}
    """
    model = genai.GenerativeModel("models/gemini-1.5-pro")
    response = model.generate_content(prompt)
    print("🔍 Raw Model Response:", response.text)
    return response.text

# Extract the raw JSON from the response
def extract_json_from_response(response_text):
    """Extract and clean JSON from Gemini API response."""
    json_match = re.search(r'```json\n(.*)\n```', response_text, re.DOTALL)
    if json_match:
        json_data = json_match.group(1)
        try:
            return json.loads(json_data)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return None
    else:
        print("Error: JSON content not found in the response.")
        return None

# Get a connection to the PostgreSQL database
def get_db_connection():
    """Connect to PostgreSQL database."""
    return psycopg2.connect(Config.DATABASE_URL)

def store_candidate_data(resume_data, file_path, job_offer_id):
    """Store the resume data (as JSON) and file path in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO candidates (job_offer_id, resume_data, resume_path)
        VALUES (%s, %s, %s)
    """, (job_offer_id, json.dumps(resume_data), file_path))
    conn.commit()
    conn.close()

@app.route("/job_offers", methods=["GET"])
def get_job_offers_route():
    """Fetch job offers and return as JSON."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, job_title FROM job_offers")
    job_offers = cursor.fetchall()
    conn.close()
    return jsonify([{ "id": offer[0], "job_title": offer[1] } for offer in job_offers])

# API route to handle resume upload
@app.route("/apply", methods=["POST"])
def upload_resume():
    """Handle resume upload and candidate data extraction."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    
    # Get job_offer_id from UI
    job_offer_id = request.form.get("job_offer_id")
    if not job_offer_id:
        return jsonify({"error": "Job offer ID is required"}), 400
    
    try:
        job_offer_id = int(job_offer_id)
    except ValueError:
        return jsonify({"error": "Invalid job offer ID"}), 400
    
    # Save the uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # Extract text from PDF
    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)
    else:
        return jsonify({"error": "Unsupported file format"}), 400
    
    # Get structured resume data from Google Gemini
    response = extract_resume_data_with_gemini(extracted_text)
    resume_data = extract_json_from_response(response)
    
    if not resume_data:
        return jsonify({"error": "Failed to extract resume data"}), 500
    
    # Store the extracted resume data and file path in the database
    store_candidate_data(resume_data, file_path, job_offer_id)
    
    return jsonify(resume_data)

if __name__ == "__main__":
    app.run(debug=True)
