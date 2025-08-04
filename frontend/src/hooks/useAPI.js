import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Custom hook for API calls
export const useAPI = () => {
  const { user, logout } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Setup request interceptor
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken') || localStorage.getItem('vendorToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => {
        // Log response time
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        console.log(`API Call: ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
        
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
          showError('सत्र समाप्त हो गया। कृपया पुनः लॉगिन करें।');
        } else if (error.response?.status === 403) {
          showError('आपको इस संसाधन तक पहुंचने की अनुमति नहीं है।');
        } else if (error.response?.status >= 500) {
          showError('सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।');
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, showError]);

  // Generic API call function
  const apiCall = useCallback(async (config) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient(config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'API कॉल में त्रुटि';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Convenience methods
  const get = useCallback((url, config = {}) => {
    return apiCall({ method: 'GET', url, ...config });
  }, [apiCall]);

  const post = useCallback((url, data, config = {}) => {
    return apiCall({ method: 'POST', url, data, ...config });
  }, [apiCall]);

  const put = useCallback((url, data, config = {}) => {
    return apiCall({ method: 'PUT', url, data, ...config });
  }, [apiCall]);

  const patch = useCallback((url, data, config = {}) => {
    return apiCall({ method: 'PATCH', url, data, ...config });
  }, [apiCall]);

  const del = useCallback((url, config = {}) => {
    return apiCall({ method: 'DELETE', url, ...config });
  }, [apiCall]);

  // File upload with progress
  const uploadFile = useCallback(async (url, file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiCall({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(progress);
      }
    });
  }, [apiCall]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,
    apiCall
  };
};

// Specific API hooks for common operations
export const useProducts = () => {
  const { get, post, put, delete: del } = useAPI();

  const getProducts = useCallback((params = {}) => {
    return get('/products', { params });
  }, [get]);

  const getProduct = useCallback((id) => {
    return get(`/products/${id}`);
  }, [get]);

  const createProduct = useCallback((productData) => {
    return post('/products', productData);
  }, [post]);

  const updateProduct = useCallback((id, productData) => {
    return put(`/products/${id}`, productData);
  }, [put]);

  const deleteProduct = useCallback((id) => {
    return del(`/products/${id}`);
  }, [del]);

  const searchProducts = useCallback((query, filters = {}) => {
    return get('/products/search', { params: { q: query, ...filters } });
  }, [get]);

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  };
};

export const useOrders = () => {
  const { get, post, put } = useAPI();

  const getOrders = useCallback((params = {}) => {
    return get('/orders', { params });
  }, [get]);

  const getOrder = useCallback((id) => {
    return get(`/orders/${id}`);
  }, [get]);

  const createOrder = useCallback((orderData) => {
    return post('/orders', orderData);
  }, [post]);

  const updateOrderStatus = useCallback((id, status) => {
    return put(`/orders/${id}/status`, { status });
  }, [put]);

  const trackOrder = useCallback((id) => {
    return get(`/orders/${id}/track`);
  }, [get]);

  return {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    trackOrder
  };
};

export const useVendor = () => {
  const { get, post, put } = useAPI();

  const getVendorProfile = useCallback(() => {
    return get('/vendor/profile');
  }, [get]);

  const updateVendorProfile = useCallback((profileData) => {
    return put('/vendor/profile', profileData);
  }, [put]);

  const getVendorAnalytics = useCallback((period = 'last_30_days') => {
    return get('/vendor/analytics', { params: { period } });
  }, [get]);

  const getVendorOrders = useCallback((params = {}) => {
    return get('/vendor/orders', { params });
  }, [get]);

  const getVendorProducts = useCallback((params = {}) => {
    return get('/vendor/products', { params });
  }, [get]);

  return {
    getVendorProfile,
    updateVendorProfile,
    getVendorAnalytics,
    getVendorOrders,
    getVendorProducts
  };
};

export default useAPI;