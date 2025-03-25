import os
import fitz  # PyMuPDF for PDF extraction
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import json
import psycopg2
from config import Config
from models import db, candidates, job_offers
from matchskills import match_skills_with_gemini
from storeresume import upload_resume
from getdata import get_all_candidates, get_job_titles , filter_candidates
# Initialize the Flask application
app = Flask(__name__)
CORS(app,  origins=["http://localhost:3000","http://127.0.0.1:3000"])  # Allow frontend to communicate with backend

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/resume_db'
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()


# Set up Google API Key (retrieve it securely)
os.environ["GOOGLE_API_KEY"] = "AIzaSyD_jqJEPv2lbZHcFNjuRbLG070vzrWPh_s"  # Use environment variables for production
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





# @app.route('/apply', methods=['POST'])
# def custom_handler():
#     # request.data['resume'] = request.files["file"]
#     print("Calling upload_resume inside custom_handler")
#     response = upload_resume(request)
#     return response




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
    # print("🔍 Raw Model Response:", response.text)
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

def store_candidate_data(email,resume_data, fullname,resume_link, job_offer_id, missing, extra):
    """Store the resume data (as JSON) and file path in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO candidates (email, job_offer_id, full_name, resume_data, resume_path, missing_skills , extra_skills)
    VALUES (%s, %s, %s, %s,  %s, %s,  %s)
""", (email , job_offer_id, fullname, json.dumps(resume_data), resume_link, missing ,extra))
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

#API route to handle resume upload
@app.route("/apply", methods=["POST"])
def upload_data():
    """Handle resume upload and candidate data extraction."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400
    fullname = request.form.get("fullName")
    if fullname == "":
        return jsonify({"error": "Empty name"}), 400
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
    #response = extract_resume_data_with_gemini(extracted_text)
    #resume_data = extract_json_from_response(response)
    
    #if not resume_data:
       # return jsonify({"error": "Failed to extract resume data"}), 500
    
    email = request.form.get("email")
    job_description_all = db.session.get(job_offers, job_offer_id)
    job_description = job_description_all.description
    #resume_skills = resume_data.get("skills", [])
    print("job_description=========>", job_description)
    # print("resume_skills 888888888888 ", resume_skills)
   # missing , extra = match_skills_with_gemini(job_description, resume_skills)
    #print("extra*******" , missing)
    resume_link = upload_resume(request)
    # Store the extracted resume data and file path in the database
    #store_candidate_data(email,resume_data,fullname, resume_link, job_offer_id, json.dumps(missing) , json.dumps(extra))
    
    return jsonify(resume_link)




#///////////////////////////////////////////////////////
@app.route('/api/candidates', methods=['GET'])
def handel_candidates():
    return(get_all_candidates(request))
@app.route('/api/job_titles', methods=['GET'])
def handel_jobtitles():
    return(get_job_titles(request))

@app.route('/api/candidates/filter', methods=['GET'])
def handel_filtercandidates():
    return(filter_candidates(request))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)




