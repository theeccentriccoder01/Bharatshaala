from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import database
from .utils import success_response, error_response

cart_bp = Blueprint('cart', __name__, url_prefix='/v1')

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = get_jwt_identity()
        cart_items = database.select_user_cart(user_id)
        
        # Calculate total amount
        total_amount = 0
        for item in cart_items:
            total_amount += item['quantity'] * item['price']
        
        cart_data = {
            'items': cart_items,
            'total_amount': total_amount,
            'item_count': len(cart_items)
        }
        
        return success_response(cart_data, "Cart retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve cart: {str(e)}", 500)

@cart_bp.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('productId')
        quantity = data.get('quantity', 1)
        
        if not product_id:
            return error_response("Product ID is required", 400)
        
        if quantity <= 0:
            return error_response("Quantity must be greater than 0", 400)
        
        # Check if product exists and is available
        product = database.get_product_by_id(product_id)
        if not product:
            return error_response("Product not found", 404)
        
        if product['status'] != 'active':
            return error_response("Product is not available", 400)
        
        if product['stock_quantity'] < quantity:
            return error_response("Insufficient stock", 400)
        
        # Check if item already exists in cart
        existing_item = database.get_cart_item(user_id, product_id)
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item['quantity'] + quantity
            if product['stock_quantity'] < new_quantity:
                return error_response("Insufficient stock for total quantity", 400)
            
            success = database.update_cart_item_quantity(existing_item['id'], new_quantity)
        else:
            # Add new item to cart
            success = database.add_to_cart(user_id, product_id, quantity, product['price'])
        
        if not success:
            return error_response("Failed to add item to cart", 500)
        
        return success_response(None, "Item added to cart successfully")
        
    except Exception as e:
        return error_response(f"Failed to add to cart: {str(e)}", 500)

@cart_bp.route('/cart/items/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        quantity = data.get('quantity')
        if not quantity or quantity <= 0:
            return error_response("Valid quantity is required", 400)
        
        # Check if cart item belongs to user
        cart_item = database.get_cart_item_by_id(item_id)
        if not cart_item or cart_item['user_id'] != int(user_id):
            return error_response("Cart item not found", 404)
        
        # Check stock availability
        product = database.get_product_by_id(cart_item['product_id'])
        if product['stock_quantity'] < quantity:
            return error_response("Insufficient stock", 400)
        
        success = database.update_cart_item_quantity(item_id, quantity)
        if not success:
            return error_response("Failed to update cart item", 500)
        
        return success_response(None, "Cart item updated successfully")
        
    except Exception as e:
        return error_response(f"Failed to update cart item: {str(e)}", 500)

@cart_bp.route('/cart/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if cart item belongs to user
        cart_item = database.get_cart_item_by_id(item_id)
        if not cart_item or cart_item['user_id'] != int(user_id):
            return error_response("Cart item not found", 404)
        
        success = database.remove_from_cart(item_id)
        if not success:
            return error_response("Failed to remove item from cart", 500)
        
        return success_response(None, "Item removed from cart successfully")
        
    except Exception as e:
        return error_response(f"Failed to remove from cart: {str(e)}", 500)

@cart_bp.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    try:
        user_id = get_jwt_identity()
        
        success = database.clear_user_cart(user_id)
        if not success:
            return error_response("Failed to clear cart", 500)
        
        return success_response(None, "Cart cleared successfully")
        
    except Exception as e:
        return error_response(f"Failed to clear cart: {str(e)}", 500)

# Wishlist endpoints
@cart_bp.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    try:
        user_id = get_jwt_identity()
        wishlist_items = database.get_user_wishlist(user_id)
        
        return success_response(wishlist_items, "Wishlist retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve wishlist: {str(e)}", 500)

@cart_bp.route('/wishlist/add', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        product_id = data.get('productId')
        if not product_id:
            return error_response("Product ID is required", 400)
        
        # Check if product exists
        product = database.get_product_by_id(product_id)
        if not product:
            return error_response("Product not found", 404)
        
        # Check if already in wishlist
        if database.is_in_wishlist(user_id, product_id):
            return error_response("Product already in wishlist", 400)
        
        success = database.add_to_wishlist(user_id, product_id)
        if not success:
            return error_response("Failed to add to wishlist", 500)
        
        return success_response(None, "Product added to wishlist successfully")
        
    except Exception as e:
        return error_response(f"Failed to add to wishlist: {str(e)}", 500)

@cart_bp.route('/wishlist/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    try:
        user_id = get_jwt_identity()
        
        success = database.remove_from_wishlist(user_id, product_id)
        if not success:
            return error_response("Failed to remove from wishlist", 500)
        
        return success_response(None, "Product removed from wishlist successfully")
        
    except Exception as e:
        return error_response(f"Failed to remove from wishlist: {str(e)}", 500)