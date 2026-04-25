// System Settings Component for Bharatshaala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import ImageUpload from '../components/ImageUpload';
import apiService from '../apiService';

const SystemSettings = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General Settings
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    siteLogo: '',
    siteFavicon: '',
    adminEmail: '',
    supportEmail: '',
    phone: '',
    address: '',
    
    // Business Settings
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    businessAddress: '',
    
    // Payment Settings
    razorpayKeyId: '',
    razorpayKeySecret: '',
    paytmMerchantId: '',
    paytmMerchantKey: '',
    codEnabled: true,
    minOrderAmount: 0,
    maxOrderAmount: 100000,
    
    // Shipping Settings
    defaultShippingCharges: 50,
    freeShippingThreshold: 500,
    maxShippingWeight: 30,
    domesticShipping: true,
    internationalShipping: false,
    
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    emailFromName: '',
    emailFromAddress: '',
    
    // SMS Settings
    smsProvider: 'twilio',
    twilioSid: '',
    twilioToken: '',
    twilioFrom: '',
    otpLength: 6,
    otpExpiry: 300,
    
    // Security Settings
    sessionTimeout: 3600,
    maxLoginAttempts: 5,
    lockoutDuration: 900,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    twoFactorEnabled: false,
    
    // Performance Settings
    cacheEnabled: true,
    cacheDuration: 3600,
    compressionEnabled: true,
    cdnEnabled: false,
    cdnUrl: '',
    
    // Analytics Settings
    googleAnalyticsId: '',
    facebookPixelId: '',
    gtmId: '',
    hotjarId: '',
    analyticsEnabled: true,
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: '',
    allowedIPs: [],
    
    // Feature Flags
    featuresEnabled: {
      wishlist: true,
      reviews: true,
      compare: true,
      socialLogin: true,
      guestCheckout: true,
      multiVendor: true,
      subscriptions: false,
      loyalty: true
    }
  });

  const tabs = [
    { key: 'general', name: 'सामान्य', icon: '⚙️' },
    { key: 'business', name: 'व्यवसाय', icon: '🏢' },
    { key: 'payment', name: 'भुगतान', icon: '💳' },
    { key: 'shipping', name: 'शिपिंग', icon: '📦' },
    { key: 'email', name: 'ईमेल', icon: '📧' },
    { key: 'sms', name: 'SMS', icon: '📱' },
    { key: 'security', name: 'सुरक्षा', icon: '🔒' },
    { key: 'performance', name: 'प्रदर्शन', icon: '⚡' },
    { key: 'analytics', name: 'एनालिटिक्स', icon: '📊' },
    { key: 'maintenance', name: 'मेंटेनेंस', icon: '🔧' },
    { key: 'features', name: 'फीचर्स', icon: '🎯' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/settings');
      
      if (response.success) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      showError('सेटिंग्स लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('featuresEnabled.')) {
      const featureKey = name.split('.')[1];
      setSettings(prev => ({
        ...prev,
        featuresEnabled: {
          ...prev.featuresEnabled,
          [featureKey]: checked
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);

    try {
      const response = await apiService.post('/admin/settings', settings);
      
      if (response.success) {
        showSuccess('सेटिंग्स सेव हो गईं');
        
        trackEvent('system_settings_updated', {
          tab: activeTab,
          adminId: user.id
        });
      }
    } catch (error) {
      showError('सेटिंग्स सेव करने में त्रुटि');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="सेटिंग्स लोड हो रही हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">सिस्टम सेटिंग्स</h1>
          <p className="text-gray-600 mt-1">एप्लिकेशन सेटिंग्स को कॉन्फ़िगर करें</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors duration-200"
        >
          {saving ? <LoadingSpinner size="small" color="white" /> : 'सेटिंग्स सेव करें'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    साइट नाम *
                  </label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="भारतशाला"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    एडमिन ईमेल *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={settings.adminEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="admin@bharatshaala.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  साइट विवरण
                </label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="भारत की सांस्कृतिक धरोहर का डिजिटल घर"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    साइट लोगो
                  </label>
                  <ImageUpload
                    value={settings.siteLogo}
                    onChange={(url) => setSettings(prev => ({ ...prev, siteLogo: url }))}
                    folder="settings"
                    aspectRatio="4:1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    फेविकॉन
                  </label>
                  <ImageUpload
                    value={settings.siteFavicon}
                    onChange={(url) => setSettings(prev => ({ ...prev, siteFavicon: url }))}
                    folder="settings"
                    aspectRatio="1:1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    name="razorpayKeyId"
                    value={settings.razorpayKeyId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Key Secret
                  </label>
                  <input
                    type="password"
                    name="razorpayKeySecret"
                    value={settings.razorpayKeySecret}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="codEnabled"
                  checked={settings.codEnabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Cash on Delivery सक्षम करें
                </label>
              </div>
            </div>
          )}

          {/* Features Settings */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">फीचर्स को सक्षम/निष्क्रिय करें</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(settings.featuresEnabled).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`featuresEnabled.${feature}`}
                      checked={enabled}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label className="ml-2 text-sm text-gray-700 capitalize">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
