from functools import wraps
from flask import jsonify, request, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
import os
import uuid
from werkzeug.utils import secure_filename
from PIL import Image

def success_response(data=None, message="Success", pagination=None):
    """Standard success response format"""
    response = {
        "success": True,
        "data": data,
        "message": message
    }
    if pagination:
        response["pagination"] = pagination
    return jsonify(response)

def error_response(message="Error occurred", status_code=400, error_code=None):
    """Standard error response format"""
    response = {
        "success": False,
        "error": message,
        "data": None
    }
    if error_code:
        response["error_code"] = error_code
    return jsonify(response), status_code

def jwt_required_custom():
    """Custom JWT required decorator"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                return f(*args, **kwargs)
            except Exception as e:
                return error_response("Unauthorized", 401)
        return decorated_function
    return decorator

def admin_required():
    """Decorator to require admin role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                # Check if user is admin in database
                from . import database
                user = database.get_user_details(user_id)
                if not user or user[1] != 'admin':
                    return error_response("Admin access required", 403)
                return f(*args, **kwargs)
            except Exception as e:
                return error_response("Unauthorized", 401)
        return decorated_function
    return decorator

def vendor_required():
    """Decorator to require vendor role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                from . import database
                user = database.get_user_details(user_id)
                if not user or user[1] not in ['vendor', 'admin']:
                    return error_response("Vendor access required", 403)
                return f(*args, **kwargs)
            except Exception as e:
                return error_response("Unauthorized", 401)
        return decorated_function
    return decorator

def validate_pagination():
    """Get and validate pagination parameters"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', current_app.config['DEFAULT_PAGE_SIZE'], type=int)
    
    if page < 1:
        page = 1
    if per_page > current_app.config['MAX_PAGE_SIZE']:
        per_page = current_app.config['MAX_PAGE_SIZE']
    
    return page, per_page

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

def save_file(file, folder='products'):
    """Save uploaded file with unique name"""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        
        upload_path = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # Optimize image if it's an image file
        try:
            with Image.open(file_path) as img:
                img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                img.save(file_path, optimize=True, quality=85)
        except Exception:
            pass  # Not an image or optimization failed
        
        return f"{folder}/{unique_filename}"
    return None

def create_pagination_info(page, per_page, total_items):
    """Create pagination information"""
    total_pages = (total_items + per_page - 1) // per_page
    
    return {
        "current_page": page,
        "per_page": per_page,
        "total_items": total_items,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1
    }