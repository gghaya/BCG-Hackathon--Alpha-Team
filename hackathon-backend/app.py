import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF for PDFs
import docx
import os
import spacy
import re
from config import Config

# Initialize spaCy NLP model
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
app.config.from_object(Config)  # Load the configuration from Config class
CORS(app)  # Allow frontend to communicate with backend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text() for page in doc])
    return text

def extract_text_from_docx(docx_path):
    """Extract text from a DOCX file."""
    doc = docx.Document(docx_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

def extract_info(text):
    """Extract structured information using spaCy."""
    doc = nlp(text)

    name = None
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    email_match = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)
    email = email_match.group(0) if email_match else None

    job_titles = ["Software Engineer", "Data Scientist", "Product Manager", "Developer", "Analyst"]
    job = None
    for title in job_titles:
        if title.lower() in text.lower():
            job = title
            break

    # Extract years of experience from the text
    experience_match = re.search(r"(\d+)\s*(?:years|yrs)\s*(?:of)?\s*experience", text, re.IGNORECASE)
    experience = experience_match.group(1) + " years" if experience_match else "Not mentioned"

    # Extract the 'Experience' or 'Work History' section content
    experience_section_keywords = ["experience", "work history", "professional experience", "employment history"]
    experience_section = ""
    lines = text.split("\n")
    inside_experience_section = False

    for line in lines:
        if any(keyword in line.lower() for keyword in experience_section_keywords):
            inside_experience_section = True
        elif inside_experience_section and line.strip() == "":
            # Stop extracting after a blank line
            break
        elif inside_experience_section:
            experience_section += line + "\n"

    return {
        "name": name,
        "email": email,
        "job": job,
        "experience": experience,
        "experience_section": experience_section.strip()  # Return the full experience section content
    }

def get_db_connection():
    """Get a connection to the PostgreSQL database."""
    conn = psycopg2.connect(Config.DATABASE_URL)
    return conn

def get_job_offers():
    """Fetch job offers from the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, job_title FROM job_offers")
    job_offers = cursor.fetchall()
    conn.close()
    return job_offers

def store_candidate(full_name, email, job_offer_id, experience, experience_section, resume_path):
    """Store candidate data in the database, including resume path."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(''' 
        INSERT INTO candidates (full_name, email, job_offer_id, experience, experience_section, resume_path)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (full_name, email, job_offer_id, experience, experience_section, resume_path))
    conn.commit()
    conn.close()

@app.route("/job_offers", methods=["GET"])
def get_job_offers_route():
    """Fetch job offers and return as JSON."""
    job_offers = get_job_offers()  # Fetch job offers from the database
    job_offers_list = [{"id": offer[0], "job_title": offer[1]} for offer in job_offers]
    return jsonify(job_offers_list)

@app.route("/apply", methods=["POST"])
def upload_resume():
    """Handle resume upload and candidate data extraction."""
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Extract text based on file type
    if file.filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)
    elif file.filename.endswith(".docx"):
        extracted_text = extract_text_from_docx(file_path)
    else:
        return jsonify({"error": "Unsupported file format"}), 400

    # Extract structured info from the resume
    extracted_info = extract_info(extracted_text)

    # Store candidate info in the database
    job_offer_id = None
    job_offers = get_job_offers()
    for offer in job_offers:
        if offer[1].lower() == extracted_info['job'].lower():
            job_offer_id = offer[0]
            break

    if job_offer_id:
        store_candidate(
            extracted_info["name"],
            extracted_info["email"],
            job_offer_id,
            extracted_info["experience"],
            extracted_info["experience_section"],  # Save the full experience section content in the database
            file_path  # Save the resume path in the database
        )

    return jsonify({
        "filename": file.filename,
        "name": extracted_info["name"],
        "email": extracted_info["email"],
        "job": extracted_info["job"],
        "experience": extracted_info["experience"],
        "experience_section": extracted_info["experience_section"]
    })

if __name__ == "__main__":
    app.run(debug=True)
