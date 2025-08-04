// Comprehensive Formatting Utilities for Bharatshala Platform
import { format, parseISO, isValid } from 'date-fns';
import { hi, enUS } from 'date-fns/locale';
import { INDIAN_STATES } from './constants';

// Number Formatters
export const numberFormatters = {
  // Format currency with Indian locale
  currency(amount, currency = 'INR', locale = 'hi-IN', options = {}) {
    if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
    
    const formatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...options
    };

    try {
      return new Intl.NumberFormat(locale, formatOptions).format(amount);
    } catch (error) {
      // Fallback to simple formatting
      return `₹${this.number(amount)}`;
    }
  },

  // Format numbers with Indian numbering system
  number(num, locale = 'hi-IN') {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    try {
      return new Intl.NumberFormat(locale).format(num);
    } catch (error) {
      return num.toString();
    }
  },

  // Format large numbers in Indian style (lakhs, crores)
  indianNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 10000000) { // 1 crore
      return `${sign}${(absNum / 10000000).toFixed(2)} करोड़`;
    } else if (absNum >= 100000) { // 1 lakh
      return `${sign}${(absNum / 100000).toFixed(2)} लाख`;
    } else if (absNum >= 1000) { // 1 thousand
      return `${sign}${(absNum / 1000).toFixed(1)} हज़ार`;
    } else {
      return `${sign}${absNum}`;
    }
  },

  // Format percentage
  percentage(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
  },

  // Format file size
  fileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Format ratings
  rating(rating, maxRating = 5) {
    if (!rating) return '0/5';
    return `${Number(rating).toFixed(1)}/${maxRating}`;
  },

  // Format ordinal numbers (1st, 2nd, 3rd, etc.)
  ordinal(num, language = 'hi') {
    if (language === 'hi') {
      return `${num}वां`;
    }
    
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }
};

