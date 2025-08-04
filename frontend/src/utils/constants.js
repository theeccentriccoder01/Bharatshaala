// Comprehensive Constants for Bharatshala Platform
export const PLATFORM_SETTINGS = {
  NAME: 'भारतशाला',
  NAME_EN: 'Bharatshala',
  VERSION: '1.0.0',
  TAGLINE: 'भारत की सांस्कृतिक धरोहर का डिजिटल घर',
  TAGLINE_EN: 'Digital Home of India\'s Cultural Heritage',
  COPYRIGHT: '© 2025 भारतशाला। सभी अधिकार सुरक्षित।',
  SUPPORT_EMAIL: 'support@bharatshala.com',
  SUPPORT_PHONE: '+91-1800-123-4567'
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.bharatshala.com/api',
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  ENDPOINTS: {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
    
    // User Management
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/delete-account',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_DETAILS: '/products/:id',
    PRODUCT_SEARCH: '/products/search',
    PRODUCT_CATEGORIES: '/products/categories',
    PRODUCT_REVIEWS: '/products/:id/reviews',
    
    // Cart
    CART: '/cart',
    ADD_TO_CART: '/cart/add',
    UPDATE_CART: '/cart/update',
    REMOVE_FROM_CART: '/cart/remove',
    CLEAR_CART: '/cart/clear',
    APPLY_COUPON: '/cart/coupon',
    
    // Orders
    ORDERS: '/orders',
    ORDER_DETAILS: '/orders/:id',
    CREATE_ORDER: '/orders/create',
    CANCEL_ORDER: '/orders/:id/cancel',
    TRACK_ORDER: '/orders/:id/track',
    ORDER_HISTORY: '/orders/history',
    
    // Wishlist
    WISHLIST: '/wishlist',
    ADD_TO_WISHLIST: '/wishlist/add',
    REMOVE_FROM_WISHLIST: '/wishlist/remove',
    
    // Vendor
    VENDOR_REGISTER: '/vendor/register',
    VENDOR_PROFILE: '/vendor/profile',
    VENDOR_PRODUCTS: '/vendor/products',
    VENDOR_ORDERS: '/vendor/orders',
    VENDOR_ANALYTICS: '/vendor/analytics',
    
    // Payment
    PAYMENT_INITIATE: '/payment/initiate',
    PAYMENT_VERIFY: '/payment/verify',
    PAYMENT_METHODS: '/payment/methods',
    
    // Notifications
    NOTIFICATIONS: '/notifications',
    MARK_READ: '/notifications/:id/read',
    
    // Support
    CONTACT: '/contact',
    FAQ: '/faq',
    HELP: '/help'
  }
};

// Application Routes
export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  
  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_PHONE: '/verify-phone',
  
  // Product Routes
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CATEGORIES: '/categories',
  CATEGORY_PRODUCTS: '/categories/:category',
  SEARCH: '/search',
  
  // User Routes
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  WISHLIST: '/wishlist',
  ADDRESSES: '/addresses',
  SETTINGS: '/settings',
  
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  ORDER_SUCCESS: '/order-success',
  ORDER_FAILED: '/order-failed',
  
  // Vendor Routes
  VENDOR_REGISTER: '/vendor/register',
  VENDOR_LOGIN: '/vendor/login',
  VENDOR_DASHBOARD: '/vendor/dashboard',
  VENDOR_PRODUCTS: '/vendor/products',
  VENDOR_ADD_PRODUCT: '/vendor/products/add',
  VENDOR_EDIT_PRODUCT: '/vendor/products/:id/edit',
  VENDOR_ORDERS: '/vendor/orders',
  VENDOR_ANALYTICS: '/vendor/analytics',
  VENDOR_PROFILE: '/vendor/profile',
  VENDOR_SETTINGS: '/vendor/settings',
  VENDOR_REVIEWS: '/vendor/reviews',
  VENDOR_PROMOTIONS: '/vendor/promotions',
  
  // Admin Routes
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings'
};

