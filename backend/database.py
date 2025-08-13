import sqlite3
import json
import datetime
import hashlib
import uuid
import logging
from contextlib import contextmanager
from flask_bcrypt import Bcrypt

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_NAME = 'sql.db'

# Initialize Bcrypt
bcrypt = Bcrypt()

# Context manager for database connections
@contextmanager
def get_db_connection():
    """Context manager for database connections with proper error handling"""
    conn = None
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        yield conn
    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        logger.error(f"Database error: {e}")
        raise
    finally:
        if conn:
            conn.close()

# Database initialization
def initialize_database():
    """Initialize all database tables and insert default data"""
    try:
        create_user_table()
        create_invitationcodes_table()
        create_store_table()
        create_cart_table()
        create_orders_table()
        create_inventory_table()
        create_payment_table()
        create_reviews_table()
        create_categories_table()
        create_wishlist_table()
        
        # Insert default data
        insert_default_invitation_codes()
        insert_default_categories()
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

# USER TABLE
def create_user_table():
    """Create user table with proper constraints"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='User';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE User (
                    UserId INTEGER PRIMARY KEY AUTOINCREMENT,
                    AccountType TEXT NOT NULL CHECK (AccountType IN ('vendor', 'customer', 'admin')),
                    Email TEXT UNIQUE NOT NULL,
                    Name TEXT NOT NULL,
                    Password TEXT NOT NULL,
                    StoreID INTEGER,
                    PhoneNumber TEXT,
                    Address TEXT,
                    City TEXT,
                    State TEXT,
                    Pincode TEXT,
                    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    LastLogin TIMESTAMP,
                    IsActive BOOLEAN DEFAULT 1,
                    IsVerified BOOLEAN DEFAULT 0
                );
            """)
            conn.commit()
            logger.info("User table created successfully")

def add_customer_details(email, name, password, accountType, invitationCode=None, phoneNumber=None):
    """Add new user with proper password hashing"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT UserId FROM User WHERE Email = ?", (email,))
        if cursor.fetchone():
            raise ValueError("Email already exists")
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Determine store ID for vendors
        store_id = None
        if accountType == "vendor" and invitationCode:
            store_id = check_invitation_code(invitationCode)
            if store_id == -1:
                raise ValueError("Invalid invitation code")
        
        cursor.execute("""
            INSERT INTO User (AccountType, Email, Name, Password, StoreID, PhoneNumber) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, (accountType, email, name, hashed_password, store_id, phoneNumber))
        
        user_id = cursor.lastrowid
        conn.commit()
        logger.info(f"User {email} created successfully with ID {user_id}")
        return user_id

def check_email(email):
    """Check if email exists and return user ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT UserId FROM User WHERE Email = ?', (email,))
        result = cursor.fetchone()
        return result['UserId'] if result else -1

def check_password(userID, password):
    """Verify user password with proper bcrypt verification"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Password FROM User WHERE UserId = ?', (userID,))
        result = cursor.fetchone()
        if result:
            return bcrypt.check_password_hash(result['Password'], password)
        return False

def get_user_details(user_id):
    """Get comprehensive user details"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT UserId, AccountType, Email, Name, StoreID, PhoneNumber, 
                   Address, City, State, Pincode, DateCreated, LastLogin, IsActive, IsVerified
            FROM User WHERE UserId = ?
        """, (user_id,))
        return cursor.fetchone()

def update_user_profile(user_id, **kwargs):
    """Update user profile with dynamic fields"""
    allowed_fields = ['Name', 'PhoneNumber', 'Address', 'City', 'State', 'Pincode']
    updates = {k: v for k, v in kwargs.items() if k in allowed_fields and v is not None}
    
    if not updates:
        return False
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        set_clause = ', '.join([f"{k} = ?" for k in updates.keys()])
        values = list(updates.values()) + [user_id]
        
        cursor.execute(f"UPDATE User SET {set_clause} WHERE UserId = ?", values)
        conn.commit()
        return cursor.rowcount > 0

