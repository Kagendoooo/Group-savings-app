from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.transaction_service import (
    create_contribution, request_withdrawal, 
    update_withdrawal_status, get_transaction_by_id
)
from app.utils.response import success_response, error_response

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('group_id', 'amount')):
        return error_response('Missing required fields', 400)
    
    try:
        transaction = create_contribution(current_user_id, data['group_id'], data['amount'], data.get('description', ''))
        return success_response(transaction.to_dict(), 201)
    except ValueError as e:
        return error_response(str(e), 400)

@transactions_bp.route('/withdrawals', methods=['POST'])
@jwt_required()
def create_withdrawal_request():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('group_id', 'amount')):
        return error_response('Missing required fields', 400)
    
    try:
        transaction = request_withdrawal(current_user_id, data['group_id'], data['amount'], data.get('description', ''))
        return success_response(transaction.to_dict(), 201)
    except ValueError as e:
        return error_response(str(e), 400)

@transactions_bp.route('/withdrawals/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_withdrawal(transaction_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if 'status' not in data:
        return error_response('Status is required', 400)
    
    try:
        transaction = update_withdrawal_status(transaction_id, current_user_id, data['status'])
        return success_response(transaction.to_dict())
    except ValueError as e:
        return error_response(str(e), 400)