// Product Categories with Hindi names and icons
export const PRODUCT_CATEGORIES = [
  {
    id: 'handicrafts',
    name: 'हस्तशिल्प',
    nameEn: 'Handicrafts',
    icon: '🎨',
    description: 'पारंपरिक हस्तकला उत्पाद',
    subcategories: [
      { id: 'pottery', name: 'मिट्टी के बर्तन', nameEn: 'Pottery', icon: '🏺' },
      { id: 'textiles', name: 'वस्त्र कला', nameEn: 'Textiles', icon: '🧵' },
      { id: 'woodwork', name: 'लकड़ी का काम', nameEn: 'Woodwork', icon: '🪵' },
      { id: 'metalwork', name: 'धातु कला', nameEn: 'Metalwork', icon: '⚒️' },
      { id: 'jewelry', name: 'आभूषण', nameEn: 'Jewelry', icon: '💍' }
    ]
  },
  {
    id: 'clothing',
    name: 'वस्त्र',
    nameEn: 'Clothing',
    icon: '👘',
    description: 'पारंपरिक और आधुनिक वस्त्र',
    subcategories: [
      { id: 'sarees', name: 'साड़ी', nameEn: 'Sarees', icon: '🥻' },
      { id: 'kurtas', name: 'कुर्ता', nameEn: 'Kurtas', icon: '👔' },
      { id: 'lehengas', name: 'लहंगा', nameEn: 'Lehengas', icon: '👗' },
      { id: 'traditional-wear', name: 'पारंपरिक वेशभूषा', nameEn: 'Traditional Wear', icon: '🎭' }
    ]
  },
  {
    id: 'home-decor',
    name: 'घर की सजावट',
    nameEn: 'Home Decor',
    icon: '🏠',
    description: 'घर को सजाने के लिए सुंदर वस्तुएं',
    subcategories: [
      { id: 'wall-art', name: 'दीवार कला', nameEn: 'Wall Art', icon: '🖼️' },
      { id: 'lamps', name: 'दीपक', nameEn: 'Lamps', icon: '🪔' },
      { id: 'carpets', name: 'कालीन', nameEn: 'Carpets', icon: '🪴' },
      { id: 'decoratives', name: 'सजावटी वस्तुएं', nameEn: 'Decoratives', icon: '🎨' }
    ]
  },
  {
    id: 'books',
    name: 'पुस्तकें',
    nameEn: 'Books',
    icon: '📚',
    description: 'ज्ञान और मनोरंजन की पुस्तकें',
    subcategories: [
      { id: 'spiritual', name: 'आध्यात्मिक', nameEn: 'Spiritual', icon: '🕉️' },
      { id: 'literature', name: 'साहित्य', nameEn: 'Literature', icon: '📖' },
      { id: 'history', name: 'इतिहास', nameEn: 'History', icon: '🏛️' },
      { id: 'philosophy', name: 'दर्शन', nameEn: 'Philosophy', icon: '🤔' }
    ]
  },
  {
    id: 'food',
    name: 'खाद्य पदार्थ',
    nameEn: 'Food & Beverages',
    icon: '🍛',
    description: 'पारंपरिक खाना और पेय',
    subcategories: [
      { id: 'spices', name: 'मसाले', nameEn: 'Spices', icon: '🌶️' },
      { id: 'sweets', name: 'मिठाई', nameEn: 'Sweets', icon: '🍯' },
      { id: 'tea', name: 'चाय', nameEn: 'Tea', icon: '🫖' },
      { id: 'organic', name: 'जैविक उत्पाद', nameEn: 'Organic', icon: '🌱' }
    ]
  },
  {
    id: 'wellness',
    name: 'स्वास्थ्य और कल्याण',
    nameEn: 'Health & Wellness',
    icon: '🧘',
    description: 'आयुर्वेदिक और प्राकृतिक उत्पाद',
    subcategories: [
      { id: 'ayurveda', name: 'आयुर्वेद', nameEn: 'Ayurveda', icon: '🌿' },
      { id: 'yoga', name: 'योग सामग्री', nameEn: 'Yoga Accessories', icon: '🧘‍♀️' },
      { id: 'herbal', name: 'जड़ी-बूटी', nameEn: 'Herbal Products', icon: '🌾' },
      { id: 'aromatherapy', name: 'सुगंध चिकित्सा', nameEn: 'Aromatherapy', icon: '🕯️' }
    ]
  }
];

