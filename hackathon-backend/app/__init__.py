from flask import Flask
from flask_cors import CORS

app = Flask(__name__)  # Initialisation de Flask
CORS(app)  # Activer les requêtes cross-origin pour React

from app import routes  # Importer les routes
