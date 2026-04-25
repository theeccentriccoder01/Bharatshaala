#!/usr/bin/env python
"""
Flask Development Server Entry Point
Run with: python run.py
"""
import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables from .env file (if it exists)
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add backend directory to path for imports
backend_path = os.path.dirname(os.path.abspath(__file__))
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from base import create_app

if __name__ == '__main__':
    try:
        app = create_app()
        port = int(os.environ.get('FLASK_PORT', 5000))
        debug = os.environ.get('FLASK_ENV') == 'development'
        
        logger.info(f"Starting Flask server on port {port}")
        logger.info(f"Debug mode: {debug}")
        logger.info(f"CORS Origins: {app.config.get('CORS_ORIGINS')}")
        logger.info(f"Redis URI: {app.config.get('RATELIMIT_STORAGE_URI')}")
        
        app.run(
            host='0.0.0.0',
            port=port,
            debug=debug,
            use_reloader=debug
        )
    except Exception as e:
        logger.error(f"Failed to start Flask server: {e}", exc_info=True)
        sys.exit(1)
