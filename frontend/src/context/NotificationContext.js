import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    priceDrops: true
  });

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  const loadNotifications = async () => {
    try {
      // In real app, this would be an API call
      const savedNotifications = localStorage.getItem('bharatshala_notifications');
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('bharatshala_notification_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveNotifications = (newNotifications) => {
    localStorage.setItem('bharatshala_notifications', JSON.stringify(newNotifications));
  };

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info',
      priority: 'normal',
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 100); // Keep last 100
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (settings.push && Notification.permission === 'granted') {
      new Notification(notification.title || 'भारतशाला', {
        body: notification.message,
        icon: '/favicon.ico',
        tag: newNotification.id
      });
    }

    return newNotification.id;
  }, [settings.push]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      saveNotifications(updated);
      return updated;
    });

    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      saveNotifications(updated);
      return updated;
    });
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('bharatshala_notifications');
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('bharatshala_notification_settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'सफलता',
      message,
      priority: 'normal',
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'त्रुटि',
      message,
      priority: 'high',
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'चेतावनी',
      message,
      priority: 'normal',
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'जानकारी',
      message,
      priority: 'low',
      ...options
    });
  }, [addNotification]);

  // Order-specific notifications
  const showOrderUpdate = useCallback((orderId, status, message) => {
    if (!settings.orderUpdates) return;
    
    return addNotification({
      type: 'order',
      title: 'ऑर्डर अपडेट',
      message,
      orderId,
      status,
      priority: 'high',
      actionUrl: `/user/orders/${orderId}`
    });
  }, [addNotification, settings.orderUpdates]);

  const showPromotion = useCallback((title, message, promoCode = null) => {
    if (!settings.promotions) return;
    
    return addNotification({
      type: 'promotion',
      title,
      message,
      promoCode,
      priority: 'low',
      actionUrl: '/markets'
    });
  }, [addNotification, settings.promotions]);

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updateSettings,
    requestPermission,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showOrderUpdate,
    showPromotion
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;