import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Get database URL from environment variable (useful for Docker)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@db:5432/resume_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

@app.route('/')
def home():
    return "Flask App with PostgreSQL"

if __name__ == '__main__':
    # Wrap database creation inside an application context
    with app.app_context():
        db.create_all()  # Creates the database tables

    app.run(host='0.0.0.0', port=5000, debug=True)
