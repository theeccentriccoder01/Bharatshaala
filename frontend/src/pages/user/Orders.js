import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserSidebar from "../../components/UserSidebar";
import "../../App.css";

const UserOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [selectedOrder, setSelectedOrder] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [_searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderStatuses = [
    { id: 'all', name: 'सभी ऑर्डर', icon: '📦', color: 'gray' },
    { id: 'pending', name: 'पेंडिंग', icon: '⏳', color: 'yellow' },
    { id: 'confirmed', name: 'कन्फर्म', icon: '✅', color: 'blue' },
    { id: 'processing', name: 'प्रोसेसिंग', icon: '⚙️', color: 'purple' },
    { id: 'shipped', name: 'शिप्ड', icon: '🚚', color: 'indigo' },
    { id: 'delivered', name: 'डिलीवर्ड', icon: '📍', color: 'green' },
    { id: 'cancelled', name: 'कैंसल', icon: '❌', color: 'red' },
    { id: 'returned', name: 'रिटर्न', icon: '↩️', color: 'orange' }
  ];

  const timePeriods = [
    { id: 'all', name: 'सभी समय' },
    { id: '7days', name: 'पिछले 7 दिन' },
    { id: '30days', name: 'पिछले 30 दिन' },
    { id: '3months', name: 'पिछले 3 महीने' },
    { id: '6months', name: 'पिछले 6 महीने' },
    { id: '1year', name: 'पिछला साल' }
  ];

  useEffect(() => {
    loadOrders();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, selectedStatus, selectedPeriod, searchTerm]);

  const loadOrders = async () => {
    try {
      const response = await axios.get('/user/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      // Mock data for demo
      setOrders([
        {
          id: 'ORD-12345',
          date: '2024-01-15',
          status: 'delivered',
          items: [
            {
              id: 1,
              name: 'कुंदन हार',
              image: '/images/items/kundan-necklace.jpg',
              price: 15000,
              quantity: 1,
              seller: 'राजस्थानी रत्न भंडार'
            }
          ],
          total: 15150,
          subtotal: 15000,
          shipping: 150,
          discount: 0,
          paymentMethod: 'UPI',
          deliveryAddress: {
            name: 'राज शर्मा',
            phone: '+91 98765 43210',
            address: '123, गांधी नगर, जयपुर, राजस्थान - 302015'
          },
          tracking: {
            number: 'TR123456789',
            url: 'https://track.example.com/TR123456789',
            currentStatus: 'Delivered',
            estimatedDelivery: '2024-01-20',
            actualDelivery: '2024-01-18'
          }
        },
        {
          id: 'ORD-12346',
          date: '2024-01-20',
          status: 'shipped',
          items: [
            {
              id: 2,
              name: 'राजस्थानी चूड़ी सेट',
              image: '/images/items/bangles.jpg',
              price: 2800,
              quantity: 2,
              seller: 'राजस्थानी रत्न भंडार'
            },
            {
              id: 3,
              name: 'मीनाकारी झुमके',
              image: '/images/items/earrings.jpg',
              price: 3500,
              quantity: 1,
              seller: 'राजस्थानी रत्न भंडार'
            }
          ],
          total: 9100,
          subtotal: 9100,
          shipping: 0,
          discount: 0,
          paymentMethod: 'Card',
          deliveryAddress: {
            name: 'राज शर्मा',
            phone: '+91 98765 43210',
            address: '123, गांधी नगर, जयपुर, राजस्थान - 302015'
          },
          tracking: {
            number: 'TR123456790',
            url: 'https://track.example.com/TR123456790',
            currentStatus: 'In Transit',
            estimatedDelivery: '2024-01-25'
          }
        },
        {
          id: 'ORD-12347',
          date: '2024-01-22',
          status: 'processing',
          items: [
            {
              id: 4,
              name: 'हस्तनिर्मित शॉल',
              image: '/images/items/shawl.jpg',
              price: 4500,
              quantity: 1,
              seller: 'कश्मीरी हैंडलूम'
            }
          ],
          total: 4650,
          subtotal: 4500,
          shipping: 150,
          discount: 0,
          paymentMethod: 'COD',
          deliveryAddress: {
            name: 'राज शर्मा',
            phone: '+91 98765 43210',
            address: '123, गांधी नगर, जयपुर, राजस्थान - 302015'
          }
        }
      ]);
    }
  };

  const filterOrders = () => {
    let filtered = orders.filter(order => {
      // Status filter
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      
      // Search filter
      const matchesSearch = searchTerm === '' || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Period filter
      let matchesPeriod = true;
      if (selectedPeriod !== 'all') {
        const orderDate = new Date(order.date);
        const now = new Date();
        const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
        
        switch (selectedPeriod) {
          case '7days': matchesPeriod = daysDiff <= 7; break;
          case '30days': matchesPeriod = daysDiff <= 30; break;
          case '3months': matchesPeriod = daysDiff <= 90; break;
          case '6months': matchesPeriod = daysDiff <= 180; break;
          case '1year': matchesPeriod = daysDiff <= 365; break;
          default: break;
        }
      }
      
      return matchesStatus && matchesSearch && matchesPeriod;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredOrders(filtered);
  };

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.id === status) || orderStatuses[0];
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      switch (action) {
        case 'cancel':
          if (window.confirm('क्या आप वाकई इस ऑर्डर को कैंसल करना चाहते हैं?')) {
            await axios.post(`/user/orders/${orderId}/cancel`);
            loadOrders();
          }
          break;
        case 'return':
          if (window.confirm('क्या आप इस ऑर्डर के लिए रिटर्न रिक्वेस्ट करना चाहते हैं?')) {
            await axios.post(`/user/orders/${orderId}/return`);
            loadOrders();
          }
          break;
        case 'track':
          const order = orders.find(o => o.id === orderId);
          if (order?.tracking?.url) {
            window.open(order.tracking.url, '_blank');
          }
          break;
        case 'reorder':
          // Add items to cart and redirect
          navigate('/bag');
          break;
        default: break;
      }
    } catch (error) {
      console.error('Order action failed:', error);
    }
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const pending = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    return { total, delivered, pending, cancelled, totalSpent };
  };

  const stats = getOrderStats();

  if (loading) {
    return <LoadingSpinner message="आपके ऑर्डर लोड हो रहे हैं..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
              मेरे ऑर्डर
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg">
              आपके सभी ऑर्डर्स की जानकारी और स्थिति देखें
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <UserSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">कुल ऑर्डर</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 dark:bg-gray-700/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-100 text-sm font-medium">डिलीवर्ड</p>
                      <p className="text-3xl font-bold">{stats.delivered}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 dark:bg-gray-700/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">प्रोसेसिंग</p>
                      <p className="text-3xl font-bold">{stats.pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 dark:bg-gray-700/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⏳</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">कुल खर्च</p>
                      <p className="text-2xl font-bold">₹{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 dark:bg-gray-700/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                
                {/* Search */}
                <div className="mb-6">
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="ऑर्डर ID या उत्पाद खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl focus:border-emerald-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4">ऑर्डर स्थिति के अनुसार</h3>
                  <div className="flex flex-wrap gap-3">
                    {orderStatuses.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setSelectedStatus(status.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          selectedStatus === status.id
                            ? `bg-${status.color}-500 text-white shadow-lg scale-105`
                            : `bg-${status.color}-100 text-${status.color}-700 hover:bg-${status.color}-200 border border-${status.color}-300`
                        }`}
                      >
                        <span>{status.icon}</span>
                        <span className='font-medium'>{status.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Period Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4">समय अवधि</h3>
                  <div className="flex flex-wrap gap-3">
                    {timePeriods.map((period) => (
                      <button
                        key={period.id}
                        onClick={() => setSelectedPeriod(period.id)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          selectedPeriod === period.id
                            ? 'bg-emerald-500 text-white shadow-lg scale-105'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 border border-emerald-300 dark:border-emerald-600'
                        }`}
                      >
                        {period.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 text-emerald-600 dark:text-emerald-400 font-medium">
                  {filteredOrders.length} ऑर्डर मिले
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length > 0 ? (
                <div className="space-y-6">
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <div key={order.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        
                        {/* Order Header */}
                        <div className={`bg-gradient-to-r from-${statusInfo.color}-500 to-${statusInfo.color}-600 p-6 text-white`}>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">ऑर्डर #{order.id}</h3>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span>📅 {new Date(order.date).toLocaleDateString('hi-IN')}</span>
                                <span>💳 {order.paymentMethod}</span>
                                <span>📦 {order.items.length} आइटम</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`inline-flex items-center space-x-2 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm rounded-full px-4 py-2 mb-2`}>
                                <span>{statusInfo.icon}</span>
                                <span className="font-medium">{statusInfo.name}</span>
                              </div>
                              <div className="text-2xl font-bold">₹{order.total.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6">
                          
                          {/* Items */}
                          <div className="space-y-4 mb-6">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-700">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">{item.name}</h4>
                                  <p className="text-emerald-600 dark:text-emerald-400 text-sm">विक्रेता: {item.seller}</p>
                                  <p className="text-emerald-600 dark:text-emerald-400 text-sm">मात्रा: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Info */}
                          {order.tracking && (
                            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center space-x-2">
                                <span>📍</span>
                                <span>ट्रैकिंग जानकारी</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-blue-600 dark:text-blue-400">ट्रैकिंग नंबर:</span>
                                  <span className="font-mono font-medium ml-2">{order.tracking.number}</span>
                                </div>
                                <div>
                                  <span className="text-blue-600 dark:text-blue-400">वर्तमान स्थिति:</span>
                                  <span className="font-medium ml-2">{order.tracking.currentStatus}</span>
                                </div>
                                {order.tracking.estimatedDelivery && (
                                  <div>
                                    <span className="text-blue-600 dark:text-blue-400">अनुमानित डिलीवरी:</span>
                                    <span className="font-medium ml-2">{new Date(order.tracking.estimatedDelivery).toLocaleDateString('hi-IN')}</span>
                                  </div>
                                )}
                                {order.tracking.actualDelivery && (
                                  <div>
                                    <span className="text-blue-600 dark:text-blue-400">वास्तविक डिलीवरी:</span>
                                    <span className="font-medium ml-2">{new Date(order.tracking.actualDelivery).toLocaleDateString('hi-IN')}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Delivery Address */}
                          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center space-x-2">
                              <span>🏠</span>
                              <span>डिलीवरी पता</span>
                            </h4>
                            <div className="text-gray-700 dark:text-gray-300">
                              <p className="font-medium">{order.deliveryAddress.name}</p>
                              <p className="text-sm">{order.deliveryAddress.phone}</p>
                              <p className="text-sm">{order.deliveryAddress.address}</p>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="flex flex-wrap gap-3">
                            {order.tracking && (
                              <button
                                onClick={() => handleOrderAction(order.id, 'track')}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <span>📍</span>
                                <span>ट्रैक करें</span>
                              </button>
                            )}
                            
                            {['pending', 'confirmed'].includes(order.status) && (
                              <button
                                onClick={() => handleOrderAction(order.id, 'cancel')}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <span>❌</span>
                                <span>कैंसल करें</span>
                              </button>
                            )}
                            
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => handleOrderAction(order.id, 'return')}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
                              >
                                <span>↩️</span>
                                <span>रिटर्न करें</span>
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleOrderAction(order.id, 'reorder')}
                              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <span>🔄</span>
                              <span>फिर से ऑर्डर करें</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                              className="border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <span>👁️</span>
                              <span>विस्तार देखें</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* No Orders */
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                    {orders.length === 0 ? 'अभी तक कोई ऑर्डर नहीं' : 'कोई ऑर्डर नहीं मिला'}
                  </h3>
                  <p className="text-emerald-600 dark:text-emerald-400 mb-6">
                    {orders.length === 0 
                      ? 'भारतशाला से अपनी पहली खरीदारी करें' 
                      : 'अपने फ़िल्टर बदलकर देखें'
                    }
                  </p>
                  <div className="flex justify-center space-x-4">
                    {orders.length === 0 ? (
                      <a
                        href="/markets"
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        खरीदारी शुरू करें
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedStatus('all');
                          setSelectedPeriod('all');
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        सभी फ़िल्टर साफ़ करें
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default UserOrders;