// Indian States and Union Territories
export const INDIAN_STATES = [
  { code: 'AP', name: 'आंध्र प्रदेश', nameEn: 'Andhra Pradesh' },
  { code: 'AR', name: 'अरुणाचल प्रदेश', nameEn: 'Arunachal Pradesh' },
  { code: 'AS', name: 'असम', nameEn: 'Assam' },
  { code: 'BR', name: 'बिहार', nameEn: 'Bihar' },
  { code: 'CT', name: 'छत्तीसगढ़', nameEn: 'Chhattisgarh' },
  { code: 'GA', name: 'गोवा', nameEn: 'Goa' },
  { code: 'GJ', name: 'गुजरात', nameEn: 'Gujarat' },
  { code: 'HR', name: 'हरियाणा', nameEn: 'Haryana' },
  { code: 'HP', name: 'हिमाचल प्रदेश', nameEn: 'Himachal Pradesh' },
  { code: 'JH', name: 'झारखंड', nameEn: 'Jharkhand' },
  { code: 'KA', name: 'कर्नाटक', nameEn: 'Karnataka' },
  { code: 'KL', name: 'केरल', nameEn: 'Kerala' },
  { code: 'MP', name: 'मध्य प्रदेश', nameEn: 'Madhya Pradesh' },
  { code: 'MH', name: 'महाराष्ट्र', nameEn: 'Maharashtra' },
  { code: 'MN', name: 'मणिपुर', nameEn: 'Manipur' },
  { code: 'ML', name: 'मेघालय', nameEn: 'Meghalaya' },
  { code: 'MZ', name: 'मिज़ोरम', nameEn: 'Mizoram' },
  { code: 'NL', name: 'नागालैंड', nameEn: 'Nagaland' },
  { code: 'OR', name: 'ओडिशा', nameEn: 'Odisha' },
  { code: 'PB', name: 'पंजाब', nameEn: 'Punjab' },
  { code: 'RJ', name: 'राजस्थान', nameEn: 'Rajasthan' },
  { code: 'SK', name: 'सिक्किम', nameEn: 'Sikkim' },
  { code: 'TN', name: 'तमिलनाडु', nameEn: 'Tamil Nadu' },
  { code: 'TG', name: 'तेलंगाना', nameEn: 'Telangana' },
  { code: 'TR', name: 'त्रिपुरा', nameEn: 'Tripura' },
  { code: 'UP', name: 'उत्तर प्रदेश', nameEn: 'Uttar Pradesh' },
  { code: 'UT', name: 'उत्तराखंड', nameEn: 'Uttarakhand' },
  { code: 'WB', name: 'पश्चिम बंगाल', nameEn: 'West Bengal' },
  
  // Union Territories
  { code: 'AN', name: 'अंडमान और निकोबार द्वीप समूह', nameEn: 'Andaman and Nicobar Islands' },
  { code: 'CH', name: 'चंडीगढ़', nameEn: 'Chandigarh' },
  { code: 'DN', name: 'दादरा और नगर हवेली और दमन और दीव', nameEn: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', name: 'दिल्ली', nameEn: 'Delhi' },
  { code: 'JK', name: 'जम्मू और कश्मीर', nameEn: 'Jammu and Kashmir' },
  { code: 'LA', name: 'लद्दाख', nameEn: 'Ladakh' },
  { code: 'LD', name: 'लक्षद्वीप', nameEn: 'Lakshadweep' },
  { code: 'PY', name: 'पुडुचेरी', nameEn: 'Puducherry' }
];

// Payment Methods
export const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI',
    nameHi: 'यूपीआई',
    icon: '📱',
    description: 'Google Pay, PhonePe, Paytm, और अन्य UPI ऐप्स',
    fees: 0,
    processingTime: 'तुरंत'
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    nameHi: 'क्रेडिट/डेबिट कार्ड',
    icon: '💳',
    description: 'Visa, MasterCard, RuPay',
    fees: 2.5,
    processingTime: 'तुरंत'
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    nameHi: 'नेट बैंकिंग',
    icon: '🏦',
    description: 'सभी प्रमुख बैंकों के लिए उपलब्ध',
    fees: 0,
    processingTime: 'तुरंत'
  },
  {
    id: 'wallet',
    name: 'Digital Wallets',
    nameHi: 'डिजिटल वॉलेट',
    icon: '👛',
    description: 'Paytm, MobiKwik, Freecharge',
    fees: 1.5,
    processingTime: 'तुरंत'
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    nameHi: 'कैश ऑन डिलीवरी',
    icon: '💵',
    description: 'डिलीवरी के समय नकद भुगतान',
    fees: 25,
    processingTime: 'डिलीवरी पर'
  },
  {
    id: 'emi',
    name: 'EMI',
    nameHi: 'ईएमआई',
    icon: '📊',
    description: '3, 6, 12 महीने की किस्तें',
    fees: 'varies',
    processingTime: 'तुरंत'
  }
];

// Order Status
export const ORDER_STATUS = {
  PENDING: { key: 'pending', label: 'पेंडिंग', color: 'orange', icon: '⏳' },
  CONFIRMED: { key: 'confirmed', label: 'कन्फर्म', color: 'blue', icon: '✅' },
  PROCESSING: { key: 'processing', label: 'प्रोसेसिंग', color: 'blue', icon: '⚙️' },
  PACKED: { key: 'packed', label: 'पैक्ड', color: 'purple', icon: '📦' },
  SHIPPED: { key: 'shipped', label: 'शिप्ड', color: 'indigo', icon: '🚚' },
  OUT_FOR_DELIVERY: { key: 'out_for_delivery', label: 'डिलीवरी के लिए निकला', color: 'yellow', icon: '🛵' },
  DELIVERED: { key: 'delivered', label: 'डिलीवर्ड', color: 'green', icon: '✅' },
  CANCELLED: { key: 'cancelled', label: 'कैंसल', color: 'red', icon: '❌' },
  RETURNED: { key: 'returned', label: 'रिटर्न', color: 'gray', icon: '↩️' },
  REFUNDED: { key: 'refunded', label: 'रिफंडेड', color: 'green', icon: '💰' }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'नेटवर्क कनेक्शन में समस्या है। कृपया बाद में पुनः प्रयास करें।',
  SERVER_ERROR: 'सर्वर में समस्या है। कृपया बाद में पुनः प्रयास करें।',
  UNAUTHORIZED: 'आपको इस पेज को देखने की अनुमति नहीं है।',
  FORBIDDEN: 'इस कार्य को करने की अनुमति नहीं है।',
  NOT_FOUND: 'पेज नहीं मिला।',
  VALIDATION_ERROR: 'कृपया सभी फील्ड सही तरीके से भरें।',
  GENERIC_ERROR: 'कुछ गलत हुआ है। कृपया पुनः प्रयास करें।'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'सफलतापूर्वक लॉगिन हो गए!',
  REGISTER_SUCCESS: 'खाता सफलतापूर्वक बनाया गया!',
  PROFILE_UPDATED: 'प्रोफाइल अपडेट हो गई!',
  ORDER_PLACED: 'ऑर्डर सफलतापूर्वक प्लेस हो गया!',
  PAYMENT_SUCCESS: 'भुगतान सफल हो गया!',
  ITEM_ADDED_TO_CART: 'आइटम कार्ट में जोड़ दिया गया!',
  ITEM_ADDED_TO_WISHLIST: 'आइटम विशलिस्ट में जोड़ दिया गया!'
};

