// Web Vitals Reporting for Bharatshaala Platform
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import config from './utils/constants';

// Performance thresholds (in milliseconds/scores)
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },        // Largest Contentful Paint
  FID: { good: 100, poor: 300 },          // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },         // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },        // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }         // Time to First Byte
};

// Performance grade calculation
const getPerformanceGrade = (metric, value) => {
  const thresholds = PERFORMANCE_THRESHOLDS[metric];
  if (!thresholds) return 'unknown';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

// Analytics helper function (not a hook)
const trackToAnalytics = (eventName, properties) => {
  try {
    // Send to Google Analytics if available
    if (window.gtag && config.analytics?.googleAnalyticsId) {
      window.gtag('event', eventName, properties);
    }

    // Send to custom analytics endpoint
    if (config.api?.baseURL) {
      fetch(`${config.api.baseURL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          properties,
          timestamp: Date.now()
        })
      }).catch(() => {}); // Silently fail
    }
  } catch (error) {
    console.warn('Failed to track analytics:', error);
  }
};

// Enhanced metrics storage
class PerformanceTracker {
  constructor() {
    this.metrics = new Map();
    this.sessionData = {
      startTime: Date.now(),
      pageViews: 0,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      deviceInfo: this.getDeviceInfo()
    };
    this.isReportingEnabled = config.analytics?.trackPerformance || false;
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  getDeviceInfo() {
    return {
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  recordMetric(metric) {
    if (!this.isReportingEnabled) return;

    const { name, value } = metric;
    const grade = getPerformanceGrade(name, value);
    
    const enhancedMetric = {
      ...metric,
      grade,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      sessionData: this.sessionData,
      pageLoadTime: Date.now() - this.sessionData.startTime,
      isFirstVisit: !localStorage.getItem('bharatshaala_returning_user')
    };

    this.metrics.set(name, enhancedMetric);

    // Send to analytics using function instead of hook
    this.sendToAnalytics(enhancedMetric);

    // Send to performance monitoring service
    this.sendToPerformanceService(enhancedMetric);

    // Log in development
    if (config.environment?.isDevelopment) {
      this.logMetric(enhancedMetric);
    }

    // Check for performance issues
    this.checkPerformanceAlerts(enhancedMetric);
  }

  sendToAnalytics(metric) {
    try {
      trackToAnalytics('performance_metric', {
        metric_name: metric.name,
        metric_value: metric.value,
        grade: metric.grade,
        rating: metric.rating,
        id: metric.id,
        delta: metric.delta,
        connection: metric.sessionData.connection,
        deviceMemory: metric.sessionData.deviceInfo.memory,
        isFirstVisit: metric.isFirstVisit
      });
    } catch (error) {
      console.warn('Failed to send metric to analytics:', error);
    }
  }

  sendToPerformanceService(metric) {
    if (!config.performance?.monitoring?.enabled) return;

    try {
      // Send to external performance monitoring (e.g., DataDog, New Relic)
      if (window.DD_RUM) {
        window.DD_RUM.addAction('web-vital', {
          metric: metric.name,
          value: metric.value,
          grade: metric.grade
        });
      }

      // Send to Google Analytics 4
      if (window.gtag && config.analytics?.googleAnalyticsId) {
        window.gtag('event', 'web_vital', {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_grade: metric.grade,
          custom_parameter_1: 'bharatshaala_performance'
        });
      }

      // Send to custom performance endpoint
      if (config.api?.baseURL) {
        fetch(`${config.api.baseURL}/performance/metrics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metric,
            timestamp: Date.now(),
            sessionId: this.getSessionId()
          })
        }).catch(error => {
          console.warn('Failed to send metric to performance service:', error);
        });
      }
    } catch (error) {
      console.warn('Failed to send metric to performance service:', error);
    }
  }

  logMetric(metric) {
    const emoji = this.getMetricEmoji(metric.grade);
    const color = this.getMetricColor(metric.grade);
    
    console.group(`${emoji} Web Vital: ${metric.name}`);
    console.log(`%cValue: ${metric.value}${this.getMetricUnit(metric.name)}`, `color: ${color}; font-weight: bold;`);
    console.log(`%cGrade: ${metric.grade}`, `color: ${color};`);
    console.log(`Rating: ${metric.rating}`);
    console.log(`Delta: ${metric.delta}`);
    console.log(`ID: ${metric.id}`);
    console.log('Connection:', metric.sessionData.connection);
    console.log('Device:', metric.sessionData.deviceInfo);
    console.groupEnd();
  }

  getMetricEmoji(grade) {
    switch (grade) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return 'ℹ️';
    }
  }

  getMetricColor(grade) {
    switch (grade) {
      case 'good': return '#22c55e';
      case 'needs-improvement': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  }

  getMetricUnit(metric) {
    switch (metric) {
      case 'CLS': return '';
      case 'FID':
      case 'LCP':
      case 'FCP':
      case 'TTFB':
        return 'ms';
      default: return '';
    }
  }

  checkPerformanceAlerts(metric) {
    // Alert for poor performance
    if (metric.grade === 'poor') {
      this.sendPerformanceAlert(metric);
    }

    // Check for specific conditions
    if (metric.name === 'LCP' && metric.value > 4000) {
      console.warn(`Slow page load detected: LCP = ${metric.value}ms`);
    }

    if (metric.name === 'FID' && metric.value > 300) {
      console.warn(`Poor interactivity detected: FID = ${metric.value}ms`);
    }

    if (metric.name === 'CLS' && metric.value > 0.25) {
      console.warn(`Layout instability detected: CLS = ${metric.value}`);
    }
  }

  sendPerformanceAlert(metric) {
    // Send alert to monitoring service
    if (config.environment?.isProduction) {
      fetch(`${config.api?.baseURL || ''}/alerts/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: 'warning',
          metric: metric.name,
          value: metric.value,
          grade: metric.grade,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      }).catch(() => {}); // Silently fail
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('performance_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('performance_session_id', sessionId);
    }
    return sessionId;
  }

  generatePerformanceReport() {
    const metrics = Array.from(this.metrics.values());
    const report = {
      summary: {
        totalMetrics: metrics.length,
        goodMetrics: metrics.filter(m => m.grade === 'good').length,
        poorMetrics: metrics.filter(m => m.grade === 'poor').length,
        overallScore: this.calculateOverallScore(metrics)
      },
      metrics: metrics,
      sessionData: this.sessionData,
      recommendations: this.generateRecommendations(metrics)
    };

    return report;
  }

  calculateOverallScore(metrics) {
    if (metrics.length === 0) return 0;
    
    const scores = metrics.map(metric => {
      switch (metric.grade) {
        case 'good': return 100;
        case 'needs-improvement': return 75;
        case 'poor': return 25;
        default: return 50;
      }
    });

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  generateRecommendations(metrics) {
    const recommendations = [];

    metrics.forEach(metric => {
      if (metric.grade === 'poor') {
        switch (metric.name) {
          case 'LCP':
            recommendations.push({
              metric: 'LCP',
              issue: 'Slow page loading',
              suggestions: [
                'Optimize images and use modern formats (WebP, AVIF)',
                'Implement lazy loading for images',
                'Use a Content Delivery Network (CDN)',
                'Minimize render-blocking resources'
              ]
            });
            break;
          case 'FID':
            recommendations.push({
              metric: 'FID',
              issue: 'Poor interactivity',
              suggestions: [
                'Reduce JavaScript execution time',
                'Break up long tasks',
                'Use web workers for heavy computations',
                'Optimize third-party scripts'
              ]
            });
            break;
          case 'CLS':
            recommendations.push({
              metric: 'CLS',
              issue: 'Layout instability',
              suggestions: [
                'Set size attributes on images and videos',
                'Reserve space for ads and embeds',
                'Avoid inserting content above existing content',
                'Use CSS transforms instead of changing layout properties'
              ]
            });
            break;
          default:
            break;
        }
      }
    });

    return recommendations;
  }
}

// Create performance tracker instance
const performanceTracker = new PerformanceTracker();

// Enhanced reportWebVitals function
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Get all Core Web Vitals
    getCLS((metric) => {
      performanceTracker.recordMetric(metric);
      onPerfEntry(metric);
    });

    getFID((metric) => {
      performanceTracker.recordMetric(metric);
      onPerfEntry(metric);
    });

    getFCP((metric) => {
      performanceTracker.recordMetric(metric);
      onPerfEntry(metric);
    });

    getLCP((metric) => {
      performanceTracker.recordMetric(metric);
      onPerfEntry(metric);
    });

    getTTFB((metric) => {
      performanceTracker.recordMetric(metric);
      onPerfEntry(metric);
    });
  }
};

// Additional performance monitoring
if (config.analytics?.trackPerformance) {
  // Track page load performance
  window.addEventListener('load', () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (navigationTiming) {
      trackToAnalytics('page_load_complete', {
        loadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
        firstByte: navigationTiming.responseStart - navigationTiming.fetchStart,
        domInteractive: navigationTiming.domInteractive - navigationTiming.fetchStart
      });
    }
  });

  // Track resource performance
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          // Track slow resources
          if (entry.duration > 1000) {
            trackToAnalytics('slow_resource_detected', {
              resource: entry.name,
              duration: entry.duration,
              type: entry.initiatorType
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

// Export for global access
window.__BHARATSHAALA_PERFORMANCE__ = performanceTracker;

export default reportWebVitals;
export { performanceTracker };