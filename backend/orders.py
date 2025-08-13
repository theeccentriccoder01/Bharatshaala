from flask import Blueprint, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import razorpay
from . import database
from .utils import success_response, error_response, validate_pagination, create_pagination_info

orders_bp = Blueprint('orders', __name__, url_prefix='/v1')

# Initialize Razorpay client
def get_razorpay_client():
    return razorpay.Client(auth=(
        current_app.config['RAZORPAY_KEY_ID'], 
        current_app.config['RAZORPAY_KEY_SECRET']
    ))

@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()
        page, per_page = validate_pagination()
        
        status = request.args.get('status')
        
        orders, total_count = database.get_user_orders(user_id, page, per_page, status)
        pagination = create_pagination_info(page, per_page, total_count)
        
        return success_response(orders, "Orders retrieved successfully", pagination)
        
    except Exception as e:
        return error_response(f"Failed to retrieve orders: {str(e)}", 500)

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    try:
        user_id = get_jwt_identity()
        
        order = database.get_order_by_id(order_id)
        if not order or order['user_id'] != int(user_id):
            return error_response("Order not found", 404)
        
        # Get order items
        order_items = database.get_order_items(order_id)
        order['items'] = order_items
        
        return success_response(order, "Order retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve order: {str(e)}", 500)

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        shipping_address_id = data.get('shipping_address_id')
        payment_method = data.get('payment_method', 'razorpay')
        
        if not shipping_address_id:
            return error_response("Shipping address is required", 400)
        
        # Verify address belongs to user
        address = database.get_user_address(user_id, shipping_address_id)
        if not address:
            return error_response("Invalid shipping address", 400)
        
        # Get cart items
        cart_items = database.select_user_cart(user_id)
        if not cart_items:
            return error_response("Cart is empty", 400)
        
        # Calculate total amount
        total_amount = 0
        for item in cart_items:
            total_amount += item['quantity'] * item['price']
        
        shipping_cost = current_app.config.get('SHIPPING_COST', 100)
        final_amount = total_amount + shipping_cost
        
        # Create Razorpay order
        client = get_razorpay_client()
        receipt_id = f"order_{user_id}_{database.get_next_receipt_number()}"
        
        razorpay_order = client.order.create({
            "amount": int(final_amount * 100),  # Amount in paise
            "currency": current_app.config.get('CURRENCY', 'INR'),
            "receipt": receipt_id
        })
        
        # Create order in database
        order_data = {
            'user_id': user_id,
            'razorpay_order_id': razorpay_order['id'],
            'total_amount': final_amount,
            'shipping_amount': shipping_cost,
            'shipping_address_id': shipping_address_id,
            'status': 'pending',
            'payment_status': 'pending'
        }
        
        order_id = database.create_order(order_data, cart_items)
        if order_id < 0:
            return error_response("Failed to create order", 500)
        
        # Clear cart after successful order creation
        database.clear_user_cart(user_id)
        
        return success_response({
            'order_id': order_id,
            'razorpay_order_id': razorpay_order['id'],
            'amount': final_amount,
            'currency': 'INR'
        }, "Order created successfully")
        
    except Exception as e:
        return error_response(f"Failed to create order: {str(e)}", 500)

@orders_bp.route('/orders/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        reason = data.get('reason', '').strip()
        if not reason:
            return error_response("Cancellation reason is required", 400)
        
        # Verify order belongs to user
        order = database.get_order_by_id(order_id)
        if not order or order['user_id'] != int(user_id):
            return error_response("Order not found", 404)
        
        # Check if order can be cancelled
        if order['status'] in ['shipped', 'delivered', 'cancelled']:
            return error_response("Order cannot be cancelled", 400)
        
        success = database.cancel_order(order_id, reason)
        if not success:
            return error_response("Failed to cancel order", 500)
        
        return success_response(None, "Order cancelled successfully")
        
    except Exception as e:
        return error_response(f"Failed to cancel order: {str(e)}", 500)

@orders_bp.route('/orders/<int:order_id>/tracking', methods=['GET'])
@jwt_required()
def track_order(order_id):
    try:
        user_id = get_jwt_identity()
        
        # Verify order belongs to user
        order = database.get_order_by_id(order_id)
        if not order or order['user_id'] != int(user_id):
            return error_response("Order not found", 404)
        
        # Get tracking information
        tracking_info = database.get_order_tracking(order_id)
        
        return success_response(tracking_info, "Tracking information retrieved successfully")
        
    except Exception as e:
        return error_response(f"Failed to retrieve tracking information: {str(e)}", 500)

# Payment endpoints
@orders_bp.route('/payments/initiate', methods=['POST'])
@jwt_required()
def initiate_payment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        order_id = data.get('order_id')
        if not order_id:
            return error_response("Order ID is required", 400)
        
        # Verify order belongs to user
        order = database.get_order_by_id(order_id)
        if not order or order['user_id'] != int(user_id):
            return error_response("Order not found", 404)
        
        if order['payment_status'] == 'completed':
            return error_response("Payment already completed", 400)
        
        return success_response({
            'razorpay_order_id': order['razorpay_order_id'],
            'amount': order['total_amount'],
            'currency': 'INR'
        }, "Payment initiated successfully")
        
    except Exception as e:
        return error_response(f"Failed to initiate payment: {str(e)}", 500)

@orders_bp.route('/payments/verify', methods=['POST'])
@jwt_required()
def verify_payment():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_signature = data.get('razorpay_signature')
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return error_response("Missing payment verification data", 400)
        
        # Verify payment signature
        client = get_razorpay_client()
        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
        except Exception:
            return error_response("Payment verification failed", 400)
        
        # Update order status
        success = database.update_payment_status(razorpay_order_id, 'completed', razorpay_payment_id)
        if not success:
            return error_response("Failed to update payment status", 500)
        
        return success_response(None, "Payment verified successfully")
        
    except Exception as e:
        return error_response(f"Payment verification failed: {str(e)}", 500)