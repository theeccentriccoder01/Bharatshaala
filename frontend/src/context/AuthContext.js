import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  accountType: null, // 'customer' or 'vendor'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        accountType: action.payload.accountType
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        accountType: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        accountType: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('vendorToken');
      if (!token) {
        dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/auth/me');
      
      if (response.data.success) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: {
            user: response.data.user,
            accountType: response.data.accountType
          }
        });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('vendorToken');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user, accountType } = response.data;
        
        // Store token based on account type
        if (accountType === 'vendor') {
          localStorage.setItem('vendorToken', token);
        } else {
          localStorage.setItem('authToken', token);
        }
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, accountType }
        });

        return { success: true, accountType };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'लॉगिन में त्रुटि';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await axios.post('/auth/signup', userData);
      
      if (response.data.success) {
        return { success: true, message: 'खाता सफलतापूर्वक बनाया गया' };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'साइन अप में त्रुटि';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('vendorToken');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      
      if (response.data.success) {
        dispatch({ type: 'UPDATE_USER', payload: response.data.user });
        return { success: true, message: 'प्रोफाइल अपडेट हो गई' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: 'प्रोफाइल अपडेट में त्रुटि' };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await axios.put('/auth/change-password', passwordData);
      
      if (response.data.success) {
        return { success: true, message: 'पासवर्ड सफलतापूर्वक बदला गया' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: 'पासवर्ड बदलने में त्रुटि' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        return { success: true, message: 'पासवर्ड रीसेट लिंक ईमेल पर भेजा गया' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: 'ईमेल भेजने में त्रुटि' };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post('/auth/reset-password', { token, newPassword });
      
      if (response.data.success) {
        return { success: true, message: 'पासवर्ड सफलतापूर्वक रीसेट हो गया' };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: 'पासवर्ड रीसेट में त्रुटि' };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    accountType: state.accountType,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;