import time
import unittest
import os
from backend.base import create_app
from backend.config import Config

class TestRateLimitConfiguration(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['RATELIMIT_ENABLED'] = True
        self.client = self.app.test_client()
        from backend.extensions import limiter
        limiter._storage.reset()

    def tearDown(self):
        pass
    def test_auth_login_limit(self):
        response=self.client.post('/v1/auth/login')
        limit=int(response.headers.get('X-RateLimit-Limit'))
        for i in range(limit-1):
            response = self.client.post('/v1/auth/login')
            self.assertEqual(response.headers.get('X-RateLimit-Remaining'), str(limit-2-i))
            self.assertNotEqual(response.status_code, 429)
        response = self.client.post('/v1/auth/login')
        self.assertEqual(response.status_code, 429)
        self.assertIn('Retry-After',response.headers)
    def test_rate_limit_ip_isolation(self):
        response = self.client.post('/v1/auth/login')
        limit = int(response.headers.get('X-RateLimit-Limit'))
        for _ in range(limit+1):
            response_a=self.client.post('/v1/auth/login',environ_base={'REMOTE_ADDR': '192.168.1.100'})
        self.assertEqual(response_a.status_code, 429, "User A should be blocked")
        response_b = self.client.post('/v1/auth/login', environ_base={'REMOTE_ADDR': '10.0.0.5'})
        self.assertNotEqual(response_b.status_code, 429, "User B should NOT be blocked by User A's actions")
    def test_rate_limit_recovery(self):
        response=self.client.get('/v1/products/search')
        limit=int(response.headers.get('X-RateLimit-Remaining'))
        while(limit>0):
            self.client.get('/v1/products/search')
            limit=limit-1
        blocked_response = self.client.get('/v1/products/search')
        self.assertEqual(blocked_response.status_code, 429)
        retryafter_time=int(blocked_response.headers.get('Retry-After'))

        time.sleep(retryafter_time)


        recovery_response = self.client.get('/v1/products/search')
        self.assertNotEqual(recovery_response.status_code, 429, "User should be unblocked after timeout")

