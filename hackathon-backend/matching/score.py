import re
import json
from sentence_transformers import util
import google.generativeai as genai

def calculate_candidate_job_score(candidate_metadata, job_metadata, model_embed, model_genai):
    # --- Step 1: Convert priority strings to weights ---
    def priority_to_weight(priority_str):
        mapping = {"high": 1.0, "medium": 0.66, "low": 0.33}
        return mapping.get(str(priority_str).lower(), 0.5)

    # --- Step 2: Normalize weights ---
    raw_weights = {
        "skills": priority_to_weight(job_metadata.get("skills_priority")),
        "degree": priority_to_weight(job_metadata.get("degree_priority")),
        "requirements": priority_to_weight(job_metadata.get("requirements_priority"))
    }
    total_weight = sum(raw_weights.values()) or 1.0
    weights = {k: v / total_weight for k, v in raw_weights.items()}

    # --- Step 3: Extract text chunks for embedding ---
    candidate_skills_text = " ".join(candidate_metadata.get("skills", []))
    job_skills_text = " ".join(job_metadata.get("skills", []))

    candidate_exp_text = candidate_metadata.get("experience", "")
    job_exp_text = str(job_metadata.get("experience", ""))

    candidate_edu_text = candidate_metadata.get("education", "")
    job_edu_text = str(job_metadata.get("education", ""))

    # --- Step 4: Compute cosine similarities per section ---
    def cosine_sim(text1, text2):
        emb1 = model_embed.encode(text1, convert_to_tensor=True)
        emb2 = model_embed.encode(text2, convert_to_tensor=True)
        return util.cos_sim(emb1, emb2).item()

    skills_similarity = cosine_sim(candidate_skills_text, job_skills_text)
    experience_similarity = cosine_sim(candidate_exp_text, job_exp_text)
    education_similarity = cosine_sim(candidate_edu_text, job_edu_text)

    # --- Step 5: Final weighted score ---
    final_score = (
        skills_similarity * weights["skills"] +
        education_similarity * weights["degree"] +
        experience_similarity * weights["requirements"]
    )

    # --- Step 6: Gemini skill gap analysis ---
    prompt = f"""
    Given the following job skills: {', '.join(job_metadata.get("skills", []))},
    and the following candidate skills: {', '.join(candidate_metadata.get("skills", []))},
    please identify the missing skills (those required by the job but not present in the candidate's skills)
    and extra skills (those possessed by the candidate but not required by the job).
    Return the result in JSON format with two keys: 'missing_skills' and 'extra_skills'.
    """

    try:
        model_genai = genai.GenerativeModel("models/gemini-1.5-pro")
        response = model_genai.generate_content(prompt)
        response_text = response.text if hasattr(response, "text") else str(response)
        json_match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        json_data = json_match.group(1) if json_match else response_text
        skill_analysis = json.loads(json_data)
    except Exception as e:
        print(f"Skill analysis error: {e}")
        skill_analysis = {"missing_skills": [], "extra_skills": []}

    # --- Return only what's needed ---
    return {
        "final_score": round(final_score, 4),
        "missing_skills": skill_analysis.get("missing_skills", []),
        "extra_skills": skill_analysis.get("extra_skills", [])
    }
