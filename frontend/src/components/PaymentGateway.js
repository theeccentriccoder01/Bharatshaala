import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from './LoadingSpinner';

const PaymentGateway = ({
  orderDetails,
  onPaymentSuccess,
  onPaymentFailure,
  onCancel,
  isOpen = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('method'); // method, processing, success, failure
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [transactionId, setTransactionId] = useState('');
  
  const { user } = useAuth();
  const { getCartSummary } = useCart();
  const { showSuccess, showError } = useNotification();

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '/images/icons/payment/upi-icon.svg',
      description: 'Google Pay, PhonePe, Paytm',
      processingTime: '2-3 सेकंड',
      fees: 0,
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '/images/icons/payment/credit-card.svg',
      description: 'Visa, Mastercard, RuPay',
      processingTime: '30-60 सेकंड',
      fees: 0,
      popular: false
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '/images/icons/payment/net-banking.svg',
      description: 'सभी प्रमुख बैंक',
      processingTime: '1-2 मिनट',
      fees: 0,
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '/images/icons/payment/paytm-icon.svg',
      description: 'Paytm, Mobikwik, Freecharge',
      processingTime: '5-10 सेकंड',
      fees: 0,
      popular: false
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '/images/icons/payment/cod-icon.svg',
      description: 'डिलीवरी के समय भुगतान',
      processingTime: 'तुरंत',
      fees: 25,
      popular: false
    }
  ];

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', icon: '/images/icons/payment/gpay-icon.svg' },
    { id: 'phonepe', name: 'PhonePe', icon: '/images/icons/payment/phonepe-icon.svg' },
    { id: 'paytm', name: 'Paytm', icon: '/images/icons/payment/paytm-icon.svg' },
    { id: 'other', name: 'अन्य UPI ऐप', icon: '/images/icons/payment/upi-icon.svg' }
  ];

  useEffect(() => {
    if (isOpen) {
      setPaymentStep('method');
      setErrors({});
      generateTransactionId();
    }
  }, [isOpen]);

  const generateTransactionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTransactionId(`TXN${timestamp}${random}`);
  };

  const validateUPI = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
  };

  const validateCard = (cardDetails) => {
    const errors = {};
    
    // Card number validation (simplified)
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
      errors.number = 'वैध कार्ड नंबर डालें';
    }
    
    // Expiry validation
    if (!cardDetails.expiry || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiry)) {
      errors.expiry = 'MM/YY फॉर्मेट में डालें';
    }
    
    // CVV validation
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      errors.cvv = 'वैध CVV डालें';
    }
    
    // Name validation
    if (!cardDetails.name || cardDetails.name.trim().length < 2) {
      errors.name = 'कार्डधारक का नाम डालें';
    }
    
    return errors;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    setErrors({});

    try {
      let validationErrors = {};

      // Validate based on payment method
      switch (selectedMethod) {
        case 'upi':
          if (!validateUPI(upiId)) {
            validationErrors.upi = 'वैध UPI ID डालें (example@paytm)';
          }
          break;
        case 'card':
          validationErrors = validateCard(cardDetails);
          break;
        case 'cod':
          // No validation needed for COD
          break;
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setPaymentStep('method');
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      const processingTime = selectedMethod === 'upi' ? 3000 : 
                           selectedMethod === 'card' ? 5000 : 
                           selectedMethod === 'cod' ? 1000 : 4000;

      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Simulate payment success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setPaymentStep('success');
        const paymentData = {
          transactionId,
          method: selectedMethod,
          amount: orderDetails.total,
          timestamp: new Date().toISOString(),
          status: selectedMethod === 'cod' ? 'pending' : 'completed'
        };
        
        showSuccess(`भुगतान सफल! Transaction ID: ${transactionId}`);
        onPaymentSuccess?.(paymentData);
      } else {
        setPaymentStep('failure');
        const errorData = {
          transactionId,
          method: selectedMethod,
          error: 'Payment failed due to insufficient funds or network error',
          timestamp: new Date().toISOString()
        };
        
        showError('भुगतान असफल! कृपया पुनः प्रयास करें');
        onPaymentFailure?.(errorData);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setPaymentStep('failure');
      showError('भुगतान में तकनीकी समस्या');
      onPaymentFailure?.({ error: error.message });
    }

    setIsProcessing(false);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 4);
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">💳 भुगतान गेटवे</h2>
              <p className="text-emerald-100">सुरक्षित भुगतान प्रक्रिया</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-emerald-100">Transaction ID</div>
              <div className="font-mono text-lg">{transactionId}</div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        {paymentStep === 'method' && (
          <div className="p-8">
            
            {/* Order Summary */}
            <div className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <h3 className="text-lg font-bold text-emerald-800 mb-4">ऑर्डर सारांश</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">उत्पाद राशि:</span>
                  <span className="font-semibold">₹{orderDetails?.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">शिपिंग:</span>
                  <span className="font-semibold">₹{orderDetails?.shipping?.toLocaleString()}</span>
                </div>
                {orderDetails?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>छूट:</span>
                    <span className="font-semibold">-₹{orderDetails?.discount?.toLocaleString()}</span>
                  </div>
                )}
                {selectedMethod === 'cod' && (
                  <div className="flex justify-between text-orange-600">
                    <span>COD शुल्क:</span>
                    <span className="font-semibold">₹25</span>
                  </div>
                )}
                <div className="border-t border-emerald-200 pt-2 flex justify-between text-lg font-bold text-emerald-800">
                  <span>कुल राशि:</span>
                  <span>₹{(orderDetails?.total + (selectedMethod === 'cod' ? 25 : 0))?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-6">भुगतान विधि चुनें</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`relative p-6 border-2 rounded-2xl transition-all duration-300 text-left ${
                      selectedMethod === method.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                        : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-25'
                    }`}
                  >
                    {method.popular && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        लोकप्रिय
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <img src={method.icon} alt={method.name} className="w-8 h-8" />
                      <div>
                        <h4 className="font-bold text-emerald-800">{method.name}</h4>
                        <p className="text-sm text-emerald-600">{method.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>⏱️ प्रोसेसिंग टाइम: {method.processingTime}</div>
                      <div>💰 शुल्क: {method.fees > 0 ? `₹${method.fees}` : 'मुफ्त'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Details */}
            {selectedMethod === 'upi' && (
              <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-4">UPI भुगतान</h4>
                
                {/* UPI Apps */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {upiApps.map((app) => (
                    <button
                      key={app.id}
                      className="flex flex-col items-center p-4 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors duration-200"
                    >
                      <img src={app.icon} alt={app.name} className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium text-blue-800">{app.name}</span>
                    </button>
                  ))}
                </div>
                
                {/* UPI ID Input */}
                <div>
                  <label className="block text-blue-800 font-semibold mb-2">
                    UPI ID दर्ज करें
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="example@paytm"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                      errors.upi ? 'border-red-300' : 'border-blue-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.upi && <p className="text-red-500 text-sm mt-1">{errors.upi}</p>}
                </div>
              </div>
            )}

            {selectedMethod === 'card' && (
              <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-4">कार्ड विवरण</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-purple-800 font-semibold mb-2">
                      कार्ड नंबर
                    </label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => handleCardInputChange('number', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none font-mono ${
                        errors.number ? 'border-red-300' : 'border-purple-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-purple-800 font-semibold mb-2">
                      एक्सपायरी डेट
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none font-mono ${
                        errors.expiry ? 'border-red-300' : 'border-purple-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-purple-800 font-semibold mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength="4"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none font-mono ${
                        errors.cvv ? 'border-red-300' : 'border-purple-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-purple-800 font-semibold mb-2">
                      कार्डधारक का नाम
                    </label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => handleCardInputChange('name', e.target.value)}
                      placeholder="कार्ड पर लिखा नाम"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${
                        errors.name ? 'border-red-300' : 'border-purple-200 focus:border-purple-500'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'cod' && (
              <div className="mb-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-4">Cash on Delivery</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💵</span>
                  </div>
                  <div>
                    <p className="text-orange-800 font-medium">डिलीवरी के समय भुगतान करें</p>
                    <p className="text-orange-600 text-sm">अतिरिक्त शुल्क: ₹25</p>
                  </div>
                </div>
                <div className="bg-orange-100 border border-orange-300 rounded-xl p-4">
                  <h5 className="font-semibold text-orange-800 mb-2">📋 COD नियम:</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• सटीक राशि तैयार रखें</li>
                    <li>• डिलीवरी बॉय के पास चेंज नहीं होगा</li>
                    <li>• ऑर्डर refuse करने पर ₹50 पेनल्टी</li>
                    <li>• सामान चेक करने के बाद ही भुगतान करें</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-200">
              <h4 className="font-bold text-green-800 mb-3 flex items-center space-x-2">
                <span>🔒</span>
                <span>सुरक्षा गारंटी</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>256-bit SSL एन्क्रिप्शन</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>PCI DSS कॉम्प्लायंट</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>100% सुरक्षित भुगतान</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={onCancel}
                className="px-8 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors duration-300"
              >
                रद्द करें
              </button>
              
              <button
                onClick={processPayment}
                disabled={isProcessing}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>₹{(orderDetails?.total + (selectedMethod === 'cod' ? 25 : 0))?.toLocaleString()} भुगतान करें</span>
                <span>🔒</span>
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {paymentStep === 'processing' && (
          <div className="p-8 text-center">
            <LoadingSpinner />
            <h3 className="text-2xl font-bold text-emerald-800 mt-6 mb-4">
              भुगतान प्रोसेस हो रहा है...
            </h3>
            <p className="text-emerald-600 mb-8">
              कृपया प्रतीक्षा करें, यह प्रक्रिया कुछ समय ले सकती है
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <span>⚠️</span>
                <span className="font-semibold">महत्वपूर्ण:</span>
              </div>
              <p className="text-yellow-700 mt-2">
                इस पेज को बंद न करें या refresh न करें
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {paymentStep === 'success' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">✅</span>
            </div>
            
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              भुगतान सफल!
            </h3>
            <p className="text-green-600 mb-6">
              आपका भुगतान सफलतापूर्वक पूरा हो गया है
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">Transaction ID:</span>
                  <div className="font-mono font-bold text-green-800">{transactionId}</div>
                </div>
                <div>
                  <span className="text-green-600">राशि:</span>
                  <div className="font-bold text-green-800">₹{(orderDetails?.total + (selectedMethod === 'cod' ? 25 : 0))?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-green-600">भुगतान विधि:</span>
                  <div className="font-bold text-green-800">{paymentMethods.find(m => m.id === selectedMethod)?.name}</div>
                </div>
                <div>
                  <span className="text-green-600">समय:</span>
                  <div className="font-bold text-green-800">{new Date().toLocaleString('hi-IN')}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onPaymentSuccess?.()}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              ऑर्डर्स देखें
            </button>
          </div>
        )}

        {/* Failure State */}
        {paymentStep === 'failure' && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">❌</span>
            </div>
            
            <h3 className="text-2xl font-bold text-red-800 mb-4">
              भुगतान असफल
            </h3>
            <p className="text-red-600 mb-6">
              आपका भुगतान पूरा नहीं हो सका, कृपया पुनः प्रयास करें
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-red-800 mb-2">संभावित कारण:</h4>
              <ul className="text-sm text-red-700 space-y-1 text-left">
                <li>• अपर्याप्त बैलेंस</li>
                <li>• इंटरनेट कनेक्शन की समस्या</li>
                <li>• बैंक सर्वर डाउन</li>
                <li>• गलत OTP या पासवर्ड</li>
              </ul>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setPaymentStep('method')}
                className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                पुनः प्रयास करें
              </button>
              
              <button
                onClick={onCancel}
                className="border-2 border-gray-300 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                बाद में करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;