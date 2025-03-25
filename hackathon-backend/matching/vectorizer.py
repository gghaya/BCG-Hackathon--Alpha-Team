import pinecone
from sentence_transformers import SentenceTransformer
from matching.config import INDEX_NAME, MODEL, PINECONE_API_KEY
from matching.utils import clean_text
from pinecone import Pinecone, ServerlessSpec
import json
from matching.utils import clean_text

pinecone.init(api_key=PINECONE_API_KEY, environment="us-west1-gcp")

index = pinecone.Index(INDEX_NAME) 
model = SentenceTransformer(MODEL)


#########################    Job Embeddings   ################################
def process_job_descriptions(job, model, index):
    """
    Process a single job and upsert its vector to Pinecone.
    """
    job_id = job.get("id", "")
    title = job.get("title", "")
    description = job.get("description", "")
    requirements = job.get("requirements", "")  
    responsibilities = " ".join(job.get("responsibilities", []))
    skills = job.get("skills", [])
    degree = requirements.get("degree", "")

    # Priority fields (optional)
    skillspriority = job.get("skillspriority")
    requirementspriority = job.get("requirementspriority")
    degreepriority = job.get("educationpriority")

    # Final job text for embedding
    job_text = f"{title}. {description} " \
               f"Experience required: {requirements}. " \
               f"Skills: {' '.join(skills)}. " \
               f"Education: {degree}. " \
               f"Responsibilities: {responsibilities}"

    job_text = clean_text(job_text)

    # Metadata
    metadata = {
        "title": title,
        "description": description,
        "experience": requirements,
        "skills": skills,
        "education": degree,
        "responsibilities": responsibilities,
        "skills_priority": skillspriority,
        "requirements_priority": requirementspriority,
        "education_priority": degreepriority
    }

    # Create embedding and upsert to Pinecone
    vector = model.encode(job_text).tolist()
    index.upsert(vectors=[(str(job_id), vector, metadata)], namespace="jobs")



#########################   Candidat Embeddings   ################################


def process_single_candidate(candidate_id, resume_json, model, index):
    """
    Processes a single candidate and upserts them into Pinecone.
    """
    try:
        resume = json.loads(resume_json)
    except json.JSONDecodeError:
        print(f"Erreur de parsing JSON pour le candidat {candidate_id}")
        return

    name = resume.get("name", "")
    summary = resume.get("summary", "")

    # Process Experience
    experience_texts = []
    for exp in resume.get("experience", []):
        if isinstance(exp, dict):
            job_title = exp.get("job_title", "")
            company = exp.get("company", "")
            location = exp.get("location", "")
            responsibilities = " ".join(exp.get("responsibilities", []))
            experience_texts.append(f"{job_title} at {company}, {location}. {responsibilities}")

    # Process Education
    education_texts = []
    for edu in resume.get("education", []):
        if isinstance(edu, dict):
            degree = edu.get("degree", "")
            university = edu.get("university", "")
            year = edu.get("year", "")
            education_texts.append(f"{degree} from {university}, {year}")

    # Skills
    skills_list = resume.get("skills", [])
    skills = " ".join(skills_list) if isinstance(skills_list, list) else ""

    contact_info = resume.get("contact", {})
    email = contact_info.get("email", "") if isinstance(contact_info, dict) else ""
    phone = contact_info.get("phone", "") if isinstance(contact_info, dict) else ""

    # Final cleaned text for embedding
    text = f"{name}. {summary} {' '.join(experience_texts)} {' '.join(education_texts)} {skills}"
    text = clean_text(text)

    # Metadata
    metadata = {
        "name": name,
        "email": email,
        "phone": phone,
        "experience": " ".join(experience_texts),
        "education": " ".join(education_texts),
        "skills": skills_list,
        "summary": summary,
    }

    # Encode and upsert
    vector = model.encode(text).tolist()
    index.upsert(vectors=[(str(candidate_id), vector, metadata)], namespace="resumes")
