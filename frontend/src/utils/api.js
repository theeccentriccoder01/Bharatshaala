// API Utility Service - Bharatshala Platform
import { authService } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.bharatshala.com/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Get authorization header
  getAuthHeader() {
    const token = authService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        pagination: data.pagination,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  }

  // Specific API methods

  // Authentication
  async login(credentials) {
    return this.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async refreshToken() {
    return this.post('/auth/refresh');
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return this.post('/auth/reset-password', { token, password });
  }

  // User management
  async getProfile() {
    return this.get('/user/profile');
  }

  async updateProfile(userData) {
    return this.put('/user/profile', userData);
  }

  async changePassword(passwords) {
    return this.post('/user/change-password', passwords);
  }

  // Products
  async getProducts(params = {}) {
    return this.get('/products', params);
  }

  async getProduct(id) {
    return this.get(`/products/${id}`);
  }

  async searchProducts(query, filters = {}) {
    return this.get('/products/search', { query, ...filters });
  }

  // Categories
  async getCategories() {
    return this.get('/categories');
  }

  async getCategoryProducts(categoryId, params = {}) {
    return this.get(`/categories/${categoryId}/products`, params);
  }

  // Markets
  async getMarkets() {
    return this.get('/markets');
  }

  async getMarket(id) {
    return this.get(`/markets/${id}`);
  }

  async getMarketProducts(marketId, params = {}) {
    return this.get(`/markets/${marketId}/products`, params);
  }

  // Cart
  async getCart() {
    return this.get('/cart');
  }

  async addToCart(productId, quantity = 1, options = {}) {
    return this.post('/cart/add', { productId, quantity, ...options });
  }

  async updateCartItem(itemId, quantity) {
    return this.put(`/cart/items/${itemId}`, { quantity });
  }

  async removeFromCart(itemId) {
    return this.delete(`/cart/items/${itemId}`);
  }

  async clearCart() {
    return this.delete('/cart');
  }

  // Wishlist
  async getWishlist() {
    return this.get('/wishlist');
  }

  async addToWishlist(productId) {
    return this.post('/wishlist/add', { productId });
  }

  async removeFromWishlist(productId) {
    return this.delete(`/wishlist/${productId}`);
  }

  // Orders
  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  async getOrder(id) {
    return this.get(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  async cancelOrder(id, reason) {
    return this.post(`/orders/${id}/cancel`, { reason });
  }

  async trackOrder(id) {
    return this.get(`/orders/${id}/tracking`);
  }

  // Payments
  async initiatePayment(orderData) {
    return this.post('/payments/initiate', orderData);
  }

  async verifyPayment(paymentData) {
    return this.post('/payments/verify', paymentData);
  }

  // Addresses
  async getAddresses() {
    return this.get('/user/addresses');
  }

  async addAddress(addressData) {
    return this.post('/user/addresses', addressData);
  }

  async updateAddress(id, addressData) {
    return this.put(`/user/addresses/${id}`, addressData);
  }

  async deleteAddress(id) {
    return this.delete(`/user/addresses/${id}`);
  }

  // Reviews
  async getProductReviews(productId, params = {}) {
    return this.get(`/products/${productId}/reviews`, params);
  }

  async addReview(productId, reviewData) {
    return this.post(`/products/${productId}/reviews`, reviewData);
  }

  async updateReview(reviewId, reviewData) {
    return this.put(`/reviews/${reviewId}`, reviewData);
  }

  async deleteReview(reviewId) {
    return this.delete(`/reviews/${reviewId}`);
  }

  // Vendor APIs
  async getVendorProducts(params = {}) {
    return this.get('/vendor/products', params);
  }

  async addVendorProduct(productData) {
    return this.post('/vendor/products', productData);
  }

  async updateVendorProduct(id, productData) {
    return this.put(`/vendor/products/${id}`, productData);
  }

  async deleteVendorProduct(id) {
    return this.delete(`/vendor/products/${id}`);
  }

  async getVendorOrders(params = {}) {
    return this.get('/vendor/orders', params);
  }

  async updateOrderStatus(orderId, status) {
    return this.patch(`/vendor/orders/${orderId}/status`, { status });
  }

  // Analytics
  async getVendorAnalytics(params = {}) {
    return this.get('/vendor/analytics', params);
  }

  async getUserAnalytics(params = {}) {
    return this.get('/user/analytics', params);
  }

  // Support
  async createSupportTicket(ticketData) {
    return this.post('/support/tickets', ticketData);
  }

  async getSupportTickets(params = {}) {
    return this.get('/support/tickets', params);
  }

  async updateSupportTicket(id, updateData) {
    return this.patch(`/support/tickets/${id}`, updateData);
  }

  // Blog
  async getBlogPosts(params = {}) {
    return this.get('/blog/posts', params);
  }

  async getBlogPost(id) {
    return this.get(`/blog/posts/${id}`);
  }

  // Notifications
  async getNotifications(params = {}) {
    return this.get('/notifications', params);
  }

  async markNotificationRead(id) {
    return this.patch(`/notifications/${id}/read`);
  }

  async markAllNotificationsRead() {
    return this.patch('/notifications/read-all');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export class for testing
export { ApiService };