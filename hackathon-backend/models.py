from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class candidates(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    job_offer_id = db.Column(db.Integer, nullable=False)
    experience = db.Column(db.String(100), nullable=False)
    resume_path = db.Column(db.String(100), nullable=False)

class job_offers(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)