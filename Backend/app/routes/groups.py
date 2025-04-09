from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.group_service import (
    create_group, get_user_groups, get_group_by_id, 
    update_group, delete_group, join_group, leave_group
)
from app.utils.response import success_response, error_response

groups_bp = Blueprint('groups', __name__)

@groups_bp.route('', methods=['GET'])
@jwt_required()
def get_groups():
    current_user_id = get_jwt_identity()
    groups = get_user_groups(current_user_id)
    return success_response([group.to_dict() for group in groups])

@groups_bp.route('', methods=['POST'])
@jwt_required()
def create_new_group():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if 'name' not in data:
        return error_response('Group name is required', 400)
    
    try:
        group = create_group(current_user_id, data)
        return success_response(group.to_dict(), 201)
    except ValueError as e:
        return error_response(str(e), 400)

@groups_bp.route('/<int:group_id>', methods=['GET'])
@jwt_required()
def get_group(group_id):
    current_user_id = get_jwt_identity()
    group = get_group_by_id(group_id, current_user_id)
    
    if not group:
        return error_response('Group not found or you do not have permission', 404)
    
    return success_response(group.to_dict())

@groups_bp.route('/<int:group_id>', methods=['PUT'])
@jwt_required()
def update_existing_group(group_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        group = update_group(group_id, current_user_id, data)
        return success_response(group.to_dict())
    except ValueError as e:
        return error_response(str(e), 400)

@groups_bp.route('/<int:group_id>', methods=['DELETE'])
@jwt_required()
def delete_existing_group(group_id):
    current_user_id = get_jwt_identity()
    
    try:
        delete_group(group_id, current_user_id)
        return success_response({'message': 'Group deleted successfully'})
    except ValueError as e:
        return error_response(str(e), 400)

@groups_bp.route('/<int:group_id>/join', methods=['POST'])
@jwt_required()
def join_existing_group(group_id):
    current_user_id = get_jwt_identity()
    
    try:
        membership = join_group(group_id, current_user_id)
        return success_response({
            'message': 'Successfully joined the group',
            'membership': membership.to_dict()
        })
    except ValueError as e:
        return error_response(str(e), 400)

@groups_bp.route('/<int:group_id>/leave', methods=['POST'])
@jwt_required()
def leave_existing_group(group_id):
    current_user_id = get_jwt_identity()
    
    try:
        leave_group(group_id, current_user_id)
        return success_response({'message': 'Successfully left the group'})
    except ValueError as e:
        return error_response(str(e), 400)

@groups_bp.route('/<int:group_id>/transactions', methods=['GET'])
@jwt_required()
def get_group_transactions(group_id):
    from app.services.transaction_service import get_transactions_by_group
    
    current_user_id = get_jwt_identity()
    
    try:
        transactions = get_transactions_by_group(group_id, current_user_id)
        return success_response([t.to_dict() for t in transactions])
    except ValueError as e:
        return error_response(str(e), 400)
