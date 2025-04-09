from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.membership import Membership

def admin_required(fn):
    """
    Decorator to check if a user is an admin of a group
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        group_id = kwargs.get('group_id')
        
        # Check if user is an admin of the group
        membership = Membership.query.filter_by(
            user_id=current_user_id,
            group_id=group_id,
            is_admin=True
        ).first()
        
        if not membership:
            return jsonify({
                'status': 'error',
                'message': 'Admin privileges required'
            }), 403
        
        return fn(*args, **kwargs)
    return wrapper
