from flask import Blueprint, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
import re
from . import database
from .utils import success_response, error_response

auth_bp = Blueprint('auth', __name__, url_prefix='/v1/auth')

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long"
    return True, "Valid password"

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return error_response("Email and password are required", 400)
        
        if not validate_email(email):
            return error_response("Invalid email format", 400)
        
        # Check if user exists
        user_id = database.check_email(email)
        if user_id < 0:
            return error_response("Invalid email or password", 401)
        
        # Verify password
        if not database.check_password(user_id, password):
            return error_response("Invalid email or password", 401)
        
        # Get user details
        user = database.get_user_details(user_id)
        if not user:
            return error_response("User not found", 404)
        
        # Check if user is active
        if not user[7]:  # is_active field
            return error_response("Account is deactivated", 401)
        
        # Create JWT tokens
        access_token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        
        user_data = {
            'id': user[0],
            'email': user[2],
            'name': user[3],
            'role': user[1],
            'phone': user[5],
            'is_verified': user[6]
        }
        
        return success_response({
            'user': user_data,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, "Login successful")
        
    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        account_type = data.get('accountType', 'customer').lower()
        invitation_code = data.get('invitationCode', '').strip()
        
        # Validation
        if not email or not password or not name:
            return error_response("Email, password, and name are required", 400)
        
        if not validate_email(email):
            return error_response("Invalid email format", 400)
        
        is_valid, msg = validate_password(password)
        if not is_valid:
            return error_response(msg, 400)
        
        # Check if email already exists
        if database.check_email(email) >= 0:
            return error_response("Email already registered", 400)
        
        # Validate invitation code for vendors
        shop_id = None
        if account_type == 'vendor':
            if not invitation_code:
                return error_response("Invitation code required for vendor registration", 400)
            shop_id = database.check_invitation_code(invitation_code)
            if shop_id < 0:
                return error_response("Invalid invitation code", 400)
        
        # Create user
        user_id = database.add_customer_details(email, name, password, account_type, invitation_code, phone)
        if user_id < 0:
            return error_response("Registration failed", 500)
        
        # Create JWT tokens
        access_token = create_access_token(identity=str(user_id))
        refresh_token = create_refresh_token(identity=str(user_id))
        
        user_data = {
            'id': user_id,
            'email': email,
            'name': name,
            'role': account_type,
            'phone': phone,
            'shop_id': shop_id
        }
        
        return success_response({
            'user': user_data,
            'access_token': access_token,
            'refresh_token': refresh_token
        }, "Registration successful")
        
    except Exception as e:
        return error_response(f"Registration failed: {str(e)}", 500)

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        
        return success_response({
            'access_token': new_access_token
        }, "Token refreshed successfully")
        
    except Exception as e:
        return error_response(f"Token refresh failed: {str(e)}", 500)

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a real implementation, you'd add the token to a blacklist
    return success_response(None, "Logged out successfully")

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email or not validate_email(email):
            return error_response("Valid email is required", 400)
        
        # Check if user exists
        user_id = database.check_email(email)
        if user_id < 0:
            return error_response("Email not found", 404)
        
        # Generate reset token (implement this in database.py)
        reset_token = database.generate_password_reset_token(user_id)
        
        # Send email (implement email service)
        # send_password_reset_email(email, reset_token)
        
        return success_response(None, "Password reset link sent to your email")
        
    except Exception as e:
        return error_response(f"Password reset failed: {str(e)}", 500)

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get('token', '')
        password = data.get('password', '')
        
        if not token or not password:
            return error_response("Token and password are required", 400)
        
        is_valid, msg = validate_password(password)
        if not is_valid:
            return error_response(msg, 400)
        
        # Verify and use reset token
        user_id = database.verify_password_reset_token(token)
        if user_id < 0:
            return error_response("Invalid or expired reset token", 400)
        
        # Update password
        success = database.update_password(user_id, password)
        if not success:
            return error_response("Password update failed", 500)
        
        return success_response(None, "Password reset successful")
        
    except Exception as e:
        return error_response(f"Password reset failed: {str(e)}", 500)