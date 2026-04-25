// Store Settings Component - Bharatshaala Vendor Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ImageUploader from '../../components/ImageUploader';

const StoreSettings = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [storeData, setStoreData] = useState({
    basic: {
      storeName: '',
      tagline: '',
      description: '',
      logo: null,
      banner: null,
      categories: [],
      tags: []
    },
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    },
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      coordinates: { lat: null, lng: null }
    },
    business: {
      businessType: 'individual',
      gstNumber: '',
      panNumber: '',
      establishedYear: '',
      employeeCount: '1-10',
      businessHours: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '10:00', close: '17:00', closed: false }
      }
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      customUrl: ''
    },
    preferences: {
      currency: 'INR',
      language: 'hi',
      timezone: 'Asia/Kolkata',
      notifications: {
        orderUpdates: true,
        marketingEmails: false,
        smsAlerts: true,
        pushNotifications: true
      },
      privacy: {
        showContactInfo: true,
        showBusinessHours: true,
        allowCustomerReviews: true,
        autoApproveReviews: false
      }
    }
  });

  const tabs = [
    { id: 'basic', name: 'बेसिक जानकारी', icon: '🏪' },
    { id: 'contact', name: 'संपर्क विवरण', icon: '📞' },
    { id: 'location', name: 'लोकेशन', icon: '📍' },
    { id: 'business', name: 'बिज़नेस डिटेल्स', icon: '🏢' },
    { id: 'seo', name: 'SEO सेटिंग्स', icon: '🔍' },
    { id: 'preferences', name: 'प्राथमिकताएं', icon: '⚙️' }
  ];

  const businessTypes = [
    { value: 'individual', label: 'व्यक्तिगत' },
    { value: 'partnership', label: 'पार्टनरशिप' },
    { value: 'private_limited', label: 'प्राइवेट लिमिटेड' },
    { value: 'llp', label: 'LLP' },
    { value: 'public_limited', label: 'पब्लिक लिमिटेड' },
    { value: 'sole_proprietorship', label: 'सोल प्रोप्राइटरशिप' }
  ];

  const employeeCounts = [
    { value: '1-10', label: '1-10 कर्मचारी' },
    { value: '11-50', label: '11-50 कर्मचारी' },
    { value: '51-200', label: '51-200 कर्मचारी' },
    { value: '201-500', label: '201-500 कर्मचारी' },
    { value: '500+', label: '500+ कर्मचारी' }
  ];

  const indianStates = [
    'आंध्र प्रदेश', 'अरुणाचल प्रदेश', 'असम', 'बिहार', 'छत्तीसगढ़', 'गोवा', 'गुजरात',
    'हरियाणा', 'हिमाचल प्रदेश', 'झारखंड', 'कर्नाटक', 'केरल', 'मध्य प्रदेश', 'महाराष्ट्र',
    'मणिपुर', 'मेघालय', 'मिजोरम', 'नागालैंड', 'ओडिशा', 'पंजाब', 'राजस्थान', 'सिक्किम',
    'तमिलनाडु', 'तेलंगाना', 'त्रिपुरा', 'उत्तर प्रदेश', 'उत्तराखंड', 'पश्चिम बंगाल',
    'दिल्ली', 'जम्मू और कश्मीर', 'लद्दाख'
  ];

  const dayNames = {
    monday: 'सोमवार',
    tuesday: 'मंगलवार',
    wednesday: 'बुधवार',
    thursday: 'गुरुवार',
    friday: 'शुक्रवार',
    saturday: 'शनिवार',
    sunday: 'रविवार'
  };

  useEffect(() => {
    trackPageView('vendor_store_settings');
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/vendor/store-settings');
      if (response.success) {
        setStoreData({ ...storeData, ...response.data });
      }
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.put('/vendor/store-settings', storeData);
      
      if (response.success) {
        trackEvent('store_settings_updated', { tab: activeTab });
        alert('स्टोर सेटिंग्स सफलतापूर्वक अपडेट हुईं!');
      }
    } catch (error) {
      console.error('Failed to save store settings:', error);
      alert('सेटिंग्स सेव करने में समस्या हुई');
    } finally {
      setSaving(false);
    }
  };

  const updateBasic = (field, value) => {
    setStoreData({
      ...storeData,
      basic: { ...storeData.basic, [field]: value }
    });
  };

  const updateContact = (field, value) => {
    setStoreData({
      ...storeData,
      contact: { ...storeData.contact, [field]: value }
    });
  };

  const updateSocialMedia = (platform, value) => {
    setStoreData({
      ...storeData,
      contact: {
        ...storeData.contact,
        socialMedia: {
          ...storeData.contact.socialMedia,
          [platform]: value
        }
      }
    });
  };

  const updateLocation = (field, value) => {
    setStoreData({
      ...storeData,
      location: { ...storeData.location, [field]: value }
    });
  };

  const updateBusiness = (field, value) => {
    setStoreData({
      ...storeData,
      business: { ...storeData.business, [field]: value }
    });
  };

  const updateBusinessHours = (day, field, value) => {
    setStoreData({
      ...storeData,
      business: {
        ...storeData.business,
        businessHours: {
          ...storeData.business.businessHours,
          [day]: {
            ...storeData.business.businessHours[day],
            [field]: value
          }
        }
      }
    });
  };

  const updateSEO = (field, value) => {
    setStoreData({
      ...storeData,
      seo: { ...storeData.seo, [field]: value }
    });
  };

  const updatePreferences = (section, field, value) => {
    setStoreData({
      ...storeData,
      preferences: {
        ...storeData.preferences,
        [section]: typeof storeData.preferences[section] === 'object' 
          ? { ...storeData.preferences[section], [field]: value }
          : value
      }
    });
  };

  const addTag = (newTag) => {
    if (newTag && !storeData.basic.tags.includes(newTag)) {
      updateBasic('tags', [...storeData.basic.tags, newTag]);
    }
  };

  const removeTag = (tagToRemove) => {
    updateBasic('tags', storeData.basic.tags.filter(tag => tag !== tagToRemove));
  };

  const addKeyword = (newKeyword) => {
    if (newKeyword && !storeData.seo.keywords.includes(newKeyword)) {
      updateSEO('keywords', [...storeData.seo.keywords, newKeyword]);
    }
  };

  const removeKeyword = (keywordToRemove) => {
    updateSEO('keywords', storeData.seo.keywords.filter(keyword => keyword !== keywordToRemove));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="स्टोर सेटिंग्स लोड हो रही हैं..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>स्टोर सेटिंग्स - भारतशाला वेंडर | Store Settings</title>
        <meta name="description" content="अपनी स्टोर की जानकारी, कॉन्टैक्ट डिटेल्स, बिज़नेस आवर्स और SEO सेटिंग्स मैनेज करें।" />
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
                <h1 className="text-2xl font-bold text-gray-900">स्टोर सेटिंग्स</h1>
                <p className="text-gray-600">अपनी स्टोर की पूरी जानकारी मैनेज करें</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {saving ? 'सेव हो रहा है...' : 'सभी सेटिंग्स सेव करें'}
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
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
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        स्टोर का नाम *
                      </label>
                      <input
                        type="text"
                        value={storeData.basic.storeName}
                        onChange={(e) => updateBasic('storeName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="आपके स्टोर का नाम"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        टैगलाइन
                      </label>
                      <input
                        type="text"
                        value={storeData.basic.tagline}
                        onChange={(e) => updateBasic('tagline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="आपके बिज़नेस की टैगलाइन"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      स्टोर का विवरण *
                    </label>
                    <textarea
                      rows={4}
                      value={storeData.basic.description}
                      onChange={(e) => updateBasic('description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="अपने स्टोर के बारे में विस्तार से बताएं..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        स्टोर लोगो
                      </label>
                      <ImageUploader
                        currentImage={storeData.basic.logo}
                        onImageSelect={(image) => updateBasic('logo', image)}
                        aspectRatio="1:1"
                        maxSize={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        स्टोर बैनर
                      </label>
                      <ImageUploader
                        currentImage={storeData.basic.banner}
                        onImageSelect={(image) => updateBasic('banner', image)}
                        aspectRatio="16:9"
                        maxSize={5}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      स्टोर टैग्स
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {storeData.basic.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="नया टैग एंटर करें और Enter दबाएं"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Contact Information Tab */}
              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        फोन नंबर *
                      </label>
                      <input
                        type="tel"
                        value={storeData.contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ईमेल *
                      </label>
                      <input
                        type="email"
                        value={storeData.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="store@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        व्हाट्सऐप नंबर
                      </label>
                      <input
                        type="tel"
                        value={storeData.contact.whatsapp}
                        onChange={(e) => updateContact('whatsapp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        वेबसाइट
                      </label>
                      <input
                        type="url"
                        value={storeData.contact.website}
                        onChange={(e) => updateContact('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="https://yourstore.com"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">सोशल मीडिया</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          value={storeData.contact.socialMedia.facebook}
                          onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://facebook.com/yourstore"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input
                          type="url"
                          value={storeData.contact.socialMedia.instagram}
                          onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://instagram.com/yourstore"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          value={storeData.contact.socialMedia.twitter}
                          onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://twitter.com/yourstore"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube
                        </label>
                        <input
                          type="url"
                          value={storeData.contact.socialMedia.youtube}
                          onChange={(e) => updateSocialMedia('youtube', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="https://youtube.com/yourstore"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      पूरा पता *
                    </label>
                    <textarea
                      rows={3}
                      value={storeData.location.address}
                      onChange={(e) => updateLocation('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="दुकान का पूरा पता..."
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        शहर *
                      </label>
                      <input
                        type="text"
                        value={storeData.location.city}
                        onChange={(e) => updateLocation('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        राज्य *
                      </label>
                      <select
                        value={storeData.location.state}
                        onChange={(e) => updateLocation('state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">राज्य चुनें</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        पिनकोड *
                      </label>
                      <input
                        type="text"
                        value={storeData.location.pincode}
                        onChange={(e) => updateLocation('pincode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        pattern="[0-9]{6}"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      लैंडमार्क
                    </label>
                    <input
                      type="text"
                      value={storeData.location.landmark}
                      onChange={(e) => updateLocation('landmark', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="पास का प्रसिद्ध स्थान"
                    />
                  </div>
                </motion.div>
              )}

              {/* Business Details Tab */}
              {activeTab === 'business' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        बिज़नेस टाइप *
                      </label>
                      <select
                        value={storeData.business.businessType}
                        onChange={(e) => updateBusiness('businessType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {businessTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        कर्मचारियों की संख्या
                      </label>
                      <select
                        value={storeData.business.employeeCount}
                        onChange={(e) => updateBusiness('employeeCount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {employeeCounts.map((count) => (
                          <option key={count.value} value={count.value}>{count.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        स्थापना वर्ष
                      </label>
                      <input
                        type="number"
                        value={storeData.business.establishedYear}
                        onChange={(e) => updateBusiness('establishedYear', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAN नंबर *
                      </label>
                      <input
                        type="text"
                        value={storeData.business.panNumber}
                        onChange={(e) => updateBusiness('panNumber', e.target.value.toUpperCase())}
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
                        value={storeData.business.gstNumber}
                        onChange={(e) => updateBusiness('gstNumber', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="22AAAAA0000A1Z5"
                        maxLength="15"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">बिज़नेस आवर्स</h3>
                    <div className="space-y-3">
                      {Object.entries(storeData.business.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center space-x-4">
                          <div className="w-20">
                            <span className="text-sm font-medium text-gray-700">
                              {dayNames[day]}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!hours.closed}
                              onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-600">खुला</span>
                          </div>
                          {!hours.closed && (
                            <>
                              <input
                                type="time"
                                value={hours.open}
                                onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded"
                              />
                              <span>से</span>
                              <input
                                type="time"
                                value={hours.close}
                                onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                                className="px-3 py-1 border border-gray-300 rounded"
                              />
                              <span>तक</span>
                            </>
                          )}
                          {hours.closed && (
                            <span className="text-red-600 text-sm">बंद</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SEO Settings Tab */}
              {activeTab === 'seo' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मेटा टाइटल
                    </label>
                    <input
                      type="text"
                      value={storeData.seo.metaTitle}
                      onChange={(e) => updateSEO('metaTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="आपके स्टोर का SEO टाइटल"
                      maxLength="60"
                    />
                    <p className="text-xs text-gray-500 mt-1">60 कैरेक्टर या कम रखें</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      मेटा डिस्क्रिप्शन
                    </label>
                    <textarea
                      rows={3}
                      value={storeData.seo.metaDescription}
                      onChange={(e) => updateSEO('metaDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="आपके स्टोर का SEO डिस्क्रिप्शन"
                      maxLength="160"
                    />
                    <p className="text-xs text-gray-500 mt-1">160 कैरेक्टर या कम रखें</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कीवर्ड्स
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {storeData.seo.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="नया कीवर्ड एंटर करें और Enter दबाएं"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyword(e.target.value.trim());
                          e.target.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      कस्टम URL स्लग
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        bharatshaala.com/store/
                      </span>
                      <input
                        type="text"
                        value={storeData.seo.customUrl}
                        onChange={(e) => updateSEO('customUrl', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="your-store-name"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">जेनरल प्राथमिकताएं</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          करेंसी
                        </label>
                        <select
                          value={storeData.preferences.currency}
                          onChange={(e) => updatePreferences('currency', null, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="INR">भारतीय रुपया (₹)</option>
                          <option value="USD">US डॉलर ($)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          भाषा
                        </label>
                        <select
                          value={storeData.preferences.language}
                          onChange={(e) => updatePreferences('language', null, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="hi">हिंदी</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          टाइमजोन
                        </label>
                        <select
                          value={storeData.preferences.timezone}
                          onChange={(e) => updatePreferences('timezone', null, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="Asia/Kolkata">भारत (IST)</option>
                          <option value="UTC">UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">नोटिफिकेशन प्राथमिकताएं</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">ऑर्डर अपडेट्स</h4>
                          <p className="text-sm text-gray-600">नए ऑर्डर्स और स्टेटस अपडेट्स</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.notifications.orderUpdates}
                          onChange={(e) => updatePreferences('notifications', 'orderUpdates', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">मार्केटिंग ईमेल्स</h4>
                          <p className="text-sm text-gray-600">प्रमोशनल ईमेल्स और ऑफर्स</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.notifications.marketingEmails}
                          onChange={(e) => updatePreferences('notifications', 'marketingEmails', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS अलर्ट्स</h4>
                          <p className="text-sm text-gray-600">महत्वपूर्ण अपडेट्स SMS पर</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.notifications.smsAlerts}
                          onChange={(e) => updatePreferences('notifications', 'smsAlerts', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">पुश नोटिफिकेशन्स</h4>
                          <p className="text-sm text-gray-600">ब्राउज़र नोटिफिकेशन्स</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.notifications.pushNotifications}
                          onChange={(e) => updatePreferences('notifications', 'pushNotifications', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">प्राइवेसी सेटिंग्स</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">कॉन्टैक्ट जानकारी दिखाएं</h4>
                          <p className="text-sm text-gray-600">कस्टमर्स को फोन और ईमेल दिखाएं</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.privacy.showContactInfo}
                          onChange={(e) => updatePreferences('privacy', 'showContactInfo', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">बिज़नेस आवर्स दिखाएं</h4>
                          <p className="text-sm text-gray-600">स्टोर के खुलने का समय दिखाएं</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.privacy.showBusinessHours}
                          onChange={(e) => updatePreferences('privacy', 'showBusinessHours', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">कस्टमर रिव्यूज अनुमति दें</h4>
                          <p className="text-sm text-gray-600">कस्टमर्स को रिव्यू लिखने दें</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.privacy.allowCustomerReviews}
                          onChange={(e) => updatePreferences('privacy', 'allowCustomerReviews', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">रिव्यूज ऑटो अप्रूव करें</h4>
                          <p className="text-sm text-gray-600">बिना चेक किए रिव्यूज पब्लिश करें</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={storeData.preferences.privacy.autoApproveReviews}
                          onChange={(e) => updatePreferences('privacy', 'autoApproveReviews', e.target.checked)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
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

export default StoreSettings;
