// Shipping Settings Component - Bharatshaala Vendor Platform (COMPLETED)
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ShippingSettings = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shippingData, setShippingData] = useState({
    policies: {
      freeShippingThreshold: 999,
      processingTime: 2,
      returnAccepted: true,
      returnWindow: 7,
      codAvailable: true,
      codCharge: 50
    },
    rates: [],
    zones: [],
    restrictions: {
      maxWeight: 10,
      maxDimensions: { length: 50, width: 50, height: 50 },
      restrictedPincodes: [],
      restrictedStates: []
    }
  });

  const [newRate, setNewRate] = useState({
    zone: '',
    weightFrom: 0,
    weightTo: 1,
    rate: 50,
    deliveryDays: '3-5'
  });

  const [newZone, setNewZone] = useState({
    name: '',
    pincodes: '',
    states: []
  });

  const deliveryZones = [
    { id: 'local', name: 'लोकल (शहर के अंदर)', baseRate: 30 },
    { id: 'metro', name: 'मेट्रो सिटीज', baseRate: 50 },
    { id: 'state', name: 'राज्य के अंदर', baseRate: 70 },
    { id: 'north', name: 'उत्तर भारत', baseRate: 90 },
    { id: 'south', name: 'दक्षिण भारत', baseRate: 90 },
    { id: 'east', name: 'पूर्व भारत', baseRate: 100 },
    { id: 'west', name: 'पश्चिम भारत', baseRate: 90 },
    { id: 'northeast', name: 'उत्तर-पूर्व', baseRate: 120 },
    { id: 'islands', name: 'द्वीप समूह', baseRate: 150 }
  ];

  const indianStates = [
    'आंध्र प्रदेश', 'अरुणाचल प्रदेश', 'असम', 'बिहार', 'छत्तीसगढ़', 'गोवा', 'गुजरात',
    'हरियाणा', 'हिमाचल प्रदेश', 'झारखंड', 'कर्नाटक', 'केरल', 'मध्य प्रदेश', 'महाराष्ट्र',
    'मणिपुर', 'मेघालय', 'मिजोरम', 'नागालैंड', 'ओडिशा', 'पंजाब', 'राजस्थान', 'सिक्किम',
    'तमिलनाडु', 'तेलंगाना', 'त्रिपुरा', 'उत्तर प्रदेश', 'उत्तराखंड', 'पश्चिम बंगाल',
    'दिल्ली', 'जम्मू और कश्मीर', 'लद्दाख'
  ];

  useEffect(() => {
    trackPageView('vendor_shipping_settings');
    loadShippingData();
  }, []);

  const loadShippingData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/vendor/shipping-settings');
      if (response.success) {
        setShippingData(response.data);
      }
    } catch (error) {
      console.error('Failed to load shipping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.put('/vendor/shipping-settings', shippingData);
      
      if (response.success) {
        trackEvent('shipping_settings_updated');
        alert('शिपिंग सेटिंग्स सफलतापूर्वक अपडेट हुईं!');
      }
    } catch (error) {
      console.error('Failed to save shipping settings:', error);
      alert('सेटिंग्स सेव करने में समस्या हुई');
    } finally {
      setSaving(false);
    }
  };

  const updatePolicies = (field, value) => {
    setShippingData({
      ...shippingData,
      policies: {
        ...shippingData.policies,
        [field]: value
      }
    });
  };

  const updateRestrictions = (field, value) => {
    setShippingData({
      ...shippingData,
      restrictions: {
        ...shippingData.restrictions,
        [field]: value
      }
    });
  };

  const addShippingRate = () => {
    if (!newRate.zone || !newRate.rate) {
      alert('कृपया सभी फील्ड्स भरें');
      return;
    }

    setShippingData({
      ...shippingData,
      rates: [...shippingData.rates, { ...newRate, id: Date.now() }]
    });

    setNewRate({
      zone: '',
      weightFrom: 0,
      weightTo: 1,
      rate: 50,
      deliveryDays: '3-5'
    });
  };

  const removeShippingRate = (rateId) => {
    setShippingData({
      ...shippingData,
      rates: shippingData.rates.filter(rate => rate.id !== rateId)
    });
  };

  const addPincodeRestriction = (pincode) => {
    if (pincode && !shippingData.restrictions.restrictedPincodes.includes(pincode)) {
      updateRestrictions('restrictedPincodes', [
        ...shippingData.restrictions.restrictedPincodes,
        pincode
      ]);
    }
  };

  const removePincodeRestriction = (pincode) => {
    updateRestrictions('restrictedPincodes',
      shippingData.restrictions.restrictedPincodes.filter(p => p !== pincode)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="शिपिंग सेटिंग्स लोड हो रही हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>शिपिंग सेटिंग्स - भारतशाला वेंडर | Shipping Settings</title>
        <meta name="description" content="अपनी शिपिंग पॉलिसी, रेट्स और डिलीवरी जोन्स मैनेज करें। फ्री शिपिंग और COD सेटिंग्स अपडेट करें।" />
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
                <h1 className="text-2xl font-bold text-gray-900">शिपिंग सेटिंग्स</h1>
                <p className="text-gray-600">अपनी शिपिंग पॉलिसी और रेट्स मैनेज करें</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {saving ? 'सेव हो रहा है...' : 'सेव करें'}
              </button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Policies */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">शिपिंग पॉलिसी</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      फ्री शिपिंग थ्रेशहोल्ड (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingData.policies.freeShippingThreshold}
                      onChange={(e) => updatePolicies('freeShippingThreshold', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">इस राशि से ऊपर फ्री शिपिंग</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      प्रोसेसिंग टाइम (दिन)
                    </label>
                    <input
                      type="number"
                      value={shippingData.policies.processingTime}
                      onChange={(e) => updatePolicies('processingTime', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="7"
                    />
                    <p className="text-xs text-gray-500 mt-1">ऑर्डर प्रोसेसिंग में लगने वाले दिन</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      रिटर्न विंडो (दिन)
                    </label>
                    <select
                      value={shippingData.policies.returnWindow}
                      onChange={(e) => updatePolicies('returnWindow', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={3}>3 दिन</option>
                      <option value={7}>7 दिन</option>
                      <option value={15}>15 दिन</option>
                      <option value={30}>30 दिन</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      COD चार्ज (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingData.policies.codCharge}
                      onChange={(e) => updatePolicies('codCharge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="10"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="returnAccepted"
                      checked={shippingData.policies.returnAccepted}
                      onChange={(e) => updatePolicies('returnAccepted', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="returnAccepted" className="text-sm text-gray-700">
                      रिटर्न स्वीकार करते हैं
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="codAvailable"
                      checked={shippingData.policies.codAvailable}
                      onChange={(e) => updatePolicies('codAvailable', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="codAvailable" className="text-sm text-gray-700">
                      कैश ऑन डिलीवरी उपलब्ध है
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Rates */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">शिपिंग रेट्स</h2>
                
                {/* Add New Rate */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-3">नई रेट जोड़ें</h3>
                  <div className="grid md:grid-cols-5 gap-3">
                    <div>
                      <select
                        value={newRate.zone}
                        onChange={(e) => setNewRate({...newRate, zone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">जोन चुनें</option>
                        {deliveryZones.map((zone) => (
                          <option key={zone.id} value={zone.id}>{zone.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="वेट फ्रॉम (kg)"
                        value={newRate.weightFrom}
                        onChange={(e) => setNewRate({...newRate, weightFrom: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="वेट टू (kg)"
                        value={newRate.weightTo}
                        onChange={(e) => setNewRate({...newRate, weightTo: parseFloat(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="रेट (₹)"
                        value={newRate.rate}
                        onChange={(e) => setNewRate({...newRate, rate: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <button
                        onClick={addShippingRate}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        जोड़ें
                      </button>
                    </div>
                  </div>
                </div>

                {/* Existing Rates */}
                <div className="space-y-3">
                  {shippingData.rates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      कोई शिपिंग रेट नहीं मिली। ऊपर से नई रेट जोड़ें।
                    </div>
                  ) : (
                    shippingData.rates.map((rate) => (
                      <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-semibold">
                            {deliveryZones.find(z => z.id === rate.zone)?.name || rate.zone}
                          </span>
                          <span className="text-gray-600 ml-2">
                            ({rate.weightFrom}kg - {rate.weightTo}kg)
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-green-600">₹{rate.rate}</span>
                          <span className="text-sm text-gray-600">{rate.deliveryDays} दिन</span>
                          <button
                            onClick={() => removeShippingRate(rate.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Shipping Restrictions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">शिपिंग लिमिटेशन्स</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      अधिकतम वजन (kg)
                    </label>
                    <input
                      type="number"
                      value={shippingData.restrictions.maxWeight}
                      onChange={(e) => updateRestrictions('maxWeight', parseFloat(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.5"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    अधिकतम आयाम (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="लेंथ"
                      value={shippingData.restrictions.maxDimensions.length}
                      onChange={(e) => updateRestrictions('maxDimensions', {
                        ...shippingData.restrictions.maxDimensions,
                        length: parseInt(e.target.value)
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="चौड़ाई"
                      value={shippingData.restrictions.maxDimensions.width}
                      onChange={(e) => updateRestrictions('maxDimensions', {
                        ...shippingData.restrictions.maxDimensions,
                        width: parseInt(e.target.value)
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="ऊंचाई"
                      value={shippingData.restrictions.maxDimensions.height}
                      onChange={(e) => updateRestrictions('maxDimensions', {
                        ...shippingData.restrictions.maxDimensions,
                        height: parseInt(e.target.value)
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Restricted Pincodes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    रेस्ट्रिक्टेड पिनकोड्स
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {shippingData.restrictions.restrictedPincodes.map((pincode, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {pincode}
                        <button
                          onClick={() => removePincodeRestriction(pincode)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="पिनकोड एंटर करें"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addPincodeRestriction(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Setup */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">क्विक सेटअप</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Set standard rates for all zones
                      const standardRates = deliveryZones.map(zone => ({
                        id: Date.now() + Math.random(),
                        zone: zone.id,
                        weightFrom: 0,
                        weightTo: 5,
                        rate: zone.baseRate,
                        deliveryDays: zone.id === 'local' ? '1-2' : '3-5'
                      }));
                      setShippingData({
                        ...shippingData,
                        rates: standardRates
                      });
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    स्टैंडर्ड रेट्स सेट करें
                  </button>
                  <button
                    onClick={() => {
                      updatePolicies('freeShippingThreshold', 999);
                      updatePolicies('processingTime', 2);
                      updatePolicies('returnWindow', 7);
                      updatePolicies('codCharge', 50);
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    रेकमेंडेड सेटिंग्स
                  </button>
                </div>
              </motion.div>

              {/* Delivery Zones Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">डिलीवरी जोन्स</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {deliveryZones.map((zone) => (
                    <div key={zone.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{zone.name}</span>
                      <span className="font-semibold text-blue-600">₹{zone.baseRate}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-3">💡 शिपिंग टिप्स</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• कॉम्पिटिटिव रेट्स रखें</li>
                  <li>• फ्री शिपिंग थ्रेशहोल्ड को रीज़नेबल रखें</li>
                  <li>• प्रोसेसिंग टाइम realistic रखें</li>
                  <li>• COD चार्ज minimal रखें</li>
                  <li>• रिटर्न पॉलिसी clear करें</li>
                  <li>• रेगुलर रेट रिव्यू करें</li>
                  <li>• फेस्टिवल सीज़न में स्पेशल रेट्स ऑफर करें</li>
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-yellow-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-yellow-900 mb-3">🆘 सहायता चाहिए?</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  शिपिंग सेटअप में मदद चाहिए? हमारी टीम से संपर्क करें।
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:shipping@bharatshaala.com"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📧 shipping@bharatshaala.com
                  </a>
                  <a 
                    href="tel:+91-XXXX-XXXXXX"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📞 +91-XXXX-XXXXXX
                  </a>
                  <div className="mt-3 pt-3 border-t border-yellow-200">
                    <p className="text-yellow-700 text-xs">
                      सपोर्ट आवर्स: सोमवार से शुक्रवार, 9AM - 6PM IST
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Shipping Calculator Preview */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-green-900 mb-3">📊 रेट कैलकुलेटर प्रीव्यू</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-green-800 mb-1">टेस्ट वेट (kg)</label>
                    <input
                      type="number"
                      defaultValue="1"
                      className="w-full px-3 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-green-800 mb-1">टेस्ट जोन</label>
                    <select className="w-full px-3 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500">
                      <option value="">जोन चुनें</option>
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-center">
                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      रेट कैलकुलेट करें
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingSettings;
