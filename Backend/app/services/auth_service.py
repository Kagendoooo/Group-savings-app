from app.models.user import User
from app.extensions import db

def register_user(username, email, password):
    """
    Register a new user in the system
    """
    # Check if username already exists
    if User.query.filter_by(username=username).first():
        raise ValueError("Username already exists")
    
    # Check if email already exists
    if User.query.filter_by(email=email).first():
        raise ValueError("Email already exists")
    
    # Create new user
    user = User(username=username, email=email, password=password)
    
    db.session.add(user)
    db.session.commit()
    
    return user

def authenticate_user(email, password):
    """
    Authenticate a user by email and password
    """
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        raise ValueError("Invalid email or password")
    
    return user
