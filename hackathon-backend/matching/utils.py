import re
def clean_text(text):
    """ Nettoyage basique du texte """
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_years(text):
    """Extract numeric years of experience from a string using regex."""
    if not isinstance(text, str):
        return 0
    matches = re.findall(r'(\d+(?:\.\d+)?)', text)
    if not matches:
        return 0
    # Return the largest number found (e.g., '5 to 7 years' → 7)
    return max(float(m) for m in matches)

def normalizer (embedding_weight ,skills_weight,experience_weight, degree_weight):
    total_weight = embedding_weight + skills_weight + experience_weight + degree_weight
    if total_weight == 0:
        print("All weights are zero. Using equal weights.")
        return {k: 0.25 for k in ["embedding", "skills", "experience", "degree"]}
    return {
        "embedding": embedding_weight / total_weight,
        "skills": skills_weight / total_weight,
        "experience": experience_weight / total_weight,
        "degree": degree_weight / total_weight,
    }