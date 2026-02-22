import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { get } = useAPI();
  const { showError } = useNotification();

  const [orderTracking, setOrderTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadTrackingInfo();
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadTrackingInfo, 30000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const loadTrackingInfo = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await get(`/orders/${orderId}/track`);
      if (response.success) {
        setOrderTracking(response.tracking);
      }
    } catch (error) {
      console.error('Error loading tracking info:', error);
      // Mock data for demo
      setOrderTracking({
        orderId: orderId,
        orderNumber: `ORD-${orderId}`,
        status: 'shipped',
        currentLocation: 'मुंबई सॉर्टिंग हब',
        estimatedDelivery: '2025-08-06',
        trackingNumber: 'TRK123456789',
        carrier: 'Bharatshaala Express',
        orderDate: '2025-08-02',
        items: [
          {
            id: 1,
            name: 'कुंदन पर्ल नेकलेस सेट',
            image: '/images/items/kundan-necklace-1.jpg',
            quantity: 1,
            seller: 'राजस्थानी जेम्स'
          }
        ],
        timeline: [
          {
            status: 'placed',
            statusHindi: 'ऑर्डर प्लेसड',
            description: 'आपका ऑर्डर सफलतापूर्वक प्लेस हो गया है',
            timestamp: '2025-08-02T10:30:00Z',
            location: 'ऑनलाइन',
            completed: true,
            icon: '📝'
          },
          {
            status: 'confirmed',
            statusHindi: 'कन्फर्म',
            description: 'विक्रेता द्वारा ऑर्डर कन्फर्म किया गया',
            timestamp: '2025-08-02T11:15:00Z',
            location: 'जयपुर, राजस्थान',
            completed: true,
            icon: '✅'
          },
          {
            status: 'packed',
            statusHindi: 'पैक किया गया',
            description: 'आपका ऑर्डर पैक हो गया है और शिपमेंट के लिए तैयार है',
            timestamp: '2025-08-03T09:45:00Z',
            location: 'जयपुर फुलफिलमेंट सेंटर',
            completed: true,
            icon: '📦'
          },
          {
            status: 'shipped',
            statusHindi: 'शिप किया गया',
            description: 'आपका पैकेज डिलीवरी के लिए भेज दिया गया है',
            timestamp: '2025-08-03T18:20:00Z',
            location: 'जयपुर',
            completed: true,
            icon: '🚚',
            current: true
          },
          {
            status: 'in_transit',
            statusHindi: 'ट्रांज़िट में',
            description: 'पैकेज आपके शहर की तरफ आ रहा है',
            timestamp: '2025-08-04T06:00:00Z',
            location: 'मुंबई सॉर्टिंग हब',
            completed: false,
            icon: '🛣️'
          },
          {
            status: 'out_for_delivery',
            statusHindi: 'डिलीवरी के लिए निकला',
            description: 'आपका पैकेज डिलीवरी के लिए निकल गया है',
            timestamp: null,
            location: 'मुंबई',
            completed: false,
            icon: '🏃'
          },
          {
            status: 'delivered',
            statusHindi: 'डिलीवर हुआ',
            description: 'आपका ऑर्डर सफलतापूर्वक डिलीवर हो गया है',
            timestamp: null,
            location: 'मुंबई',
            completed: false,
            icon: '🎉'
          }
        ],
        deliveryAddress: {
          name: 'राम शर्मा',
          phone: '+91 9876543210',
          address: '123, मेन स्ट्रीट, अंधेरी वेस्ट, मुंबई - 400058'
        },
        supportContact: {
          phone: '+91 1800-123-4567',
          email: 'support@bharatshaala.com',
          whatsapp: '+91 9876543210'
        }
      });
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    loadTrackingInfo(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-500',
      confirmed: 'bg-green-500',
      packed: 'bg-purple-500',
      shipped: 'bg-orange-500',
      in_transit: 'bg-yellow-500',
      out_for_delivery: 'bg-indigo-500',
      delivered: 'bg-emerald-500'
    };
    return colors[status] || 'bg-gray-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDeliveryMessage = () => {
    const today = new Date();
    const deliveryDate = new Date(orderTracking.estimatedDelivery);
    const diffTime = deliveryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'आज डिलीवरी होगी';
    if (diffDays === 1) return 'कल डिलीवरी होगी';
    if (diffDays > 1) return `${diffDays} दिन में डिलीवरी होगी`;
    return 'डिलीवरी हो चुकी है';
  };

  if (loading) {
    return <LoadingSpinner message="ट्रैकिंग जानकारी लोड हो रही है..." />;
  }

  if (!orderTracking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">ऑर्डर नहीं मिला</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">कृपया सही ऑर्डर नंबर डालें</p>
          <button
            onClick={() => navigate('/user/orders')}
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
          >
            मेरे ऑर्डर्स देखें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                ऑर्डर ट्रैकिंग
              </h1>
              <p className="text-emerald-600 dark:text-emerald-400">
                ऑर्डर नंबर: <span className="font-bold">{orderTracking.orderNumber}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                ट्रैकिंग नंबर: <span className="font-mono">{orderTracking.trackingNumber}</span>
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
              <span>{refreshing ? 'रिफ्रेश हो रहा है...' : 'रिफ्रेश करें'}</span>
            </button>
          </div>

          {/* Current Status */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">वर्तमान स्थिति</h2>
                <p className="text-emerald-100 dark:text-emerald-300 mb-1">
                  {orderTracking.timeline.find(t => t.current)?.statusHindi || 'अपडेट हो रहा है...'}
                </p>
                <p className="text-emerald-100 dark:text-emerald-300 text-sm">
                  स्थान: {orderTracking.currentLocation}
                </p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 dark:text-emerald-300 text-sm">अनुमानित डिलीवरी</p>
                <p className="text-xl font-bold">
                  {new Date(orderTracking.estimatedDelivery).toLocaleDateString('hi-IN')}
                </p>
                <p className="text-emerald-100 dark:text-emerald-300 text-sm">
                  {getEstimatedDeliveryMessage()}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4">ऑर्डर किए गए आइटम</h3>
            <div className="space-y-3">
              {orderTracking.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">{item.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300">विक्रेता: {item.seller}</p>
                    <p className="text-gray-600 dark:text-gray-300">मात्रा: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-8">ट्रैकिंग टाइमलाइन</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
            
            <div className="space-y-8">
              {orderTracking.timeline.map((event, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl ${
                    event.completed ? getStatusColor(event.status) : 'bg-gray-300 dark:bg-gray-600'
                  } ${event.current ? 'ring-4 ring-yellow-300 dark:ring-yellow-600 animate-pulse' : ''}`}>
                    {event.icon}
                  </div>
                  
                  {/* Event Content */}
                  <div className={`flex-1 ${event.completed ? '' : 'opacity-50'}`}>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-6 border-l-4 border-emerald-500 dark:border-emerald-400">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className={`text-lg font-bold ${event.completed ? 'text-emerald-800 dark:text-emerald-200' : 'text-gray-600 dark:text-gray-300'}`}>
                          {event.statusHindi}
                          {event.current && (
                            <span className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                              वर्तमान
                            </span>
                          )}
                        </h4>
                        {event.timestamp && (
                          <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                            {formatDate(event.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{event.description}</p>
                      
                      <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 text-sm">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                      
                      {event.current && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                          <p className="text-yellow-800 dark:text-yellow-400 text-sm font-medium">
                            📱 अगला अपडेट 2-4 घंटे में मिलेगा
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Address & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Delivery Address */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center space-x-2">
              <span>📍</span>
              <span>डिलीवरी पता</span>
            </h3>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-4">
              <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">{orderTracking.deliveryAddress.name}</h4>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{orderTracking.deliveryAddress.phone}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{orderTracking.deliveryAddress.address}</p>
            </div>
          </div>

          {/* Support Contact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center space-x-2">
              <span>📞</span>
              <span>सहायता संपर्क</span>
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${orderTracking.supportContact.phone}`}
                className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="text-blue-600 dark:text-blue-400 text-xl">📱</span>
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-400">कॉल करें</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">{orderTracking.supportContact.phone}</p>
                </div>
              </a>
              
              <a
                href={`https://wa.me/${orderTracking.supportContact.whatsapp.replace(/[^0-9]/g, '')}?text=ऑर्डर%20नंबर:%20${orderTracking.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="text-green-600 dark:text-green-400 text-xl">💬</span>
                <div>
                  <p className="font-medium text-green-800 dark:text-green-400">WhatsApp</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">तुरंत सहायता पाएं</p>
                </div>
              </a>
              
              <a
                href={`mailto:${orderTracking.supportContact.email}?subject=ऑर्डर%20${orderTracking.orderNumber}%20सहायता`}
                className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="text-purple-600 dark:text-purple-400 text-xl">✉️</span>
                <div>
                  <p className="font-medium text-purple-800 dark:text-purple-400">ईमेल करें</p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">{orderTracking.supportContact.email}</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-emerald-800 dark:text-emerald-200 mb-4">त्वरित कार्य</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate(`/order-confirmation/${orderId}`)}
              className="bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 p-4 rounded-xl hover:bg-emerald-200 dark:hover:bg-gray-700 transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📄</div>
              <div className="text-sm font-medium">ऑर्डर विवरण</div>
            </button>
            
            <button
              onClick={() => window.open(`/api/orders/${orderId}/invoice`, '_blank')}
              className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl hover:bg-blue-200 transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">इनवॉइस डाउनलोड</div>
            </button>
            
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'ऑर्डर ट्रैकिंग',
                    text: `मेरा ऑर्डर ${orderTracking.orderNumber} ट्रैक करें`,
                    url: window.location.href
                  });
                }
              }}
              className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 p-4 rounded-xl hover:bg-purple-200 transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📤</div>
              <div className="text-sm font-medium">शेयर करें</div>
            </button>
            
            <button
              onClick={() => navigate('/user/orders')}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium">सभी ऑर्डर्स</div>
            </button>
          </div>
        </div>

        {/* Carrier Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            परिवहन साथी: <span className="font-semibold">{orderTracking.carrier}</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            ट्रैकिंग जानकारी हर 30 सेकंड में अपडेट होती है
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;