def update_last_login(user_id):
    """Update user's last login timestamp"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE User SET LastLogin = CURRENT_TIMESTAMP WHERE UserId = ?", (user_id,))
        conn.commit()

# INVITATION CODES TABLE
def create_invitationcodes_table():
    """Create invitation codes table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='InvitationCodes';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE InvitationCodes (
                    StoreId INTEGER UNIQUE,
                    InvitationCode TEXT UNIQUE,
                    StoreName TEXT,
                    IsActive BOOLEAN DEFAULT 1,
                    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            logger.info("InvitationCodes table created successfully")

def insert_default_invitation_codes():
    """Insert default invitation codes"""
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
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM InvitationCodes")
        if cursor.fetchone()['count'] == 0:
            cursor.executemany("""
                INSERT INTO InvitationCodes (StoreId, InvitationCode, StoreName) 
                VALUES (?, ?, ?)
            """, default_codes)
            conn.commit()
            logger.info("Default invitation codes inserted")

def check_invitation_code(invitationCode):
    """Check invitation code and return store ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT StoreId FROM InvitationCodes 
            WHERE InvitationCode = ? AND IsActive = 1
        """, (invitationCode,))
        result = cursor.fetchone()
        return result['StoreId'] if result else -1

# STORE TABLE
def create_store_table():
    """Create store table for inventory management"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Store';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE Store (
                    StoreId INTEGER,
                    ItemId INTEGER,
                    Quantity INTEGER NOT NULL CHECK (Quantity >= 0),
                    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
                    ItemName TEXT NOT NULL,
                    Image BLOB,
                    CategoryId INTEGER,
                    Description TEXT,
                    IsActive BOOLEAN DEFAULT 1,
                    DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    DateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (StoreId, ItemId),
                    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId)
                )
            """)
            conn.commit()
            logger.info("Store table created successfully")

def insert_into_table_Store(StoreId, ItemId, Quantity, Price, ItemName, Image=None, CategoryId=None, Description=None):
    """Insert item into store with validation"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Store (StoreId, ItemId, Quantity, Price, ItemName, Image, CategoryId, Description) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (StoreId, ItemId, Quantity, Price, ItemName, Image, CategoryId, Description))
        conn.commit()
        logger.info(f"Item {ItemName} added to store {StoreId}")

def select_store_items(StoreId, category_id=None, search_term=None):
    """Select store items with optional filtering"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Store WHERE StoreId = ? AND IsActive = 1"
        params = [StoreId]
        
        if category_id:
            query += " AND CategoryId = ?"
            params.append(category_id)
        
        if search_term:
            query += " AND (ItemName LIKE ? OR Description LIKE ?)"
            params.extend([f"%{search_term}%", f"%{search_term}%"])
        
        cursor.execute(query, params)
        return cursor.fetchall()

def updateitem(item_id, vendor_id, item_name, quantity, price, description=None):
    """Update store item with validation"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Store 
            SET Quantity = ?, Price = ?, ItemName = ?, Description = ?, DateModified = CURRENT_TIMESTAMP
            WHERE ItemId = ? AND StoreId = ?
        """, (quantity, price, item_name, description, item_id, vendor_id))
        conn.commit()
        return cursor.rowcount > 0

def delete_store_item(item_id, vendor_id):
    """Soft delete store item"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE Store SET IsActive = 0, DateModified = CURRENT_TIMESTAMP 
            WHERE StoreId = ? AND ItemId = ?
        """, (vendor_id, item_id))
        conn.commit()
        return cursor.rowcount > 0

# CART TABLE
def create_cart_table():
    """Create cart table with proper constraints"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cart';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE cart (
                    CartId INTEGER PRIMARY KEY AUTOINCREMENT,
                    StoreId INTEGER NOT NULL,
                    ItemId INTEGER NOT NULL,
                    CustomerId INTEGER NOT NULL,
                    Quantity INTEGER NOT NULL CHECK (Quantity > 0),
                    Price DECIMAL(10,2) NOT NULL,
                    ItemName TEXT NOT NULL,
                    OrderId TEXT,
                    DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (CustomerId) REFERENCES User(UserId),
                    UNIQUE(StoreId, ItemId, CustomerId)
                )
            """)
            conn.commit()
            logger.info("Cart table created successfully")

def insert_into_table_cart(StoreId, ItemId, CustomerID, Quantity, Price, ItemName):
    """Add item to cart or update quantity if exists"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if item already exists in cart
        cursor.execute("""
            SELECT CartId, Quantity FROM cart 
            WHERE StoreId = ? AND ItemId = ? AND CustomerId = ? AND OrderId IS NULL
        """, (StoreId, ItemId, CustomerID))
        
        existing = cursor.fetchone()
        
        if existing:
            # Update quantity
            new_quantity = existing['Quantity'] + Quantity
            cursor.execute("""
                UPDATE cart SET Quantity = ?, DateAdded = CURRENT_TIMESTAMP 
                WHERE CartId = ?
            """, (new_quantity, existing['CartId']))
        else:
            # Insert new item
            cursor.execute("""
                INSERT INTO cart (StoreId, ItemId, CustomerId, Quantity, Price, ItemName) 
                VALUES (?, ?, ?, ?, ?, ?)
            """, (StoreId, ItemId, CustomerID, Quantity, Price, ItemName))
        
        conn.commit()

def select_user_cart(CustomerId):
    """Get user's cart items"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.*, s.Image, s.Description 
            FROM cart c
            LEFT JOIN Store s ON c.StoreId = s.StoreId AND c.ItemId = s.ItemId
            WHERE c.CustomerId = ? AND c.OrderId IS NULL
            ORDER BY c.DateAdded DESC
        """, (CustomerId,))
        return cursor.fetchall()

def change_quantity_cart(customer_id, store_id, item_id, new_quantity):
    """Update cart item quantity"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if new_quantity <= 0:
            cursor.execute("""
                DELETE FROM cart 
                WHERE StoreId = ? AND ItemId = ? AND CustomerId = ? AND OrderId IS NULL
            """, (store_id, item_id, customer_id))
        else:
            cursor.execute("""
                UPDATE cart SET Quantity = ? 
                WHERE StoreId = ? AND ItemId = ? AND CustomerId = ? AND OrderId IS NULL
            """, (new_quantity, store_id, item_id, customer_id))
        conn.commit()
        return cursor.rowcount > 0

