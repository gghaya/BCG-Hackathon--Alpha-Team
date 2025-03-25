import enum
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PriorityLevel(enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"

class candidates(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(120), nullable=True)
    job_offer_id = db.Column(db.Integer, db.ForeignKey('job_offers.id'), nullable=True)
    experience = db.Column(db.String(100), nullable=True)
    resume_path = db.Column(db.String(100), nullable=True)
    resume_data = db.Column(db.JSON, nullable=True)
    missing_skills = db.Column(db.JSON, nullable=True)
    extra_skills = db.Column(db.JSON, nullable=True)
    match_score = db.Column(db.Float, nullable=True)
    skills_score = db.Column(db.Integer, nullable=True, default=0)

class job_offers(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    requirements = db.Column(db.String, nullable=True)
    responsibilities = db.Column(db.JSONB, nullable=True)
    skills = db.Column(db.JSONB, nullable=True)
    education = db.Column(db.String, nullable=True)
    skillspriority = db.Column(db.Enum(PriorityLevel), nullable=True)
    requirementspriority = db.Column(db.Enum(PriorityLevel), nullable=True)
    educationpriority = db.Column(db.Enum(PriorityLevel), nullable=True)
    
