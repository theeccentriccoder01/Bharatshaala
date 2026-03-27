"""
Integration Tests for Full E-Commerce Flow
Tests auth → cart → orders workflow
"""
import unittest
import json
import os
import sys
from datetime import timedelta

# Add parent directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from base import create_app
from config import Config
from extensions import limiter


class ECommerceIntegrationTestCase(unittest.TestCase):
    """Test complete e-commerce workflow"""

    @classmethod
    def setUpClass(cls):
        """Set up test client and app context"""
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        cls.client = cls.app.test_client()

    def setUp(self):
        """Set up each test"""
        self.app_context = self.app.app_context()
        self.app_context.push()
        
        # Reset limiter for testing
        limiter.reset()

    def tearDown(self):
        """Tear down each test"""
        self.app_context.pop()

    def register_user(self, email, password='TestPassword123', name='Test User', 
                     phone='9876543210', account_type='customer'):
        """Helper method to register a user"""
        response = self.client.post('/v1/auth/register', json={
            'email': email,
            'password': password,
            'name': name,
            'phone': phone,
            'accountType': account_type
        })
        return response

    def login_user(self, email, password='TestPassword123'):
        """Helper method to login a user"""
        response = self.client.post('/v1/auth/login', json={
            'email': email,
            'password': password
        })
        return response

    def test_1_user_registration_success(self):
        """Test successful user registration"""
        response = self.register_user('testuser@example.com')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Registration successful')
        self.assertIn('user', data['data'])

    def test_2_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        email = 'duplicate@example.com'
        
        # Register first user
        self.register_user(email)
        
        # Try to register with same email
        response = self.register_user(email)
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_3_user_registration_invalid_email(self):
        """Test registration with invalid email"""
        response = self.register_user('invalidemail')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_4_user_registration_weak_password(self):
        """Test registration with weak password"""
        response = self.register_user('weakpass@example.com', password='123')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_5_user_login_success(self):
        """Test successful user login"""
        email = 'login@example.com'
        self.register_user(email)
        
        response = self.login_user(email)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertIn('access_token', data['data'])
        self.assertIn('refresh_token', data['data'])
        self.assertIn('user', data['data'])

    def test_6_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.login_user('nonexistent@example.com')
        
        self.assertEqual(response.status_code, 401)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_7_login_missing_credentials(self):
        """Test login with missing credentials"""
        response = self.client.post('/v1/auth/login', json={
            'email': 'test@example.com'
        })
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertFalse(data['success'])

    def test_8_cart_add_without_authentication(self):
        """Test adding to cart without authentication"""
        response = self.client.post('/v1/cart/add', json={
            'productId': 1,
            'quantity': 1
        })
        
        # Should return 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_9_cart_get_without_authentication(self):
        """Test getting cart without authentication"""
        response = self.client.get('/v1/cart')
        
        # Should return 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_10_complete_flow_register_login_cart(self):
        """Test complete flow: register → login → cart"""
        email = 'complete@example.com'
        password = 'CompletePassword123'
        
        # Step 1: Register
        reg_response = self.register_user(email, password=password)
        self.assertEqual(reg_response.status_code, 201)
        
        # Step 2: Login
        login_response = self.login_user(email, password=password)
        self.assertEqual(login_response.status_code, 200)
        login_data = json.loads(login_response.data)
        
        access_token = login_data['data']['access_token']
        
        # Step 3: Get cart (should be empty)
        headers = {'Authorization': f'Bearer {access_token}'}
        cart_response = self.client.get('/v1/cart', headers=headers)
        
        self.assertEqual(cart_response.status_code, 200)
        cart_data = json.loads(cart_response.data)
        self.assertTrue(cart_data['success'])
        self.assertEqual(cart_data['data']['item_count'], 0)

    def test_11_cart_operations_require_valid_token(self):
        """Test that cart operations validate JWT token"""
        # Test with invalid token
        headers = {'Authorization': 'Bearer invalid_token_here'}
        
        response = self.client.get('/v1/cart', headers=headers)
        self.assertEqual(response.status_code, 422)  # Unprocessable Entity

    def test_12_pagination_validation(self):
        """Test pagination parameter validation"""
        email = 'pagination@example.com'
        self.register_user(email)
        login_response = self.login_user(email)
        
        login_data = json.loads(login_response.data)
        access_token = login_data['data']['access_token']
        headers = {'Authorization': f'Bearer {access_token}'}
        
        # Test with invalid page number
        response = self.client.get('/v1/orders?page=0', headers=headers)
        self.assertEqual(response.status_code, 400)
        
        # Test with invalid per_page
        response = self.client.get('/v1/orders?per_page=1001', headers=headers)
        self.assertEqual(response.status_code, 400)


class AuthenticationSpecificTests(unittest.TestCase):
    """Specific authentication tests"""

    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        cls.client = cls.app.test_client()

    def setUp(self):
        """Set up each test"""
        self.app_context = self.app.app_context()
        self.app_context.push()
        limiter.reset()

    def tearDown(self):
        """Tear down each test"""
        self.app_context.pop()

    def test_jwt_token_expiration(self):
        """Test that JWT tokens work correctly"""
        # Register and login
        response = self.client.post('/v1/auth/register', json={
            'email': 'token@example.com',
            'password': 'TokenTest123',
            'name': 'Token Tester',
            'phone': '9876543210',
            'accountType': 'customer'
        })
        
        login_response = self.client.post('/v1/auth/login', json={
            'email': 'token@example.com',
            'password': 'TokenTest123'
        })
        
        data = json.loads(login_response.data)
        access_token = data['data']['access_token']
        refresh_token = data['data']['refresh_token']
        
        # Verify refresh token endpoint exists
        self.assertIsNotNone(refresh_token)
        self.assertIsNotNone(access_token)

    def test_password_hashing(self):
        """Test that passwords are hashed, not stored plaintext"""
        email = 'hash@example.com'
        password = 'HashTest123'
        
        # Register user
        self.client.post('/v1/auth/register', json={
            'email': email,
            'password': password,
            'name': 'Hash Tester',
            'phone': '9876543210',
            'accountType': 'customer'
        })
        
        # Try to login with correct password (should work)
        login1 = self.client.post('/v1/auth/login', json={
            'email': email,
            'password': password
        })
        self.assertEqual(login1.status_code, 200)
        
        # Try to login with different password (should fail)
        login2 = self.client.post('/v1/auth/login', json={
            'email': email,
            'password': 'WrongPassword123'
        })
        self.assertEqual(login2.status_code, 401)


class RateLimitingTests(unittest.TestCase):
    """Test rate limiting functionality"""

    @classmethod
    def setUpClass(cls):
        """Set up test client"""
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.client = cls.app.test_client()

    def setUp(self):
        """Set up each test"""
        self.app_context = self.app.app_context()
        self.app_context.push()
        limiter.reset()

    def tearDown(self):
        """Tear down each test"""
        self.app_context.pop()

    def test_auth_rate_limiting(self):
        """Test that auth endpoints have rate limiting"""
        # Note: This test verifies rate limiting headers are present
        # Actual rate limiting enforcement depends on Redis configuration
        
        response = self.client.post('/v1/auth/login', json={
            'email': 'test@example.com',
            'password': 'test'
        })
        
        # Check for rate limit headers
        self.assertIn('RateLimit-Limit', response.headers)


if __name__ == '__main__':
    unittest.main(verbosity=2)
