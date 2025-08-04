// Advanced Analytics System for Bharatshala Platform
import config from './config';

// Analytics configuration
const ANALYTICS_CONFIG = {
  apiEndpoint: config.api.baseURL + '/analytics',
  batchSize: config.analytics.batchSize || 50,
  flushInterval: config.analytics.flushInterval || 30000,
  maxRetries: 3,
  retryDelay: 1000,
  storageKey: 'bharatshala_analytics_queue',
  sessionKey: 'bharatshala_session_id',
  userKey: 'bharatshala_user_analytics'
};

// Event types for better categorization
const EVENT_TYPES = {
  PAGE_VIEW: 'page_view',
  USER_ACTION: 'user_action',
  COMMERCE: 'commerce',
  PERFORMANCE: 'performance',
  ERROR: 'error',
  CUSTOM: 'custom'
};

// E-commerce specific events
const COMMERCE_EVENTS = {
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',
  REFUND: 'refund',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  SEARCH: 'search',
  SELECT_CONTENT: 'select_content'
};

class AnalyticsManager {
  constructor() {
    this.isEnabled = config.analytics.enabled;
    this.queue = [];
    this.sessionId = this.getOrCreateSessionId();
    this.userId = this.getUserId();
    this.deviceInfo = this.getDeviceInfo();
    this.pageLoadTime = Date.now();
    this.flushTimer = null;
    this.retryCount = 0;
    
    this.initializeSession();
    this.loadQueueFromStorage();
    this.startPeriodicFlush();
    this.setupEventListeners();
  }

