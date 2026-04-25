from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy
from .config import Config

# Initialize Rate Limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    strategy="moving-window"
)

# Initialize SQLAlchemy ORM
db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    with app.app_context():
        # Import models to ensure they're registered
        from . import models
        # Create all tables
        db.create_all()
