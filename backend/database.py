"""
SQLAlchemy-based database operations - replaces raw sqlite3 queries
Provides backward-compatible functions while using ORM underneath
"""
import json
import datetime
import uuid
import logging
from datetime import datetime as dt
from flask_bcrypt import Bcrypt
from sqlalchemy import and_, or_, func, desc
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from .extensions import db
from .models import (
    User, InvitationCode, Category, Store, Cart, Order, 
    Inventory, Payment, Review
)
from .cache import cache, cached, categories_cache, products_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Bcrypt
bcrypt = Bcrypt()

# ==================== USER OPERATIONS ====================

def add_customer_details(email, name, password, accountType, invitationCode=None, phoneNumber=None):
    """Add new user with proper password hashing"""
    try:
        # Check if email already exists
        existing_user = User.query.filter_by(Email=email).first()
        if existing_user:
            raise ValueError("Email already exists")
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Determine store ID for vendors
        store_id = None
        if accountType == "vendor" and invitationCode:
            store_id = check_invitation_code(invitationCode)
            if store_id == -1:
                raise ValueError("Invalid invitation code")
        
        # Create new user
        new_user = User(
            AccountType=accountType,
            Email=email,
            Name=name,
            Password=hashed_password,
            StoreID=store_id,
            PhoneNumber=phoneNumber,
            IsActive=True,
            IsVerified=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        logger.info(f"User {email} created successfully with ID {new_user.UserId}")
        return new_user.UserId
        
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Integrity error creating user: {e}")
        raise ValueError("Email already exists")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating user: {e}")
        raise

def check_email(email):
    """Check if email exists and return user ID"""
    try:
        user = User.query.filter_by(Email=email).first()
        return user.UserId if user else -1
    except Exception as e:
        logger.error(f"Error checking email: {e}")
        return -1

def check_password(userID, password):
    """Verify user password with proper bcrypt verification"""
    try:
        user = User.query.filter_by(UserId=userID).first()
        if user:
            return bcrypt.check_password_hash(user.Password, password)
        return False
    except Exception as e:
        logger.error(f"Error checking password: {e}")
        return False

def get_user_details(user_id):
    """Get comprehensive user details"""
    try:
        user = User.query.filter_by(UserId=user_id).first()
        if user:
            return {
                'UserId': user.UserId,
                'AccountType': user.AccountType,
                'Email': user.Email,
                'Name': user.Name,
                'StoreID': user.StoreID,
                'PhoneNumber': user.PhoneNumber,
                'Address': user.Address,
                'City': user.City,
                'State': user.State,
                'Pincode': user.Pincode,
                'DateCreated': user.DateCreated,
                'LastLogin': user.LastLogin,
                'IsActive': user.IsActive,
                'IsVerified': user.IsVerified
            }
        return None
    except Exception as e:
        logger.error(f"Error getting user details: {e}")
        return None

def update_user_profile(user_id, **kwargs):
    """Update user profile with dynamic fields"""
    try:
        allowed_fields = ['Name', 'PhoneNumber', 'Address', 'City', 'State', 'Pincode']
        updates = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
        
        if not updates:
            return False
        
        user = User.query.filter_by(UserId=user_id).first()
        if not user:
            return False
        
        for key, value in updates.items():
            setattr(user, key, value)
        
        db.session.commit()
        logger.info(f"User {user_id} profile updated")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating user profile: {e}")
        return False

def update_last_login(user_id):
    """Update user's last login timestamp"""
    try:
        user = User.query.filter_by(UserId=user_id).first()
        if user:
            user.LastLogin = dt.utcnow()
            db.session.commit()
            logger.info(f"User {user_id} last login updated")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating last login: {e}")

# ==================== INVITATION CODES ====================

def check_invitation_code(invitationCode):
    """Check invitation code and return store ID"""
    try:
        code = InvitationCode.query.filter_by(
            InvitationCode=invitationCode,
            IsActive=True
        ).first()
        return code.StoreId if code else -1
    except Exception as e:
        logger.error(f"Error checking invitation code: {e}")
        return -1

def insert_default_invitation_codes():
    """Insert default invitation codes"""
    try:
        # Check if codes already exist
        existing_count = InvitationCode.query.count()
        if existing_count > 0:
            logger.info("Invitation codes already exist, skipping insertion")
            return
        
        default_codes = [
            (1, '1111', 'Delhi Bazaar'),
            (2, '2222', 'Mumbai Market'),
            (3, '3333', 'Kolkata Corner'),
            (4, '4444', 'Chennai Central'),
            (5, '5555', 'Bangalore Boutique'),
            (6, '6666', 'Hyderabad Hub'),
            (7, '7777', 'Pune Plaza'),
            (8, '8888', 'Ahmedabad Avenue'),
            (9, '9999', 'Jaipur Junction')
        ]
        
        for store_id, code, store_name in default_codes:
            new_code = InvitationCode(
                StoreId=store_id,
                InvitationCode=code,
                StoreName=store_name,
                IsActive=True
            )
            db.session.add(new_code)
        
        db.session.commit()
        logger.info("Default invitation codes inserted")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inserting invitation codes: {e}")

# ==================== CATEGORY OPERATIONS ====================

def insert_default_categories():
    """Insert default categories"""
    try:
        # Check if categories already exist
        existing_count = Category.query.count()
        if existing_count > 0:
            logger.info("Categories already exist, skipping insertion")
            return
        
        default_categories = [
            ('Electronics', 'इलेक्ट्रॉनिक्स', None, 'Electronic devices and gadgets', True, 1),
            ('Clothing', 'कपड़े', None, 'Apparel and fashion items', True, 2),
            ('Home & Kitchen', 'घर और रसोई', None, 'Home and kitchen essentials', True, 3),
            ('Books', 'किताबें', None, 'Educational and recreational books', True, 4),
            ('Sports', 'खेल', None, 'Sports equipment and gear', True, 5),
        ]
        
        for name, name_hindi, parent_id, description, is_active, sort_order in default_categories:
            category = Category(
                CategoryName=name,
                CategoryNameHindi=name_hindi,
                ParentCategoryId=parent_id,
                Description=description,
                IsActive=is_active,
                SortOrder=sort_order
            )
            db.session.add(category)
        
        db.session.commit()
        logger.info("Default categories inserted")
        categories_cache.clear()  # Clear cache after insertion
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inserting categories: {e}")

# ==================== STORE OPERATIONS ====================

def insert_into_table_Store(StoreId, ItemId, Quantity, Price, ItemName, Image=None, CategoryId=None, Description=None):
    """Insert item into store with validation"""
    try:
        store_item = Store(
            StoreId=StoreId,
            ItemId=ItemId,
            Quantity=Quantity,
            Price=Price,
            ItemName=ItemName,
            Image=Image,
            CategoryId=CategoryId,
            Description=Description,
            IsActive=True
        )
        
        db.session.add(store_item)
        db.session.commit()
        logger.info(f"Item {ItemName} added to store {StoreId}")
        
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Integrity error adding store item: {e}")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding store item: {e}")

