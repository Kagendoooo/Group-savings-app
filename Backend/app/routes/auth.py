from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.auth_service import register_user, authenticate_user
from app.utils.response import success_response, error_response

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('username', 'email', 'password')):
        return error_response('Missing required fields', 400)
    
    # Register user
    try:
        user = register_user(data['username'], data['email'], data['password'])
        access_token = create_access_token(identity=user.id)
        return success_response({
            'token': access_token,
            'user': user.to_dict()
        })
    except ValueError as e:
        return error_response(str(e), 400)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('email', 'password')):
        return error_response('Missing email or password', 400)
    
    # Authenticate user
    try:
        user = authenticate_user(data['email'], data['password'])
        access_token = create_access_token(identity=user.id)
        return success_response({
            'token': access_token,
            'user': user.to_dict()
        })
    except ValueError as e:
        return error_response(str(e), 401)

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # We don't need to do anything on the server side for JWT logout
    # Client should remove the token from storage
    return success_response({'message': 'Successfully logged out'})
