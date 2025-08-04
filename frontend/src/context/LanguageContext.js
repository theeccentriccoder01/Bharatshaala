import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default to Hindi
  const [isLoading, setIsLoading] = useState(false);

  // Language options
  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🏳️' },
    { code: 'ta', name: 'தமிழ்', flag: '🏳️' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🏳️' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🏳️' },
    { code: 'mr', name: 'मराठी', flag: '🏳️' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🏳️' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🏳️' }
  ];

  // Translation dictionaries
  const translations = {
    hi: {
      // Common UI
      home: 'होम',
      markets: 'बाजार',
      categories: 'श्रेणियां',
      cart: 'कार्ट',
      profile: 'प्रोफाइल',
      login: 'लॉगिन',
      signup: 'साइन अप',
      logout: 'लॉग आउट',
      search: 'खोजें',
      
      // Shopping
      addToCart: 'कार्ट में जोड़ें',
      buyNow: 'अभी खरीदें',
      price: 'मूल्य',
      quantity: 'मात्रा',
      total: 'कुल',
      checkout: 'चेकआउट',
      
      // Messages
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      
      // Vendor
      vendorDashboard: 'विक्रेता डैशबोर्ड',
      addProduct: 'उत्पाद जोड़ें',
      orders: 'ऑर्डर्स',
      analytics: 'एनालिटिक्स',
      
      // Common actions
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      share: 'साझा करें'
    },
    en: {
      // Common UI
      home: 'Home',
      markets: 'Markets',
      categories: 'Categories',
      cart: 'Cart',
      profile: 'Profile',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      search: 'Search',
      
      // Shopping
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      checkout: 'Checkout',
      
      // Messages
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      
      // Vendor
      vendorDashboard: 'Vendor Dashboard',
      addProduct: 'Add Product',
      orders: 'Orders',
      analytics: 'Analytics',
      
      // Common actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      share: 'Share'
    }
    // Add more languages as needed
  };

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('bharatshala_language');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = languages.find(lang => lang.code === browserLang);
      if (supportedLang) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const changeLanguage = async (langCode) => {
    if (languages.find(lang => lang.code === langCode)) {
      setIsLoading(true);
      
      // Simulate loading time for language switch
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLanguage(langCode);
      localStorage.setItem('bharatshala_language', langCode);
      setIsLoading(false);
      
      // Trigger page reload for full language change
      window.location.reload();
    }
  };

  const t = (key, fallback = key) => {
    return translations[language]?.[key] || translations['en']?.[key] || fallback;
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === language);
  };

  const isRTL = () => {
    const rtlLanguages = ['ar', 'ur', 'fa'];
    return rtlLanguages.includes(language);
  };

  const formatNumber = (number) => {
    if (language === 'hi') {
      return new Intl.NumberFormat('hi-IN').format(number);
    }
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const formatCurrency = (amount) => {
    if (language === 'hi') {
      return new Intl.NumberFormat('hi-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount);
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    if (language === 'hi') {
      return dateObj.toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return dateObj.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const value = {
    language,
    languages,
    isLoading,
    changeLanguage,
    t,
    getCurrentLanguage,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;