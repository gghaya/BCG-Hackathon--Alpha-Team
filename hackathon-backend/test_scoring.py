"""
Test script for the scoring functionality.
Run this script to verify that the scoring works correctly.
"""

import os
import json
from dotenv import load_dotenv
from scoring import calculate_candidate_score

# Load environment variables
load_dotenv()

# Sample job data
job_data = {
    "job_title": "Data Scientist",
    "description": "We are looking for a talented data scientist with experience in machine learning and Python.",
    "requirements": "5+ years of experience in data science. Experience with TensorFlow and PyTorch. Strong statistical background.",
    "responsibilities": ["Build ML models", "Analyze large datasets", "Present findings to stakeholders"],
    "skills": ["Python", "TensorFlow", "PyTorch", "SQL", "Statistics", "Machine Learning"],
    "education": "Master's degree in Computer Science, Statistics, or related field",
    "skills_priority": "high",
    "requirements_priority": "medium",
    "education_priority": "medium"
}

# Sample candidate data
candidate_data = {
    "name": "John Doe",
    "contact": {
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "linkedin": "linkedin.com/in/johndoe",
        "location": "New York, NY"
    },
    "summary": "Data scientist with 4 years of experience in building ML models and analyzing data.",
    "experience": [
        {
            "job_title": "Data Scientist",
            "company": "Tech Company",
            "location": "New York, NY",
            "start_date": "2020-01",
            "end_date": "Present",
            "responsibilities": [
                "Developed machine learning models for customer segmentation",
                "Analyzed large datasets to extract business insights",
                "Presented findings to executives and stakeholders"
            ]
        },
        {
            "job_title": "Data Analyst",
            "company": "Analytics Inc.",
            "location": "Boston, MA",
            "start_date": "2018-06",
            "end_date": "2019-12",
            "responsibilities": [
                "Created SQL queries to extract data from databases",
                "Built dashboards for monitoring business metrics",
                "Performed statistical analysis to identify trends"
            ]
        }
    ],
    "education": [
        {
            "degree": "Master of Science in Data Science",
            "university": "University of Data",
            "year": "2018"
        },
        {
            "degree": "Bachelor of Science in Computer Science",
            "university": "Tech University",
            "year": "2016"
        }
    ],
    "skills": ["Python", "SQL", "Statistics", "Data Visualization", "Machine Learning", "Pandas", "NumPy"],
    "certifications": ["Certified Data Scientist", "AWS Certified Data Analytics"]
}

def main():
    """
    Test the scoring functionality
    """
    print("Testing candidate scoring...")
    
    # Get Google API key from environment
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    # Calculate score
    result = calculate_candidate_score(candidate_data, job_data, google_api_key)
    
    # Print result
    print("\nScoring Results:")
    print(f"Overall Score: {result['overall_score']:.2f}")
    print(f"Skills Score: {result['skills_score']}")
    print(f"Requirements Score: {result['requirements_score']}")
    print(f"Education Score: {result['education_score']}")
    
    print("\nMissing Skills:")
    for skill in result['missing_skills']:
        print(f"- {skill}")
    
    print("\nExtra Skills:")
    for skill in result['extra_skills']:
        print(f"- {skill}")
    
    # Save result to file
    with open("scoring_test_result.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print("\nResults saved to scoring_test_result.json")

if __name__ == "__main__":
    main()