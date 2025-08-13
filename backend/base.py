from flask import Flask, request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS
import os

# Import configuration and utilities
from .config import Config
from .utils import success_response, error_response

# Import blueprints
from .auth import auth_bp
from .products import products_bp
from .cart import cart_bp
from .orders import orders_bp
from .vendor import vendor_bp
from .admin import admin_bp

# Import database
from . import database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Create upload folders
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'products'), exist_ok=True)
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(vendor_bp)
    app.register_blueprint(admin_bp)
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return error_response("Token has expired", 401)
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return error_response("Invalid token", 401)
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return error_response("Authorization token is required", 401)
    
    # User management endpoints
    @app.route('/v1/user/profile', methods=['GET'])
    @jwt_required()
    def get_user_profile():
        try:
            user_id = get_jwt_identity()
            user = database.get_user_details(user_id)
            
            if not user:
                return error_response("User not found", 404)
            
            user_data = {
                'id': user[0],
                'email': user[2],
                'name': user[3],
                'role': user[1],
                'phone': user[5],
                'shop_id': user[4],
                'is_verified': user[6],
                'is_active': user[7],
                'created_at': user[8]
            }
            
            return success_response(user_data, "Profile retrieved successfully")
            
        except Exception as e:
            return error_response(f"Failed to retrieve profile: {str(e)}", 500)
    
    @app.route('/v1/user/profile', methods=['PUT'])
    @jwt_required()
    def update_user_profile():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            name = data.get('name', '').strip()
            phone = data.get('phone', '').strip()
            
            if not name:
                return error_response("Name is required", 400)
            
            success = database.update_user_profile(user_id, name, phone)
            if not success:
                return error_response("Failed to update profile", 500)
            
            return success_response(None, "Profile updated successfully")
            
        except Exception as e:
            return error_response(f"Failed to update profile: {str(e)}", 500)
    
    @app.route('/v1/user/change-password', methods=['POST'])
    @jwt_required()
    def change_password():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            current_password = data.get('current_password', '')
            new_password = data.get('new_password', '')
            
            if not current_password or not new_password:
                return error_response("Current and new passwords are required", 400)
            
            # Verify current password
            if not database.check_password(user_id, current_password):
                return error_response("Current password is incorrect", 400)
            
            # Validate new password
            if len(new_password) < 6:
                return error_response("New password must be at least 6 characters long", 400)
            
            success = database.update_password(user_id, new_password)
            if not success:
                return error_response("Failed to change password", 500)
            
            return success_response(None, "Password changed successfully")
            
        except Exception as e:
            return error_response(f"Failed to change password: {str(e)}", 500)
    
    # Address management endpoints
    @app.route('/v1/user/addresses', methods=['GET'])
    @jwt_required()
    def get_user_addresses():
        try:
            user_id = get_jwt_identity()
            addresses = database.get_user_addresses(user_id)
            
            return success_response(addresses, "Addresses retrieved successfully")
            
        except Exception as e:
            return error_response(f"Failed to retrieve addresses: {str(e)}", 500)
    
    @app.route('/v1/user/addresses', methods=['POST'])
    @jwt_required()
    def add_user_address():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            required_fields = ['name', 'phone', 'address_line_1', 'city', 'state', 'pincode']
            for field in required_fields:
                if not data.get(field, '').strip():
                    return error_response(f"{field.replace('_', ' ').title()} is required", 400)
            
            address_data = {
                'user_id': user_id,
                'name': data['name'].strip(),
                'phone': data['phone'].strip(),
                'address_line_1': data['address_line_1'].strip(),
                'address_line_2': data.get('address_line_2', '').strip(),
                'city': data['city'].strip(),
                'state': data['state'].strip(),
                'pincode': data['pincode'].strip(),
                'country': data.get('country', 'India').strip(),
                'is_default': data.get('is_default', False)
            }
            
            address_id = database.add_user_address(address_data)
            if address_id < 0:
                return error_response("Failed to add address", 500)
            
            return success_response({'address_id': address_id}, "Address added successfully")
            
        except Exception as e:
            return error_response(f"Failed to add address: {str(e)}", 500)
    
    @app.route('/v1/user/addresses/<int:address_id>', methods=['PUT'])
    @jwt_required()
    def update_user_address(address_id):
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            # Verify address belongs to user
            address = database.get_user_address(user_id, address_id)
            if not address:
                return error_response("Address not found", 404)
            
            required_fields = ['name', 'phone', 'address_line_1', 'city', 'state', 'pincode']
            for field in required_fields:
                if not data.get(field, '').strip():
                    return error_response(f"{field.replace('_', ' ').title()} is required", 400)
            
            address_data = {
                'name': data['name'].strip(),
                'phone': data['phone'].strip(),
                'address_line_1': data['address_line_1'].strip(),
                'address_line_2': data.get('address_line_2', '').strip(),
                'city': data['city'].strip(),
                'state': data['state'].strip(),
                'pincode': data['pincode'].strip(),
                'country': data.get('country', 'India').strip(),
                'is_default': data.get('is_default', False)
            }
            
            success = database.update_user_address(address_id, address_data)
            if not success:
                return error_response("Failed to update address", 500)
            
            return success_response(None, "Address updated successfully")
            
        except Exception as e:
            return error_response(f"Failed to update address: {str(e)}", 500)
    
    @app.route('/v1/user/addresses/<int:address_id>', methods=['DELETE'])
    @jwt_required()
    def delete_user_address(address_id):
        try:
            user_id = get_jwt_identity()
            
            # Verify address belongs to user
            address = database.get_user_address(user_id, address_id)
            if not address:
                return error_response("Address not found", 404)
            
            success = database.delete_user_address(address_id)
            if not success:
                return error_response("Failed to delete address", 500)
            
            return success_response(None, "Address deleted successfully")
            
        except Exception as e:
            return error_response(f"Failed to delete address: {str(e)}", 500)
    
    # Support and notification endpoints
    @app.route('/v1/support/tickets', methods=['POST'])
    @jwt_required()
    def create_support_ticket():
        try:
            user_id = get_jwt_identity()
            data = request.get_json()
            
            subject = data.get('subject', '').strip()
            message = data.get('message', '').strip()
            priority = data.get('priority', 'medium')
            
            if not subject or not message:
                return error_response("Subject and message are required", 400)
            
            ticket_id = database.create_support_ticket(user_id, subject, message, priority)
            if ticket_id < 0:
                return error_response("Failed to create support ticket", 500)
            
            return success_response({'ticket_id': ticket_id}, "Support ticket created successfully")
            
        except Exception as e:
            return error_response(f"Failed to create support ticket: {str(e)}", 500)
    
    @app.route('/v1/notifications', methods=['GET'])
    @jwt_required()
    def get_notifications():
        try:
            user_id = get_jwt_identity()
            page, per_page = validate_pagination()
            
            notifications, total_count = database.get_user_notifications(user_id, page, per_page)
            pagination = create_pagination_info(page, per_page, total_count)
            
            return success_response(notifications, "Notifications retrieved successfully", pagination)
            
        except Exception as e:
            return error_response(f"Failed to retrieve notifications: {str(e)}", 500)
    
    # Blog endpoints
    @app.route('/v1/blog/posts', methods=['GET'])
    def get_blog_posts():
        try:
            page, per_page = validate_pagination()
            
            posts, total_count = database.get_blog_posts(page, per_page)
            pagination = create_pagination_info(page, per_page, total_count)
            
            return success_response(posts, "Blog posts retrieved successfully", pagination)
            
        except Exception as e:
            return error_response(f"Failed to retrieve blog posts: {str(e)}", 500)
    
    @app.route('/v1/blog/posts/<int:post_id>', methods=['GET'])
    def get_blog_post(post_id):
        try:
            post = database.get_blog_post_by_id(post_id)
            if not post:
                return error_response("Blog post not found", 404)
            
            return success_response(post, "Blog post retrieved successfully")
            
        except Exception as e:
            return error_response(f"Failed to retrieve blog post: {str(e)}", 500)
    
    # Health check endpoint
    @app.route('/v1/health', methods=['GET'])
    def health_check():
        return success_response({'status': 'healthy'}, "Service is running")
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)