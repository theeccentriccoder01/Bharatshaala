// System Settings Component for Bharatshala Admin Panel
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
    gt