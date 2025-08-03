import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import "../../App.css";

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [quickActions, setQuickActions] = useState([]);
  const navigate = useNavigate();

  const periods = [
    { id: 'today', name: 'आज', icon: '📅' },
    { id: 'week', name: 'इस सप्ताह', icon: '📊' },
    { id: 'month', name: 'इस महीने', icon: '📈' },
    { id: 'year', name: 'इस साल', icon: '📋' }
  ];

  useEffect(() => {
    loadDashboardData();
    setupQuickActions();
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      // Multiple API calls for different data
      const [salesResponse, ordersResponse, inventoryResponse, analyticsResponse] = await Promise.all([
        axios.get(`/vendor/sales?period=${selectedPeriod}`),
        axios.get(`/vendor/orders?period=${selectedPeriod}`),
        axios.get('/vendor/inventory'),
        axios.get(`/vendor/analytics?period=${selectedPeriod}`)
      ]);

      setDashboardData({
        sales: salesResponse.data,
        orders: ordersResponse.data,
        inventory: inventoryResponse.data,
        analytics: analyticsResponse.data
      });
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      // Mock data for demo
      setDashboardData({
        sales: {
          total: 125000,
          growth: 15.2,
          transactions: 87,
          avgOrderValue: 1437
        },
        orders: {
          total: 87,
          pending: 12,
          processing: 25,
          shipped: 35,
          delivered: 15,
          cancelled: 0
        },
        inventory: {
          totalProducts: 45,
          lowStock: 8,
          outOfStock: 3,
          topSelling: [
            { name: 'कुंदन हार', sales: 25, revenue: 62500 },
            { name: 'राजस्थानी चूड़ी सेट', sales: 18, revenue: 50400 },
            { name: 'मीनाकारी झुमके', sales: 15, revenue: 37500 }
          ]
        },
        analytics: {
          pageViews: 2547,
          uniqueVisitors: 1823,
          conversionRate: 4.8,
          returnCustomers: 32
        }
      });
    }
  };

  const setupQuickActions = () => {
    setQuickActions([
      { id: 'add-product', name: 'नया उत्पाद जोड़ें', icon: '➕', href: '/vendor/add-item', color: 'from-emerald-500 to-green-500' },
      { id: 'manage-orders', name: 'ऑर्डर प्रबंधन', icon: '📦', href: '/vendor/orders', color: 'from-blue-500 to-indigo-500' },
      { id: 'inventory', name: 'इन्वेंटरी देखें', icon: '📊', href: '/vendor/items', color: 'from-purple-500 to-pink-500' },
      { id: 'analytics', name: 'एनालिटिक्स', icon: '📈', href: '/vendor/analytics', color: 'from-orange-500 to-red-500' }
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="विक्रेता डैशबोर्ड लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                  विक्रेता केंद्र
                </h1>
                <p className="text-emerald-600 text-lg">
                  आपके व्यापार का संपूर्ण विवरण एक स्थान पर
                </p>
              </div>
              
              {/* Period Selector */}
              <div className="flex bg-white rounded-xl p-1 shadow-lg">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period.id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                        : 'text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    <span>{period.icon}</span>
                    <span>{period.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <VendorSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">कुल बिक्री</p>
                      <p className="text-3xl font-bold">₹{dashboardData?.sales?.total?.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      +{dashboardData?.sales?.growth}%
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">कुल ऑर्डर</p>
                      <p className="text-3xl font-bold">{dashboardData?.orders?.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-100 text-sm">लंबित:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {dashboardData?.orders?.pending}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">कुल उत्पाद</p>
                      <p className="text-3xl font-bold">{dashboardData?.inventory?.totalProducts}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-100 text-sm">कम स्टॉक:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {dashboardData?.inventory?.lowStock}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">रूपांतरण दर</p>
                      <p className="text-3xl font-bold">{dashboardData?.analytics?.conversionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-100 text-sm">विज़िटर:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                      {dashboardData?.analytics?.uniqueVisitors}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-emerald-800 mb-6">त्वरित कार्य</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <a
                      key={action.id}
                      href={action.href}
                      className={`group bg-gradient-to-br ${action.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{action.icon}</div>
                        <h4 className="font-semibold">{action.name}</h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Order Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center space-x-2">
                    <span>📋</span>
                    <span>ऑर्डर स्थिति</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { status: 'pending', name: 'लंबित', count: dashboardData?.orders?.pending, color: 'orange' },
                      { status: 'processing', name: 'प्रक्रिया में', count: dashboardData?.orders?.processing, color: 'blue' },
                      { status: 'shipped', name: 'भेजे गए', count: dashboardData?.orders?.shipped, color: 'purple' },
                      { status: 'delivered', name: 'वितरित', count: dashboardData?.orders?.delivered, color: 'green' }
                    ].map((item) => (
                      <div key={item.status} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full bg-${item.color}-500`}></div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-gray-800">{item.count}</span>
                          <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            देखें →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center space-x-2">
                    <span>🏆</span>
                    <span>सबसे ज्यादा बिकने वाले उत्पाद</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {dashboardData?.inventory?.topSelling?.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-emerald-800">{product.name}</h4>
                            <p className="text-emerald-600 text-sm">{product.sales} बिक्री</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">₹{product.revenue.toLocaleString()}</p>
                          <p className="text-emerald-500 text-sm">राजस्व</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center space-x-2">
                  <span>⚡</span>
                  <span>हाल की गतिविधि</span>
                </h3>
                
                <div className="space-y-4">
                  {[
                    { time: '2 मिनट पहले', action: 'नया ऑर्डर प्राप्त हुआ', details: '#ORD-12345 - कुंदन हार', type: 'order' },
                    { time: '15 मिनट पहले', action: 'उत्पाद स्टॉक अपडेट किया गया', details: 'राजस्थानी चूड़ी सेट - 25 यूनिट्स', type: 'inventory' },
                    { time: '1 घंटा पहले', action: 'ऑर्डर शिप किया गया', details: '#ORD-12344 - ट्रैकिंग: TR123456789', type: 'shipping' },
                    { time: '3 घंटे पहले', action: 'नई समीक्षा प्राप्त', details: '5⭐ - मीनाकारी झुमके', type: 'review' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 hover:bg-emerald-50 rounded-xl transition-colors duration-200">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'inventory' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'shipping' ? 'bg-green-100 text-green-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'order' && '📦'}
                        {activity.type === 'inventory' && '📊'}
                        {activity.type === 'shipping' && '🚚'}
                        {activity.type === 'review' && '⭐'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <p className="text-gray-600 text-sm">{activity.details}</p>
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default VendorDashboard;