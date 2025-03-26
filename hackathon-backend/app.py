import os
import fitz  # PyMuPDF for PDF extraction
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import re
import json
import psycopg2
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from models import db, candidates, job_offers, User
from matchskills import match_skills_with_gemini
from storeresume import upload_resume
from auth import token_required, recruiter_required, generate_token

# Load environment variables
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)
CORS(app,  origins=["http://localhost:3000","http://127.0.0.1:3000"])

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/resume_db')
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Set up Google API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("WARNING: Google API Key not found in environment variables")
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
    return response.text

# Extract the raw JSON from the response
def extract_json_from_response(response_text):
    """Extract and clean JSON from Gemini API response."""
    try:
        # Try direct JSON parsing first
        return json.loads(response_text)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON from markdown code blocks
        json_match = re.search(r'```json\n(.*)\n```', response_text, re.DOTALL)
        if json_match:
            json_data = json_match.group(1)
            try:
                return json.loads(json_data)
            except json.JSONDecodeError as e:
                print(f"Error decoding JSON from code block: {e}")
                return None
        else:
            # Print the response for debugging
            print("Unable to extract JSON. Response:", response_text[:500])
            return None

# Get a connection to the PostgreSQL database
def get_db_connection():
    """Connect to PostgreSQL database."""
    return psycopg2.connect(app.config['SQLALCHEMY_DATABASE_URI'])

def store_candidate_data(email, resume_data, fullname, resume_link, job_offer_id, missing, extra):
    """Store the resume data (as JSON) and file path in the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO candidates (email, job_offer_id, full_name, resume_data, resume_path, missing_skills, extra_skills)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (email, job_offer_id, fullname, json.dumps(resume_data), resume_link, missing, extra))
    conn.commit()
    conn.close()

# Authentication routes
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Username or email already exists"}), 409
    
    # Create new user
    new_user = User(
        username=data['username'],
        email=data['email'],
        is_recruiter=data.get('is_recruiter', False)
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Missing username or password"}), 400
    
    # Find user by username
    user = User.query.filter_by(username=data['username']).first()
    
    # Check password
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Generate token
    token = generate_token(user.id, user.is_recruiter)
    
    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_recruiter": user.is_recruiter
        }
    }), 200

# Public routes for applicants
@app.route("/api/apply", methods=["POST"])
def upload_resume_route():
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
    response = extract_resume_data_with_gemini(extracted_text)
    resume_data = extract_json_from_response(response)
    
    if not resume_data:
        return jsonify({"error": "Failed to extract resume data"}), 500
    
    email = request.form.get("email")
    
    # Get job description
    job = job_offers.query.get(job_offer_id)
    if not job:
        return jsonify({"error": "Job offer not found"}), 404
    
    job_description = job.description
    resume_skills = resume_data.get("skills", [])
    
    # Match skills with job description
    missing, extra = match_skills_with_gemini(job_description, resume_skills)
    
    # Upload resume to storage (Google Drive)
    resume_link = upload_resume(request)
    
    # Calculate skill score
    total_skills = len(resume_skills) + len(missing)
    skill_score = 0
    if total_skills > 0:
        skill_score = round((len(resume_skills) / total_skills) * 100)
    
    # Store the extracted resume data and file path in the database
    try:
        new_candidate = candidates(
            full_name=fullname,
            email=email,
            job_offer_id=job_offer_id,
            resume_path=resume_link,
            resume_data=resume_data,
            missing_skills=missing,
            extra_skills=extra,
            skills_score=skill_score
        )
        
        db.session.add(new_candidate)
        db.session.commit()
        
        return jsonify({
            "message": "Application submitted successfully",
            "skills": resume_skills,
            "missingSkills": missing,
            "extraSkills": extra,
            "skillScore": skill_score
        })
    
    except Exception as e:
        print(f"Error storing candidate data: {e}")
        return jsonify({"error": "Failed to store application data"}), 500

# Protected routes
@app.route("/api/job_offers", methods=["GET"])
def get_job_offers_route():
    """Fetch job offers and return as JSON."""
    try:
        job_offers_list = job_offers.query.all()
        return jsonify([{
            "id": offer.id,
            "job_title": offer.job_title,
            "description": offer.description,
            "closing_date": offer.closing_date.isoformat() if offer.closing_date else None,
            "publish_date": offer.publish_date.isoformat() if offer.publish_date else None,
            "reference_number": offer.reference_number,
            "number_of_positions": offer.number_of_positions
        } for offer in job_offers_list])
    except Exception as e:
        print(f"Error fetching job offers: {e}")
        return jsonify({"error": "Failed to fetch job offers"}), 500

@app.route("/api/job_offers", methods=["POST"])
@token_required
@recruiter_required
def create_job_offer():
    """Create a new job offer."""
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('job_title') or not data.get('description'):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Parse dates if provided
    closing_date = None
    if data.get('closing_date'):
        try:
            closing_date = datetime.strptime(data['closing_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid closing date format. Use YYYY-MM-DD"}), 400
    
    # Create new job offer
    new_job = job_offers(
        job_title=data['job_title'],
        description=data['description'],
        created_by=request.current_user.id,
        closing_date=closing_date,
        number_of_positions=data.get('number_of_positions', 1),
        publish_date=date.today(),
        reference_number=data.get('reference_number')
    )
    
    db.session.add(new_job)
    db.session.commit()
    
    return jsonify({
        "id": new_job.id,
        "job_title": new_job.job_title,
        "description": new_job.description,
        "closing_date": new_job.closing_date.isoformat() if new_job.closing_date else None,
        "publish_date": new_job.publish_date.isoformat() if new_job.publish_date else None,
        "reference_number": new_job.reference_number,
        "number_of_positions": new_job.number_of_positions
    }), 201

@app.route("/api/job_offers/<int:job_id>", methods=["PUT"])
@token_required
@recruiter_required
def update_job_offer(job_id):
    """Update an existing job offer."""
    job = job_offers.query.get(job_id)
    
    if not job:
        return jsonify({"error": "Job offer not found"}), 404
    
    data = request.get_json()
    
    # Update fields if provided
    if data.get('job_title'):
        job.job_title = data['job_title']
    
    if data.get('description'):
        job.description = data['description']
    
    if data.get('closing_date'):
        try:
            job.closing_date = datetime.strptime(data['closing_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid closing date format. Use YYYY-MM-DD"}), 400
    
    if data.get('number_of_positions'):
        job.number_of_positions = data['number_of_positions']
    
    if data.get('reference_number'):
        job.reference_number = data['reference_number']
    
    db.session.commit()
    
    return jsonify({
        "id": job.id,
        "job_title": job.job_title,
        "description": job.description,
        "closing_date": job.closing_date.isoformat() if job.closing_date else None,
        "publish_date": job.publish_date.isoformat() if job.publish_date else None,
        "reference_number": job.reference_number,
        "number_of_positions": job.number_of_positions
    }), 200

@app.route("/api/job_offers/<int:job_id>", methods=["DELETE"])
@token_required
@recruiter_required
def delete_job_offer(job_id):
    """Delete a job offer."""
    job = job_offers.query.get(job_id)
    
    if not job:
        return jsonify({"error": "Job offer not found"}), 404
    
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({"message": "Job offer deleted successfully"}), 200

@app.route("/api/applicants", methods=["GET"])
@token_required
@recruiter_required
def get_applicants():
    """Get all applicants with optional filtering."""
    try:
        query = candidates.query
        
        # Filter by job offer if provided
        job_id = request.args.get('job_offer_id')
        if job_id:
            query = query.filter_by(job_offer_id=job_id)
        
        # Get all applicants with requested filters
        applicants_list = query.all()
        
        # Convert to JSON-friendly format
        result = []
        for applicant in applicants_list:
            # Get job title if job_offer_id exists
            job_title = None
            if applicant.job_offer_id:
                job = job_offers.query.get(applicant.job_offer_id)
                if job:
                    job_title = job.job_title
            
            # Extract skills from resume_data if available
            skills = []
            missing_skills = []
            
            if applicant.resume_data:
                resume_data = json.loads(applicant.resume_data) if isinstance(applicant.resume_data, str) else applicant.resume_data
                skills = resume_data.get('skills', [])
            
            if applicant.missing_skills:
                missing_skills = json.loads(applicant.missing_skills) if isinstance(applicant.missing_skills, str) else applicant.missing_skills
            
            # Calculate skill score (could be enhanced with more sophisticated algorithm)
            skill_score = applicant.skills_score or 0
            if skill_score == 0 and skills and missing_skills:
                # Simple calculation based on missing skills
                total_skills = len(skills) + len(missing_skills)
                if total_skills > 0:
                    skill_score = round((len(skills) / total_skills) * 100)
            
            result.append({
                "id": applicant.id,
                "fullName": applicant.full_name,
                "email": applicant.email,
                "jobTitle": job_title,
                "jobId": applicant.job_offer_id,
                "resumePath": applicant.resume_path,
                "missingSkills": missing_skills,
                "skillScore": f"{skill_score}%",
                "rating": 0  # This could be added as a feature later
            })
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error fetching applicants: {e}")
        return jsonify({"error": "Failed to fetch applicants"}), 500

@app.route("/api/applicants/<int:applicant_id>", methods=["GET"])
@token_required
@recruiter_required
def get_applicant(applicant_id):
    """Get a specific applicant's details."""
    applicant = candidates.query.get(applicant_id)
    
    if not applicant:
        return jsonify({"error": "Applicant not found"}), 404
    
    # Get job title if job_offer_id exists
    job_title = None
    if applicant.job_offer_id:
        job = job_offers.query.get(applicant.job_offer_id)
        if job:
            job_title = job.job_title
    
    # Parse JSON fields
    resume_data = json.loads(applicant.resume_data) if isinstance(applicant.resume_data, str) else applicant.resume_data
    missing_skills = json.loads(applicant.missing_skills) if isinstance(applicant.missing_skills, str) else applicant.missing_skills
    extra_skills = json.loads(applicant.extra_skills) if isinstance(applicant.extra_skills, str) else applicant.extra_skills
    
    return jsonify({
        "id": applicant.id,
        "fullName": applicant.full_name,
        "email": applicant.email,
        "jobTitle": job_title,
        "jobId": applicant.job_offer_id,
        "resumePath": applicant.resume_path,
        "resumeData": resume_data,
        "missingSkills": missing_skills,
        "extraSkills": extra_skills,
        "skillScore": applicant.skills_score or 0
    }), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
