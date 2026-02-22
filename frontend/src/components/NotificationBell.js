import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Set up real-time notifications if needed
      const interval = setInterval(loadNotifications, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Mock data for demo
      setNotifications([
        {
          id: 1,
          title: 'ऑर्डर अपडेट',
          message: 'आपका ऑर्डर #ORD-12345 शिप हो गया है',
          type: 'order',
          isRead: false,
          createdAt: '2025-08-03T08:30:00Z',
          actionUrl: '/user/orders/ORD-12345'
        },
        {
          id: 2,
          title: 'नया ऑफर',
          message: 'राजस्थानी ज्वेलरी पर 20% छूट',
          type: 'promotion',
          isRead: false,
          createdAt: '2025-08-03T07:15:00Z',
          actionUrl: '/categories/jewelry'
        },
        {
          id: 3,
          title: 'डिलीवरी कम्प्लीट',
          message: 'आपका ऑर्डर #ORD-12344 डिलीवर हो गया है',
          type: 'delivery',
          isRead: true,
          createdAt: '2025-08-02T18:45:00Z',
          actionUrl: '/user/orders/ORD-12344'
        },
        {
          id: 4,
          title: 'नई समीक्षा',
          message: 'आपने खरीदे गए उत्पाद की समीक्षा दें',
          type: 'review',
          isRead: true,
          createdAt: '2025-08-02T12:30:00Z',
          actionUrl: '/user/reviews'
        }
      ]);
      setUnreadCount(2);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      delivery: '🚚',
      promotion: '🎯',
      review: '⭐',
      payment: '💳',
      account: '👤',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'अभी अभी';
    if (diffInMinutes < 60) return `${diffInMinutes} मिनट पहले`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} दिन पहले`;
    
    return notificationDate.toLocaleDateString('hi-IN');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-emerald-200 dark:border-emerald-700 z-50 max-h-96 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">अधिसूचनाएं</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-emerald-100 hover:text-white text-sm underline"
                >
                  सभी पढ़ें
                </button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-emerald-100 text-sm mt-1">
                {unreadCount} नई अधिसूचनाएं
              </p>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-emerald-200 dark:border-emerald-700 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-2">लोड हो रहा है...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-emerald-100 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${
                      !notification.isRead ? 'bg-emerald-25 border-l-4 border-l-emerald-500' : ''
                    }`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <span className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-emerald-800 dark:text-emerald-200 ${
                          !notification.isRead ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-emerald-500 dark:text-emerald-400 text-xs mt-2">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex items-center space-x-1">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200 p-1"
                          title="हटाएं"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🔔</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">कोई अधिसूचना नहीं</p>
                <p className="text-gray-400 text-sm mt-1">आपकी सभी अधिसूचनाएं यहाँ दिखेंगी</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-emerald-200 dark:border-emerald-700 p-3">
              <a
                href="/user/notifications"
                className="block text-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm"
                onClick={() => setIsOpen(false)}
              >
                सभी अधिसूचनाएं देखें
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;