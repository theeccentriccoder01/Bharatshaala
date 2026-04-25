// Payment Settings Component - Bharatshaala Vendor Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PaymentSettings = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paymentData, setPaymentData] = useState({
    bankDetails: {
      accountHolder: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: '',
      accountType: 'savings'
    },
    upiDetails: {
      upiId: '',
      qrCode: null
    },
    paymentSchedule: {
      frequency: 'weekly',
      minimumAmount: 1000
    },
    taxDetails: {
      gstNumber: '',
      panNumber: '',
      businessType: 'individual'
    }
  });

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingAmount: 0,
    lastPayment: null,
    nextPayment: null
  });

  const accountTypes = [
    { value: 'savings', label: 'बचत खाता' },
    { value: 'current', label: 'चालू खाता' }
  ];

  const paymentFrequencies = [
    { value: 'weekly', label: 'साप्ताहिक (हर सोमवार)' },
    { value: 'biweekly', label: 'द्विसाप्ताहिक (15 दिन में)' },
    { value: 'monthly', label: 'मासिक (महीने की 1 तारीख)' }
  ];

  const businessTypes = [
    { value: 'individual', label: 'व्यक्तिगत' },
    { value: 'partnership', label: 'पार्टनरशिप' },
    { value: 'private_limited', label: 'प्राइवेट लिमिटेड' },
    { value: 'llp', label: 'LLP' },
    { value: 'public_limited', label: 'पब्लिक लिमिटेड' }
  ];

  useEffect(() => {
    trackPageView('vendor_payment_settings');
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const [settingsResponse, historyResponse, statsResponse] = await Promise.all([
        apiService.get('/vendor/payment-settings'),
        apiService.get('/vendor/payment-history'),
        apiService.get('/vendor/payment-stats')
      ]);

      if (settingsResponse.success) {
        setPaymentData(settingsResponse.data);
      }
      if (historyResponse.success) {
        setPaymentHistory(historyResponse.data);
      }
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.put('/vendor/payment-settings', paymentData);
      
      if (response.success) {
        trackEvent('payment_settings_updated');
        alert('पेमेंट सेटिंग्स सफलतापूर्वक अपडेट हुईं!');
      }
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      alert('सेटिंग्स सेव करने में समस्या हुई');
    } finally {
      setSaving(false);
    }
  };

  const updateBankDetails = (field, value) => {
    setPaymentData({
      ...paymentData,
      bankDetails: {
        ...paymentData.bankDetails,
        [field]: value
      }
    });
  };

  const updateUpiDetails = (field, value) => {
    setPaymentData({
      ...paymentData,
      upiDetails: {
        ...paymentData.upiDetails,
        [field]: value
      }
    });
  };

  const updatePaymentSchedule = (field, value) => {
    setPaymentData({
      ...paymentData,
      paymentSchedule: {
        ...paymentData.paymentSchedule,
        [field]: value
      }
    });
  };

  const updateTaxDetails = (field, value) => {
    setPaymentData({
      ...paymentData,
      taxDetails: {
        ...paymentData.taxDetails,
        [field]: value
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('hi-IN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="पेमेंट सेटिंग्स लोड हो रही हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>पेमेंट सेटिंग्स - भारतशाला वेंडर | Payment Settings</title>
        <meta name="description" content="अपनी पेमेंट जानकारी और बैंक डिटेल्स मैनेज करें। पेमेंट शेड्यूल और टैक्स डिटेल्स अपडेट करें।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">पेमेंट सेटिंग्स</h1>
                <p className="text-gray-600">अपनी पेमेंट जानकारी मैनेज करें</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {saving ? 'सेव हो रहा है...' : 'सेव करें'}
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">कुल कमाई</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
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
                  <p className="text-sm text-gray-600 mb-1">पेंडिंग अमाउंट</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingAmount)}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <span className="text-2xl">⏳</span>
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
                  <p className="text-sm text-gray-600 mb-1">लास्ट पेमेंट</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.lastPayment ? formatDate(stats.lastPayment) : 'अभी तक नहीं'}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-2xl">📅</span>
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
                  <p className="text-sm text-gray-600 mb-1">नेक्स्ट पेमेंट</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.nextPayment ? formatDate(stats.nextPayment) : 'TBD'}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-2xl">🗓️</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Settings Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bank Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">बैंक डिटेल्स</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खाताधारक का नाम *
                    </label>
                    <input
                      type="text"
                      value={paymentData.bankDetails.accountHolder}
                      onChange={(e) => updateBankDetails('accountHolder', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="खाताधारक का पूरा नाम"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खाता नंबर *
                    </label>
                    <input
                      type="text"
                      value={paymentData.bankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="खाता नंबर"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC कोड *
                    </label>
                    <input
                      type="text"
                      value={paymentData.bankDetails.ifscCode}
                      onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="IFSC कोड"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      खाता प्रकार *
                    </label>
                    <select
                      value={paymentData.bankDetails.accountType}
                      onChange={(e) => updateBankDetails('accountType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {accountTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      बैंक का नाम *
                    </label>
                    <input
                      type="text"
                      value={paymentData.bankDetails.bankName}
                      onChange={(e) => updateBankDetails('bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="बैंक का नाम"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ब्रांच *
                    </label>
                    <input
                      type="text"
                      value={paymentData.bankDetails.branch}
                      onChange={(e) => updateBankDetails('branch', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="ब्रांच का नाम"
                    />
                  </div>
                </div>
              </motion.div>

              {/* UPI Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">UPI डिटेल्स (वैकल्पिक)</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={paymentData.upiDetails.upiId}
                      onChange={(e) => updateUpiDetails('upiId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="yourname@paytm"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Schedule */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">पेमेंट शेड्यूल</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      पेमेंट फ्रीक्वेंसी
                    </label>
                    <select
                      value={paymentData.paymentSchedule.frequency}
                      onChange={(e) => updatePaymentSchedule('frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {paymentFrequencies.map((freq) => (
                        <option key={freq.value} value={freq.value}>{freq.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मिनिमम पेमेंट अमाउंट (₹)
                    </label>
                    <input
                      type="number"
                      value={paymentData.paymentSchedule.minimumAmount}
                      onChange={(e) => updatePaymentSchedule('minimumAmount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="500"
                      step="100"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  जब आपकी पेंडिंग अमाउंट इस राशि से ज्यादा हो जाएगी, तभी पेमेंट प्रोसेस होगी।
                </p>
              </motion.div>

              {/* Tax Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">टैक्स डिटेल्स</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      बिज़नेस टाइप
                    </label>
                    <select
                      value={paymentData.taxDetails.businessType}
                      onChange={(e) => updateTaxDetails('businessType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN नंबर *
                    </label>
                    <input
                      type="text"
                      value={paymentData.taxDetails.panNumber}
                      onChange={(e) => updateTaxDetails('panNumber', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="ABCDE1234F"
                      maxLength="10"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST नंबर (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      value={paymentData.taxDetails.gstNumber}
                      onChange={(e) => updateTaxDetails('gstNumber', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="22AAAAA0000A1Z5"
                      maxLength="15"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment History */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">पेमेंट हिस्ट्री</h3>
                
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">💳</div>
                    <p className="text-gray-600">अभी तक कोई पेमेंट नहीं मिली</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {paymentHistory.slice(0, 10).map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-600">{formatDate(payment.date)}</p>
                          <p className="text-xs text-gray-500">{payment.transactionId}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status === 'completed' ? 'पूर्ण' :
                           payment.status === 'pending' ? 'प्रतीक्षा में' : 'फेल'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Important Notes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-blue-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-3">📝 महत्वपूर्ण नोट्स</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• बैंक डिटेल्स सही और अपडेटेड होनी चाहिए</li>
                  <li>• PAN नंबर बैंक अकाउंट से मैच होना चाहिए</li>
                  <li>• GST रजिस्ट्रेशन होने पर GST नंबर जरूरी है</li>
                  <li>• पेमेंट में TDS काटा जाएगा</li>
                  <li>• मिनिमम पेमेंट अमाउंट ₹500 है</li>
                </ul>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-yellow-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-yellow-900 mb-3">🆘 पेमेंट सपोर्ट</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  पेमेंट से जुड़ी कोई समस्या है? हमारी फाइनेंस टीम से संपर्क करें।
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:payments@bharatshaala.com"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📧 payments@bharatshaala.com
                  </a>
                  <a 
                    href="tel:+91-XXXX-XXXXXX"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📞 +91-XXXX-XXXXXX
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSettings;
