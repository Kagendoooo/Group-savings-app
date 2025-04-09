from flask import jsonify

def success_response(data, status_code=200):
    """
    Create a standardized success response
    """
    response = {
        'status': 'success',
        'data': data
    }
    return jsonify(response), status_code

def error_response(message, status_code=400):
    """
    Create a standardized error response
    """
    response = {
        'status': 'error',
        'message': message
    }
    return jsonify(response), status_code
