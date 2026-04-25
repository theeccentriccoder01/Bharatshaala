import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get } = useAPI();
  const { showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [recentActivities, setRecentActivities] = useState([]);

  const periods = [
    { id: 'today', name: 'आज' },
    { id: 'week', name: 'इस हफ्ते' },
    { id: 'month', name: 'इस महीने' },
    { id: 'quarter', name: 'इस तिमाही' },
    { id: 'year', name: 'इस साल' }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, user, selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await get(`/admin/dashboard?period=${selectedPeriod}`);
      if (response.success) {
        setDashboardData(response.data);
        setRecentActivities(response.activities);
      }
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      // Mock data for demo
      setDashboardData({
        overview: {
          totalUsers: 15420,
          newUsersToday: 89,
          totalVendors: 1250,
          pendingVendors: 23,
          totalOrders: 8965,
          ordersToday: 156,
          totalRevenue: 25670000,
          revenueToday: 89500,
          platformCommission: 1283500,
          disputesCases: 12,
          systemHealth: 98.5
        },
        charts: {
          userGrowth: [
            { date: '2025-07-30', users: 15200 },
            { date: '2025-07-31', users: 15250 },
            { date: '2025-08-01', users: 15300 },
            { date: '2025-08-02', users: 15350 },
            { date: '2025-08-03', users: 15400 },
            { date: '2025-08-04', users: 15420 }
          ],
          revenueGrowth: [
            { date: '2025-07-30', revenue: 25400000 },
            { date: '2025-07-31', revenue: 25480000 },
            { date: '2025-08-01', revenue: 25520000 },
            { date: '2025-08-02', revenue: 25580000 },
            { date: '2025-08-03', revenue: 25630000 },
            { date: '2025-08-04', revenue: 25670000 }
          ],
          categoryPerformance: [
            { category: 'Jewelry', orders: 2890, revenue: 8950000 },
            { category: 'Clothing', orders: 2150, revenue: 6780000 },
            { category: 'Handicrafts', orders: 1820, revenue: 4560000 },
            { category: 'Books', orders: 1650, revenue: 2890000 },
            { category: 'Accessories', orders: 455, revenue: 2490000 }
          ]
        },
        topVendors: [
          { id: 1, name: 'राजस्थानी जेम्स', orders: 245, revenue: 890000, rating: 4.8 },
          { id: 2, name: 'कश्मीर आर्ट्स', orders: 189, revenue: 670000, rating: 4.9 },
          { id: 3, name: 'जयपुर हैंडीक्राफ्ट्स', orders: 167, revenue: 560000, rating: 4.7 },
          { id: 4, name: 'मैसूर सिल्क हाउस', orders: 134, revenue: 450000, rating: 4.6 },
          { id: 5, name: 'दिल्ली हस्तशिल्प', orders: 112, revenue: 380000, rating: 4.5 }
        ],
        systemStats: {
          serverUptime: '99.8%',
          avgResponseTime: '245ms',
          activeConnections: 1250,
          storageUsed: '78%',
          bandwidthUsage: '456 GB',
          errorRate: '0.2%'
        }
      });

      setRecentActivities([
        {
          id: 1,
          type: 'vendor_registration',
          message: 'नया विक्रेता "गुजरात टेक्सटाइल्स" ने रजिस्ट्रेशन किया',
          timestamp: '2025-08-04T05:45:00Z',
          priority: 'medium',
          icon: '👤'
        },
        {
          id: 2,
          type: 'dispute',
          message: 'ऑर्डर #ORD-8901 में विवाद दर्ज किया गया',
          timestamp: '2025-08-04T05:30:00Z',
          priority: 'high',
          icon: '⚠️'
        },
        {
          id: 3,
          type: 'payment',
          message: 'आज ₹89,500 का भुगतान प्राप्त हुआ',
          timestamp: '2025-08-04T05:15:00Z',
          priority: 'low',
          icon: '💰'
        },
        {
          id: 4,
          type: 'system',
          message: 'सिस्टम बैकअप सफलतापूर्वक पूरा हुआ',
          timestamp: '2025-08-04T04:00:00Z',
          priority: 'low',
          icon: '💾'
        },
        {
          id: 5,
          type: 'user',
          message: 'आज 89 नए यूज़र रजिस्टर हुए',
          timestamp: '2025-08-04T03:45:00Z',
          priority: 'medium',
          icon: '📈'
        }
      ]);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    });
  };

  const getActivityPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const quickActions = [
    { id: 'user_management', name: 'यूज़र प्रबंधन', icon: '👥', href: '/admin/users' },
    { id: 'vendor_approval', name: 'विक्रेता अप्रूवल', icon: '✅', href: '/admin/vendor-approval' },
    { id: 'order_management', name: 'ऑर्डर प्रबंधन', icon: '📦', href: '/admin/orders' },
    { id: 'category_management', name: 'श्रेणी प्रबंधन', icon: '🏷️', href: '/admin/categories' },
    { id: 'content_management', name: 'कंटेंट प्रबंधन', icon: '📝', href: '/admin/content' },
    { id: 'reports', name: 'रिपोर्ट्स', icon: '📊', href: '/admin/reports' },
    { id: 'system_settings', name: 'सिस्टम सेटिंग्स', icon: '⚙️', href: '/admin/settings' },
    { id: 'security_logs', name: 'सिक्योरिटी लॉग्स', icon: '🔒', href: '/admin/security' }
  ];

  if (loading) {
    return <LoadingSpinner message="एडमिन डैशबोर्ड लोड हो रहा है..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                एडमिन डैशबोर्ड 🛡️
              </h1>
              <p className="text-slate-600 text-lg">
                भारतशाला प्लेटफॉर्म प्रबंधन केंद्र
              </p>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-slate-500 focus:outline-none"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium">कुल यूज़र</p>
                <p className="text-3xl font-bold">{dashboardData?.overview?.totalUsers?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-100 text-sm">आज नए:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                +{dashboardData?.overview?.newUsersToday}
              </span>
            </div>
          </div>

          {/* Total Vendors */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-emerald-100 text-sm font-medium">कुल विक्रेता</p>
                <p className="text-3xl font-bold">{dashboardData?.overview?.totalVendors?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-100 text-sm">पेंडिंग:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                {dashboardData?.overview?.pendingVendors}
              </span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-purple-100 text-sm font-medium">कुल ऑर्डर्स</p>
                <p className="text-3xl font-bold">{dashboardData?.overview?.totalOrders?.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-100 text-sm">आज:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                {dashboardData?.overview?.ordersToday}
              </span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-orange-100 text-sm font-medium">कुल राजस्व</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboardData?.overview?.totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-100 text-sm">आज:</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                {formatCurrency(dashboardData?.overview?.revenueToday)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">त्वरित कार्य</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => navigate(action.href)}
                className="p-4 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 text-center group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
                <p className="text-slate-700 font-medium text-sm">{action.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-6">हाल की गतिविधियां</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 border-l-4 rounded-lg ${getActivityPriorityColor(activity.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">{activity.message}</p>
                      <p className="text-slate-500 text-sm mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                      activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {activity.priority === 'high' ? 'उच्च' :
                       activity.priority === 'medium' ? 'मध्यम' : 'कम'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health & Top Vendors */}
          <div className="space-y-8">
            
            {/* System Health */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-800 mb-4">सिस्टम स्वास्थ्य</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">सर्वर अपटाइम:</span>
                  <span className="font-semibold text-green-600">{dashboardData?.systemStats?.serverUptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">रिस्पॉन्स टाइम:</span>
                  <span className="font-semibold">{dashboardData?.systemStats?.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">एक्टिव कनेक्शन्स:</span>
                  <span className="font-semibold">{dashboardData?.systemStats?.activeConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">स्टोरेज उपयोग:</span>
                  <span className="font-semibold text-orange-600">{dashboardData?.systemStats?.storageUsed}</span>
                </div>
              </div>
            </div>

            {/* Top Vendors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-800 mb-4">टॉप विक्रेता</h3>
              <div className="space-y-3">
                {dashboardData?.topVendors?.slice(0, 5).map((vendor, index) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{vendor.name}</p>
                        <p className="text-slate-500 text-sm">{vendor.orders} ऑर्डर्स</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(vendor.revenue)}</p>
                      <p className="text-yellow-500 text-sm">⭐ {vendor.rating}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
