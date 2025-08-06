// Performance Reports Component - Bharatshaala Vendor Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PerformanceReports = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [reportData, setReportData] = useState({
    summary: {},
    salesData: [],
    productPerformance: [],
    customerInsights: {},
    trends: {}
  });

  const dateRanges = [
    { value: 'today', label: 'आज' },
    { value: 'yesterday', label: 'कल' },
    { value: 'last_7_days', label: 'पिछले 7 दिन' },
    { value: 'last_30_days', label: 'पिछले 30 दिन' },
    { value: 'last_90_days', label: 'पिछले 90 दिन' },
    { value: 'this_month', label: 'इस महीने' },
    { value: 'last_month', label: 'पिछला महीना' },
    { value: 'this_year', label: 'इस साल' },
    { value: 'custom', label: 'कस्टम रेंज' }
  ];

  const [customDates, setCustomDates] = useState({
    startDate: '',
    endDate: ''
  });

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'ओवरव्यू', icon: '📊' },
    { id: 'sales', name: 'सेल्स', icon: '💰' },
    { id: 'products', name: 'प्रोडक्ट्स', icon: '📦' },
    { id: 'customers', name: 'कस्टमर्स', icon: '👥' },
    { id: 'trends', name: 'ट्रेंड्स', icon: '📈' }
  ];

  useEffect(() => {
    trackPageView('vendor_performance_reports');
    loadReportData();
  }, [dateRange, customDates]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const params = {
        range: dateRange,
        ...(dateRange === 'custom' && customDates.startDate && customDates.endDate && {
          startDate: customDates.startDate,
          endDate: customDates.endDate
        })
      };

      const response = await apiService.get('/vendor/performance-reports', params);
      if (response.success) {
        setReportData(response.data);
      }
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const params = {
        range: dateRange,
        format,
        ...(dateRange === 'custom' && customDates.startDate && customDates.endDate && {
          startDate: customDates.startDate,
          endDate: customDates.endDate
        })
      };

      const response = await apiService.get('/vendor/export-report', params);
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `performance_report_${dateRange}.${format}`;
        link.click();

        trackEvent('report_exported', { format, dateRange });
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('रिपोर्ट एक्सपोर्ट करने में समस्या हुई');
    }
  };

  const getPerformanceColor = (value, benchmark) => {
    if (value >= benchmark * 1.2) return 'text-green-600';
    if (value >= benchmark * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="रिपोर्ट लोड हो रही है..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>परफॉर्मेंस रिपोर्ट्स - भारतशाला वेंडर | Performance Reports</title>
        <meta name="description" content="अपनी सेल्स, प्रोडक्ट परफॉर्मेंस और कस्टमर इनसाइट्स देखें। विस्तृत एनालिटिक्स और ट्रेंड्स एनालिसिस।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">परफॉर्मेंस रिपोर्ट्स</h1>
                <p className="text-gray-600">आपके बिज़नेस की विस्तृत एनालिटिक्स</p>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                {/* Date Range Selector */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {dateRanges.map((range) => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>

                {/* Export Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportReport('pdf')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    PDF Export
                  </button>
                  <button
                    onClick={() => exportReport('excel')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Excel Export
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <div className="mt-4 flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    शुरुआती तारीख
                  </label>
                  <input
                    type="date"
                    value={customDates.startDate}
                    onChange={(e) => setCustomDates({...customDates, startDate: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    अंतिम तारीख
                  </label>
                  <input
                    type="date"
                    value={customDates.endDate}
                    onChange={(e) => setCustomDates({...customDates, endDate: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">कुल सेल्स</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.summary?.totalSales || 0)}
                  </p>
                  <p className={`text-sm ${getPerformanceColor(reportData.summary?.salesGrowth || 0, 10)}`}>
                    {reportData.summary?.salesGrowth > 0 ? '↗' : '↘'} 
                    {Math.abs(reportData.summary?.salesGrowth || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
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
                  <p className="text-sm text-gray-600 mb-1">कुल ऑर्डर्स</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.summary?.totalOrders || 0}
                  </p>
                  <p className={`text-sm ${getPerformanceColor(reportData.summary?.orderGrowth || 0, 5)}`}>
                    {reportData.summary?.orderGrowth > 0 ? '↗' : '↘'} 
                    {Math.abs(reportData.summary?.orderGrowth || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">📦</span>
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
                  <p className="text-sm text-gray-600 mb-1">औसत ऑर्डर वैल्यू</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(reportData.summary?.averageOrderValue || 0)}
                  </p>
                  <p className={`text-sm ${getPerformanceColor(reportData.summary?.aovGrowth || 0, 5)}`}>
                    {reportData.summary?.aovGrowth > 0 ? '↗' : '↘'} 
                    {Math.abs(reportData.summary?.aovGrowth || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">📊</span>
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
                  <p className="text-sm text-gray-600 mb-1">नए कस्टमर्स</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.summary?.newCustomers || 0}
                  </p>
                  <p className={`text-sm ${getPerformanceColor(reportData.summary?.customerGrowth || 0, 10)}`}>
                    {reportData.summary?.customerGrowth > 0 ? '↗' : '↘'} 
                    {Math.abs(reportData.summary?.customerGrowth || 0).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">सेल्स ट्रेंड</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">इस महीने</span>
                          <span className="font-semibold">
                            {formatCurrency(reportData.trends?.thisMonth || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">पिछला महीना</span>
                          <span className="font-semibold">
                            {formatCurrency(reportData.trends?.lastMonth || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Growth</span>
                          <span className={`font-semibold ${
                            calculateGrowth(reportData.trends?.thisMonth, reportData.trends?.lastMonth) > 0 
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {calculateGrowth(reportData.trends?.thisMonth, reportData.trends?.lastMonth).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">टॉप परफॉर्मिंग कैटेगरी</h3>
                      <div className="space-y-3">
                        {(reportData.summary?.topCategories || []).slice(0, 5).map((category, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{category.name}</span>
                            <span className="font-semibold">{formatCurrency(category.sales)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">के इनसाइट्स</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.summary?.conversionRate || 0}%
                        </div>
                        <div className="text-sm text-blue-800">कन्वर्जन रेट</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.summary?.returnRate || 0}%
                        </div>
                        <div className="text-sm text-blue-800">रिटर्न रेट</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {reportData.summary?.customerSatisfaction || 0}/5
                        </div>
                        <div className="text-sm text-blue-800">कस्टमर सैटिस्फैक्शन</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Sales Tab */}
              {activeTab === 'sales' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">दैनिक सेल्स ट्रेंड</h3>
                      <div className="bg-gray-50 rounded-lg p-4 h-64 flex items-center justify-center">
                        <p className="text-gray-500">चार्ट प्लेसहोल्डर - दैनिक सेल्स ग्राफ</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">सेल्स बाई कैटेगरी</h3>
                      <div className="space-y-3">
                        {(reportData.salesData || []).slice(0, 8).map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">{item.category}</span>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(item.amount)}</div>
                              <div className="text-sm text-gray-600">{item.orders} ऑर्डर्स</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">प्रोडक्ट परफॉर्मेंस</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">प्रोडक्ट</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">सेल्स</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">ऑर्डर्स</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">रेवेन्यू</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">रेटिंग</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportData.productPerformance || []).slice(0, 10).map((product, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={product.image || '/placeholder-product.png'} 
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                                <span className="font-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{product.unitsSold}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.orders}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatCurrency(product.revenue)}</td>
                            <td className="border border-gray-300 px-4 py-2">
                              <div className="flex items-center">
                                <span className="mr-1">⭐</span>
                                <span>{product.rating || 0}/5</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Customers Tab */}
              {activeTab === 'customers' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">कस्टमर सेगमेंट्स</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>नए कस्टमर्स</span>
                          <span className="font-semibold">{reportData.customerInsights?.newCustomers || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>रिपीट कस्टमर्स</span>
                          <span className="font-semibold">{reportData.customerInsights?.repeatCustomers || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>वीआईपी कस्टमर्स</span>
                          <span className="font-semibold">{reportData.customerInsights?.vipCustomers || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">टॉप कस्टमर्स</h3>
                      <div className="space-y-3">
                        {(reportData.customerInsights?.topCustomers || []).slice(0, 5).map((customer, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{customer.name}</span>
                            <span className="font-semibold">{formatCurrency(customer.totalSpent)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">कस्टमर मेट्रिक्स</h3>
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {reportData.customerInsights?.averageLifetimeValue || 0}
                          </div>
                          <div className="text-sm text-gray-600">औसत लाइफटाइम वैल्यू</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {reportData.customerInsights?.retentionRate || 0}%
                          </div>
                          <div className="text-sm text-gray-600">रिटेंशन रेट</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Trends Tab */}
              {activeTab === 'trends' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">सीज़नल ट्रेंड्स</h3>
                      <div className="space-y-3">
                        {(reportData.trends?.seasonal || []).map((trend, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{trend.period}</span>
                            <div className="text-right">
                              <div className="font-semibold">{formatCurrency(trend.sales)}</div>
                              <div className={`text-sm ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.growth > 0 ? '↗' : '↘'} {Math.abs(trend.growth)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">ट्रेंडिंग प्रोडक्ट्स</h3>
                      <div className="space-y-3">
                        {(reportData.trends?.trendingProducts || []).slice(0, 5).map((product, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{product.name}</span>
                            <div className="text-right">
                              <div className="font-semibold">{product.sales} यूनिट्स</div>
                              <div className="text-sm text-green-600">↗ {product.growth}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">📊 ट्रेंड इनसाइट्स</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">बेस्ट परफॉर्मिंग डेज</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          {(reportData.trends?.bestDays || []).map((day, index) => (
                            <li key={index}>• {day}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">रेकमेंडेशन्स</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          {(reportData.trends?.recommendations || []).map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerformanceReports;