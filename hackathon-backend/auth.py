# auth.py
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from models import User, db

# Secret key for JWT
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-fallback-secret-key')
JWT_EXPIRATION_HOURS = 24

def generate_token(user_id, is_recruiter):
    """Generate a new JWT token for a user"""
    payload = {
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow(),
        'sub': user_id,
        'is_recruiter': is_recruiter
    }
    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm='HS256'
    )

def decode_token(token):
    """Decode and validate a JWT token"""
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return {'error': 'Token expired. Please log in again.'}
    except jwt.InvalidTokenError:
        return {'error': 'Invalid token. Please log in again.'}

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # Decode and validate token
        payload = decode_token(token)
        if 'error' in payload:
            return jsonify({'message': payload['error']}), 401
        
        # Add user information to the request context
        user = User.query.get(payload['sub'])
        if not user:
            return jsonify({'message': 'User not found!'}), 401
        
        # Store user data for the route to use
        request.current_user = user
        request.is_recruiter = payload.get('is_recruiter', False)
        
        return f(*args, **kwargs)
    
    return decorated

def recruiter_required(f):
    """Decorator to ensure user is a recruiter"""
    @wraps(f)
    def decorated(*args, **kwargs):
        # Check if token_required already ran
        if not hasattr(request, 'is_recruiter'):
            return jsonify({'message': 'Authentication required!'}), 401
        
        # Check if user is a recruiter
        if not request.is_recruiter:
            return jsonify({'message': 'Recruiter access required!'}), 403
        
        return f(*args, **kwargs)
    
    return decorated