def select_store_items(StoreId, category_id=None, search_term=None):
    """Select store items with optional filtering"""
    try:
        query = Store.query.filter_by(StoreId=StoreId, IsActive=True)
        
        if category_id:
            query = query.filter_by(CategoryId=category_id)
        
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(
                or_(
                    Store.ItemName.ilike(search_pattern),
                    Store.Description.ilike(search_pattern)
                )
            )
        
        items = query.all()
        return [item.__dict__ for item in items]  # Convert to dict for compatibility
        
    except Exception as e:
        logger.error(f"Error selecting store items: {e}")
        return []

def updateitem(item_id, vendor_id, item_name, quantity, price, description=None):
    """Update store item with validation"""
    try:
        store_item = Store.query.filter_by(StoreId=vendor_id, ItemId=item_id).first()
        if not store_item:
            return False
        
        store_item.Quantity = quantity
        store_item.Price = price
        store_item.ItemName = item_name
        store_item.Description = description
        store_item.DateModified = dt.utcnow()
        
        db.session.commit()
        logger.info(f"Store item {item_id} updated")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating store item: {e}")
        return False

def delete_store_item(item_id, vendor_id):
    """Soft delete store item"""
    try:
        store_item = Store.query.filter_by(StoreId=vendor_id, ItemId=item_id).first()
        if not store_item:
            return False
        
        store_item.IsActive = False
        store_item.DateModified = dt.utcnow()
        
        db.session.commit()
        logger.info(f"Store item {item_id} deleted (soft delete)")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting store item: {e}")
        return False

# ==================== CART OPERATIONS ====================

