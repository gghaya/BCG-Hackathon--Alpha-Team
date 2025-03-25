import os
import fitz  # PyMuPDF for PDF extraction
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import json
import psycopg2
from sentence_transformers import SentenceTransformer
from config import Config
from models import db, candidates, job_offers
from matchskills import match_skills_with_gemini
from storeresume import upload_resume
from matching.config import MODEL , INDEX_NAME
from matching.vectorizer import process_job_descriptions, process_single_candidate
from matching.score import calculate_candidate_job_score
from pinecone import Pinecone 
# Initialize the Flask application
app = Flask(__name__)
CORS(app,  origins=["http://localhost:3000","http://127.0.0.1:3000"])  # Allow frontend to communicate with backend

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@db:5432/resume_db'
db.init_app(app)
PINECONE_API_KEY = "pcsk_5TtrUy_9uv7qGMEoZwK1tKUedXrV9edhVwVKAcvthRrkQUNzWotvBBT6GKZeALnC5zbVCR"
pc = Pinecone(api_key=PINECONE_API_KEY)

INDEX_NAME = "indexopenai"


index = pc.Index(INDEX_NAME)
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

def update_candidate_score_and_skills(candidate_id, score, missing, extra):
    candidate = db.session.get(candidates, candidate_id)
    if candidate:
        candidate.match_score = score
        candidate.missing_skills = missing
        candidate.extra_skills = extra
        db.session.commit()

def store_candidate_data(email,resume_data, fullname,resume_link, job_offer_id, missing, extra):
    """Store the resume data (as JSON) and file path in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO candidates (email, job_offer_id, full_name, resume_data, resume_path, missing_skills , extra_skills)
    VALUES (%s, %s, %s, %s,  %s, %s,  %s)
""", (email , job_offer_id, fullname, json.dumps(resume_data), resume_link, missing ,extra))
    candidate_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()
    

    return candidate_id


#API route to handle resume upload
@app.route("/apply", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    fullname = request.form.get("fullName")
    if not fullname:
        return jsonify({"error": "Full name is required"}), 400

    job_offer_id = request.form.get("job_offer_id")
    if not job_offer_id:
        return jsonify({"error": "Job offer ID is required"}), 400

    try:
        job_offer_id = int(job_offer_id)
    except ValueError:
        return jsonify({"error": "Invalid job offer ID"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    if not file.filename.endswith(".pdf"):
        return jsonify({"error": "Unsupported file format"}), 400

    extracted_text = extract_text_from_pdf(file_path)
    response = extract_resume_data_with_gemini(extracted_text)
    resume_data = extract_json_from_response(response)
    if not resume_data:
        return jsonify({"error": "Failed to extract resume data"}), 500

    email = request.form.get("email")
    resume_link = upload_resume(request)  # Assuming this stores the file & returns link

    # Temporary placeholder for skills from match_skills_with_gemini
    missing, extra = [], []

    # Store candidate in DB & Pinecone
    candidate_id = store_candidate_data(
        email=email,
        resume_data=resume_data,
        full_name=fullname,
        resume_link=resume_link,
        job_offer_id=job_offer_id,
        missing=json.dumps(missing),
        extra=json.dumps(extra)
    )

    process_single_candidate(candidate_id, json.dumps(resume_data), SentenceTransformer("all-MiniLM-L6-v2"), INDEX_NAME)

    # Fetch vectors from Pinecone
    candidate_fetch = index.fetch(ids=[str(candidate_id)], namespace="resumes")
    job_fetch = index.fetch(ids=[f"J{job_offer_id}"], namespace="jobs")

    if str(candidate_id) not in candidate_fetch.vectors or f"J{job_offer_id}" not in job_fetch.vectors:
        return jsonify({"error": "Candidate or Job not found in Pinecone"}), 404

    candidate_data = candidate_fetch.vectors[str(candidate_id)]
    job_data = job_fetch.vectors[f"J{job_offer_id}"]

    # Run score function
    score_result = calculate_candidate_job_score(
        candidate_metadata=candidate_data["metadata"],
        job_metadata=job_data["metadata"],
        model_embed=SentenceTransformer("all-MiniLM-L6-v2"),
        model_genai=genai.GenerativeModel("models/gemini-1.5-pro")
    )

    update_candidate_score_and_skills(
        candidate_id=candidate_id,
        score=score_result["final_score"],
        missing=json.dumps(score_result["missing_skills"]),
        extra=json.dumps(score_result["extra_skills"])
    )

    return jsonify({
        "final_score": score_result["final_score"],
        "missing_skills": score_result["missing_skills"],
        "extra_skills": score_result["extra_skills"]
    })



 #####  Job handling #####
 
import json
from db import get_db_connection

@app.route("/api/jobs", methods=["POST"])
def create_job():
    try:
        job_data = request.get_json()
        if not job_data:
            return jsonify({"error": "Missing JSON payload"}), 400

        job_id = store_job_in_db(job_data)

        # Call Pinecone vectorizer
        index = INDEX_NAME
        model = MODEL
        process_job_descriptions(job_data, model, index)

        return jsonify({"message": "Job created successfully", "job_id": job_id}), 201

    except Exception as e:
        print("Error in /api/jobs:", e)
        return jsonify({"error": "Failed to create job"}), 500


def store_job_in_db(job_data):
    conn = get_db_connection()
    cursor = conn.cursor()

   
    title = job_data.get("title", "")
    description = job_data.get("description", "")
    requirements = job_data.get("requirements", "")
    responsibilities = job_data.get("responsibilities", [])

    skills = requirements.get("skills", [])
    degree = requirements.get("degree", "")

    # Priority fields (e.g., "low", "medium", "high")
    skillspriority = job_data.get("skillspriority", None)
    requirementspriority = job_data.get("requirementspriority", None)
    degreepriority = job_data.get("educationpriority", None)

    cursor.execute("""
        INSERT INTO jobs (
             title, description,
            requirements, responsibilities,
            skills, degree,
            skillspriority, requirementspriority, degreepriority
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        
        title,
        description,
        json.dumps(requirements),
        json.dumps(responsibilities),
        json.dumps(skills),
        degree,
        skillspriority,
        requirementspriority,
        degreepriority
    ))

    inserted_id = cursor.fetchone()[0]
    conn.commit()
    conn.close()
   
    return inserted_id 
    

def get_all_jobs():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM jobs")
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]  # get column names

    jobs = []
    for row in rows:
        job = dict(zip(columns, row))  # convert row to dict
        jobs.append(job)

    conn.close()
    return jobs

@app.route("/api/jobs", methods=["GET"])
def list_jobs():
    try:
        jobs = get_all_jobs()
        return jsonify(jobs), 200
    except Exception as e:
        print("Error fetching jobs:", e)
        return jsonify({"error": "Failed to fetch jobs"}), 500
    
if __name__ == "__main__":
    app.run(debug=True)
