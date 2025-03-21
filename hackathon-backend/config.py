import os

class Config:
    DEBUG = True
    SECRET_KEY = "your_secret_key"
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/resume_db")
