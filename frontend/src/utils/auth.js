// Authentication Utility Service - Bharatshala Platform
import { storageService } from './storage';

const TOKEN_KEY = 'bharatshala_token';
const REFRESH_TOKEN_KEY = 'bharatshala_refresh_token';
const USER_KEY = 'bharatshala_user';

class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.bharatshala.com/v1';
    this.isAuthenticated = this.checkAuthState();
    this.user = this.getUser();
  }

  // Check if user is authenticated
  checkAuthState() {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get stored token
  getToken() {
    return storageService.getItem(TOKEN_KEY);
  }

  // Get stored refresh token
  getRefreshToken() {
    return storageService.getItem(REFRESH_TOKEN_KEY);
  }

  // Get stored user data
  getUser() {
    const userData = storageService.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Set token in storage
  setToken(token) {
    storageService.setItem(TOKEN_KEY, token);
  }

  // Set refresh token in storage
  setRefreshToken(refreshToken) {
    storageService.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  // Set user data in storage
  setUser(user) {
    storageService.setItem(USER_KEY, JSON.stringify(user));
    this.user = user;
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store tokens and user data
      this.setToken(data.token);
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }
      this.setUser(data.user);
      this.isAuthenticated = true;

      // Track login event
      this.trackEvent('user_login', {
        userId: data.user.id,
        method: 'email'
      });

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto-login after registration
      if (data.token) {
        this.setToken(data.token);
        if (data.refreshToken) {
          this.setRefreshToken(data.refreshToken);
        }
        this.setUser(data.user);
        this.isAuthenticated = true;
      }

      // Track registration event
      this.trackEvent('user_register', {
        userId: data.user.id,
        method: 'email'
      });

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Logout user
  async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        // Call logout API to invalidate token
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call success
      this.clearAuthData();
      
      // Track logout event
      this.trackEvent('user_logout');
    }
  }

  // Clear authentication data
  clearAuthData() {
    storageService.removeItem(TOKEN_KEY);
    storageService.removeItem(REFRESH_TOKEN_KEY);
    storageService.removeItem(USER_KEY);
    this.isAuthenticated = false;
    this.user = null;
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update stored token
      this.setToken(data.token);
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }

      return {
        success: true,
        token: data.token
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      this.logout();
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Change password (authenticated user)
  async changePassword(currentPassword, newPassword) {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseURL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update stored user data
      this.setUser(data.user);

      return {
        success: true,
        user: data.user
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email verification failed');
      }

      // Update user data if logged in
      if (this.isAuthenticated && data.user) {
        this.setUser(data.user);
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail() {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseURL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Social login (Google, Facebook, etc.)
  async socialLogin(provider, token) {
    try {
      const response = await fetch(`${this.baseURL}/auth/social/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Social login failed');
      }

      // Store tokens and user data
      this.setToken(data.token);
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }
      this.setUser(data.user);
      this.isAuthenticated = true;

      // Track social login event
      this.trackEvent('user_login', {
        userId: data.user.id,
        method: provider
      });

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Social login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check if token is expired
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Get user role
  getUserRole() {
    return this.user?.role || 'user';
  }

  // Check if user has specific role
  hasRole(role) {
    return this.getUserRole() === role;
  }

  // Check if user has permission
  hasPermission(permission) {
    const userPermissions = this.user?.permissions || [];
    return userPermissions.includes(permission);
  }

  // Track analytics event
  trackEvent(event, properties = {}) {
    // Integration with analytics service
    if (window.gtag) {
      window.gtag('event', event, properties);
    }
    
    // Custom analytics implementation
    if (window.analytics) {
      window.analytics.track(event, properties);
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export { authService };

// Export class for testing
export default AuthService;