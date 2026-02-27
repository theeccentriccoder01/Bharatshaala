// Payment Methods Component - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PaymentMethods = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState('card');

  const [cardForm, setCardForm] = useState({
    type: 'credit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    holderName: '',
    isDefault: false
  });

  const [upiForm, setUpiForm] = useState({
    upiId: '',
    holderName: '',
    isDefault: false
  });

  const paymentTypes = [
    { id: 'card', name: 'कार्ड', icon: '💳', description: 'डेबिट/क्रेडिट कार्ड' },
    { id: 'upi', name: 'UPI', icon: '📱', description: 'यूपीआई आईडी' },
    { id: 'netbanking', name: 'नेट बैंकिंग', icon: '🏦', description: 'इंटरनेट बैंकिंग' },
    { id: 'wallet', name: 'वॉलेट', icon: '👛', description: 'डिजिटल वॉलेट' }
  ];

  const cardTypes = [
    { value: 'credit', label: 'क्रेडिट कार्ड' },
    { value: 'debit', label: 'डेबिट कार्ड' }
  ];

  const months = [
    { value: '01', label: '01 - जनवरी' },
    { value: '02', label: '02 - फरवरी' },
    { value: '03', label: '03 - मार्च' },
    { value: '04', label: '04 - अप्रैल' },
    { value: '05', label: '05 - मई' },
    { value: '06', label: '06 - जून' },
    { value: '07', label: '07 - जुलाई' },
    { value: '08', label: '08 - अगस्त' },
    { value: '09', label: '09 - सितंबर' },
    { value: '10', label: '10 - अक्टूबर' },
    { value: '11', label: '11 - नवंबर' },
    { value: '12', label: '12 - दिसंबर' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear + i).toString(),
    label: (currentYear + i).toString()
  }));

  useEffect(() => {
    trackPageView('payment_methods');
    loadPaymentMethods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/user/payment-methods');
      if (response.success) {
        setPaymentMethods(response.data);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    
    try {
      const data = selectedType === 'card' ? cardForm : upiForm;
      const response = await apiService.post('/user/payment-methods', {
        type: selectedType,
        ...data
      });

      if (response.success) {
        await loadPaymentMethods();
        setShowAddForm(false);
        resetForms();
        trackEvent('payment_method_added', { type: selectedType });
        alert('पेमेंट मेथड सफलतापूर्वक जोड़ा गया!');
      }
    } catch (error) {
      console.error('Failed to add payment method:', error);
      alert('पेमेंट मेथड जोड़ने में समस्या हुई');
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (window.confirm('क्या आप इस पेमेंट मेथड को हटाना चाहते हैं?')) {
      try {
        const response = await apiService.delete(`/user/payment-methods/${methodId}`);
        if (response.success) {
          await loadPaymentMethods();
          trackEvent('payment_method_deleted');
          alert('पेमेंट मेथड हटा दिया गया!');
        }
      } catch (error) {
        console.error('Failed to delete payment method:', error);
        alert('पेमेंट मेथड हटाने में समस्या हुई');
      }
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      const response = await apiService.patch(`/user/payment-methods/${methodId}/set-default`);
      if (response.success) {
        await loadPaymentMethods();
        trackEvent('payment_method_set_default');
      }
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    }
  };

  const resetForms = () => {
    setCardForm({
      type: 'credit',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      holderName: '',
      isDefault: false
    });
    setUpiForm({
      upiId: '',
      holderName: '',
      isDefault: false
    });
  };

  const formatCardNumber = (number) => {
    return number.replace(/\d{4}(?=\d)/g, '$& ');
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    const cleaned = number.replace(/\s/g, '');
    const masked = '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
    return formatCardNumber(masked);
  };

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    if (cleaned.startsWith('6')) return 'RuPay';
    return 'Card';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="पेमेंट मेथड्स लोड हो रहे हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>पेमेंट मेथड्स - भारतशाला | Payment Methods</title>
        <meta name="description" content="अपने पेमेंट मेथड्स मैनेज करें। कार्ड, UPI और अन्य पेमेंट विकल्प जोड़ें या हटाएं।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">पेमेंट मेथड्स</h1>
                <p className="text-gray-600">अपने पेमेंट विकल्प मैनेज करें</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                + नया जोड़ें
              </button>
            </div>
          </div>

          {/* Add Payment Method Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">नया पेमेंट मेथड जोड़ें</h2>
              
              {/* Payment Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  पेमेंट टाइप चुनें
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {paymentTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 border rounded-lg text-center transition-colors duration-200 ${
                        selectedType === type.id
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Form */}
              {selectedType === 'card' && (
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कार्ड टाइप
                    </label>
                    <select
                      value={cardForm.type}
                      onChange={(e) => setCardForm({...cardForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {cardTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कार्ड नंबर
                    </label>
                    <input
                      type="text"
                      maxLength="19"
                      value={formatCardNumber(cardForm.cardNumber)}
                      onChange={(e) => setCardForm({...cardForm, cardNumber: e.target.value.replace(/\s/g, '')})}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        महीना
                      </label>
                      <select
                        value={cardForm.expiryMonth}
                        onChange={(e) => setCardForm({...cardForm, expiryMonth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">महीना चुनें</option>
                        {months.map((month) => (
                          <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        साल
                      </label>
                      <select
                        value={cardForm.expiryYear}
                        onChange={(e) => setCardForm({...cardForm, expiryYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">साल चुनें</option>
                        {years.map((year) => (
                          <option key={year.value} value={year.value}>{year.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कार्डहोल्डर का नाम
                    </label>
                    <input
                      type="text"
                      value={cardForm.holderName}
                      onChange={(e) => setCardForm({...cardForm, holderName: e.target.value})}
                      placeholder="जैसा कि कार्ड पर लिखा है"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cardDefault"
                      checked={cardForm.isDefault}
                      onChange={(e) => setCardForm({...cardForm, isDefault: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="cardDefault" className="text-sm text-gray-700">
                      इसे डिफ़ॉल्ट पेमेंट मेथड बनाएं
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      कार्ड जोड़ें
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      रद्द करें
                    </button>
                  </div>
                </form>
              )}

              {/* UPI Form */}
              {selectedType === 'upi' && (
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiForm.upiId}
                      onChange={(e) => setUpiForm({...upiForm, upiId: e.target.value})}
                      placeholder="yourname@paytm / yourname@gpay"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खाताधारक का नाम
                    </label>
                    <input
                      type="text"
                      value={upiForm.holderName}
                      onChange={(e) => setUpiForm({...upiForm, holderName: e.target.value})}
                      placeholder="आपका नाम"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="upiDefault"
                      checked={upiForm.isDefault}
                      onChange={(e) => setUpiForm({...upiForm, isDefault: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="upiDefault" className="text-sm text-gray-700">
                      इसे डिफ़ॉल्ट पेमेंट मेथड बनाएं
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      UPI जोड़ें
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      रद्द करें
                    </button>
                  </div>
                </form>
              )}

              {/* Other payment types message */}
              {!['card', 'upi'].includes(selectedType) && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🚧</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">जल्द ही आने वाला है</h3>
                  <p className="text-gray-600">यह पेमेंट मेथड जल्द ही उपलब्ध होगा</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Payment Methods List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई पेमेंट मेथड नहीं मिला</h3>
                <p className="text-gray-600 mb-4">अपना पहला पेमेंट मेथड जोड़ें</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  पेमेंट मेथड जोड़ें
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">
                          {method.type === 'card' ? '💳' : 
                           method.type === 'upi' ? '📱' : 
                           method.type === 'netbanking' ? '🏦' : '👛'}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">
                              {method.type === 'card' ? 
                                `${getCardBrand(method.cardNumber)} ${method.cardType}` :
                                method.type === 'upi' ? 'UPI' : method.type}
                            </h3>
                            {method.isDefault && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                डिफ़ॉल्ट
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {method.type === 'card' ? 
                              maskCardNumber(method.cardNumber) : 
                              method.upiId || method.accountNumber}
                          </p>
                          <p className="text-sm text-gray-500">{method.holderName}</p>
                          {method.type === 'card' && (
                            <p className="text-sm text-gray-500">
                              एक्सपायरी: {method.expiryMonth}/{method.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            डिफ़ॉल्ट बनाएं
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="हटाएं"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">सुरक्षा सूचना</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• आपकी पेमेंट जानकारी 256-बिट SSL एन्क्रिप्शन से सुरक्षित है</li>
                  <li>• हम आपका CVV स्टोर नहीं करते हैं</li>
                  <li>• सभी ट्रांज़ैक्शन PCI DSS कॉम्प्लाइंट हैं</li>
                  <li>• आपकी जानकारी तीसरे पक्ष के साथ साझा नहीं की जाती</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;