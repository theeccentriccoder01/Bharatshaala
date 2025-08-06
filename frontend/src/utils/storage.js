// Storage Utility Service - Bharatshala Platform

class StorageService {
  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
    this.isSessionStorageAvailable = this.checkSessionStorageAvailability();
  }

  // Check if localStorage is available
  checkLocalStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Check if sessionStorage is available
  checkSessionStorageAvailability() {
    try {
      const test = '__storage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // LocalStorage methods
  setItem(key, value, options = {}) {
    try {
      if (!this.isLocalStorageAvailable) {
        console.warn('LocalStorage is not available');
        return false;
      }

      const item = {
        value: value,
        timestamp: Date.now(),
        ttl: options.ttl || null // Time to live in milliseconds
      };

      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (!this.isLocalStorageAvailable) {
        return defaultValue;
      }

      const itemString = localStorage.getItem(key);
      if (!itemString) {
        return defaultValue;
      }

      const item = JSON.parse(itemString);
      
      // Check if item has expired
      if (item.ttl && (Date.now() - item.timestamp > item.ttl)) {
        this.removeItem(key);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      if (!this.isLocalStorageAvailable) {
        return false;
      }

      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  clear() {
    try {
      if (!this.isLocalStorageAvailable) {
        return false;
      }

      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // SessionStorage methods
  setSessionItem(key, value) {
    try {
      if (!this.isSessionStorageAvailable) {
        console.warn('SessionStorage is not available');
        return false;
      }

      const item = {
        value: value,
        timestamp: Date.now()
      };

      sessionStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
      return false;
    }
  }

  getSessionItem(key, defaultValue = null) {
    try {
      if (!this.isSessionStorageAvailable) {
        return defaultValue;
      }

      const itemString = sessionStorage.getItem(key);
      if (!itemString) {
        return defaultValue;
      }

      const item = JSON.parse(itemString);
      return item.value;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  }

  removeSessionItem(key) {
    try {
      if (!this.isSessionStorageAvailable) {
        return false;
      }

      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  }

  clearSession() {
    try {
      if (!this.isSessionStorageAvailable) {
        return false;
      }

      sessionStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }

  // Cookie methods
  setCookie(name, value, options = {}) {
    try {
      const defaults = {
        path: '/',
        expires: null, // Date object or number of days
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax'
      };

      const settings = { ...defaults, ...options };
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

      if (settings.expires) {
        if (typeof settings.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + (settings.expires * 24 * 60 * 60 * 1000));
          settings.expires = date;
        }
        cookieString += `; expires=${settings.expires.toUTCString()}`;
      }

      if (settings.path) {
        cookieString += `; path=${settings.path}`;
      }

      if (settings.domain) {
        cookieString += `; domain=${settings.domain}`;
      }

      if (settings.secure) {
        cookieString += '; secure';
      }

      if (settings.sameSite) {
        cookieString += `; samesite=${settings.sameSite}`;
      }

      if (settings.httpOnly) {
        cookieString += '; httponly';
      }

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error('Error setting cookie:', error);
      return false;
    }
  }

  getCookie(name) {
    try {
      const nameEQ = encodeURIComponent(name) + '=';
      const cookies = document.cookie.split(';');

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }

      return null;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return null;
    }
  }

  removeCookie(name, options = {}) {
    try {
      const settings = {
        path: '/',
        ...options,
        expires: new Date(0) // Set expiry to past date
      };

      this.setCookie(name, '', settings);
      return true;
    } catch (error) {
      console.error('Error removing cookie:', error);
      return false;
    }
  }

  // Utility methods
  getStorageSize() {
    try {
      let localStorageSize = 0;
      let sessionStorageSize = 0;

      if (this.isLocalStorageAvailable) {
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            localStorageSize += localStorage[key].length + key.length;
          }
        }
      }

      if (this.isSessionStorageAvailable) {
        for (let key in sessionStorage) {
          if (sessionStorage.hasOwnProperty(key)) {
            sessionStorageSize += sessionStorage[key].length + key.length;
          }
        }
      }

      return {
        localStorage: this.formatBytes(localStorageSize),
        sessionStorage: this.formatBytes(sessionStorageSize),
        localStorageBytes: localStorageSize,
        sessionStorageBytes: sessionStorageSize
      };
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return null;
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Get all keys with optional prefix filter
  getKeys(prefix = '') {
    try {
      const keys = [];

      if (this.isLocalStorageAvailable) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keys.push(key);
          }
        }
      }

      return keys;
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  // Remove items with prefix
  removeByPrefix(prefix) {
    try {
      const keys = this.getKeys(prefix);
      let removedCount = 0;

      keys.forEach(key => {
        if (this.removeItem(key)) {
          removedCount++;
        }
      });

      return removedCount;
    } catch (error) {
      console.error('Error removing items by prefix:', error);
      return 0;
    }
  }

  // Clean expired items
  cleanExpired() {
    try {
      let cleanedCount = 0;

      if (this.isLocalStorageAvailable) {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key) {
            const item = this.getItem(key);
            if (item === null) { // Item was expired and removed
              cleanedCount++;
            }
          }
        }
      }

      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning expired items:', error);
      return 0;
    }
  }

  // Export storage data
  exportData(keys = null) {
    try {
      const data = {};

      if (this.isLocalStorageAvailable) {
        const keysToExport = keys || this.getKeys();

        keysToExport.forEach(key => {
          const value = this.getItem(key);
          if (value !== null) {
            data[key] = value;
          }
        });
      }

      return data;
    } catch (error) {
      console.error('Error exporting storage data:', error);
      return {};
    }
  }

  // Import storage data
  importData(data, options = {}) {
    try {
      const { overwrite = false, prefix = '' } = options;
      let importedCount = 0;

      Object.keys(data).forEach(key => {
        const fullKey = prefix + key;
        
        if (overwrite || this.getItem(fullKey) === null) {
          if (this.setItem(fullKey, data[key])) {
            importedCount++;
          }
        }
      });

      return importedCount;
    } catch (error) {
      console.error('Error importing storage data:', error);
      return 0;
    }
  }

  // Bharatshala specific storage methods
  setUserPreference(key, value) {
    return this.setItem(`bharatshala_pref_${key}`, value);
  }

  getUserPreference(key, defaultValue = null) {
    return this.getItem(`bharatshala_pref_${key}`, defaultValue);
  }

  setCartData(cartData) {
    return this.setItem('bharatshala_cart', cartData, { ttl: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  }

  getCartData() {
    return this.getItem('bharatshala_cart', []);
  }

  clearCartData() {
    return this.removeItem('bharatshala_cart');
  }

  setWishlistData(wishlistData) {
    return this.setItem('bharatshala_wishlist', wishlistData);
  }

  getWishlistData() {
    return this.getItem('bharatshala_wishlist', []);
  }

  setRecentlyViewed(products) {
    const maxItems = 20;
    const recentProducts = products.slice(0, maxItems);
    return this.setItem('bharatshala_recent_viewed', recentProducts);
  }

  getRecentlyViewed() {
    return this.getItem('bharatshala_recent_viewed', []);
  }

  addToRecentlyViewed(product) {
    const recentProducts = this.getRecentlyViewed();
    const existingIndex = recentProducts.findIndex(p => p.id === product.id);
    
    if (existingIndex > -1) {
      recentProducts.splice(existingIndex, 1);
    }
    
    recentProducts.unshift(product);
    return this.setRecentlyViewed(recentProducts);
  }

  setSearchHistory(searches) {
    const maxItems = 10;
    const recentSearches = searches.slice(0, maxItems);
    return this.setItem('bharatshala_search_history', recentSearches);
  }

  getSearchHistory() {
    return this.getItem('bharatshala_search_history', []);
  }

  addToSearchHistory(searchTerm) {
    const searches = this.getSearchHistory();
    const existingIndex = searches.indexOf(searchTerm);
    
    if (existingIndex > -1) {
      searches.splice(existingIndex, 1);
    }
    
    searches.unshift(searchTerm);
    return this.setSearchHistory(searches);
  }

  // Theme and UI preferences
  setTheme(theme) {
    return this.setUserPreference('theme', theme);
  }

  getTheme() {
    return this.getUserPreference('theme', 'light');
  }

  setLanguage(language) {
    return this.setUserPreference('language', language);
  }

  getLanguage() {
    return this.getUserPreference('language', 'hi');
  }

  setCurrency(currency) {
    return this.setUserPreference('currency', currency);
  }

  getCurrency() {
    return this.getUserPreference('currency', 'INR');
  }

  // Analytics and tracking data
  setAnalyticsData(key, data) {
    return this.setSessionItem(`bharatshala_analytics_${key}`, data);
  }

  getAnalyticsData(key) {
    return this.getSessionItem(`bharatshala_analytics_${key}`, null);
  }

  // Cache management
  setCache(key, data, ttl = 60 * 60 * 1000) { // Default 1 hour
    return this.setItem(`bharatshala_cache_${key}`, data, { ttl });
  }

  getCache(key) {
    return this.getItem(`bharatshala_cache_${key}`, null);
  }

  clearCache() {
    return this.removeByPrefix('bharatshala_cache_');
  }

  // Vendor specific storage
  setVendorData(vendorId, key, data) {
    return this.setItem(`bharatshala_vendor_${vendorId}_${key}`, data);
  }

  getVendorData(vendorId, key, defaultValue = null) {
    return this.getItem(`bharatshala_vendor_${vendorId}_${key}`, defaultValue);
  }

  clearVendorData(vendorId) {
    return this.removeByPrefix(`bharatshala_vendor_${vendorId}_`);
  }
}

// Create and export singleton instance
const storageService = new StorageService();
export { storageService };

// Export class for testing
export default StorageService;