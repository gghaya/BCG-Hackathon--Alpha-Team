import json
import re
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
from models import PriorityLevel

# Initialize the sentence transformer model - this will be loaded once when the module is imported
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print(f"Error loading sentence transformer model: {e}")
    model = None

def clean_text(text):
    """Basic text cleaning"""
    if not isinstance(text, str):
        return ""
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def priority_to_weight(priority_level):
    """Convert a PriorityLevel enum to a numerical weight"""
    weights = {
        PriorityLevel.LOW: 0.33,
        PriorityLevel.MEDIUM: 0.66,
        PriorityLevel.HIGH: 1.0,
        PriorityLevel.CRITICAL: 1.5
    }
    if isinstance(priority_level, PriorityLevel):
        return weights.get(priority_level, 0.66)  # Default to medium if not specified
    
    # If it's a string, try to match it to a priority level
    if isinstance(priority_level, str):
        priority_str = priority_level.lower()
        for level in PriorityLevel:
            if level.value == priority_str:
                return weights.get(level, 0.66)
    
    return 0.66  # Default to medium weight

def cosine_similarity(text1, text2, model=model):
    """Calculate cosine similarity between two text strings"""
    if not text1 or not text2 or not model:
        return 0.0
    
    text1 = clean_text(text1)
    text2 = clean_text(text2)
    
    if not text1 or not text2:
        return 0.0
    
    try:
        emb1 = model.encode(text1, convert_to_tensor=True)
        emb2 = model.encode(text2, convert_to_tensor=True)
        return float(util.cos_sim(emb1, emb2).item())
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.0

def identify_skill_gaps(job_skills, candidate_skills, google_api_key=None):
    """
    Use Gemini AI to identify missing and extra skills
    """
    if not google_api_key:
        # Fallback to simpler method if no API key
        if not job_skills or not candidate_skills:
            return [], []
            
        job_skills_set = set(job_skills) if isinstance(job_skills, list) else set()
        candidate_skills_set = set(candidate_skills) if isinstance(candidate_skills, list) else set()
        
        missing = list(job_skills_set - candidate_skills_set)
        extra = list(candidate_skills_set - job_skills_set)
        
        return missing, extra
    
    # Configure Gemini
    genai.configure(api_key=google_api_key)
    
    # Create prompt for AI
    prompt = f"""
    Given the following job skills: {', '.join(job_skills) if isinstance(job_skills, list) else job_skills},
    and the following candidate skills: {', '.join(candidate_skills) if isinstance(candidate_skills, list) else candidate_skills},
    please identify:
    1. 'missing_skills': skills required by the job but not found in the candidate's list
    2. 'extra_skills': skills the candidate has but not required by the job

    Return only this JSON format:
    {{
      "missing_skills": ["skill1", "skill2"],
      "extra_skills": ["skill3", "skill4"]
    }}
    """
    
    try:
        model_genai = genai.GenerativeModel("models/gemini-1.5-pro")
        response = model_genai.generate_content(prompt)
        response_text = response.text if hasattr(response, "text") else str(response)
        
        # Try to extract JSON block if presented in markdown
        json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        json_data = json_match.group(1) if json_match else response_text
        
        # Parse JSON
        result = json.loads(json_data)
        return result.get("missing_skills", []), result.get("extra_skills", [])
    except Exception as e:
        print(f"Gemini skill analysis error: {e}")
        # Fall back to set-based comparison
        return identify_skill_gaps(job_skills, candidate_skills, None)

def calculate_candidate_score(candidate_data, job_data, google_api_key=None):
    """
    Calculate a comprehensive matching score between a candidate and a job
    
    Parameters:
    - candidate_data: Dict containing candidate resume data
    - job_data: Dict containing job offer data
    - google_api_key: Optional API key for Gemini AI
    
    Returns:
    - Dict containing scores and skill gap analysis
    """
    # Extract candidate data
    if isinstance(candidate_data, str):
        try:
            candidate_data = json.loads(candidate_data)
        except:
            candidate_data = {}
    
    # Extract skills
    candidate_skills = candidate_data.get("skills", [])
    
    # Extract job skills and priorities
    job_skills = job_data.get("skills", [])
    skills_priority = job_data.get("skills_priority", PriorityLevel.MEDIUM)
    requirements_priority = job_data.get("requirements_priority", PriorityLevel.MEDIUM)
    education_priority = job_data.get("education_priority", PriorityLevel.MEDIUM)
    
    # Step 1: Calculate weights
    skill_weight = priority_to_weight(skills_priority)
    req_weight = priority_to_weight(requirements_priority)
    edu_weight = priority_to_weight(education_priority)
    
    # Normalize weights
    total_weight = skill_weight + req_weight + edu_weight
    if total_weight == 0:
        total_weight = 1.0
    norm_skill_weight = skill_weight / total_weight
    norm_req_weight = req_weight / total_weight
    norm_edu_weight = edu_weight / total_weight
    
    # Step 2: Extract text for comparison
    # Skills
    candidate_skills_text = ", ".join(candidate_skills) if isinstance(candidate_skills, list) else str(candidate_skills)
    job_skills_text = ", ".join(job_skills) if isinstance(job_skills, list) else str(job_skills)
    
    # Experience/Requirements
    candidate_exp = []
    for exp in candidate_data.get("experience", []):
        if isinstance(exp, dict):
            job_title = exp.get("job_title", "")
            company = exp.get("company", "")
            responsibilities = " ".join(exp.get("responsibilities", []))
            candidate_exp.append(f"{job_title} at {company}. {responsibilities}")
    candidate_exp_text = " ".join(candidate_exp)
    
    job_req_text = job_data.get("requirements", "")
    job_resp_text = json.dumps(job_data.get("responsibilities", {})) if isinstance(job_data.get("responsibilities"), dict) else str(job_data.get("responsibilities", ""))
    
    # Education
    candidate_edu = []
    for edu in candidate_data.get("education", []):
        if isinstance(edu, dict):
            degree = edu.get("degree", "")
            university = edu.get("university", "")
            candidate_edu.append(f"{degree} from {university}")
    candidate_edu_text = " ".join(candidate_edu)
    
    job_edu_text = job_data.get("education", "")
    
    # Step 3: Calculate similarities
    skills_score = cosine_similarity(candidate_skills_text, job_skills_text) * 100
    req_score = cosine_similarity(candidate_exp_text, job_req_text + " " + job_resp_text) * 100
    edu_score = cosine_similarity(candidate_edu_text, job_edu_text) * 100
    
    # Step 4: Calculate overall score
    overall_score = (
        skills_score * norm_skill_weight +
        req_score * norm_req_weight +
        edu_score * norm_edu_weight
    )
    
    # Step 5: Skill gap analysis
    missing_skills, extra_skills = identify_skill_gaps(job_skills, candidate_skills, google_api_key)
    
    # Return scores and analysis
    return {
        "skills_score": round(skills_score),
        "requirements_score": round(req_score),
        "education_score": round(edu_score),
        "overall_score": round(overall_score, 2),
        "missing_skills": missing_skills,
        "extra_skills": extra_skills
    }