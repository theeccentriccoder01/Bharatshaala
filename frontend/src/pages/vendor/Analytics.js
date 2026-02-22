import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import "../../App.css";

const VendorAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const periods = [
    { id: 'today', name: 'आज', icon: '📅' },
    { id: 'yesterday', name: 'कल', icon: '📊' },
    { id: 'last_7_days', name: 'पिछले 7 दिन', icon: '📈' },
    { id: 'last_30_days', name: 'पिछले 30 दिन', icon: '📋' },
    { id: 'last_90_days', name: 'पिछले 90 दिन', icon: '📄' },
    { id: 'this_year', name: 'इस साल', icon: '🗓️' }
  ];

  const metrics = [
    { id: 'revenue', name: 'राजस्व', icon: '💰', color: 'emerald' },
    { id: 'orders', name: 'ऑर्डर', icon: '📦', color: 'blue' },
    { id: 'customers', name: 'ग्राहक', icon: '👥', color: 'purple' },
    { id: 'views', name: 'व्यू', icon: '👁️', color: 'orange' },
    { id: 'conversion', name: 'कन्वर्शन', icon: '📊', color: 'green' }
  ];

  useEffect(() => {
    loadAnalyticsData();
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      const response = await axios.get(`/vendor/analytics?period=${selectedPeriod}`);
      if (response.data.success) {
        setAnalyticsData(response.data.analytics);
        setChartData(response.data.chartData);
      }
    } catch (error) {
      console.error("Analytics data fetch error:", error);
      // Mock comprehensive analytics data
      setAnalyticsData({
        overview: {
          totalRevenue: 145250,
          revenueGrowth: 15.2,
          totalOrders: 89,
          ordersGrowth: 12.8,
          totalCustomers: 67,
          customersGrowth: 18.5,
          averageOrderValue: 1632,
          aovGrowth: 3.2,
          conversionRate: 4.8,
          conversionGrowth: -1.2,
          totalViews: 2847,
          viewsGrowth: 22.1
        },
        revenue: {
          daily: [
            { date: '2025-07-25', amount: 4200 },
            { date: '2025-07-26', amount: 3800 },
            { date: '2025-07-27', amount: 5200 },
            { date: '2025-07-28', amount: 4900 },
            { date: '2025-07-29', amount: 6100 },
            { date: '2025-07-30', amount: 5800 },
            { date: '2025-07-31', amount: 7200 },
            { date: '2025-08-01', amount: 6800 },
            { date: '2025-08-02', amount: 5400 },
            { date: '2025-08-03', amount: 4200 }
          ],
          byCategory: [
            { category: 'jewelry', amount: 67500, percentage: 46.5 },
            { category: 'textiles', amount: 43800, percentage: 30.2 },
            { category: 'handicrafts', amount: 23400, percentage: 16.1 },
            { category: 'books', amount: 10550, percentage: 7.2 }
          ]
        },
        orders: {
          status: {
            pending: 8,
            processing: 15,
            shipped: 23,
            delivered: 38,
            cancelled: 3,
            returned: 2
          },
          timeline: [
            { date: '2025-07-25', count: 3 },
            { date: '2025-07-26', count: 2 },
            { date: '2025-07-27', count: 4 },
            { date: '2025-07-28', count: 3 },
            { date: '2025-07-29', count: 5 },
            { date: '2025-07-30', count: 4 },
            { date: '2025-07-31', count: 6 },
            { date: '2025-08-01', count: 5 },
            { date: '2025-08-02', count: 4 },
            { date: '2025-08-03', count: 3 }
          ]
        },
        customers: {
          new: 12,
          returning: 55,
          geography: [
            { state: 'राजस्थान', count: 18, percentage: 26.9 },
            { state: 'दिल्ली', count: 14, percentage: 20.9 },
            { state: 'महाराष्ट्र', count: 12, percentage: 17.9 },
            { state: 'गुजरात', count: 9, percentage: 13.4 },
            { state: 'अन्य', count: 14, percentage: 20.9 }
          ],
          ageGroups: [
            { group: '18-25', count: 23, percentage: 34.3 },
            { group: '26-35', count: 28, percentage: 41.8 },
            { group: '36-45', count: 12, percentage: 17.9 },
            { group: '46+', count: 4, percentage: 6.0 }
          ]
        },
        topProducts: [
          { id: 1, name: 'कुंदन हार', sales: 25, revenue: 62500, views: 450 },
          { id: 2, name: 'राजस्थानी चूड़ी सेट', sales: 18, revenue: 50400, views: 380 },
          { id: 3, name: 'मीनाकारी झुमके', sales: 15, revenue: 37500, views: 320 },
          { id: 4, name: 'हस्तनिर्मित शॉल', sales: 12, revenue: 54000, views: 280 },
          { id: 5, name: 'पारंपरिक पुस्तक', sales: 8, revenue: 12800, views: 220 }
        ],
        traffic: {
          sources: [
            { source: 'Organic Search', visits: 1285, percentage: 45.1 },
            { source: 'Direct', visits: 712, percentage: 25.0 },
            { source: 'Social Media', visits: 456, percentage: 16.0 },
            { source: 'Referral', visits: 284, percentage: 10.0 },
            { source: 'Email', visits: 110, percentage: 3.9 }
          ],
          devices: [
            { device: 'Mobile', visits: 1708, percentage: 60.0 },
            { device: 'Desktop', visits: 854, percentage: 30.0 },
            { device: 'Tablet', visits: 285, percentage: 10.0 }
          ]
        }
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? '📈' : '📉';
  };

  if (loading) {
    return <LoadingSpinner message="एनालिटिक्स डेटा लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                  एनालिटिक्स डैशबोर्ड
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400 text-lg">
                  आपके बिज़नेस की विस्तृत जानकारी और ट्रेंड्स
                </p>
              </div>
              
              {/* Period Selector */}
              <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg">
                {periods.map((period) => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPeriod === period.id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md'
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700'
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
              
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Revenue Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">कुल राजस्व</p>
                      <p className="text-3xl font-bold">{formatCurrency(analyticsData?.overview?.totalRevenue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.revenueGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.revenueGrowth)}</span>
                    </span>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">कुल ऑर्डर</p>
                      <p className="text-3xl font-bold">{analyticsData?.overview?.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.ordersGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.ordersGrowth)}</span>
                    </span>
                  </div>
                </div>

                {/* Customers Card */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">कुल ग्राहक</p>
                      <p className="text-3xl font-bold">{analyticsData?.overview?.totalCustomers}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.customersGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.customersGrowth)}</span>
                    </span>
                  </div>
                </div>

                {/* AOV Card */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">औसत ऑर्डर वैल्यू</p>
                      <p className="text-3xl font-bold">{formatCurrency(analyticsData?.overview?.averageOrderValue)}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💎</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.aovGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.aovGrowth)}</span>
                    </span>
                  </div>
                </div>

                {/* Conversion Rate Card */}
                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-teal-100 text-sm font-medium">कन्वर्शन रेट</p>
                      <p className="text-3xl font-bold">{analyticsData?.overview?.conversionRate}%</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.conversionGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.conversionGrowth)}</span>
                    </span>
                  </div>
                </div>

                {/* Views Card */}
                <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">कुल व्यूज़</p>
                      <p className="text-3xl font-bold">{analyticsData?.overview?.totalViews?.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👁️</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-100 text-sm">वृद्धि:</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <span>{getGrowthIcon(analyticsData?.overview?.viewsGrowth)}</span>
                      <span>{formatPercentage(analyticsData?.overview?.viewsGrowth)}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Revenue by Category */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">श्रेणी के अनुसार राजस्व</h3>
                  <div className="space-y-4">
                    {analyticsData?.revenue?.byCategory?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                            index === 0 ? 'from-emerald-400 to-green-500' :
                            index === 1 ? 'from-blue-400 to-indigo-500' :
                            index === 2 ? 'from-purple-400 to-pink-500' :
                            'from-orange-400 to-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800 dark:text-gray-100">{formatCurrency(item.amount)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">ऑर्डर स्थिति</h3>
                  <div className="space-y-4">
                    {Object.entries(analyticsData?.orders?.status || {}).map(([status, count], index) => (
                      <div key={status} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            status === 'pending' ? 'bg-yellow-500' :
                            status === 'processing' ? 'bg-blue-500' :
                            status === 'shipped' ? 'bg-purple-500' :
                            status === 'delivered' ? 'bg-green-500' :
                            status === 'cancelled' ? 'bg-red-500' :
                            'bg-orange-500'
                          }`}></div>
                          <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                            {status === 'pending' ? 'लंबित' :
                             status === 'processing' ? 'प्रक्रिया में' :
                             status === 'shipped' ? 'भेजे गए' :
                             status === 'delivered' ? 'वितरित' :
                             status === 'cancelled' ? 'रद्द' : 'वापस'}
                          </span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">सबसे ज्यादा बिकने वाले उत्पाद</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-emerald-200 dark:border-emerald-700">
                        <th className="text-left py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-200">उत्पाद</th>
                        <th className="text-center py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-200">बिक्री</th>
                        <th className="text-center py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-200">राजस्व</th>
                        <th className="text-center py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-200">व्यूज़</th>
                        <th className="text-center py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-200">कन्वर्शन</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.topProducts?.map((product, index) => (
                        <tr key={product.id} className="border-b border-emerald-100 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-gray-700">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="font-medium text-gray-800 dark:text-gray-100">{product.name}</span>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4 font-medium text-gray-800 dark:text-gray-100">{product.sales}</td>
                          <td className="text-center py-4 px-4 font-medium text-gray-800 dark:text-gray-100">{formatCurrency(product.revenue)}</td>
                          <td className="text-center py-4 px-4 font-medium text-gray-800 dark:text-gray-100">{product.views}</td>
                          <td className="text-center py-4 px-4">
                            <span className="bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full text-sm font-medium">
                              {((product.sales / product.views) * 100).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Traffic Sources & Customer Demographics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Traffic Sources */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">ट्रैफिक स्रोत</h3>
                  <div className="space-y-4">
                    {analyticsData?.traffic?.sources?.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-emerald-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800 dark:text-gray-100">{source.visits.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{source.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Geography */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">ग्राहक भूगोल</h3>
                  <div className="space-y-4">
                    {analyticsData?.customers?.geography?.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-emerald-500' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-gray-800 dark:text-gray-100">{location.state}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800 dark:text-gray-100">{location.count}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{location.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Insights & Recommendations */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">📊 इनसाइट्स और सुझाव</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <span>📈</span>
                      <span>बेस्ट परफॉर्मिंग कैटेगरी</span>
                    </h4>
                    <p className="text-emerald-100">
                      ज्वेलरी आपकी सबसे अच्छी कैटेगरी है जो कुल राजस्व का 46.5% हिस्सा है। 
                      इस कैटेगरी में और उत्पाद जोड़ने से अच्छे परिणाम मिल सकते हैं।
                    </p>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <span>🎯</span>
                      <span>कन्वर्शन सुधार</span>
                    </h4>
                    <p className="text-emerald-100">
                      आपका कन्वर्शन रेट 4.8% है जो अच्छा है, लेकिन बेहतर उत्पाद फोटो और विवरण 
                      से इसे और बेहतर बनाया जा सकता है।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default VendorAnalytics;