import google.generativeai as genai
import os
os.environ["GOOGLE_API_KEY"] = "AIzaSyCAePlqabCS1iBOlSBGSGtxKrOZ1I2lWKQ"  # Use environment variables for production
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Use environment variable for API key
genai.configure(api_key=GOOGLE_API_KEY)


# --- Gemini Skill Matching Function ---
def compare_skills_with_gemini(job_description, candidate_skills):
    prompt = f"""
You are an AI assistant helping recruiters match job requirements with candidate skills.

Here is a job description:
{job_description}

Here are the candidate's skills:
{candidate_skills}

Return only this JSON format:
{{
  "missing_skills": ["skill1", "skill2"],
  "extra_skills": ["skill3", "skill4"]
}}
"""
    model = genai.GenerativeModel("models/gemini-1.5-pro")
    response = model.generate_content(prompt)
    raw = response.text.strip()

    try:
        raw_clean = re.sub(r"```json|```", "", raw)
        parsed = json.loads(raw_clean)
        return parsed.get("missing_skills", []), parsed.get("extra_skills", [])
    except Exception as e:
        print("Gemini JSON parse error:", e)
        return [], []



def extract_skills_from_job_description_with_gemini(description):
    """Extract a list of skills from a job description using Google Gemini."""
    prompt = f"""
    Extract only the core technicaland soft skills mentioned in the following job description. 
    Return the result as a JSON array of skill keywords (no explanation or extra text).

    Job Description:
    {description}

    JSON format:
    {{
      "skills": ["skill1", "skill2", "skill3", ...]
    }}
    """

    model = genai.GenerativeModel("models/gemini-1.5-pro")
    response = model.generate_content(prompt)
    
    print("🔍 Raw Gemini Response:", response.text)
    
    # Optionally parse the JSON
    try:
        import json
        parsed = json.loads(response.text)
        return parsed.get("skills", [])
    except Exception as e:
        print("⚠️ Failed to parse skills JSON:", e)
        return []

def match_skills_with_gemini(job_description, candidate_skills):
    prompt = f"""
You are an AI assistant helping recruiters match job requirements with candidate skills.

Here is a job description:
{job_description}

And here are the candidate's skills:
{candidate_skills}

Please compare the job-required skills with the candidate's skills and return:
1. 'missing_skills': skills required by the job but not found in the candidate's list
2. 'extra_skills': skills the candidate has but are not required by the job

Return only this JSON format:

{{
  "missing_skills": ["skill1", "skill2"],
  "extra_skills": ["skill3", "skill4"]
}}
"""
    model = genai.GenerativeModel("models/gemini-1.5-pro")
    response = model.generate_content(prompt)

    raw = response.text.strip()
    print("🧠 Raw Comparison Response:", repr(raw))

    try:
        import json, re
        raw_clean = re.sub(r"```json|```", "", raw)
        parsed = json.loads(raw_clean)
        return parsed.get("missing_skills", []), parsed.get("extra_skills", [])
    except Exception as e:
        print("⚠️ JSON Parse Failed:", e)
        return [], []

test_description = """Au sein des équipes R&D Produits et CloudOps IT, le développeur a pour mission de concevoir, développer et maintenir des applications logicielles en utilisant lesmeilleures pratiques de programmation. Il doit collaborer avec les équipes pourassurer la qualité, la performance et la livraison efficace des projets, autour d’une sonde d'analyse de trafic IP.



A cette fin, ses missions principales sont les suivantes :

Développement de Logiciels
Développer et maintenir le produit, en l'adaptant aux évolutions constantes des protocoles et des applications utilisant les réseaux IP
Écrire du code propre, modulaire, évolutif et bien documenté.
Participer aux revues de code et assurer la qualité du code produit.
Améliorer le produit au niveau technique (optimisations, refactoring etc).
Améliorer le produit par l'ajout de nouvelles fonctionnalités : Rechercher (par exemple en analysant des captures réseau, par du reverse engineering ou dela veille technologique) des moyens d’extraire de nouvelles informations pertinentes de flux réseaux de plus en plus chiffrés (pouvant par exemple faire appel au Machine Learning etc).
2.Analyse et Conception

Analyser les besoins des utilisateurs, proposer des solutions techniques adaptées et chiffrer la réalisation
Collaborer avec les équipes pour créer des interfaces utilisateur intuitives et fonctionnelles.


3.Tests et Débogage

Effectuer des tests unitaires, d'intégration et fonctionnels pour garantir la qualité et la performance des applications.
Détecter, analyser et corriger les bugs et les dysfonctionnements.


4.Collaboration Inter-équipes

Travailler en étroite collaboration avec les équipes de développement et produit.
Participer aux réunions Agile/Scrum pour aligner les objectifs et les priorités.


5.Maintenance et Support

Assurer la maintenance des applications existantes en réponse aux évolutions des besoins et aux retours des utilisateurs.
Mettre à jour la documentation technique


6.Veille Technologique

Se tenir informé des évolutions technologiques et des bonnespratiques de développement.
Proposer et intégrer de nouvelles technologies et méthodologies pour améliorer les performances des applications."""
# skills = extract_skills_from_job_description_with_gemini(test_description)
# match = match_skills_with_gemini("""Machine Learning,
#     Data Analytics,
#     Project Management,
#     Software Development,
#     Agile Methodology,
#     Business Growth""", test_description)
# print("🎯 Extracted Skills:", (skills))