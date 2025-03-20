from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# PostgreSQL Configuration (replace with your database details)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://postgres:password@db:5432/resume_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define a sample model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.name}>'

# Route to test database connection
@app.route('/')
def index():
    return "Flask app connected to PostgreSQL!"

if __name__ == '__main__':
    app.run(debug=True)
