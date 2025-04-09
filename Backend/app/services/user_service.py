from app.models.user import User
from app.extensions import db
from werkzeug.security import generate_password_hash

def get_user_by_id(user_id):
    """
    Get a user by their ID
    """
    return User.query.get(user_id)

def update_user(user_id, data):
    """
    Update a user's information
    """
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    
    # Update fields if they are provided
    if 'username' in data:
        # Check if username is taken by another user
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user_id:
            raise ValueError("Username already exists")
        user.username = data['username']
    
    if 'email' in data:
        # Check if email is taken by another user
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            raise ValueError("Email already exists")
        user.email = data['email']
    
    if 'password' in data:
        user.set_password(data['password'])
    
    db.session.commit()
    return user
