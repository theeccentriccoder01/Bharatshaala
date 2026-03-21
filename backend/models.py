from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Numeric, Date, Time, ForeignKey, LargeBinary, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

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

# ==================== DATABASE MODELS ====================

class User(Base):
    """User account model - supports customers, vendors, and admins"""
    __tablename__ = 'User'
    
    UserId = Column(Integer, primary_key=True, autoincrement=True)
    AccountType = Column(String(50), nullable=False)  # 'vendor', 'customer', 'admin'
    Email = Column(String(255), unique=True, nullable=False, index=True)
    Name = Column(String(255), nullable=False)
    Password = Column(String(255), nullable=False)
    StoreID = Column(Integer, index=True)
    PhoneNumber = Column(String(20))
    Address = Column(Text)
    City = Column(String(100))
    State = Column(String(100))
    Pincode = Column(String(10))
    DateCreated = Column(DateTime, default=datetime.utcnow)
    LastLogin = Column(DateTime)
    IsActive = Column(Boolean, default=True)
    IsVerified = Column(Boolean, default=False)
    
    # Relationships
    cart_items = relationship('Cart', back_populates='customer')
    orders = relationship('Order', back_populates='customer')
    payments = relationship('Payment', back_populates='customer')
    reviews = relationship('Review', back_populates='customer')
    inventory = relationship('Inventory', back_populates='vendor')
    
    __table_args__ = (
        CheckConstraint("AccountType IN ('vendor', 'customer', 'admin')"),
        Index('ix_user_email', 'Email'),
        Index('ix_user_store_id', 'StoreID'),
    )

class InvitationCode(Base):
    """Vendor invitation codes - associates vendors with stores"""
    __tablename__ = 'InvitationCodes'
    
    StoreId = Column(Integer, primary_key=True)
    InvitationCode = Column(String(50), unique=True, nullable=False)
    StoreName = Column(String(255))
    IsActive = Column(Boolean, default=True)
    CreatedDate = Column(DateTime, default=datetime.utcnow)

class Category(Base):
    """Product categories with support for sub-categories"""
    __tablename__ = 'Categories'
    
    CategoryId = Column(Integer, primary_key=True, autoincrement=True)
    CategoryName = Column(String(255), unique=True, nullable=False)
    CategoryNameHindi = Column(String(255))
    ParentCategoryId = Column(Integer, ForeignKey('Categories.CategoryId'))
    Description = Column(Text)
    IsActive = Column(Boolean, default=True)
    SortOrder = Column(Integer)
    DateCreated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    parent_category = relationship('Category', remote_side=[CategoryId], backref='sub_categories')
    store_items = relationship('Store', back_populates='category')
    inventory_items = relationship('Inventory', back_populates='category')
    
    __table_args__ = (
        Index('ix_category_name', 'CategoryName'),
    )

class Store(Base):
    """Store inventory - items available in each vendor store"""
    __tablename__ = 'Store'
    
    StoreId = Column(Integer, primary_key=True)
    ItemId = Column(Integer, primary_key=True)
    Quantity = Column(Integer, nullable=False, default=0)
    Price = Column(Numeric(10, 2), nullable=False)
    ItemName = Column(String(255), nullable=False)
    Image = Column(LargeBinary)
    CategoryId = Column(Integer, ForeignKey('Categories.CategoryId'))
    Description = Column(Text)
    IsActive = Column(Boolean, default=True)
    DateAdded = Column(DateTime, default=datetime.utcnow)
    DateModified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship('Category', back_populates='store_items')
    cart_items = relationship('Cart', back_populates='store_item')
    orders = relationship('Order', back_populates='store_item')
    reviews = relationship('Review', back_populates='store_item')
    
    __table_args__ = (
        CheckConstraint('Quantity >= 0'),
        CheckConstraint('Price >= 0'),
        Index('ix_store_category_id', 'CategoryId'),
    )

class Cart(Base):
    """Shopping cart items for customers"""
    __tablename__ = 'cart'
    
    CartId = Column(Integer, primary_key=True, autoincrement=True)
    StoreId = Column(Integer, ForeignKey('Store.StoreId'), nullable=False)
    ItemId = Column(Integer, ForeignKey('Store.ItemId'), nullable=False)
    CustomerId = Column(Integer, ForeignKey('User.UserId'), nullable=False)
    Quantity = Column(Integer, nullable=False, default=1)
    Price = Column(Numeric(10, 2), nullable=False)
    ItemName = Column(String(255), nullable=False)
    OrderId = Column(String(100))
    DateAdded = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship('User', back_populates='cart_items')
    store_item = relationship('Store', back_populates='cart_items', 
                              foreign_keys=[StoreId, ItemId], 
                              primaryjoin="and_(Cart.StoreId==Store.StoreId, Cart.ItemId==Store.ItemId)")
    
    __table_args__ = (
        CheckConstraint('Quantity > 0'),
        UniqueConstraint('StoreId', 'ItemId', 'CustomerId', name='uq_cart_store_item_customer'),
    )