// Date Formatters
export const dateFormatters = {
  // Format date with various patterns
  date(date, pattern = 'dd/MM/yyyy', locale = 'hi') {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    const localeObj = locale === 'hi' ? hi : enUS;
    
    try {
      return format(dateObj, pattern, { locale: localeObj });
    } catch (error) {
      return dateObj.toLocaleDateString();
    }
  },

  // Format date and time
  dateTime(date, pattern = 'dd MMM yyyy, hh:mm a', locale = 'hi') {
    return this.date(date, pattern, locale);
  },

  // Format time only
  time(date, pattern = 'hh:mm a', locale = 'hi') {
    return this.date(date, pattern, locale);
  },

  // Relative time (e.g., "2 hours ago")
  relative(date, locale = 'hi') {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    if (locale === 'hi') {
      if (diffInSeconds < 60) return 'अभी';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} मिनट पहले`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} घंटे पहले`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} दिन पहले`;
      if (diffInSeconds < 2629746) return `${Math.floor(diffInSeconds / 604800)} सप्ताह पहले`;
      if (diffInSeconds < 31556952) return `${Math.floor(diffInSeconds / 2629746)} महीने पहले`;
      return `${Math.floor(diffInSeconds / 31556952)} साल पहले`;
    } else {
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 2629746) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
      if (diffInSeconds < 31556952) return `${Math.floor(diffInSeconds / 2629746)} months ago`;
      return `${Math.floor(diffInSeconds / 31556952)} years ago`;
    }
  },

  // Format birthday/age
  age(birthDate) {
    if (!birthDate) return '';
    
    const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
    if (!isValid(birth)) return '';
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} साल`;
  },

  // Format duration
  duration(seconds) {
    if (!seconds || seconds < 0) return '0 सेकंड';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours} घंटे`);
    if (minutes > 0) parts.push(`${minutes} मिनट`);
    if (secs > 0) parts.push(`${secs} सेकंड`);
    
    return parts.join(', ') || '0 सेकंड';
  },

  // Format date range
  dateRange(startDate, endDate, locale = 'hi') {
    if (!startDate || !endDate) return '';
    
    const start = this.date(startDate, 'dd MMM', locale);
    const end = this.date(endDate, 'dd MMM yyyy', locale);
    
    return `${start} - ${end}`;
  }
};

// Text Formatters
export const textFormatters = {
  // Truncate text with ellipsis
  truncate(text, length = 100, suffix = '...') {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
  },

  // Capitalize first letter
  capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Title case
  titleCase(text) {
    if (!text) return '';
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  // Sentence case
  sentenceCase(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  // Camel case
  camelCase(text) {
    if (!text) return '';
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  },

  // Kebab case
  kebabCase(text) {
    if (!text) return '';
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/\s+/g, '-')
      .toLowerCase();
  },

  // Snake case
  snakeCase(text) {
    if (!text) return '';
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  },

  // Extract initials
  initials(name, maxLength = 2) {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, maxLength)
      .join('');
  },

  // Format phone number
  phone(phoneNumber, format = 'indian') {
    if (!phoneNumber) return '';
    
    const digits = phoneNumber.replace(/\D/g, '');
    
    if (format === 'indian') {
      if (digits.length === 10) {
        return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      } else if (digits.length === 12 && digits.startsWith('91')) {
        return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
      }
    }
    
    return phoneNumber;
  },

  // Mask sensitive data
  mask(text, visibleChars = 4, maskChar = '*') {
    if (!text) return '';
    if (text.length <= visibleChars) return text;
    
    const visible = text.slice(-visibleChars);
    const masked = maskChar.repeat(text.length - visibleChars);
    return masked + visible;
  },

  // Format card number
  cardNumber(cardNumber) {
    if (!cardNumber) return '';
    const digits = cardNumber.replace(/\D/g, '');
    return digits.replace(/(.{4})/g, '$1 ').trim();
  }
};

// Address Formatters
export const addressFormatters = {
  // Format full address
  fullAddress(addressObj) {
    if (!addressObj) return '';
    
    const parts = [
      addressObj.line1,
      addressObj.line2,
      addressObj.landmark,
      addressObj.city,
      this.stateName(addressObj.state),
      addressObj.pincode
    ].filter(Boolean);
    
    return parts.join(', ');
  },

  // Format compact address
  compactAddress(addressObj) {
    if (!addressObj) return '';
    
    const parts = [
      addressObj.city,
      this.stateName(addressObj.state),
      addressObj.pincode
    ].filter(Boolean);
    
    return parts.join(', ');
  },

  // Get state name from code
  stateName(stateCode) {
    if (!stateCode) return '';
    const state = INDIAN_STATES.find(s => s.code === stateCode);
    return state ? state.name : stateCode;
  },

  // Format pincode
  pincode(pincode) {
    if (!pincode) return '';
    const digits = pincode.toString();
    return digits.length === 6 ? digits.replace(/(.{3})(.{3})/, '$1 $2') : digits;
  }
};

// E-commerce Formatters
export const ecommerceFormatters = {
  // Format product SKU
  sku(sku) {
    if (!sku) return '';
    return sku.toUpperCase();
  },

  // Format order ID
  orderId(id, prefix = 'ORD') {
    if (!id) return '';
    return `${prefix}-${id.toString().padStart(6, '0')}`;
  },

  // Format shipping status
  shippingStatus(status) {
    const statusMap = {
      pending: 'पेंडिंग',
      confirmed: 'कन्फर्म',
      processing: 'प्रोसेसिंग',
      packed: 'पैक्ड',
      shipped: 'शिप्ड',
      out_for_delivery: 'डिलीवरी के लिए निकला',
      delivered: 'डिलीवर्ड',
      cancelled: 'कैंसल',
      returned: 'रिटर्न'
    };
    
    return statusMap[status] || status;
  },

  // Format payment method
  paymentMethod(method) {
    const methodMap = {
      upi: 'UPI',
      card: 'कार्ड',
      netbanking: 'नेट बैंकिंग',
      wallet: 'डिजिटल वॉलेट',
      cod: 'कैश ऑन डिलीवरी'
    };
    
    return methodMap[method] || method;
  },

  // Format discount
  discount(originalPrice, discountedPrice) {
    if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
      return null;
    }
    
    const discountAmount = originalPrice - discountedPrice;
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100);
    
    return {
      amount: discountAmount,
      percentage: discountPercentage,
      formatted: `${discountPercentage}% छूट (₹${numberFormatters.number(discountAmount)} बचत)`
    };
  },

  // Format stock status
  stockStatus(stockCount, minStock = 5) {
    if (stockCount === 0) {
      return { text: 'स्टॉक में नहीं', color: 'red', severity: 'high' };
    } else if (stockCount <= minStock) {
      return { text: `केवल ${stockCount} बचे`, color: 'orange', severity: 'medium' };
    } else {
      return { text: 'स्टॉक में उपलब्ध', color: 'green', severity: 'low' };
    }
  },

  // Format review summary
  reviewSummary(reviews) {
    if (!reviews || reviews.length === 0) {
      return { average: 0, total: 0, text: 'कोई समीक्षा नहीं' };
    }
    
    const total = reviews.length;
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total;
    
    return {
      average: Number(average.toFixed(1)),
      total,
      text: `${average.toFixed(1)} ⭐ (${total} समीक्षा)`
    };
  }
};

// Validation Formatters
export const validationFormatters = {
  // Format validation error
  error(field, rule, value) {
    const fieldNames = {
      name: 'नाम',
      email: 'ईमेल',
      phone: 'फोन नंबर',
      password: 'पासवर्ड',
      price: 'कीमत',
      quantity: 'मात्रा'
    };
    
    const fieldName = fieldNames[field] || field;
    
    const errorMessages = {
      required: `${fieldName} आवश्यक है`,
      email: 'कृपया वैध ईमेल पता डालें',
      min: `${fieldName} कम से कम ${value} अक्षर का होना चाहिए`,
      max: `${fieldName} अधिकतम ${value} अक्षर का होना चाहिए`,
      pattern: `${fieldName} का प्रारूप सही नहीं है`
    };
    
    return errorMessages[rule] || `${fieldName} में त्रुटि`;
  }
};

// Social Media Formatters
export const socialFormatters = {
  // Format follower count
  followers(count) {
    return numberFormatters.indianNumber(count) + ' फॉलोअर्स';
  },

  // Format like count
  likes(count) {
    return numberFormatters.indianNumber(count) + ' लाइक्स';
  },

  // Format share count
  shares(count) {
    return numberFormatters.indianNumber(count) + ' शेयर्स';
  },

  // Format hashtag
  hashtag(tag) {
    if (!tag) return '';
    return tag.startsWith('#') ? tag : `#${tag}`;
  },

  // Format mention
  mention(username) {
    if (!username) return '';
    return username.startsWith('@') ? username : `@${username}`;
  }
};

