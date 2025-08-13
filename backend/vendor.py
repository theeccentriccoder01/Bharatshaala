from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import database
from .utils import success_response, error_response, vendor_required, validate_pagination, create_pagination_info, save_file

vendor_bp = Blueprint('vendor', __name__, url_prefix='/v1/vendor')

@vendor_bp.route('/products', methods=['GET'])
@vendor_required()
def get_vendor_products():
    try:
        user_id = get_jwt_identity()
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        search = request.args.get('search')
        
        products, total_count = database.get_vendor_products(user_id, page, per_page, status, search)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(products, "Vendor products retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve vendor products: {str(e)}", 500)

@vendor_bp.route('/products', methods=['POST'])
@vendor_required()
def add_vendor_product():
    try:
        user_id = get_jwt_identity()
        
        # Handle file upload if present
        product_images = []
        if 'images' in request.files:
            files = request.files.getlist('images')
            for file in files:
                if file.filename:
                    image_path = save_file(file, 'products')
                    if image_path:
                        product_images.append(image_path)
        
        # Get form data
        name = request.form.get('name', '').strip()
        description = request.form.get('description', '').strip()
        price = request.form.get('price', type=float)
        discounted_price = request.form.get('discounted_price', type=float)
        category_id = request.form.get('category_id', type=int)
        market_id = request.form.get('market_id', type=int)
        stock_quantity = request.form.get('stock_quantity', type=int)
        sku = request.form.get('sku', '').strip()
        
        # Validation
        if not all([name, description, price, category_id, stock_quantity]):
            return error_response("Name, description, price, category, and stock quantity are required", 400)
        
        if price <= 0:
            return error_response("Price must be greater than 0", 400)
        
        if stock_quantity < 0:
            return error_response("Stock quantity cannot be negative", 400)
        
        # Check if SKU is unique (if provided)
        if sku and database.check_sku_exists(sku):
            return error_response("SKU already exists", 400)
        
        product_data = {
            'name': name,
            'description': description,
            'price': price,
            'discounted_price': discounted_price,
            'category_id': category_id,
            'market_id': market_id,
            'vendor_id': user_id,
            'stock_quantity': stock_quantity,
            'sku': sku,
            'images': product_images,
            'status': 'active'
        }
        
        product_id = database.add_vendor_product(product_data)
        if product_id < 0:
            return error_response("Failed to add product", 500)
        
        return success_response({'product_id': product_id}, "Product added successfully")
        
    except Exception as e:
        return error_response(f"Failed to add product: {str(e)}", 500)

@vendor_bp.route('/products/<int:product_id>', methods=['PUT'])
@vendor_required()
def update_vendor_product(product_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify product belongs to vendor
        product = database.get_vendor_product_by_id(user_id, product_id)
        if not product:
            return error_response("Product not found", 404)
        
        # Handle file upload if present
        new_images = []
        if 'images' in request.files:
            files = request.files.getlist('images')
            for file in files:
                if file.filename:
                    image_path = save_file(file, 'products')
                    if image_path:
                        new_images.append(image_path)
        
        # Get form data
        name = request.form.get('name', product['name']).strip()
        description = request.form.get('description', product['description']).strip()
        price = request.form.get('price', product['price'], type=float)
        discounted_price = request.form.get('discounted_price', product.get('discounted_price'), type=float)
        category_id = request.form.get('category_id', product['category_id'], type=int)
        market_id = request.form.get('market_id', product.get('market_id'), type=int)
        stock_quantity = request.form.get('stock_quantity', product['stock_quantity'], type=int)
        sku = request.form.get('sku', product.get('sku', '')).strip()
        status = request.form.get('status', product['status'])
        
        # Validation
        if price <= 0:
            return error_response("Price must be greater than 0", 400)
        
        if stock_quantity < 0:
            return error_response("Stock quantity cannot be negative", 400)
        
        # Check if SKU is unique (if changed)
        if sku and sku != product.get('sku') and database.check_sku_exists(sku):
            return error_response("SKU already exists", 400)
        
        update_data = {
            'name': name,
            'description': description,
            'price': price,
            'discounted_price': discounted_price,
            'category_id': category_id,
            'market_id': market_id,
            'stock_quantity': stock_quantity,
            'sku': sku,
            'status': status
        }
        
        # Add new images if provided
        if new_images:
            existing_images = product.get('images', [])
            update_data['images'] = existing_images + new_images
        
        success = database.update_vendor_product(product_id, update_data)
        if not success:
            return error_response("Failed to update product", 500)
        
        return success_response(None, "Product updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update product: {str(e)}", 500)

@vendor_bp.route('/products/<int:product_id>', methods=['DELETE'])
@vendor_required()
def delete_vendor_product(product_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify product belongs to vendor
        product = database.get_vendor_product_by_id(user_id, product_id)
        if not product:
            return error_response("Product not found", 404)
        
        success = database.delete_vendor_product(product_id)
        if not success:
            return error_response("Failed to delete product", 500)
        
        return success_response(None, "Product deleted successfully")
        
    except Exception as e:
        return error_response(f"Failed to delete product: {str(e)}", 500)

@vendor_bp.route('/orders', methods=['GET'])
@vendor_required()
def get_vendor_orders():
    try:
        user_id = get_jwt_identity()
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        
        orders, total_count = database.get_vendor_orders(user_id, page, per_page, status)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(orders, "Vendor orders retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve vendor orders: {str(e)}", 500)

@vendor_bp.route('/orders/<int:order_id>/status', methods=['PATCH'])
@vendor_required()
def update_order_status(order_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        status = data.get('status')
        if not status:
            return error_response("Status is required", 400)
        
        allowed_statuses = ['confirmed', 'processing', 'shipped', 'delivered']
        if status not in allowed_statuses:
            return error_response(f"Invalid status. Allowed: {', '.join(allowed_statuses)}", 400)
        
        # Verify order belongs to vendor's products
        order = database.get_vendor_order_by_id(user_id, order_id)
        if not order:
            return error_response("Order not found", 404)
        
        # Add tracking number if status is shipped
        tracking_number = data.get('tracking_number') if status == 'shipped' else None
        
        success = database.update_order_status(order_id, status, tracking_number)
        if not success:
            return error_response("Failed to update order status", 500)
        
        return success_response(None, "Order status updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update order status: {str(e)}", 500)

@vendor_bp.route('/analytics', methods=['GET'])
@vendor_required()
def get_vendor_analytics():
    try:
        user_id = get_jwt_identity()
        
        # Get date range from query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        analytics_data = database.get_vendor_analytics(user_id, start_date, end_date)
        
        return success_response(analytics_data, "Vendor analytics retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve vendor analytics: {str(e)}", 500)