// Currency Settings
export const CURRENCY = {
  CODE: 'INR',
  SYMBOL: '₹',
  NAME: 'भारतीय रुपया',
  NAME_EN: 'Indian Rupee',
  DECIMALS: 2
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: false,
  VOICE_SEARCH: false,
  AR_PREVIEW: false,
  SOCIAL_LOGIN: true,
  GUEST_CHECKOUT: true,
  WISHLIST: true,
  REVIEWS: true,
  LIVE_CHAT: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  PWA: true,
  ANALYTICS: true
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/bharatshala',
  INSTAGRAM: 'https://instagram.com/bharatshala',
  TWITTER: 'https://twitter.com/bharatshala',
  YOUTUBE: 'https://youtube.com/bharatshala',
  LINKEDIN: 'https://linkedin.com/company/bharatshala',
  WHATSAPP: 'https://wa.me/919876543210'
};

// App Store Links
export const APP_LINKS = {
  ANDROID: 'https://play.google.com/store/apps/details?id=com.bharatshala.app',
  IOS: 'https://apps.apple.com/app/bharatshala/id123456789'
};

// Business Information
export const BUSINESS_INFO = {
  COMPANY_NAME: 'भारतशाला प्राइवेट लिमिटेड',
  COMPANY_NAME_EN: 'Bharatshala Private Limited',
  CIN: 'U74999DL2020PTC123456',
  GST: '07AABCB1234M1Z5',
  ADDRESS: {
    LINE1: 'भारतशाला हाउस, कनॉट प्लेस',
    LINE2: 'नई दिल्ली - 110001',
    CITY: 'नई दिल्ली',
    STATE: 'दिल्ली',
    PINCODE: '110001',
    COUNTRY: 'भारत'
  },
  CONTACT: {
    EMAIL: 'info@bharatshala.com',
    PHONE: '+91-11-4567-8901',
    SUPPORT: 'support@bharatshala.com',
    VENDOR: 'vendor@bharatshala.com'
  }
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9]\d{5}$/,
  PAN: /^[A-Z]{5}\d{4}[A-Z]$/,
  AADHAAR: /^\d{4}\s?\d{4}\s?\d{4}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bharatshala_auth_token',
  REFRESH_TOKEN: 'bharatshala_refresh_token',
  USER_DATA: 'bharatshala_user_data',
  CART_DATA: 'bharatshala_cart_data',
  WISHLIST_DATA: 'bharatshala_wishlist_data',
  SEARCH_HISTORY: 'bharatshala_search_history',
  RECENTLY_VIEWED: 'bharatshala_recently_viewed',
  USER_PREFERENCES: 'bharatshala_user_preferences',
  LANGUAGE: 'bharatshala_language',
  THEME: 'bharatshala_theme'
};

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DISPLAY_WITH_TIME: 'DD MMM YYYY, hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  RELATIVE: 'relative' // for "2 hours ago" type display
};

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 },
  BANNER: { width: 1920, height: 600 }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_VISIBLE_PAGES: 5
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_FILES: 10
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#10b981', // emerald-500
  SECONDARY: '#f97316', // orange-500
  SUCCESS: '#22c55e', // green-500
  WARNING: '#f59e0b', // amber-500
  ERROR: '#ef4444', // red-500
  INFO: '#3b82f6' // blue-500
};

export default {
  PLATFORM_SETTINGS,
  API_CONFIG,
  ROUTES,
  PRODUCT_CATEGORIES,
  INDIAN_STATES,
  PAYMENT_METHODS,
  ORDER_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CURRENCY,
  FEATURES,
  SOCIAL_LINKS,
  APP_LINKS,
  BUSINESS_INFO,
  REGEX_PATTERNS,
  STORAGE_KEYS,
  DATE_FORMATS,
  IMAGE_SIZES,
  PAGINATION,
  FILE_UPLOAD,
  THEME_COLORS
};