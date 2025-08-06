// Comprehensive Authentication Hook for Bharatshaala Platform
import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../utils/api';
import { useAnalytics } from '../utils/analytics';
import { storageService } from '../utils/storage';
import config from '../utils/constants';
import { useNotification } from './useNotification';

// Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = getStoredToken();
      const storedUser = getStoredUser();
      
      if (!token || !storedUser) {
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      // Verify token with server
      const response = await apiService.get('/auth/verify');
      if (response.success && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Update stored user data
        storeUser(response.data.user);
        
        // Track authentication
        trackEvent('user_authenticated', {
          userId: response.data.user.id,
          userType: response.data.user.role,
          method: 'token_verification'
        });
      } else {
        // Token invalid, clear auth data
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  }, [trackEvent]);

  const checkTokenExpiry = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return;

    try {
      // Decode token to check expiry (assuming JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpiry = payload.exp - currentTime;

      // If token expires within threshold, refresh it
      if (timeToExpiry <= config.auth.autoRefreshThreshold / 1000) {
        await refreshToken();
      }
    } catch (error) {
      console.error('Token expiry check failed:', error);
      logout();
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Check for token expiry
  useEffect(() => {
    if (isAuthenticated && user) {
      const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, checkTokenExpiry]);

  // Check lockout status
  useEffect(() => {
    checkLockoutStatus();
  }, []);

  const checkLockoutStatus = () => {
    const lockoutData = localStorage.getItem('auth_lockout');
    if (lockoutData) {
      const { endTime, attempts } = JSON.parse(lockoutData);
      const now = Date.now();
      
      if (now < endTime) {
        setIsLocked(true);
        setLockoutEndTime(endTime);
        setLoginAttempts(attempts);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('auth_lockout');
        setLoginAttempts(0);
      }
    }
  };

  const login = useCallback(async (credentials, options = {}) => {
    try {
      // Check if account is locked
      if (isLocked) {
        const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 60000);
        throw new Error(`खाता ${remainingTime} मिनट के लिए लॉक है। कृपया बाद में पुनः प्रयास करें।`);
      }

      setLoading(true);

      const response = await apiService.post('/auth/login', {
        ...credentials,
        rememberMe: options.rememberMe || false,
        deviceInfo: getDeviceInfo()
      });

      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;

        // Store tokens
        storeToken(accessToken);
        if (refreshToken) {
          storeRefreshToken(refreshToken);
        }

        // Store user data
        storeUser(userData);

        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        setLoginAttempts(0);
        setIsLocked(false);
        
        // Clear lockout data
        localStorage.removeItem('auth_lockout');

        // Track successful login
        trackEvent('user_login', {
          userId: userData.id,
          userType: userData.role,
          method: credentials.email ? 'email' : 'phone',
          rememberMe: options.rememberMe
        });

        showSuccess(`स्वागत है, ${userData.name}!`);

        // Redirect based on user role
        const redirectPath = getRedirectPath(userData.role, options.redirectTo);
        if (redirectPath) {
          navigate(redirectPath);
        }

        return { success: true, user: userData };
      } else {
        throw new Error(response.error || 'लॉगिन में त्रुटि');
      }
    } catch (error) {
      // Handle login attempts and lockout
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= config.auth.maxLoginAttempts) {
        const lockoutEnd = Date.now() + config.auth.lockoutDuration;
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);
        
        localStorage.setItem('auth_lockout', JSON.stringify({
          endTime: lockoutEnd,
          attempts: newAttempts
        }));

        trackEvent('account_locked', {
          attempts: newAttempts,
          lockoutDuration: config.auth.lockoutDuration
        });

        showError(`अधिक गलत प्रयासों के कारण खाता लॉक हो गया है। ${Math.ceil(config.auth.lockoutDuration / 60000)} मिनट बाद पुनः प्रयास करें।`);
      } else {
        const remainingAttempts = config.auth.maxLoginAttempts - newAttempts;
        showError(`${error.message} (${remainingAttempts} प्रयास बचे हैं)`);
      }

      trackEvent('login_failed', {
        error: error.message,
        attempts: newAttempts
      });

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [isLocked, lockoutEndTime, loginAttempts, showSuccess, showError, trackEvent, navigate]);

  const register = async (userData, options = {}) => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/register', {
        ...userData,
        deviceInfo: getDeviceInfo(),
        referralCode: options.referralCode
      });

      if (response.success && response.data) {
        const { user: newUser, accessToken, refreshToken, requiresVerification } = response.data;

        if (requiresVerification) {
          trackEvent('user_registration_pending', {
            userId: newUser.id,
            userType: newUser.role,
            method: userData.email ? 'email' : 'phone'
          });

          showSuccess('खाता बनाया गया! कृपया अपना ईमेल/फोन वेरिफाई करें।');
          return { success: true, requiresVerification: true, user: newUser };
        }

        // Auto-login after registration
        storeToken(accessToken);
        if (refreshToken) {
          storeRefreshToken(refreshToken);
        }
        storeUser(newUser);

        setUser(newUser);
        setIsAuthenticated(true);

        trackEvent('user_registration_complete', {
          userId: newUser.id,
          userType: newUser.role,
          method: userData.email ? 'email' : 'phone'
        });

        showSuccess(`स्वागत है, ${newUser.name}! आपका खाता सफलतापूर्वक बनाया गया।`);

        // Redirect based on user role
        const redirectPath = getRedirectPath(newUser.role, options.redirectTo);
        if (redirectPath) {
          navigate(redirectPath);
        }

        return { success: true, user: newUser };
      } else {
        throw new Error(response.error || 'खाता बनाने में त्रुटि');
      }
    } catch (error) {
      trackEvent('registration_failed', {
        error: error.message
      });

      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async (options = {}) => {
    try {
      setLoading(true);

      // Notify server about logout
      if (isAuthenticated) {
        try {
          await apiService.post('/auth/logout');
        } catch (error) {
          console.error('Server logout failed:', error);
        }
      }

      // Track logout
      if (user) {
        trackEvent('user_logout', {
          userId: user.id,
          userType: user.role,
          method: options.method || 'manual'
        });
      }

      // Clear auth data
      clearAuthData();

      // Update state
      setUser(null);
      setIsAuthenticated(false);

      showSuccess('सफलतापूर्वक लॉगआउट हो गए।');

      // Redirect to login or home
      if (options.redirectTo) {
        navigate(options.redirectTo);
      } else if (options.redirectToLogin) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, navigate, showSuccess, trackEvent]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue = getStoredRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/refresh', {
        refreshToken: refreshTokenValue
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken, user: updatedUser } = response.data;

        storeToken(accessToken);
        if (newRefreshToken) {
          storeRefreshToken(newRefreshToken);
        }
        if (updatedUser) {
          storeUser(updatedUser);
          setUser(updatedUser);
        }

        trackEvent('token_refreshed', {
          userId: user?.id
        });

        return accessToken;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout({ method: 'token_expired' });
      throw error;
    }
  }, [user?.id, trackEvent, logout]);

  const updateProfile = async (updateData) => {
    try {
      setLoading(true);

      const response = await apiService.put('/auth/profile', updateData);

      if (response.success && response.data) {
        const updatedUser = response.data.user;
        
        setUser(updatedUser);
        storeUser(updatedUser);

        trackEvent('profile_updated', {
          userId: updatedUser.id,
          fields: Object.keys(updateData)
        });

        showSuccess('प्रोफाइल अपडेट हो गई!');
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.error || 'प्रोफाइल अपडेट में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.success) {
        trackEvent('password_changed', {
          userId: user.id
        });

        showSuccess('पासवर्ड सफलतापूर्वक बदला गया!');
        return { success: true };
      } else {
        throw new Error(response.error || 'पासवर्ड बदलने में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (identifier) => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/forgot-password', {
        identifier // email or phone
      });

      if (response.success) {
        trackEvent('password_reset_requested', {
          method: identifier.includes('@') ? 'email' : 'phone'
        });

        showSuccess('पासवर्ड रीसेट लिंक भेजा गया है।');
        return { success: true };
      } else {
        throw new Error(response.error || 'पासवर्ड रीसेट में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/reset-password', {
        token,
        newPassword
      });

      if (response.success) {
        trackEvent('password_reset_completed');

        showSuccess('पासवर्ड सफलतापूर्वक रीसेट हो गया!');
        navigate('/login');
        return { success: true };
      } else {
        throw new Error(response.error || 'पासवर्ड रीसेट में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async (token, type = 'email') => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/verify', {
        token,
        type
      });

      if (response.success) {
        trackEvent('account_verified', {
          method: type
        });

        showSuccess('खाता सफलतापूर्वक वेरिफाई हो गया!');
        
        // If user data is returned, update it
        if (response.data?.user) {
          setUser(response.data.user);
          storeUser(response.data.user);
        }

        return { success: true };
      } else {
        throw new Error(response.error || 'वेरिफिकेशन में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (type = 'email') => {
    try {
      setLoading(true);

      const response = await apiService.post('/auth/resend-verification', {
        type
      });

      if (response.success) {
        trackEvent('verification_resent', {
          method: type
        });

        showSuccess('वेरिफिकेशन लिंक दोबारा भेजा गया है।');
        return { success: true };
      } else {
        throw new Error(response.error || 'वेरिफिकेशन भेजने में त्रुटि');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getStoredToken = () => {
    return localStorage.getItem(config.auth.tokenKey) || 
           sessionStorage.getItem(config.auth.tokenKey);
  };

  const getStoredRefreshToken = () => {
    return localStorage.getItem(config.auth.refreshTokenKey) || 
           sessionStorage.getItem(config.auth.refreshTokenKey);
  };

  const getStoredUser = () => {
    try {
      const userData = localStorage.getItem(config.auth.userKey) || 
                      sessionStorage.getItem(config.auth.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const storeToken = (token, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(config.auth.tokenKey, token);
  };

  const storeRefreshToken = (token, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(config.auth.refreshTokenKey, token);
  };

  const storeUser = (userData, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(config.auth.userKey, JSON.stringify(userData));
  };

  const clearAuthData = () => {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
    localStorage.removeItem(config.auth.userKey);
    sessionStorage.removeItem(config.auth.tokenKey);
    sessionStorage.removeItem(config.auth.refreshTokenKey);
    sessionStorage.removeItem(config.auth.userKey);
  };

  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${window.screen.width}x${window.screen.height}`,
      timestamp: new Date().toISOString()
    };
  };

  const getRedirectPath = (userRole, customRedirect) => {
    if (customRedirect) return customRedirect;
    
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'customer':
      default:
        return '/';
    }
  };

  // Permission checking
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const isAdmin = () => hasRole('admin');
  const isVendor = () => hasRole('vendor');
  const isCustomer = () => hasRole('customer');

  const value = {
    // State
    user,
    loading,
    isAuthenticated,
    authChecked,
    loginAttempts,
    isLocked,
    lockoutEndTime,

    // Actions
    login,
    logout,
    register,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyAccount,
    resendVerification,
    refreshToken,

    // Utilities
    hasPermission,
    hasRole,
    isAdmin,
    isVendor,
    isCustomer,
    getStoredToken,
    clearAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;