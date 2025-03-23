from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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
    skills_score = db.Column(db.Integer, nullable=True, default=0)

class job_offers(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)