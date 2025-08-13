from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import database
from .utils import success_response, error_response, admin_required, validate_pagination, create_pagination_info

admin_bp = Blueprint('admin', __name__, url_prefix='/v1/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_admin_dashboard():
    try:
        # Get dashboard statistics
        stats = {
            'total_users': database.get_total_users_count(),
            'total_vendors': database.get_total_vendors_count(),
            'total_products': database.get_total_products_count(),
            'total_orders': database.get_total_orders_count(),
            'total_revenue': database.get_total_revenue(),
            'pending_vendor_approvals': database.get_pending_vendor_approvals_count(),
            'active_orders': database.get_active_orders_count(),
            'monthly_revenue': database.get_monthly_revenue(),
            'top_categories': database.get_top_categories(),
            'recent_orders': database.get_recent_orders(limit=10)
        }
        
        return success_response(stats, "Admin dashboard data retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve dashboard data: {str(e)}", 500)

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_all_users():
    try:
        page, per_page = validate_pagination()
        
        role = request.args.get('role')
        status = request.args.get('status')
        search = request.args.get('search')
        
        users, total_count = database.get_all_users(page, per_page, role, status, search)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(users, "Users retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve users: {str(e)}", 500)

@admin_bp.route('/users/<int:user_id>/status', methods=['PATCH'])
@admin_required()
def update_user_status(user_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['active', 'inactive', 'suspended']:
            return error_response("Invalid status", 400)
        
        success = database.update_user_status(user_id, status)
        if not success:
            return error_response("Failed to update user status", 500)
        
        return success_response(None, "User status updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update user status: {str(e)}", 500)

@admin_bp.route('/vendors', methods=['GET'])
@admin_required()
def get_all_vendors():
    try:
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        approval_status = request.args.get('approval_status')
        
        vendors, total_count = database.get_all_vendors(page, per_page, status, approval_status)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(vendors, "Vendors retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve vendors: {str(e)}", 500)

@admin_bp.route('/vendors/<int:vendor_id>/approve', methods=['POST'])
@admin_required()
def approve_vendor(vendor_id):
    try:
        data = request.get_json()
        approved = data.get('approved', True)
        remarks = data.get('remarks', '')
        
        success = database.update_vendor_approval_status(vendor_id, approved, remarks)
        if not success:
            return error_response("Failed to update vendor approval status", 500)
        
        action = "approved" if approved else "rejected"
        return success_response(None, f"Vendor {action} successfully")
        
    except Exception as e:
        return error_response(f"Failed to update vendor approval: {str(e)}", 500)

@admin_bp.route('/products', methods=['GET'])
@admin_required()
def get_all_products():
    try:
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        category_id = request.args.get('category_id', type=int)
        vendor_id = request.args.get('vendor_id', type=int)
        search = request.args.get('search')
        
        products, total_count = database.get_all_products_admin(
            page, per_page, status, category_id, vendor_id, search
        )
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, "Products retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve products: {str(e)}", 500)

@admin_bp.route('/products/<int:product_id>/status', methods=['PATCH'])
@admin_required()
def update_product_status(product_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['active', 'inactive', 'banned']:
            return error_response("Invalid status", 400)
        
        success = database.update_product_status(product_id, status)
        if not success:
            return error_response("Failed to update product status", 500)
        
        return success_response(None, "Product status updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update product status: {str(e)}", 500)

@admin_bp.route('/orders', methods=['GET'])
@admin_required()
def get_all_orders():
    try:
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        payment_status = request.args.get('payment_status')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        orders, total_count = database.get_all_orders_admin(
            page, per_page, status, payment_status, start_date, end_date
        )
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(orders, "Orders retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve orders: {str(e)}", 500)

@admin_bp.route('/categories', methods=['POST'])
@admin_required()
def create_category():
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        parent_id = data.get('parent_id')
        
        if not name:
            return error_response("Category name is required", 400)
        
        category_id = database.create_category(name, description, parent_id)
        if category_id < 0:
            return error_response("Failed to create category", 500)
        
        return success_response({'category_id': category_id}, "Category created successfully")
        
    except Exception as e:
        return error_response(f"Failed to create category: {str(e)}", 500)

@admin_bp.route('/categories/<int:category_id>', methods=['PUT'])
@admin_required()
def update_category(category_id):
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        is_active = data.get('is_active', True)
        
        if not name:
            return error_response("Category name is required", 400)
        
        success = database.update_category(category_id, name, description, is_active)
        if not success:
            return error_response("Failed to update category", 500)
        
        return success_response(None, "Category updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update category: {str(e)}", 500)

@admin_bp.route('/markets', methods=['POST'])
@admin_required()
def create_market():
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        location = data.get('location', '').strip()
        
        if not name:
            return error_response("Market name is required", 400)
        
        market_id = database.create_market(name, description, location)
        if market_id < 0:
            return error_response("Failed to create market", 500)
        
        return success_response({'market_id': market_id}, "Market created successfully")
        
    except Exception as e:
        return error_response(f"Failed to create market: {str(e)}", 500)

@admin_bp.route('/markets/<int:market_id>', methods=['PUT'])
@admin_required()
def update_market(market_id):
    try:
        data = request.get_json()
        
        name = data.get('name', '').strip()
        description = data.get('description', '').strip()
        location = data.get('location', '').strip()
        is_active = data.get('is_active', True)
        
        if not name:
            return error_response("Market name is required", 400)
        
        success = database.update_market(market_id, name, description, location, is_active)
        if not success:
            return error_response("Failed to update market", 500)
        
        return success_response(None, "Market updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update market: {str(e)}", 500)

@admin_bp.route('/analytics', methods=['GET'])
@admin_required()
def get_admin_analytics():
    try:
        period = request.args.get('period', 'month')  # day, week, month, year
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        analytics_data = database.get_admin_analytics(period, start_date, end_date)
        
        return success_response(analytics_data, "Admin analytics retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve admin analytics: {str(e)}", 500)

@admin_bp.route('/system/settings', methods=['GET'])
@admin_required()
def get_system_settings():
    try:
        settings = database.get_system_settings()
        return success_response(settings, "System settings retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve system settings: {str(e)}", 500)

@admin_bp.route('/system/settings', methods=['PUT'])
@admin_required()
def update_system_settings():
    try:
        data = request.get_json()
        
        success = database.update_system_settings(data)
        if not success:
            return error_response("Failed to update system settings", 500)
        
        return success_response(None, "System settings updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update system settings: {str(e)}", 500)