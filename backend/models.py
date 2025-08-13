from datetime import datetime
from enum import Enum

class UserRole(Enum):
    CUSTOMER = "customer"
    VENDOR = "vendor"
    ADMIN = "admin"

class OrderStatus(Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class ProductStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"

# Database schema definitions (you'll need to implement these in your database.py)
USER_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'email': 'TEXT UNIQUE NOT NULL',
    'password_hash': 'TEXT NOT NULL',
    'name': 'TEXT NOT NULL',
    'phone': 'TEXT',
    'role': 'TEXT NOT NULL DEFAULT "customer"',
    'shop_id': 'INTEGER',
    'is_verified': 'BOOLEAN DEFAULT FALSE',
    'is_active': 'BOOLEAN DEFAULT TRUE',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

PRODUCT_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'name': 'TEXT NOT NULL',
    'description': 'TEXT',
    'price': 'DECIMAL(10,2) NOT NULL',
    'discounted_price': 'DECIMAL(10,2)',
    'category_id': 'INTEGER NOT NULL',
    'market_id': 'INTEGER',
    'vendor_id': 'INTEGER NOT NULL',
    'stock_quantity': 'INTEGER DEFAULT 0',
    'sku': 'TEXT UNIQUE',
    'images': 'TEXT',  # JSON array of image URLs
    'status': 'TEXT DEFAULT "active"',
    'rating': 'DECIMAL(3,2) DEFAULT 0',
    'review_count': 'INTEGER DEFAULT 0',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

CATEGORY_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'name': 'TEXT NOT NULL',
    'description': 'TEXT',
    'parent_id': 'INTEGER',
    'image': 'TEXT',
    'is_active': 'BOOLEAN DEFAULT TRUE',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

MARKET_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'name': 'TEXT NOT NULL',
    'description': 'TEXT',
    'location': 'TEXT',
    'image': 'TEXT',
    'is_active': 'BOOLEAN DEFAULT TRUE',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

ORDER_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'user_id': 'INTEGER NOT NULL',
    'razorpay_order_id': 'TEXT',
    'total_amount': 'DECIMAL(10,2) NOT NULL',
    'shipping_amount': 'DECIMAL(10,2) DEFAULT 0',
    'discount_amount': 'DECIMAL(10,2) DEFAULT 0',
    'status': 'TEXT DEFAULT "pending"',
    'payment_status': 'TEXT DEFAULT "pending"',
    'shipping_address_id': 'INTEGER',
    'tracking_number': 'TEXT',
    'notes': 'TEXT',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

CART_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'user_id': 'INTEGER NOT NULL',
    'product_id': 'INTEGER NOT NULL',
    'quantity': 'INTEGER NOT NULL DEFAULT 1',
    'price': 'DECIMAL(10,2) NOT NULL',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    'updated_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}

ADDRESS_SCHEMA = {
    'id': 'INTEGER PRIMARY KEY',
    'user_id': 'INTEGER NOT NULL',
    'name': 'TEXT NOT NULL',
    'phone': 'TEXT NOT NULL',
    'address_line_1': 'TEXT NOT NULL',
    'address_line_2': 'TEXT',
    'city': 'TEXT NOT NULL',
    'state': 'TEXT NOT NULL',
    'pincode': 'TEXT NOT NULL',
    'country': 'TEXT DEFAULT "India"',
    'is_default': 'BOOLEAN DEFAULT FALSE',
    'created_at': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
}