class Order(Base):
    """Customer orders"""
    __tablename__ = 'orders'
    
    OrderDetailId = Column(Integer, primary_key=True, autoincrement=True)
    StoreId = Column(Integer, nullable=False)
    ItemId = Column(Integer, nullable=False)
    CustomerId = Column(Integer, ForeignKey('User.UserId'), nullable=False)
    Quantity = Column(Integer, nullable=False)
    Price = Column(Numeric(10, 2), nullable=False)
    ItemName = Column(String(255), nullable=False)
    OrderId = Column(String(100), nullable=False, index=True)
    OrderStatus = Column(String(50), default='pending')  # 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    OrderDate = Column(Date, nullable=False)
    OrderTime = Column(Time, nullable=False)
    DeliveryAddress = Column(Text)
    TrackingNumber = Column(String(100))
    DeliveryDate = Column(Date)
    PaymentStatus = Column(String(50), default='pending')  # 'pending', 'paid', 'failed', 'refunded'
    TotalAmount = Column(Numeric(10, 2))
    
    # Relationships
    customer = relationship('User', back_populates='orders')
    store_item = relationship('Store', back_populates='orders',
                              foreign_keys=[StoreId, ItemId],
                              primaryjoin="and_(Order.StoreId==Store.StoreId, Order.ItemId==Store.ItemId)")
    payment = relationship('Payment', back_populates='order', uselist=False)
    
    __table_args__ = (
        CheckConstraint("OrderStatus IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')"),
        CheckConstraint("PaymentStatus IN ('pending', 'paid', 'failed', 'refunded')"),
        Index('ix_orders_customer_id', 'CustomerId'),
        Index('ix_orders_status', 'OrderStatus'),
        Index('ix_orders_order_id', 'OrderId'),
    )

class Inventory(Base):
    """Vendor inventory management"""
    __tablename__ = 'inventory'
    
    InventoryId = Column(Integer, primary_key=True, autoincrement=True)
    VendorId = Column(Integer, ForeignKey('User.UserId'), nullable=False)
    VendorName = Column(String(255), nullable=False)
    StoreId = Column(Integer, nullable=False)
    ItemId = Column(Integer, nullable=False)
    ItemName = Column(String(255), nullable=False)
    ItemDesc = Column(Text)
    ItemImage = Column(LargeBinary)
    Quantity = Column(Integer, nullable=False, default=0)
    Price = Column(Numeric(10, 2), nullable=False)
    CategoryId = Column(Integer, ForeignKey('Categories.CategoryId'))
    SKU = Column(String(100), unique=True)
    MinStockLevel = Column(Integer, default=10)
    MaxStockLevel = Column(Integer, default=1000)
    IsActive = Column(Boolean, default=True)
    DateAdded = Column(DateTime, default=datetime.utcnow)
    DateModified = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vendor = relationship('User', back_populates='inventory')
    category = relationship('Category', back_populates='inventory_items')
    
    __table_args__ = (
        CheckConstraint('Quantity >= 0'),
        CheckConstraint('Price >= 0'),
        UniqueConstraint('VendorId', 'ItemId', name='uq_vendor_item'),
        Index('ix_inventory_sku', 'SKU'),
        Index('ix_inventory_vendor', 'VendorId'),
    )

class Payment(Base):
    """Payment tracking for orders"""
    __tablename__ = 'payments'
    
    PaymentId = Column(Integer, primary_key=True, autoincrement=True)
    OrderId = Column(String(100), nullable=False, index=True)
    CustomerId = Column(Integer, ForeignKey('User.UserId'), nullable=False)
    Amount = Column(Numeric(10, 2), nullable=False)
    PaymentMethod = Column(String(100), nullable=False)
    PaymentStatus = Column(String(50), default='pending')  # 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
    TransactionId = Column(String(255), unique=True)
    GatewayResponse = Column(Text)
    PaymentDate = Column(DateTime, default=datetime.utcnow)
    RefundAmount = Column(Numeric(10, 2), default=0)
    RefundDate = Column(DateTime)
    
    # Relationships
    customer = relationship('User', back_populates='payments')
    order = relationship('Order', back_populates='payment', foreign_keys=[OrderId], primaryjoin="Payment.OrderId==Order.OrderId")
    
    __table_args__ = (
        CheckConstraint("PaymentStatus IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')"),
        Index('ix_payment_order_id', 'OrderId'),
        Index('ix_payment_transaction_id', 'TransactionId'),
    )

class Review(Base):
    """Product reviews and ratings"""
    __tablename__ = 'reviews'
    
    ReviewId = Column(Integer, primary_key=True, autoincrement=True)
    ProductId = Column(Integer, nullable=False)
    StoreId = Column(Integer, nullable=False)
    CustomerId = Column(Integer, ForeignKey('User.UserId'), nullable=False)
    OrderId = Column(String(100))
    Rating = Column(Integer, nullable=False)
    ReviewTitle = Column(String(255))
    ReviewText = Column(Text)
    IsVerifiedPurchase = Column(Boolean, default=False)
    IsApproved = Column(Boolean, default=True)
    HelpfulCount = Column(Integer, default=0)
    DateCreated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    customer = relationship('User', back_populates='reviews')
    store_item = relationship('Store', back_populates='reviews',
                              foreign_keys=[StoreId, ProductId],
                              primaryjoin="and_(Review.StoreId==Store.StoreId, Review.ProductId==Store.ItemId)")
    
    __table_args__ = (
        CheckConstraint('Rating BETWEEN 1 AND 5'),
    )

# ==================== SCHEMA DEFINITIONS ====================

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