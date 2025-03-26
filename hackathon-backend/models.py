# models.py - Add User model
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    is_recruiter = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    closing_date = db.Column(db.Date, nullable=True)
    number_of_positions = db.Column(db.Integer, default=1)
    publish_date = db.Column(db.Date, nullable=True)
    reference_number = db.Column(db.String(20), nullable=True)