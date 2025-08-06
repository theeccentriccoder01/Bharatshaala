// Order Management Component for Bharatshala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import apiService from '../apiService';
import { helpers } from '../helpers';
import { ORDER_STATUS } from '../constants';

const OrderManagement = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({
    trackingNumber: '',
    courier: '',
    estimatedDelivery: ''
  });

  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadOrders();
    loadOrderStats();
  }, [currentPage, searchTerm, filterStatus, filterPayment, dateRange]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/orders', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: filterStatus,
          payment: filterPayment,
          dateRange,
          limit: 20
        }
      });

      if (response.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      showError('ऑर्डर लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const loadOrderStats = async () => {
    try {
      const response = await apiService.get('/admin/orders/stats', {
        params: { dateRange }
      });

      if (response.success) {
        setOrderStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load order stats:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await apiService.patch(`/admin/orders/${orderId}/status`, {
        status: newStatus,
        updatedBy: user.id
      });

      if (response.success) {
        showSuccess('ऑर्डर स्टेटस अपडेट हो गया');
        loadOrders();
        loadOrderStats();
        
        trackEvent('order_status_updated', {
          orderId,
          newStatus,
          adminId: user.id
        });
      }
    } catch (error) {
      showError('स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await apiService.get(`/admin/orders/${orderId}`);
      
      if (response.success) {
        setSelectedOrder(response.data);
        setShowDetailsModal(true);
        
        trackEvent('order_details_viewed', {
          orderId,
          adminId: user.id
        });
      }
    } catch (error) {
      showError('ऑर्डर विवरण लोड करने में त्रुटि');
    }
  };

  const handleAddTracking = (order) => {
    setSelectedOrder(order);
    setTrackingInfo({
      trackingNumber: order.trackingNumber || '',
      courier: order.courier || '',
      estimatedDelivery: order.estimatedDelivery || ''
    });
    setShowTrackingModal(true);
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await apiService.patch(`/admin/orders/${selectedOrder.id}/tracking`, trackingInfo);
      
      if (response.success) {
        showSuccess('ट्रैकिंग जानकारी अपडेट हो गई');
        setShowTrackingModal(false);
        loadOrders();
        
        trackEvent('order_tracking_updated', {
          orderId: selectedOrder.id,
          trackingNumber: trackingInfo.trackingNumber
        });
      }
    } catch (error) {
      showError('ट्रैकिंग अपडेट करने में त्रुटि');
    }
  };

  const handleExportOrders = async () => {
    try {
      const response = await apiService.get('/admin/orders/export', {
        params: {
          status: filterStatus,
          payment: filterPayment,
          dateRange
        },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      trackEvent('orders_exported', {
        filterStatus,
        filterPayment,
        dateRange
      });
    } catch (error) {
      showError('ऑर्डर एक्सपोर्ट करने में त्रुटि');
    }
  };

  const getStatusColor = (status) => {
    const statusConfig = ORDER_STATUS[status.toUpperCase()];
    return statusConfig ? statusConfig.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const statusConfig = ORDER_STATUS[status.toUpperCase()];
    return statusConfig ? statusConfig.label : status;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      case 'refunded': return 'blue';
      default: return 'gray';
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status) {
      case 'paid': return 'भुगतान हो गया';
      case 'pending': return 'भुगतान पेंडिंग';
      case 'failed': return 'भुगतान असफल';
      case 'refunded': return 'रिफंड हो गया';
      default: return status;
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="ऑर्डर लोड हो रहे हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ऑर्डर प्रबंधन</h1>
          <p className="text-gray-600 mt-1">सभी ऑर्डर को प्रबंधित करें</p>
        </div>
        <button
          onClick={handleExportOrders}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          ऑर्डर एक्सपोर्ट करें
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📦</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">कुल ऑर्डर</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⏳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">पेंडिंग</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">⚙️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">प्रोसेसिंग</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.processing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-lg">🚚</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">शिप्ड</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.shipped}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">डिलीवर्ड</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">❌</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">कैंसल्ड</p>
              <p className="text-lg font-semibold text-gray-900">{orderStats.cancelled}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">💰</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500">कुल रेवेन्यू</p>
              <p className="text-lg font-semibold text-gray-900">
                {helpers.number.formatCurrency(orderStats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="ऑर्डर ID या ग्राहक नाम खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी स्टेटस</option>
              <option value="pending">पेंडिंग</option>
              <option value="confirmed">कन्फर्म</option>
              <option value="processing">प्रोसेसिंग</option>
              <option value="shipped">शिप्ड</option>
              <option value="delivered">डिलीवर्ड</option>
              <option value="cancelled">कैंसल्ड</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी पेमेंट</option>
              <option value="paid">पेड</option>
              <option value="pending">पेंडिंग</option>
              <option value="failed">फेल्ड</option>
              <option value="refunded">रिफंडेड</option>
            </select>
          </div>
          
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी समय</option>
              <option value="today">आज</option>
              <option value="yesterday">कल</option>
              <option value="last7days">पिछले 7 दिन</option>
              <option value="last30days">पिछले 30 दिन</option>
              <option value="thismonth">इस महीने</option>
              <option value="lastmonth">पिछले महीने</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPayment('all');
                setDateRange('all');
                setCurrentPage(1);
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              फिल्टर रीसेट करें
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ऑर्डर ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ग्राहक
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  उत्पाद
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  राशि
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ऑर्डर स्टेटस
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  पेमेंट स्टेटस
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ऑर्डर की तारीख
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  कार्य
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length > 1 
                          ? `${order.items[0].productName} और ${order.items.length - 1} अन्य`
                          : order.items?.[0]?.productName
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        कुल {order.items?.length} आइटम
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {helpers.number.formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}
                      >
                        <option value="pending">पेंडिंग</option>
                        <option value="confirmed">कन्फर्म</option>
                        <option value="processing">प्रोसेसिंग</option>
                        <option value="packed">पैक्ड</option>
                        <option value="shipped">शिप्ड</option>
                        <option value="out_for_delivery">डिलीवरी के लिए</option>
                        <option value="delivered">डिलीवर्ड</option>
                        <option value="cancelled">कैंसल्ड</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getPaymentStatusColor(order.paymentStatus)}-100 text-${getPaymentStatusColor(order.paymentStatus)}-800`}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {helpers.date.formatDate(order.createdAt, 'DD MMM YYYY, hh:mm A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(order.id)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          विवरण
                        </button>
                        {(order.status === 'shipped' || order.status === 'out_for_delivery') && (
                          <button
                            onClick={() => handleAddTracking(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            ट्रैकिंग
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>