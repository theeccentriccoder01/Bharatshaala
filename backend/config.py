import os
from datetime import timedelta

class Config:
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or '12aj2k4j3lj5nlsklq24534'
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'bharatshaala-jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database Configuration
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///bharatshaala.db'
    
    # API Configuration
    API_VERSION = 'v1'
    API_BASE_URL = f'https://api.bharatshaala.com/{API_VERSION}'
    
    # Razorpay Configuration
    RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID') or 'rzp_test_BXNSan3NdLPrPa'
    RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET') or 'jQLMopwxI1FrtqnrHg3j9e3R'
    
    # Upload Configuration
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Email Configuration (for notifications)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    
    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # Application Settings
    SHIPPING_COST = 100
    CURRENCY = 'INR'

    #Redis connection
    RATELIMIT_STORAGE_URI = os.environ.get('REDIS_URL', "memory://")
    RATELIMIT_DEFAULT = ["200 per day", "50 per hour"]
    RATELIMIT_STRATEGY = 'fixed-window'
    RATELIMIT_KEY_PREFIX = "rate_limit"
    RATELIMIT_HEADERS_ENABLED = True

    #Rate Limits
    LIMIT_AUTH = "5 per 15 minutes"
    LIMIT_READ_ADMIN = "60 per minute"
    LIMIT_WRITE_ADMIN = "20 per minute"
    LIMIT_READ_BASE = "20 per minute"
    LIMIT_WRITE_BASE = "5 per minute"
    LIMIT_READ_CART= "50 per minute"
    LIMIT_WRITE_CART = "20 per minute"
    LIMIT_ORDERS_PAYMENT= "5 per minute"
    LIMIT_ORDERS_READ_ORDER= "60 per minute"
    LIMIT_ORDERS_WRITE_ORDER= "10 per minute"
    LIMIT_READ_PRODUCTS= "100 per minute"
    LIMIT_SEARCH_PRODUCTS= "2 per second"
    LIMIT_WRITE_PRODUCTS= "5 per minute"
    LIMIT_READ_VENDOR= "60 per minute"
    LIMIT_WRITE_VENDOR= "20 per minute"