// User Notifications Component - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatRelativeTime } from '../../utils/helpers';

const Notifications = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  const notificationTypes = [
    { value: 'all', label: 'सभी', icon: '🔔' },
    { value: 'order', label: 'ऑर्डर', icon: '📦' },
    { value: 'payment', label: 'पेमेंट', icon: '💳' },
    { value: 'offer', label: 'ऑफर', icon: '🎁' },
    { value: 'system', label: 'सिस्टम', icon: '⚙️' }
  ];

  const typeIcons = {
    order: '📦',
    payment: '💳',
    offer: '🎁',
    system: '⚙️',
    support: '🎧',
    security: '🔐'
  };

  const priorityColors = {
    low: 'gray',
    normal: 'blue',
    high: 'orange',
    urgent: 'red'
  };

  useEffect(() => {
    trackPageView('user_notifications');
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications({ limit: 50 });
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      const response = await apiService.markNotificationRead(notificationId);
      if (response.success) {
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
        trackEvent('notification_marked_read', { notificationId });
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const response = await apiService.markAllNotificationsRead();
      if (response.success) {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
        trackEvent('all_notifications_marked_read');
        alert('सभी नोटिफिकेशन्स को पढ़ा हुआ मार्क कर दिया गया');
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) {
      alert('कृपया कम से कम एक नोटिफिकेशन चुनें');
      return;
    }

    try {
      if (action === 'mark_read') {
        await Promise.all(selectedIds.map(id => apiService.markNotificationRead(id)));
        setNotifications(notifications.map(notif => 
          selectedIds.includes(notif.id) ? { ...notif, read: true } : notif
        ));
        trackEvent('bulk_notifications_marked_read', { count: selectedIds.length });
      }
      
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const handleSelectAll = () => {
    const filteredNotifications = getFilteredNotifications();
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const getFilteredNotifications = () => {
    return filter === 'all' 
      ? notifications 
      : notifications.filter(notif => notif.type === filter);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="नोटिफिकेशन्स लोड हो रहे हैं..." />
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      <Helmet>
        <title>नोटिफिकेशन्स - भारतशाला | Notifications</title>
        <meta name="description" content="अपने ऑर्डर, पेमेंट और ऑफर्स से जुड़े नोटिफिकेशन्स देखें।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">नोटिफिकेशन्स</h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {unreadCount > 0 ? `${unreadCount} नए नोटिफिकेशन्स` : 'सभी नोटिफिकेशन्स पढ़े गए हैं'}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  सभी को पढ़ा हुआ मार्क करें
                </button>
              )}
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Type Filters */}
              <div className="flex flex-wrap gap-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFilter(type.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                      filter === type.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Bulk Actions */}
              {selectedIds.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{selectedIds.length} चुने गए</span>
                  <button
                    onClick={() => handleBulkAction('mark_read')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors duration-200"
                  >
                    पढ़ा हुआ मार्क करें
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">कोई नोटिफिकेशन नहीं मिला</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {filter === 'all' 
                    ? 'अभी तक कोई नोटिफिकेशन नहीं आया है'
                    : `${notificationTypes.find(t => t.value === filter)?.label} श्रेणी में कोई नोटिफिकेशन नहीं`
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Select All Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredNotifications.length}
                      onChange={handleSelectAll}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">सभी को चुनें</span>
                  </label>
                </div>

                {/* Notifications */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(notification.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds([...selectedIds, notification.id]);
                            } else {
                              setSelectedIds(selectedIds.filter(id => id !== notification.id));
                            }
                          }}
                          className="mt-1"
                        />

                        {/* Icon */}
                        <div className="flex-shrink-0">
                          <span className="text-2xl">
                            {typeIcons[notification.type] || '🔔'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </h3>
                              <p className={`mt-1 text-sm ${
                                !notification.read ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'
                              }`}>
                                {notification.message}
                              </p>
                              
                              {/* Metadata */}
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>{formatRelativeTime(notification.createdAt)}</span>
                                {notification.priority && notification.priority !== 'normal' && (
                                  <span className={`px-2 py-1 rounded-full bg-${priorityColors[notification.priority]}-100 text-${priorityColors[notification.priority]}-800`}>
                                    {notification.priority === 'high' ? 'उच्च' : 
                                     notification.priority === 'urgent' ? 'अत्यावश्यक' : 
                                     notification.priority === 'low' ? 'कम' : notification.priority}
                                  </span>
                                )}
                                {notification.category && (
                                  <span className="text-gray-400">• {notification.category}</span>
                                )}
                              </div>

                              {/* Action Button */}
                              {notification.actionUrl && (
                                <div className="mt-3">
                                  <a
                                    href={notification.actionUrl}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                                  >
                                    {notification.actionText || 'देखें'} →
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Read Status & Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkRead(notification.id)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                                  title="पढ़ा हुआ मार्क करें"
                                >
                                  ✓
                                </button>
                              )}
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">नोटिफिकेशन सेटिंग्स</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">ईमेल नोटिफिकेशन</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">महत्वपूर्ण अपडेट्स ईमेल पर प्राप्त करें</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">SMS नोटिफिकेशन</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ऑर्डर अपडेट्स SMS पर प्राप्त करें</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">प्रमोशनल नोटिफिकेशन</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">ऑफर्स और डील्स की जानकारी प्राप्त करें</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;