// Analytics Formatters
export const analyticsFormatters = {
  // Format growth percentage
  growth(current, previous) {
    if (!previous || previous === 0) return '0%';
    const growth = ((current - previous) / previous) * 100;
    const sign = growth > 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  },

  // Format conversion rate
  conversionRate(conversions, visits) {
    if (!visits || visits === 0) return '0%';
    const rate = (conversions / visits) * 100;
    return `${rate.toFixed(2)}%`;
  },

  // Format bounce rate
  bounceRate(bounces, sessions) {
    if (!sessions || sessions === 0) return '0%';
    const rate = (bounces / sessions) * 100;
    return `${rate.toFixed(1)}%`;
  },

  // Format session duration
  sessionDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// Export all formatters as a single object
export const formatters = {
  number: numberFormatters,
  date: dateFormatters,
  text: textFormatters,
  address: addressFormatters,
  ecommerce: ecommerceFormatters,
  validation: validationFormatters,
  social: socialFormatters,
  analytics: analyticsFormatters
};

// Convenience functions for common formatting
export const format = {
  // Quick currency formatting
  currency: numberFormatters.currency,
  
  // Quick date formatting
  date: dateFormatters.date,
  dateTime: dateFormatters.dateTime,
  relative: dateFormatters.relative,
  
  // Quick text formatting
  truncate: textFormatters.truncate,
  capitalize: textFormatters.capitalize,
  
  // Quick number formatting
  number: numberFormatters.number,
  indianNumber: numberFormatters.indianNumber,
  percentage: numberFormatters.percentage,
  
  // Quick e-commerce formatting
  orderId: ecommerceFormatters.orderId,
  discount: ecommerceFormatters.discount,
  stockStatus: ecommerceFormatters.stockStatus
};

export default formatters;