  // Session management
  getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem(ANALYTICS_CONFIG.sessionKey);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(ANALYTICS_CONFIG.sessionKey, sessionId);
    }
    return sessionId;
  }

  getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || null;
    } catch {
      return null;
    }
  }

  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        orientation: screen.orientation?.type || 'unknown'
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      connection: this.getConnectionInfo()
    };
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return null;
  }

  initializeSession() {
    // Track session start
    this.track('session_start', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      referrer: document.referrer,
      utm: this.getUTMParameters()
    });

    // Update user info when available
    window.addEventListener('user_logged_in', (event) => {
      this.userId = event.detail.userId;
      this.track('user_identified', {
        userId: this.userId,
        userType: event.detail.userType
      });
    });
  }

  getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      source: urlParams.get('utm_source'),
      medium: urlParams.get('utm_medium'),
      campaign: urlParams.get('utm_campaign'),
      term: urlParams.get('utm_term'),
      content: urlParams.get('utm_content')
    };
  }

  setupEventListeners() {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', { duration: Date.now() - this.pageLoadTime });
      } else {
        this.pageLoadTime = Date.now();
        this.track('page_visible');
      }
    });

    // Page unload
    window.addEventListener('beforeunload', () => {
      this.track('page_unload', { 
        duration: Date.now() - this.pageLoadTime,
        scrollDepth: this.getScrollDepth()
      });
      this.flush(true); // Force flush on page unload
    });

    // Network status changes
    window.addEventListener('online', () => {
      this.track('network_online');
      this.retryFailedEvents();
    });

    window.addEventListener('offline', () => {
      this.track('network_offline');
    });

    // Orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.track('orientation_change', {
          orientation: screen.orientation?.type || window.orientation
        });
      }, 100);
    });

    // Error tracking
    window.addEventListener('error', (event) => {
      this.trackError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  getScrollDepth() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
  }

  // Core tracking methods
  track(eventName, properties = {}, eventType = EVENT_TYPES.USER_ACTION) {
    if (!this.isEnabled) return;

    const event = {
      id: this.generateEventId(),
      name: eventName,
      type: eventType,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      context: {
        page: {
          title: document.title,
          url: window.location.href,
          path: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        },
        device: this.deviceInfo,
        library: {
          name: 'bharatshala-analytics',
          version: '1.0.0'
        }
      }
    };

    this.addToQueue(event);

    // Debug logging
    if (config.isDev) {
      console.log('📊 Analytics Event:', eventName, properties);
    }

    return event.id;
  }

  trackPageView(pageName, properties = {}) {
    return this.track('page_view', {
      page_name: pageName,
      page_title: document.title,
      page_location: window.location.href,
      ...properties
    }, EVENT_TYPES.PAGE_VIEW);
  }

  trackCommerce(eventName, properties = {}) {
    const commerceEvent = {
      event_name: eventName,
      currency: properties.currency || 'INR',
      value: properties.value || properties.price || 0,
      ...properties
    };

    // Add standard e-commerce parameters
    if (properties.items) {
      commerceEvent.items = properties.items.map(item => ({
        item_id: item.id || item.productId,
        item_name: item.name,
        item_category: item.category,
        item_brand: item.brand || item.vendorName,
        price: item.price,
        quantity: item.quantity || 1
      }));
    }

    return this.track(eventName, commerceEvent, EVENT_TYPES.COMMERCE);
  }

  trackError(error, additionalInfo = {}) {
    const errorEvent = {
      error_message: error.message || 'Unknown error',
      error_name: error.name || 'Error',
      error_stack: error.stack || '',
      error_type: additionalInfo.type || 'unknown',
      ...additionalInfo
    };

    return this.track('error_occurred', errorEvent, EVENT_TYPES.ERROR);
  }

  trackPerformance(metricName, value, properties = {}) {
    return this.track('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      ...properties
    }, EVENT_TYPES.PERFORMANCE);
  }

  trackCustom(eventName, properties = {}) {
    return this.track(eventName, properties, EVENT_TYPES.CUSTOM);
  }

  // User identification
  identify(userId, traits = {}) {
    this.userId = userId;
    
    return this.track('user_identified', {
      user_id: userId,
      traits: {
        ...traits,
        identified_at: Date.now()
      }
    });
  }

  // Group tracking (for vendor organizations)
  group(groupId, traits = {}) {
    return this.track('group_identified', {
      group_id: groupId,
      group_traits: traits
    });
  }

  // Funnel tracking
  trackFunnel(funnelName, step, properties = {}) {
    return this.track('funnel_step', {
      funnel_name: funnelName,
      step_name: step,
      step_number: properties.stepNumber || 1,
      ...properties
    });
  }

  // A/B Testing
  trackExperiment(experimentName, variant, properties = {}) {
    return this.track('experiment_viewed', {
      experiment_name: experimentName,
      variant_name: variant,
      ...properties
    });
  }

  // Queue management
  addToQueue(event) {
    this.queue.push(event);
    
    // Save to localStorage for persistence
    this.saveQueueToStorage();

    // Flush if queue is full
    if (this.queue.length >= ANALYTICS_CONFIG.batchSize) {
      this.flush();
    }
  }

  saveQueueToStorage() {
    try {
      localStorage.setItem(ANALYTICS_CONFIG.storageKey, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('Failed to save analytics queue to storage:', error);
    }
  }

  loadQueueFromStorage() {
    try {
      const saved = localStorage.getItem(ANALYTICS_CONFIG.storageKey);
      if (saved) {
        this.queue = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load analytics queue from storage:', error);
      this.queue = [];
    }
  }

  startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, ANALYTICS_CONFIG.flushInterval);
  }

  async flush(force = false) {
    if (this.queue.length === 0) return;

    // Don't flush if offline unless forced
    if (!navigator.onLine && !force) {
      return;
    }

    const eventsToSend = [...this.queue];
    this.queue = [];
    this.saveQueueToStorage();

    try {
      await this.sendEvents(eventsToSend);
      this.retryCount = 0;
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      
      // Add events back to queue for retry
      this.queue.unshift(...eventsToSend);
      this.saveQueueToStorage();
      
      // Retry with exponential backoff
      this.scheduleRetry();
    }
  }

  async sendEvents(events) {
    const payload = {
      events,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      api_key: config.analytics.apiKey || 'bharatshala_web'
    };

    // Send to multiple endpoints
    const promises = [];

    // Send to custom analytics endpoint
    if (ANALYTICS_CONFIG.apiEndpoint) {
      promises.push(
        fetch(ANALYTICS_CONFIG.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      );
    }

    // Send to Google Analytics 4
    if (window.gtag && config.analytics.googleAnalyticsId) {
      events.forEach(event => {
        if (event.type === EVENT_TYPES.COMMERCE) {
          window.gtag('event', event.name, event.properties);
        } else {
          window.gtag('event', event.name, {
            custom_parameter_1: 'bharatshala',
            custom_parameter_2: event.type,
            ...event.properties
          });
        }
      });
    }

    // Send to Facebook Pixel
    if (window.fbq && config.analytics.facebookPixelId) {
      events.forEach(event => {
        if (event.type === EVENT_TYPES.COMMERCE) {
          const fbEvent = this.mapToFacebookEvent(event);
          if (fbEvent) {
            window.fbq('track', fbEvent.name, fbEvent.properties);
          }
        }
      });
    }

    // Wait for all requests to complete
    const results = await Promise.allSettled(promises);
    
    // Check if any request failed
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      throw new Error(`Failed to send to ${failures.length} endpoints`);
    }
  }

  mapToFacebookEvent(event) {
    const mapping = {
      'view_item': { name: 'ViewContent', properties: { content_ids: [event.properties.item_id] } },
      'add_to_cart': { name: 'AddToCart', properties: { content_ids: [event.properties.item_id] } },
      'begin_checkout': { name: 'InitiateCheckout', properties: {} },
      'purchase': { name: 'Purchase', properties: { value: event.properties.value, currency: event.properties.currency } },
      'search': { name: 'Search', properties: { search_string: event.properties.search_term } }
    };

    return mapping[event.name] || null;
  }

  scheduleRetry() {
    if (this.retryCount >= ANALYTICS_CONFIG.maxRetries) {
      console.warn('Max retry attempts reached for analytics events');
      return;
    }

    const delay = ANALYTICS_CONFIG.retryDelay * Math.pow(2, this.retryCount);
    this.retryCount++;

    setTimeout(() => {
      this.flush();
    }, delay);
  }

  retryFailedEvents() {
    if (this.queue.length > 0) {
      this.flush();
    }
  }

  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods
  setUserId(userId) {
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

  getSessionId() {
    return this.sessionId;
  }

  // Configuration
  configure(newConfig) {
    Object.assign(ANALYTICS_CONFIG, newConfig);
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Data export for debugging
  getQueuedEvents() {
    return [...this.queue];
  }

  getAnalyticsInfo() {
    return {
      enabled: this.isEnabled,
      sessionId: this.sessionId,
      userId: this.userId,
      queueSize: this.queue.length,
      retryCount: this.retryCount,
      deviceInfo: this.deviceInfo
    };
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(true);
  }
}

// Create global analytics instance
const analytics = new AnalyticsManager();

// Enhanced tracking helpers
export const trackEvent = (eventName, properties = {}) => {
  return analytics.track(eventName, properties);
};

export const trackPageView = (pageName, properties = {}) => {
  return analytics.trackPageView(pageName, properties);
};

export const trackCommerce = (eventName, properties = {}) => {
  return analytics.trackCommerce(eventName, properties);
};

export const trackError = (error, additionalInfo = {}) => {
  return analytics.trackError(error, additionalInfo);
};

export const trackPerformance = (metricName, value, properties = {}) => {
  return analytics.trackPerformance(metricName, value, properties);
};

export const identify = (userId, traits = {}) => {
  return analytics.identify(userId, traits);
};

export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackCommerce: analytics.trackCommerce.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    identify: analytics.identify.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    enable: analytics.enable.bind(analytics),
    disable: analytics.disable.bind(analytics)
  };
};

// Global access for debugging
if (config.isDev) {
  window.__BHARATSHALA_ANALYTICS__ = analytics;
}

export { analytics, EVENT_TYPES, COMMERCE_EVENTS };
export default analytics;