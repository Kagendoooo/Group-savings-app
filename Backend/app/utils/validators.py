def validate_email(email):
    """
    Validate email format
    """
    import re
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    """
    # At least 8 characters, at least one letter and one number
    import re
    return len(password) >= 8 and re.search(r'[A-Za-z]', password) and re.search(r'[0-9]', password)
