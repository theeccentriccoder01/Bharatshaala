import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { get } = useAPI();
  const { showSuccess } = useNotification();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
      showSuccess('ऑर्डर सफलतापूर्वक प्लेस हो गया!');
    }
  }, [orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await get(`/orders/${orderId}`);
      if (response.success) {
        setOrder(response.order);
      }
    } catch (error) {
      console.error('Error loading order:', error);
      // Mock data for demo
      setOrder({
        id: orderId,
        orderNumber: `ORD-${orderId}`,
        status: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            id: 1,
            name: 'कुंदन पर्ल नेकलेस सेट',
            image: '/images/items/kundan-necklace-1.jpg',
            price: 15999,
            quantity: 1,
            seller: 'राजस्थानी जेम्स'
          }
        ],
        address: {
          name: 'राम शर्मा',
          phone: '+91 9876543210',
          addressLine1: '123, मेन स्ट्रीट',
          city: 'जयपुर',
          state: 'राजस्थान',
          pincode: '302001'
        },
        payment: {
          method: 'UPI',
          transactionId: 'TXN1234567890',
          amount: 16098,
          status: 'completed'
        },
        summary: {
          subtotal: 15999,
          shipping: 99,
          discount: 0,
          total: 16098
        }
      });
    }
    setLoading(false);
  };

  const downloadInvoice = () => {
    // Generate and download invoice
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'मेरा ऑर्डर',
        text: `मैंने भारतशाला से ऑर्डर किया है! ऑर्डर नंबर: ${order.orderNumber}`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="ऑर्डर विवरण लोड हो रहा है..." />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ऑर्डर नहीं मिला</h2>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">✅</span>
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            ऑर्डर कन्फर्म हो गया!
          </h1>
          <p className="text-xl text-emerald-600 mb-2">
            धन्यवाद! आपका ऑर्डर सफलतापूर्वक प्लेस हो गया है।
          </p>
          <p className="text-emerald-500">
            ऑर्डर नंबर: <span className="font-bold text-emerald-700">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">ऑर्डर विवरण</h2>
                <p>ऑर्डर दिनांक: {new Date(order.orderDate).toLocaleDateString('hi-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-100">स्थिति</p>
                <span className="bg-white text-emerald-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {order.status === 'confirmed' ? 'कन्फर्म' : order.status}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-emerald-800 mb-4">ऑर्डर ट्रैकिंग</h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <p className="text-xs mt-2 text-center">ऑर्डर प्लेसड</p>
                <p className="text-xs text-gray-500">आज</p>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200 mx-2">
                <div className="h-1 bg-green-500 w-0"></div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">📦</span>
                </div>
                <p className="text-xs mt-2 text-center">पैकेजिंग</p>
                <p className="text-xs text-gray-500">1-2 दिन</p>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">🚚</span>
                </div>
                <p className="text-xs mt-2 text-center">शिप्ड</p>
                <p className="text-xs text-gray-500">2-3 दिन</p>
              </div>
              
              <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">🏠</span>
                </div>
                <p className="text-xs mt-2 text-center">डिलीवर्ड</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.estimatedDelivery).toLocaleDateString('hi-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-emerald-800 mb-4">ऑर्डर किए गए आइटम</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-800">{item.name}</h4>
                    <p className="text-gray-600">विक्रेता: {item.seller}</p>
                    <p className="text-gray-600">मात्रा: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-800">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-emerald-800 mb-4">भुगतान विवरण</h3>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>उत्पाद राशि:</span>
                  <span>₹{order.summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>डिलीवरी चार्ज:</span>
                  <span>₹{order.summary.shipping.toLocaleString()}</span>
                </div>
                {order.summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>छूट:</span>
                    <span>-₹{order.summary.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-emerald-200 pt-2 flex justify-between text-lg font-bold text-emerald-800">
                  <span>कुल राशि:</span>
                  <span>₹{order.summary.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">भुगतान विधि:</span>
                  <span>{order.payment.method}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-semibold">Transaction ID:</span>
                  <span className="font-mono text-sm">{order.payment.transactionId}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-semibold">भुगतान स्थिति:</span>
                  <span className="text-green-600">✅ सफल</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6">
            <h3 className="font-bold text-emerald-800 mb-4">डिलीवरी पता</h3>
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-emerald-800">{order.address.name}</h4>
              <p className="text-gray-700 mt-1">{order.address.phone}</p>
              <p className="text-gray-700 mt-1">
                {order.address.addressLine1}<br />
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="bg-emerald-500 text-white py-3 px-6 rounded-xl hover:bg-emerald-600 transition-colors duration-200 text-center"
          >
            📍 ऑर्डर ट्रैक करें
          </button>
          
          <button
            onClick={downloadInvoice}
            className="bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors duration-200 text-center"
          >
            📄 इनवॉइस डाउनलोड करें
          </button>
          
          <button
            onClick={shareOrder}
            className="bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-600 transition-colors duration-200 text-center"
          >
            📤 शेयर करें
          </button>
          
          <button
            onClick={() => navigate('/user/orders')}
            className="bg-gray-500 text-white py-3 px-6 rounded-xl hover:bg-gray-600 transition-colors duration-200 text-center"
          >
            📋 सभी ऑर्डर्स देखें
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-800 mb-3">📱 अगले स्टेप्स</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center space-x-2">
              <span>✓</span>
              <span>आपको ऑर्डर कन्फर्मेशन का SMS/Email मिलेगा</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>✓</span>
              <span>विक्रेता आपके ऑर्डर को प्रोसेस करेगा</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>✓</span>
              <span>शिपमेंट का ट्रैकिंग लिंक मिलेगा</span>
            </li>
            <li className="flex items-center space-x-2">
              <span>✓</span>
              <span>डिलीवरी के बाद प्रोडक्ट को रेट करना न भूलें</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;