def clear_user_cart(customer_id):
    """Clear user's cart"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart WHERE CustomerId = ? AND OrderId IS NULL", (customer_id,))
        conn.commit()

def add_order_id(customer_id, order_id):
    """Add order ID to cart items"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE cart SET OrderId = ? 
            WHERE CustomerId = ? AND OrderId IS NULL
        """, (order_id, customer_id))
        conn.commit()

# ORDERS TABLE
def create_orders_table():
    """Create orders table with comprehensive tracking"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='orders';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE orders (
                    OrderDetailId INTEGER PRIMARY KEY AUTOINCREMENT,
                    StoreId INTEGER NOT NULL,
                    ItemId INTEGER NOT NULL,
                    CustomerId INTEGER NOT NULL,
                    Quantity INTEGER NOT NULL,
                    Price DECIMAL(10,2) NOT NULL,
                    ItemName TEXT NOT NULL,
                    OrderId TEXT NOT NULL,
                    OrderStatus TEXT DEFAULT 'pending' CHECK (OrderStatus IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
                    OrderDate DATE NOT NULL,
                    OrderTime TIME NOT NULL,
                    DeliveryAddress TEXT,
                    TrackingNumber TEXT,
                    DeliveryDate DATE,
                    PaymentStatus TEXT DEFAULT 'pending' CHECK (PaymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
                    TotalAmount DECIMAL(10,2),
                    FOREIGN KEY (CustomerId) REFERENCES User(UserId)
                )
            """)
            conn.commit()
            logger.info("Orders table created successfully")

def update_cart(order_id, order_status, delivery_address=None):
    """Move cart items to orders"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        current_datetime = datetime.datetime.now()
        order_date = current_datetime.date()
        order_time = current_datetime.time()
        
        # Get cart items
        cursor.execute("SELECT * FROM cart WHERE OrderId = ?", (order_id,))
        cart_items = cursor.fetchall()
        
        total_amount = sum(item['Price'] * item['Quantity'] for item in cart_items)
        
        # Insert into orders
        for item in cart_items:
            cursor.execute("""
                INSERT INTO orders (StoreId, ItemId, CustomerId, Quantity, Price, ItemName, 
                                  OrderId, OrderStatus, OrderDate, OrderTime, DeliveryAddress, TotalAmount) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (item['StoreId'], item['ItemId'], item['CustomerId'], item['Quantity'], 
                  item['Price'], item['ItemName'], order_id, order_status, order_date, 
                  order_time, delivery_address, total_amount))
        
        # Remove from cart if order is complete
        if order_status in ['confirmed', 'processing']:
            cursor.execute("DELETE FROM cart WHERE OrderId = ?", (order_id,))
        
        conn.commit()
        logger.info(f"Order {order_id} updated with status {order_status}")

def get_user_orders(customer_id, status=None):
    """Get user's orders with optional status filter"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = """
            SELECT OrderId, OrderStatus, OrderDate, OrderTime, DeliveryAddress, 
                   TotalAmount, PaymentStatus, COUNT(*) as ItemCount,
                   GROUP_CONCAT(ItemName, ', ') as Items
            FROM orders 
            WHERE CustomerId = ?
        """
        params = [customer_id]
        
        if status:
            query += " AND OrderStatus = ?"
            params.append(status)
        
        query += " GROUP BY OrderId ORDER BY OrderDate DESC, OrderTime DESC"
        
        cursor.execute(query, params)
        return cursor.fetchall()

def update_order_status(order_id, new_status, tracking_number=None):
    """Update order status"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        update_fields = ["OrderStatus = ?"]
        params = [new_status]
        
        if tracking_number:
            update_fields.append("TrackingNumber = ?")
            params.append(tracking_number)
        
        if new_status == 'delivered':
            update_fields.append("DeliveryDate = CURRENT_DATE")
        
        params.append(order_id)
        
        cursor.execute(f"""
            UPDATE orders SET {', '.join(update_fields)} 
            WHERE OrderId = ?
        """, params)
        conn.commit()
        return cursor.rowcount > 0

def retrieve_orders_by_vendor(vendor_id, status=None):
    """Get orders for a specific vendor"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = """
            SELECT o.*, u.Name as CustomerName, u.Email as CustomerEmail, u.PhoneNumber
            FROM orders o
            JOIN User u ON o.CustomerId = u.UserId
            WHERE o.StoreId = ?
        """
        params = [vendor_id]
        
        if status:
            query += " AND o.OrderStatus = ?"
            params.append(status)
        
        query += " ORDER BY o.OrderDate DESC, o.OrderTime DESC"
        
        cursor.execute(query, params)
        orders = cursor.fetchall()
        
        # Convert to JSON format
        orders_list = []
        for order in orders:
            order_dict = dict(order)
            # Convert date and time to string
            if order_dict['OrderDate']:
                order_dict['OrderDate'] = str(order_dict['OrderDate'])
            if order_dict['OrderTime']:
                order_dict['OrderTime'] = str(order_dict['OrderTime'])
            if order_dict['DeliveryDate']:
                order_dict['DeliveryDate'] = str(order_dict['DeliveryDate'])
            orders_list.append(order_dict)
        
        return json.dumps(orders_list, indent=4)

# INVENTORY TABLE
def create_inventory_table():
    """Create comprehensive inventory table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='inventory';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE inventory (
                    InventoryId INTEGER PRIMARY KEY AUTOINCREMENT,
                    VendorId INTEGER NOT NULL,
                    VendorName TEXT NOT NULL,
                    StoreId INTEGER NOT NULL,
                    ItemId INTEGER NOT NULL,
                    ItemName TEXT NOT NULL,
                    ItemDesc TEXT,
                    ItemImage BLOB,
                    Quantity INTEGER NOT NULL CHECK (Quantity >= 0),
                    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
                    CategoryId INTEGER,
                    SKU TEXT UNIQUE,
                    MinStockLevel INTEGER DEFAULT 10,
                    MaxStockLevel INTEGER DEFAULT 1000,
                    IsActive BOOLEAN DEFAULT 1,
                    DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    DateModified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (VendorId) REFERENCES User(UserId),
                    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
                    UNIQUE(VendorId, ItemId)
                )
            """)
            conn.commit()
            logger.info("Inventory table created successfully")

def add_to_inventory(vendor_id, vendor_name, item_id, item_name, item_desc, image, store_id, quantity, price, category_id=None):
    """Add item to inventory with validation"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Generate SKU if not provided
        sku = f"BS-{vendor_id}-{item_id}-{uuid.uuid4().hex[:6].upper()}"
        
        cursor.execute("""
            INSERT INTO inventory (VendorId, VendorName, StoreId, ItemId, ItemName, 
                                 ItemDesc, ItemImage, Quantity, Price, CategoryId, SKU) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (vendor_id, vendor_name, store_id, item_id, item_name, item_desc, 
              image, quantity, price, category_id, sku))
        conn.commit()
        logger.info(f"Item {item_name} added to inventory for vendor {vendor_id}")

def retrieve_data_from_inventory(vendor_id, category_id=None, low_stock_only=False):
    """Retrieve inventory data with optional filters"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = """
            SELECT i.*, c.CategoryName 
            FROM inventory i
            LEFT JOIN Categories c ON i.CategoryId = c.CategoryId
            WHERE i.VendorId = ? AND i.IsActive = 1
        """
        params = [vendor_id]
        
        if category_id:
            query += " AND i.CategoryId = ?"
            params.append(category_id)
        
        if low_stock_only:
            query += " AND i.Quantity <= i.MinStockLevel"
        
        query += " ORDER BY i.DateModified DESC"
        
        cursor.execute(query, params)
        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()
        
        data = []
        for row in rows:
            row_data = {}
            for i, column in enumerate(columns):
                value = row[i]
                # Convert datetime objects to strings
                if isinstance(value, datetime.datetime):
                    value = value.isoformat()
                elif isinstance(value, datetime.date):
                    value = value.isoformat()
                row_data[column] = value
            data.append(row_data)
        
        return json.dumps(data, indent=4)

def update_inventory_quantity(vendor_id, item_id, new_quantity):
    """Update inventory quantity"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE inventory 
            SET Quantity = ?, DateModified = CURRENT_TIMESTAMP 
            WHERE VendorId = ? AND ItemId = ?
        """, (new_quantity, vendor_id, item_id))
        conn.commit()
        return cursor.rowcount > 0

# PAYMENT TABLE
def create_payment_table():
    """Create payment tracking table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE payments (
                    PaymentId INTEGER PRIMARY KEY AUTOINCREMENT,
                    OrderId TEXT NOT NULL,
                    CustomerId INTEGER NOT NULL,
                    Amount DECIMAL(10,2) NOT NULL,
                    PaymentMethod TEXT NOT NULL,
                    PaymentStatus TEXT DEFAULT 'pending' CHECK (PaymentStatus IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
                    TransactionId TEXT UNIQUE,
                    GatewayResponse TEXT,
                    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    RefundAmount DECIMAL(10,2) DEFAULT 0,
                    RefundDate TIMESTAMP,
                    FOREIGN KEY (CustomerId) REFERENCES User(UserId)
                )
            """)
            conn.commit()
            logger.info("Payments table created successfully")

def record_payment(order_id, customer_id, amount, payment_method, transaction_id=None, gateway_response=None):
    """Record a payment transaction"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO payments (OrderId, CustomerId, Amount, PaymentMethod, TransactionId, GatewayResponse) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, (order_id, customer_id, amount, payment_method, transaction_id, gateway_response))
        payment_id = cursor.lastrowid
        conn.commit()
        return payment_id

def update_payment_status(payment_id, status, transaction_id=None, gateway_response=None):
    """Update payment status"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        updates = ["PaymentStatus = ?"]
        params = [status]
        
        if transaction_id:
            updates.append("TransactionId = ?")
            params.append(transaction_id)
        
        if gateway_response:
            updates.append("GatewayResponse = ?")
            params.append(gateway_response)
        
        params.append(payment_id)
        
        cursor.execute(f"""
            UPDATE payments SET {', '.join(updates)} 
            WHERE PaymentId = ?
        """, params)
        conn.commit()
        return cursor.rowcount > 0

# REVIEWS TABLE
def create_reviews_table():
    """Create product reviews table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE reviews (
                    ReviewId INTEGER PRIMARY KEY AUTOINCREMENT,
                    ProductId INTEGER NOT NULL,
                    StoreId INTEGER NOT NULL,
                    CustomerId INTEGER NOT NULL,
                    OrderId TEXT,
                    Rating INTEGER NOT NULL CHECK (Rating BETWEEN 1 AND 5),
                    ReviewTitle TEXT,
                    ReviewText TEXT,
                    IsVerifiedPurchase BOOLEAN DEFAULT 0,
                    IsApproved BOOLEAN DEFAULT 1,
                    HelpfulCount INTEGER DEFAULT 0,
                    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (CustomerId) REFERENCES User(UserId)
                )
            """)
            conn.commit()
            logger.info("Reviews table created successfully")

def add_review(product_id, store_id, customer_id, rating, review_title=None, review_text=None, order_id=None):
    """Add a product review"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if customer has purchased this product
        is_verified = False
        if order_id:
            cursor.execute("""
                SELECT COUNT(*) as count FROM orders 
                WHERE OrderId = ? AND CustomerId = ? AND ItemId = ? AND StoreId = ?
            """, (order_id, customer_id, product_id, store_id))
            is_verified = cursor.fetchone()['count'] > 0
        
        cursor.execute("""
            INSERT INTO reviews (ProductId, StoreId, CustomerId, OrderId, Rating, 
                               ReviewTitle, ReviewText, IsVerifiedPurchase) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (product_id, store_id, customer_id, order_id, rating, review_title, review_text, is_verified))
        
        review_id = cursor.lastrowid
        conn.commit()
        return review_id

def get_product_reviews(product_id, store_id, limit=10, offset=0):
    """Get reviews for a product"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, u.Name as CustomerName 
            FROM reviews r
            JOIN User u ON r.CustomerId = u.UserId
            WHERE r.ProductId = ? AND r.StoreId = ? AND r.IsApproved = 1
            ORDER BY r.DateCreated DESC
            LIMIT ? OFFSET ?
        """, (product_id, store_id, limit, offset))
        return cursor.fetchall()

# CATEGORIES TABLE
def create_categories_table():
    """Create product categories table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Categories';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE Categories (
                    CategoryId INTEGER PRIMARY KEY AUTOINCREMENT,
                    CategoryName TEXT UNIQUE NOT NULL,
                    CategoryNameHindi TEXT,
                    ParentCategoryId INTEGER,
                    Description TEXT,
                    IsActive BOOLEAN DEFAULT 1,
                    SortOrder INTEGER DEFAULT 0,
                    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(CategoryId)
                )
            """)
            conn.commit()
            logger.info("Categories table created successfully")

def insert_default_categories():
    """Insert default product categories"""
    default_categories = [
        ('Electronics', 'इलेक्ट्रॉनिक्स', None, 'Electronic items and gadgets'),
        ('Clothing', 'कपड़े', None, 'Apparel and fashion items'),
        ('Home & Kitchen', 'घर और रसोई', None, 'Home and kitchen essentials'),
        ('Books', 'किताबें', None, 'Books and educational materials'),
        ('Beauty & Personal Care', 'सुंदरता और व्यक्तिगत देखभाल', None, 'Beauty and personal care products'),
        ('Sports & Fitness', 'खेल और फिटनेस', None, 'Sports and fitness equipment'),
        ('Toys & Games', 'खिलौने और गेम्स', None, 'Toys and gaming items'),
        ('Food & Beverages', 'भोजन और पेय', None, 'Food and beverage items'),
        ('Health & Wellness', 'स्वास्थ्य और कल्याण', None, 'Health and wellness products'),
        ('Automotive', 'ऑटोमोटिव', None, 'Vehicle parts and accessories')
    ]
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM Categories")
        if cursor.fetchone()['count'] == 0:
            cursor.executemany("""
                INSERT INTO Categories (CategoryName, CategoryNameHindi, ParentCategoryId, Description) 
                VALUES (?, ?, ?, ?)
            """, default_categories)
            conn.commit()
            logger.info("Default categories inserted")

def get_categories(parent_id=None, include_inactive=False):
    """Get categories with optional parent filter"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Categories WHERE 1=1"
        params = []
        
        if parent_id is not None:
            query += " AND ParentCategoryId = ?"
            params.append(parent_id)
        else:
            query += " AND ParentCategoryId IS NULL"
        
        if not include_inactive:
            query += " AND IsActive = 1"
        
        query += " ORDER BY SortOrder, CategoryName"
        
        cursor.execute(query, params)
        return cursor.fetchall()

# WISHLIST TABLE
def create_wishlist_table():
    """Create wishlist table"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='wishlist';")
        table_exists = cursor.fetchone()
        
        if not table_exists:
            cursor.execute("""
                CREATE TABLE wishlist (
                    WishlistId INTEGER PRIMARY KEY AUTOINCREMENT,
                    CustomerId INTEGER NOT NULL,
                    StoreId INTEGER NOT NULL,
                    ItemId INTEGER NOT NULL,
                    ItemName TEXT NOT NULL,
                    Price DECIMAL(10,2) NOT NULL,
                    DateAdded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (CustomerId) REFERENCES User(UserId),
                    UNIQUE(CustomerId, StoreId, ItemId)
                )
            """)
            conn.commit()
            logger.info("Wishlist table created successfully")

def add_to_wishlist(customer_id, store_id, item_id, item_name, price):
    """Add item to wishlist"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute("""
                INSERT INTO wishlist (CustomerId, StoreId, ItemId, ItemName, Price) 
                VALUES (?, ?, ?, ?, ?)
            """, (customer_id, store_id, item_id, item_name, price))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            # Item already in wishlist
            return False

def remove_from_wishlist(customer_id, store_id, item_id):
    """Remove item from wishlist"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            DELETE FROM wishlist 
            WHERE CustomerId = ? AND StoreId = ? AND ItemId = ?
        """, (customer_id, store_id, item_id))
        conn.commit()
        return cursor.rowcount > 0

def get_user_wishlist(customer_id):
    """Get user's wishlist"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT w.*, s.Image, s.Description 
            FROM wishlist w
            LEFT JOIN Store s ON w.StoreId = s.StoreId AND w.ItemId = s.ItemId
            WHERE w.CustomerId = ?
            ORDER BY w.DateAdded DESC
        """, (customer_id,))
        return cursor.fetchall()

# UTILITY FUNCTIONS
def get_email(customer_id):
    """Get user email by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT Email FROM User WHERE UserId = ?', (customer_id,))
        result = cursor.fetchone()
        return result['Email'] if result else None

def generate_order_id():
    """Generate unique order ID"""
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    random_suffix = uuid.uuid4().hex[:6].upper()
    return f"BS{timestamp}{random_suffix}"

def get_order_summary(order_id):
    """Get comprehensive order summary"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                o.OrderId,
                o.CustomerId,
                u.Name as CustomerName,
                u.Email as CustomerEmail,
                o.OrderStatus,
                o.PaymentStatus,
                o.OrderDate,
                o.DeliveryAddress,
                o.TotalAmount,
                COUNT(o.ItemId) as TotalItems,
                GROUP_CONCAT(o.ItemName, ', ') as ItemNames,
                p.PaymentMethod,
                p.TransactionId
            FROM orders o
            JOIN User u ON o.CustomerId = u.UserId
            LEFT JOIN payments p ON o.OrderId = p.OrderId
            WHERE o.OrderId = ?
            GROUP BY o.OrderId
        """, (order_id,))
        return cursor.fetchone()

def get_dashboard_stats(vendor_id=None):
    """Get dashboard statistics"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        if vendor_id:
            # Vendor-specific stats
            cursor.execute("""
                SELECT 
                    COUNT(DISTINCT o.OrderId) as total_orders,
                    SUM(o.TotalAmount) as total_revenue,
                    COUNT(DISTINCT o.CustomerId) as unique_customers,
                    COUNT(i.ItemId) as total_products,
                    SUM(i.Quantity) as total_inventory
                FROM orders o
                LEFT JOIN inventory i ON o.StoreId = i.StoreId
                WHERE o.StoreId = ?
            """, (vendor_id,))
        else:
            # Admin/global stats
            cursor.execute("""
                SELECT 
                    COUNT(DISTINCT o.OrderId) as total_orders,
                    SUM(o.TotalAmount) as total_revenue,
                    COUNT(DISTINCT o.CustomerId) as unique_customers,
                    COUNT(DISTINCT u.UserId) as total_users,
                    COUNT(DISTINCT s.StoreId) as total_stores
                FROM orders o
                LEFT JOIN User u ON 1=1
                LEFT JOIN Store s ON 1=1
            """)
        
        return cursor.fetchone()

# Legacy functions for backward compatibility
def Check_Valid_User(username, password):
    """Legacy function - check user credentials"""
    user_id = check_email(username)
    if user_id != -1:
        return check_password(user_id, password)
    return False

def Add_User(username, password, user_type):
    """Legacy function - add user"""
    return add_customer_details(username, username, password, user_type)

# Database initialization when module is run directly
if __name__ == "__main__":
    try:
        initialize_database()
        print("Database initialization completed successfully!")
    except Exception as e:
        print(f"Database initialization failed: {e}")