// Address Book Component - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AddressBook = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false
  });

  const addressTypes = [
    { value: 'home', label: 'घर', icon: '🏠' },
    { value: 'office', label: 'ऑफिस', icon: '🏢' },
    { value: 'other', label: 'अन्य', icon: '📍' }
  ];

  const indianStates = [
    'आंध्र प्रदेश', 'अरुणाचल प्रदेश', 'असम', 'बिहार', 'छत्तीसगढ़', 'गोवा', 'गुजरात',
    'हरियाणा', 'हिमाचल प्रदेश', 'झारखंड', 'कर्नाटक', 'केरल', 'मध्य प्रदेश', 'महाराष्ट्र',
    'मणिपुर', 'मेघालय', 'मिजोरम', 'नागालैंड', 'ओडिशा', 'पंजाब', 'राजस्थान', 'सिक्किम',
    'तमिलनाडु', 'तेलंगाना', 'त्रिपुरा', 'उत्तर प्रदेश', 'उत्तराखंड', 'पश्चिम बंगाल',
    'दिल्ली', 'जम्मू और कश्मीर', 'लद्दाख'
  ];

  useEffect(() => {
    trackPageView('address_book');
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingAddress) {
        response = await apiService.updateAddress(editingAddress.id, formData);
        trackEvent('address_updated', { type: formData.type });
      } else {
        response = await apiService.addAddress(formData);
        trackEvent('address_added', { type: formData.type });
      }

      if (response.success) {
        await loadAddresses();
        resetForm();
        alert(editingAddress ? 'पता अपडेट हो गया!' : 'नया पता जोड़ा गया!');
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      alert('पता सेव करने में समस्या हुई');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('क्या आप इस पते को हटाना चाहते हैं?')) {
      try {
        const response = await apiService.deleteAddress(addressId);
        if (response.success) {
          await loadAddresses();
          trackEvent('address_deleted');
          alert('पता हटा दिया गया!');
        }
      } catch (error) {
        console.error('Failed to delete address:', error);
        alert('पता हटाने में समस्या हुई');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="पते लोड हो रहे हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>एड्रेस बुक - भारतशाला | Address Book</title>
        <meta name="description" content="अपने डिलीवरी पते मैनेज करें। नए पते जोड़ें, मौजूदा पते एडिट करें या हटाएं।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">एड्रेस बुक</h1>
                <p className="text-gray-600">अपने डिलीवरी पते मैनेज करें</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                + नया पता जोड़ें
              </button>
            </div>
          </div>

          {/* Address Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingAddress ? 'पता एडिट करें' : 'नया पता जोड़ें'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    पता का प्रकार
                  </label>
                  <div className="flex space-x-4">
                    {addressTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({...formData, type: type.value})}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                          formData.type === type.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      पहला नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      अंतिम नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    फोन नंबर *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Address Lines */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    पता लाइन 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                    placeholder="मकान नंबर, सड़क का नाम"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    पता लाइन 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                    placeholder="इलाका, कॉलोनी"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      शहर *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      राज्य *
                    </label>
                    <select
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">राज्य चुनें</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      पिनकोड *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    लैंडमार्क (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                    placeholder="पास का प्रसिद्ध स्थान"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Default Address */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-700">
                    इसे डिफ़ॉल्ट पता बनाएं
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    {editingAddress ? 'अपडेट करें' : 'सेव करें'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    कैंसल करें
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Address List */}
          <div className="space-y-4">
            {addresses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई पता नहीं मिला</h3>
                <p className="text-gray-600 mb-4">अपना पहला डिलीवरी पता जोड़ें</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  पता जोड़ें
                </button>
              </div>
            ) : (
              addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {addressTypes.find(t => t.value === address.type)?.icon}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {addressTypes.find(t => t.value === address.type)?.label}
                        </span>
                        {address.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                            डिफ़ॉल्ट
                          </span>
                        )}
                      </div>
                      
                      <div className="text-gray-700 space-y-1">
                        <p className="font-medium">{address.firstName} {address.lastName}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                        {address.landmark && <p>लैंडमार्क: {address.landmark}</p>}
                        <p>फोन: {address.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="एडिट करें"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="हटाएं"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressBook;