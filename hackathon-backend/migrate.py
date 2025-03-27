from app import app
import os

print("Starting database migration...")

# Make sure SQLAlchemy has correct DB connection
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://user:password@db:5432/resume_db')

# Initialize DB with app
from models import db
db.init_app(app)

# Create all tables within app context
with app.app_context():
    print("Creating database tables...")
    db.create_all()
    print("Database tables created successfully!")