def insert_into_table_cart(StoreId, ItemId, CustomerID, Quantity, Price, ItemName):
    """Add item to cart or update quantity if exists"""
    try:
        # Check if item already exists in cart
        existing_cart = Cart.query.filter_by(
            StoreId=StoreId,
            ItemId=ItemId,
            CustomerId=CustomerID,
            OrderId=None
        ).first()
        
        if existing_cart:
            # Update quantity
            existing_cart.Quantity += Quantity
            logger.info(f"Cart item {ItemId} quantity updated for customer {CustomerID}")
        else:
            # Insert new item
            new_cart = Cart(
                StoreId=StoreId,
                ItemId=ItemId,
                CustomerId=CustomerID,
                Quantity=Quantity,
                Price=Price,
                ItemName=ItemName
            )
            db.session.add(new_cart)
            logger.info(f"Item {ItemName} added to cart for customer {CustomerID}")
        
        db.session.commit()
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding item to cart: {e}")

def select_user_cart(CustomerId):
    """Get user's cart items"""
    try:
        cart_items = Cart.query.filter_by(
            CustomerId=CustomerId,
            OrderId=None
        ).order_by(desc(Cart.DateAdded)).all()
        
        result = []
        for item in cart_items:
            item_dict = {
                'CartId': item.CartId,
                'StoreId': item.StoreId,
                'ItemId': item.ItemId,
                'CustomerId': item.CustomerId,
                'Quantity': item.Quantity,
                'Price': item.Price,
                'ItemName': item.ItemName,
                'OrderId': item.OrderId,
                'DateAdded': item.DateAdded
            }
            # Add store item details if available
            if item.store_item:
                item_dict['Image'] = item.store_item.Image
                item_dict['Description'] = item.store_item.Description
            result.append(item_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Error selecting user cart: {e}")
        return []

def change_quantity_cart(customer_id, store_id, item_id, new_quantity):
    """Update cart item quantity"""
    try:
        cart_item = Cart.query.filter_by(
            StoreId=store_id,
            ItemId=item_id,
            CustomerId=customer_id,
            OrderId=None
        ).first()
        
        if not cart_item:
            return False
        
        if new_quantity <= 0:
            db.session.delete(cart_item)
            logger.info(f"Cart item removed for customer {customer_id}")
        else:
            cart_item.Quantity = new_quantity
            logger.info(f"Cart item quantity updated for customer {customer_id}")
        
        db.session.commit()
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error changing cart quantity: {e}")
        return False

def clear_user_cart(customer_id):
    """Clear user's cart"""
    try:
        Cart.query.filter_by(CustomerId=customer_id, OrderId=None).delete()
        db.session.commit()
        logger.info(f"Cart cleared for customer {customer_id}")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error clearing cart: {e}")

def add_order_id(customer_id, order_id):
    """Add order ID to cart items"""
    try:
        cart_items = Cart.query.filter_by(
            CustomerId=customer_id,
            OrderId=None
        ).all()
        
        for item in cart_items:
            item.OrderId = order_id
        
        db.session.commit()
        logger.info(f"Order ID {order_id} added to cart items for customer {customer_id}")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding order ID to cart: {e}")

# ==================== ORDER OPERATIONS ====================

def update_cart(order_id, order_status, delivery_address=None):
    """Move cart items to orders"""
    try:
        # Get cart items
        cart_items = Cart.query.filter_by(OrderId=order_id).all()
        
        current_datetime = dt.utcnow()
        order_date = current_datetime.date()
        order_time = current_datetime.time()
        
        total_amount = sum(item.Price * item.Quantity for item in cart_items)
        
        # Insert into orders
        for item in cart_items:
            new_order = Order(
                StoreId=item.StoreId,
                ItemId=item.ItemId,
                CustomerId=item.CustomerId,
                Quantity=item.Quantity,
                Price=item.Price,
                ItemName=item.ItemName,
                OrderId=order_id,
                OrderStatus=order_status,
                OrderDate=order_date,
                OrderTime=order_time,
                DeliveryAddress=delivery_address,
                TotalAmount=total_amount
            )
            db.session.add(new_order)
        
        # Remove from cart if order is complete
        if order_status in ['confirmed', 'processing']:
            Cart.query.filter_by(OrderId=order_id).delete()
        
        db.session.commit()
        logger.info(f"Order {order_id} updated with status {order_status}")
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating cart to order: {e}")

def get_user_orders(customer_id, status=None):
    """Get user's orders with optional status filter"""
    try:
        query = Order.query.filter_by(CustomerId=customer_id)
        
        if status:
            query = query.filter_by(OrderStatus=status)
        
        orders = query.order_by(desc(Order.OrderDate), desc(Order.OrderTime)).all()
        
        # Group by OrderId
        orders_dict = {}
        for order in orders:
            if order.OrderId not in orders_dict:
                orders_dict[order.OrderId] = {
                    'OrderId': order.OrderId,
                    'OrderStatus': order.OrderStatus,
                    'OrderDate': order.OrderDate,
                    'OrderTime': order.OrderTime,
                    'DeliveryAddress': order.DeliveryAddress,
                    'TotalAmount': order.TotalAmount,
                    'PaymentStatus': order.PaymentStatus,
                    'ItemCount': 0,
                    'Items': []
                }
            orders_dict[order.OrderId]['ItemCount'] += 1
            orders_dict[order.OrderId]['Items'].append(order.ItemName)
        
        return list(orders_dict.values())
        
    except Exception as e:
        logger.error(f"Error getting user orders: {e}")
        return []

def update_order_status(order_id, new_status, tracking_number=None):
    """Update order status"""
    try:
        orders = Order.query.filter_by(OrderId=order_id).all()
        
        for order in orders:
            order.OrderStatus = new_status
            if tracking_number:
                order.TrackingNumber = tracking_number
            if new_status == 'delivered':
                order.DeliveryDate = datetime.date.today()
        
        db.session.commit()
        logger.info(f"Order {order_id} status updated to {new_status}")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating order status: {e}")
        return False

def retrieve_orders_by_vendor(vendor_id, status=None):
    """Get orders for a specific vendor"""
    try:
        query = db.session.query(Order).join(User).filter(Order.StoreId == vendor_id)
        
        if status:
            query = query.filter(Order.OrderStatus == status)
        
        orders = query.order_by(desc(Order.OrderDate), desc(Order.OrderTime)).all()
        
        orders_list = []
        for order in orders:
            customer = User.query.filter_by(UserId=order.CustomerId).first()
            order_dict = {
                'OrderDetailId': order.OrderDetailId,
                'StoreId': order.StoreId,
                'ItemId': order.ItemId,
                'CustomerId': order.CustomerId,
                'Quantity': order.Quantity,
                'Price': str(order.Price),
                'ItemName': order.ItemName,
                'OrderId': order.OrderId,
                'OrderStatus': order.OrderStatus,
                'OrderDate': str(order.OrderDate),
                'OrderTime': str(order.OrderTime),
                'DeliveryAddress': order.DeliveryAddress,
                'TrackingNumber': order.TrackingNumber,
                'DeliveryDate': str(order.DeliveryDate) if order.DeliveryDate else None,
                'PaymentStatus': order.PaymentStatus,
                'TotalAmount': str(order.TotalAmount),
                'CustomerName': customer.Name if customer else None,
                'CustomerEmail': customer.Email if customer else None,
                'CustomerPhone': customer.PhoneNumber if customer else None
            }
            orders_list.append(order_dict)
        
        return json.dumps(orders_list, indent=4)
        
    except Exception as e:
        logger.error(f"Error retrieving vendor orders: {e}")
        return json.dumps([], indent=4)

# ==================== INVENTORY OPERATIONS ====================

def add_to_inventory(vendor_id, vendor_name, item_id, item_name, item_desc, image, store_id, quantity, price, category_id=None):
    """Add item to inventory with validation"""
    try:
        # Generate SKU if not provided
        sku = f"BS-{vendor_id}-{item_id}-{uuid.uuid4().hex[:6].upper()}"
        
        inventory = Inventory(
            VendorId=vendor_id,
            VendorName=vendor_name,
            StoreId=store_id,
            ItemId=item_id,
            ItemName=item_name,
            ItemDesc=item_desc,
            ItemImage=image,
            Quantity=quantity,
            Price=price,
            CategoryId=category_id,
            SKU=sku,
            IsActive=True
        )
        
        db.session.add(inventory)
        db.session.commit()
        logger.info(f"Item {item_name} added to inventory for vendor {vendor_id}")
        
    except IntegrityError as e:
        db.session.rollback()
        logger.error(f"Integrity error adding to inventory: {e}")
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding to inventory: {e}")

def retrieve_data_from_inventory(vendor_id, category_id=None, low_stock_only=False):
    """Retrieve inventory data with optional filters"""
    try:
        query = Inventory.query.filter_by(VendorId=vendor_id, IsActive=True)
        
        if category_id:
            query = query.filter_by(CategoryId=category_id)
        
        if low_stock_only:
            query = query.filter(Inventory.Quantity <= Inventory.MinStockLevel)
        
        items = query.order_by(desc(Inventory.DateModified)).all()
        
        data = []
        for item in items:
            item_data = {
                'InventoryId': item.InventoryId,
                'VendorId': item.VendorId,
                'VendorName': item.VendorName,
                'StoreId': item.StoreId,
                'ItemId': item.ItemId,
                'ItemName': item.ItemName,
                'ItemDesc': item.ItemDesc,
                'Quantity': item.Quantity,
                'Price': str(item.Price),
                'CategoryId': item.CategoryId,
                'SKU': item.SKU,
                'MinStockLevel': item.MinStockLevel,
                'MaxStockLevel': item.MaxStockLevel,
                'IsActive': item.IsActive,
                'DateAdded': item.DateAdded.isoformat() if item.DateAdded else None,
                'DateModified': item.DateModified.isoformat() if item.DateModified else None
            }
            if item.category:
                item_data['CategoryName'] = item.category.CategoryName
            data.append(item_data)
        
        return json.dumps(data, indent=4)
        
    except Exception as e:
        logger.error(f"Error retrieving inventory data: {e}")
        return json.dumps([], indent=4)

def update_inventory_quantity(vendor_id, item_id, new_quantity):
    """Update inventory quantity"""
    try:
        inventory = Inventory.query.filter_by(VendorId=vendor_id, ItemId=item_id).first()
        if not inventory:
            return False
        
        inventory.Quantity = new_quantity
        inventory.DateModified = dt.utcnow()
        
        db.session.commit()
        logger.info(f"Inventory item {item_id} quantity updated")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating inventory quantity: {e}")
        return False

# ==================== PAYMENT OPERATIONS ====================

def record_payment(order_id, customer_id, amount, payment_method, transaction_id=None, gateway_response=None):
    """Record a payment transaction"""
    try:
        payment = Payment(
            OrderId=order_id,
            CustomerId=customer_id,
            Amount=amount,
            PaymentMethod=payment_method,
            TransactionId=transaction_id,
            GatewayResponse=gateway_response,
            PaymentStatus='pending'
        )
        
        db.session.add(payment)
        db.session.commit()
        logger.info(f"Payment recorded for order {order_id}")
        return payment.PaymentId
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error recording payment: {e}")
        return None

def update_payment_status(payment_id, status, transaction_id=None, gateway_response=None):
    """Update payment status"""
    try:
        payment = Payment.query.filter_by(PaymentId=payment_id).first()
        if not payment:
            return False
        
        payment.PaymentStatus = status
        if transaction_id:
            payment.TransactionId = transaction_id
        if gateway_response:
            payment.GatewayResponse = gateway_response
        
        db.session.commit()
        logger.info(f"Payment {payment_id} status updated to {status}")
        return True
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating payment status: {e}")
        return False

# ==================== REVIEW OPERATIONS ====================

def add_review(product_id, store_id, customer_id, rating, review_title=None, review_text=None, order_id=None):
    """Add a product review"""
    try:
        # Check if customer has purchased this product
        is_verified = False
        if order_id:
            purchase = Order.query.filter_by(
                OrderId=order_id,
                CustomerId=customer_id,
                ItemId=product_id,
                StoreId=store_id
            ).first()
            is_verified = purchase is not None
        
        review = Review(
            ProductId=product_id,
            StoreId=store_id,
            CustomerId=customer_id,
            OrderId=order_id,
            Rating=rating,
            ReviewTitle=review_title,
            ReviewText=review_text,
            IsVerifiedPurchase=is_verified,
            IsApproved=True
        )
        
        db.session.add(review)
        db.session.commit()
        logger.info(f"Review added for product {product_id} by customer {customer_id}")
        return review.ReviewId
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding review: {e}")
        return None

def get_product_reviews(product_id, store_id, limit=10, offset=0):
    """Get product reviews with pagination"""
    try:
        reviews = Review.query.filter_by(
            ProductId=product_id,
            StoreId=store_id,
            IsApproved=True
        ).order_by(desc(Review.DateCreated)).offset(offset).limit(limit).all()
        
        result = []
        for review in reviews:
            customer = User.query.filter_by(UserId=review.CustomerId).first()
            review_dict = {
                'ReviewId': review.ReviewId,
                'Rating': review.Rating,
                'ReviewTitle': review.ReviewTitle,
                'ReviewText': review.ReviewText,
                'CustomerName': customer.Name if customer else 'Anonymous',
                'IsVerifiedPurchase': review.IsVerifiedPurchase,
                'HelpfulCount': review.HelpfulCount,
                'DateCreated': review.DateCreated.isoformat() if review.DateCreated else None
            }
            result.append(review_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting product reviews: {e}")
        return []

# ==================== DATABASE INITIALIZATION ====================

def initialize_database():
    """Initialize all database tables and insert default data"""
    try:
        # Create all tables from models
        db.create_all()
        
        # Insert default data
        insert_default_invitation_codes()
        insert_default_categories()
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
