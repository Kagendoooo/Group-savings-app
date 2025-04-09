from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.user_service import get_user_by_id, update_user
from app.utils.response import success_response, error_response

users_bp = Blueprint('users', __name__)

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = get_user_by_id(current_user_id)
    if not user:
        return error_response('User not found', 404)
    return success_response(user.to_dict())

@users_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_current_user():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        updated_user = update_user(current_user_id, data)
        return success_response(updated_user.to_dict())
    except ValueError as e:
        return error_response(str(e), 400)
