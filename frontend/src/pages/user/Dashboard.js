// User Dashboard Component - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../utils/analytics';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';

const Dashboard = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    recentOrders: [],
    wishlistCount: 0,
    rewardPoints: 0,
    notifications: [],
    recommendations: []
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0
  });

  const quickActions = [
    {
      title: 'ऑर्डर ट्रैक करें',
      description: 'अपने ऑर्डर की स्थिति देखें',
      icon: '📦',
      link: '/user/orders',
      color: 'blue'
    },
    {
      title: 'विशलिस्ट',
      description: 'पसंदीदा आइटम्स देखें',
      icon: '❤️',
      link: '/wishlist',
      color: 'red'
    },
    {
      title: 'एड्रेस बुक',
      description: 'डिलीवरी पते मैनेज करें',
      icon: '📍',
      link: '/user/address-book',
      color: 'green'
    },
    {
      title: 'सपोर्ट',
      description: 'हेल्प और सपोर्ट',
      icon: '🎧',
      link: '/user/customer-support',
      color: 'purple'
    }
  ];

  const orderStatusColors = {
    pending: 'yellow',
    confirmed: 'blue',
    shipped: 'indigo',
    delivered: 'green',
    cancelled: 'red'
  };

  const orderStatusLabels = {
    pending: 'प्रतीक्षा में',
    confirmed: 'कन्फर्म',
    shipped: 'शिप हो गया',
    delivered: 'डिलीवर हो गया',
    cancelled: 'रद्द'
  };

  useEffect(() => {
    trackPageView('user_dashboard');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [ordersResponse, wishlistResponse, notificationsResponse, recommendationsResponse] = await Promise.all([
        apiService.getOrders({ limit: 5 }),
        apiService.getWishlist(),
        apiService.getNotifications({ limit: 3 }),
        apiService.get('/user/recommendations')
      ]);

      const orders = ordersResponse.success ? ordersResponse.data : [];
      const wishlist = wishlistResponse.success ? wishlistResponse.data : [];
      const notifications = notificationsResponse.success ? notificationsResponse.data : [];
      const recommendations = recommendationsResponse.success ? recommendationsResponse.data : [];

      // Calculate stats
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const activeOrders = orders.filter(order => ['pending', 'confirmed', 'shipped'].includes(order.status)).length;
      const completedOrders = orders.filter(order => order.status === 'delivered').length;

      setDashboardData({
        orders,
        recentOrders: orders.slice(0, 3),
        wishlistCount: wishlist.length,
        rewardPoints: user?.rewardPoints || 0,
        notifications,
        recommendations: recommendations.slice(0, 4)
      });

      setStats({
        totalOrders,
        totalSpent,
        activeOrders,
        completedOrders
      });

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    trackEvent('dashboard_quick_action', {
      action: action.title,
      userId: user?.id
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="डैशबोर्ड लोड हो रहा है..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>माई डैशबोर्ड - भारतशाला | User Dashboard</title>
        <meta name="description" content="अपने ऑर्डर्स, विशलिस्ट, रिवार्ड पॉइंट्स और अकाउंट की जानकारी देखें।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  नमस्ते, {user?.firstName || 'प्रिय ग्राहक'}! 👋
                </h1>
                <p className="opacity-90">
                  भारतशाला में आपका स्वागत है। यहाँ आप अपने सभी ऑर्डर्स और पसंदीदा चीजों को देख सकते हैं।
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{dashboardData.rewardPoints}</div>
                <div className="text-sm opacity-90">रिवार्ड पॉइंट्स</div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">कुल ऑर्डर्स</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">कुल खर्च</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">सक्रिय ऑर्डर्स</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-2xl">🚚</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">विशलिस्ट</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.wishlistCount}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <span className="text-2xl">❤️</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6 mb-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">त्वरित कार्य</h2>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      onClick={() => handleQuickAction(action)}
                      className={`flex items-center p-3 rounded-lg border-2 border-gray-100 hover:border-${action.color}-200 hover:bg-${action.color}-50 transition-colors duration-200`}
                    >
                      <span className="text-2xl mr-3">{action.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">नोटिफिकेशन</h2>
                  <Link to="/user/notifications" className="text-blue-600 hover:text-blue-800 text-sm">
                    सभी देखें
                  </Link>
                </div>
                
                {dashboardData.notifications.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">🔔</div>
                    <p className="text-gray-600">कोई नया नोटिफिकेशन नहीं</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.notifications.map((notification, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                        <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(notification.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Recent Orders & Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">हाल के ऑर्डर्स</h2>
                  <Link to="/user/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                    सभी ऑर्डर्स देखें
                  </Link>
                </div>

                {dashboardData.recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">कोई ऑर्डर नहीं मिला</h3>
                    <p className="text-gray-600 mb-4">अभी तक कोई ऑर्डर नहीं दिया गया है</p>
                    <Link
                      to="/markets"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      शॉपिंग शुरू करें
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">ऑर्डर #{order.id}</h3>
                            <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium bg-${orderStatusColors[order.status]}-100 text-${orderStatusColors[order.status]}-800`}>
                              {orderStatusLabels[order.status]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            {order.items?.length || 0} आइटम्स
                          </p>
                          <Link
                            to={`/user/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            विवरण देखें →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">आपके लिए सुझाव</h2>
                
                {dashboardData.recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-gray-600">अभी कोई सुझाव उपलब्ध नहीं है</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {dashboardData.recommendations.map((product, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.image || '/images/items/kundan-necklace.jpg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                            <p className="text-blue-600 font-semibold">{formatCurrency(product.price)}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                          कार्ट में जोड़ें
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;