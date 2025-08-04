// Comprehensive Validation System for Bharatshala Platform
import config from './config';

// Indian-specific validation patterns
const PATTERNS = {
  // Phone number patterns for India
  phone: {
    mobile: /^[6-9]\d{9}$/,
    landline: /^0\d{2,4}-?\d{6,8}$/,
    international: /^\+91[6-9]\d{9}$/
  },
  
  // Email pattern (more lenient for international domains)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Indian postal codes
  pincode: /^[1-9]\d{5}$/,
  
  // PAN card
  pan: /^[A-Z]{5}\d{4}[A-Z]$/,
  
  // Aadhaar number
  aadhaar: /^\d{4}\s?\d{4}\s?\d{4}$/,
  
  // GST number
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/,
  
  // Indian names (Hindi and English)
  indianName: /^[a-zA-Z\u0900-\u097F\s.'-]{2,50}$/,
  
  // Product SKU
  sku: /^[A-Z0-9]{3,20}$/,
  
  // Strong password
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // URL validation
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // Bank account number
  bankAccount: /^\d{9,18}$/,
  
  // IFSC code
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/
};

// Error messages in Hindi and English
const ERROR_MESSAGES = {
  required: {
    hi: 'यह फील्ड आवश्यक है',
    en: 'This field is required'
  },
  email: {
    hi: 'कृपया वैध ईमेल पता डालें',
    en: 'Please enter a valid email address'
  },
  phone: {
    hi: 'कृपया वैध फोन नंबर डालें',
    en: 'Please enter a valid phone number'
  },
  pincode: {
    hi: 'कृपया वैध पिन कोड डालें (6 अंक)',
    en: 'Please enter a valid PIN code (6 digits)'
  },
  pan: {
    hi: 'कृपया वैध PAN नंबर डालें',
    en: 'Please enter a valid PAN number'
  },
  aadhaar: {
    hi: 'कृपया वैध आधार नंबर डालें',
    en: 'Please enter a valid Aadhaar number'
  },
  gst: {
    hi: 'कृपया वैध GST नंबर डालें',
    en: 'Please enter a valid GST number'
  },
  password: {
    hi: 'पासवर्ड में कम से कम 8 अक्षर, 1 बड़ा अक्षर, 1 छोटा अक्षर, 1 नंबर और 1 विशेष चिह्न होना चाहिए',
    en: 'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character'
  },
  min: {
    hi: 'कम से कम {min} अक्षर होने चाहिए',
    en: 'Must be at least {min} characters'
  },
  max: {
    hi: 'अधिकतम {max} अक्षर हो सकते हैं',
    en: 'Must be at most {max} characters'
  },
  minNumber: {
    hi: 'न्यूनतम मान {min} होना चाहिए',
    en: 'Minimum value should be {min}'
  },
  maxNumber: {
    hi: 'अधिकतम मान {max} हो सकता है',
    en: 'Maximum value should be {max}'
  },
  url: {
    hi: 'कृपया वैध URL डालें',
    en: 'Please enter a valid URL'
  },
  bankAccount: {
    hi: 'कृपया वैध बैंक अकाउंट नंबर डालें',
    en: 'Please enter a valid bank account number'
  },
  ifsc: {
    hi: 'कृपया वैध IFSC कोड डालें',
    en: 'Please enter a valid IFSC code'
  },
  match: {
    hi: '{field} मैच नहीं हो रहा',
    en: '{field} does not match'
  },
  custom: {
    hi: 'अमान्य मान',
    en: 'Invalid value'
  }
};

// Main Validator class
class Validator {
  constructor(language = 'hi') {
    this.language = language;
    this.rules = new Map();
    this.customValidators = new Map();
    this.errors = new Map();
  }

  // Set validation language
  setLanguage(lang) {
    this.language = lang;
    return this;
  }

  // Add custom validator
  addCustomValidator(name, validator, errorMessage) {
    this.customValidators.set(name, { validator, errorMessage });
    return this;
  }

  // Core validation methods
  required(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return Boolean(value);
  }

  email(value) {
    if (!value) return true; // Allow empty if not required
    return PATTERNS.email.test(value);
  }

  phone(value) {
    if (!value) return true;
    const cleaned = value.replace(/[\s-]/g, '');
    return PATTERNS.phone.mobile.test(cleaned) || 
           PATTERNS.phone.landline.test(cleaned) || 
           PATTERNS.phone.international.test(cleaned);
  }

  pincode(value) {
    if (!value) return true;
    return PATTERNS.pincode.test(value);
  }

  pan(value) {
    if (!value) return true;
    return PATTERNS.pan.test(value.toUpperCase());
  }

  aadhaar(value) {
    if (!value) return true;
    const cleaned = value.replace(/\s/g, '');
    return PATTERNS.aadhaar.test(value) && this.verifyAadhaar(cleaned);
  }

  gst(value) {
    if (!value) return true;
    return PATTERNS.gst.test(value.toUpperCase());
  }

  password(value) {
    if (!value) return true;
    return PATTERNS.strongPassword.test(value);
  }

  url(value) {
    if (!value) return true;
    return PATTERNS.url.test(value);
  }

  bankAccount(value) {
    if (!value) return true;
    return PATTERNS.bankAccount.test(value);
  }

  ifsc(value) {
    if (!value) return true;
    return PATTERNS.ifsc.test(value.toUpperCase());
  }

  min(value, minLength) {
    if (!value) return true;
    if (typeof value === 'string') return value.length >= minLength;
    if (typeof value === 'number') return value >= minLength;
    return true;
  }

  max(value, maxLength) {
    if (!value) return true;
    if (typeof value === 'string') return value.length <= maxLength;
    if (typeof value === 'number') return value <= maxLength;
    return true;
  }

  match(value, compareValue) {
    return value === compareValue;
  }

  // Advanced validations
  indianName(value) {
    if (!value) return true;
    return PATTERNS.indianName.test(value) && value.length >= 2;
  }

  age(value, minAge = 13, maxAge = 120) {
    if (!value) return true;
    const age = parseInt(value);
    return age >= minAge && age <= maxAge;
  }

  creditCard(value) {
    if (!value) return true;
    const cleaned = value.replace(/\s/g, '');
    return this.luhnCheck(cleaned);
  }

  // Helper methods
  verifyAadhaar(aadhaar) {
    // Verhoeff algorithm for Aadhaar validation
    const d = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
      [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
      [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
      [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
      [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
      [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
      [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
      [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
      [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    ];

    const p = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
      [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
      [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
      [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
      [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
      [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
      [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
    ];

    let c = 0;
    const reversedArray = aadhaar.split('').map(Number).reverse();

    for (let i = 0; i < reversedArray.length; i++) {
      c = d[c][p[((i + 1) % 8)][reversedArray[i]]];
    }

    return c === 0;
  }

  luhnCheck(cardNumber) {
    const digits = cardNumber.split('').map(Number);
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Validate single field
  validateField(value, rules, fieldName = '') {
    const errors = [];

    for (const rule of rules) {
      let isValid = true;
      let errorKey = '';
      let errorParams = {};

      if (typeof rule === 'string') {
        // Simple rule like 'required', 'email', etc.
        if (this[rule]) {
          isValid = this[rule](value);
          errorKey = rule;
        } else if (this.customValidators.has(rule)) {
          const customValidator = this.customValidators.get(rule);
          isValid = customValidator.validator(value);
          errorKey = 'custom';
        }
      } else if (typeof rule === 'object') {
        // Complex rule like { min: 5 }, { max: 100 }
        const ruleKey = Object.keys(rule)[0];
        const ruleValue = rule[ruleKey];

        if (this[ruleKey]) {
          isValid = this[ruleKey](value, ruleValue);
          errorKey = ruleKey;
          errorParams[ruleKey] = ruleValue;
        }
      } else if (typeof rule === 'function') {
        // Custom function
        isValid = rule(value);
        errorKey = 'custom';
      }

      if (!isValid) {
        let errorMessage = ERROR_MESSAGES[errorKey]?.[this.language] || ERROR_MESSAGES[errorKey]?.en || 'Invalid value';
        
        // Replace parameters in error message
        Object.keys(errorParams).forEach(param => {
          errorMessage = errorMessage.replace(`{${param}}`, errorParams[param]);
        });

        errorMessage = errorMessage.replace('{field}', fieldName);
        
        errors.push(errorMessage);
        break; // Stop at first error
      }
    }

    return errors;
  }

  // Validate entire form
  validateForm(data, rules) {
    const errors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const fieldErrors = this.validateField(data[field], rules[field], field);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    });

    return {
      isValid,
      errors
    };
  }

  // Real-time validation
  createRealTimeValidator(rules, callback, debounceMs = 300) {
    let timeout;

    return (data) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const result = this.validateForm(data, rules);
        callback(result);
      }, debounceMs);
    };
  }

  // Business-specific validations
  validateProductData(product) {
    const rules = {
      name: ['required', { min: 3 }, { max: 100 }],
      description: ['required', { min: 10 }, { max: 1000 }],
      price: ['required', { minNumber: 1 }, { maxNumber: 1000000 }],
      category: ['required'],
      images: ['required']
    };

    return this.validateForm(product, rules);
  }

  validateUserRegistration(userData) {
    const rules = {
      name: ['required', 'indianName', { min: 2 }, { max: 50 }],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      password: ['required', 'password'],
      confirmPassword: ['required'],
      terms: ['required']
    };

    const result = this.validateForm(userData, rules);

    // Check password match
    if (userData.password !== userData.confirmPassword) {
      result.isValid = false;
      result.errors.confirmPassword = [ERROR_MESSAGES.match[this.language].replace('{field}', 'पासवर्ड')];
    }

    return result;
  }

  validateVendorRegistration(vendorData) {
    const rules = {
      businessName: ['required', { min: 3 }, { max: 100 }],
      ownerName: ['required', 'indianName'],
      email: ['required', 'email'],
      phone: ['required', 'phone'],
      address: ['required', { min: 10 }],
      pincode: ['required', 'pincode'],
      pan: ['required', 'pan'],
      gst: ['gst'], // Optional
      bankAccount: ['required', 'bankAccount'],
      ifsc: ['required', 'ifsc']
    };

    return this.validateForm(vendorData, rules);
  }

  // Sanitize input
  sanitize(value, type = 'string') {
    if (!value) return value;

    switch (type) {
      case 'string':
        return value.toString().trim();
      case 'email':
        return value.toString().toLowerCase().trim();
      case 'phone':
        return value.toString().replace(/[^\d+]/g, '');
      case 'number':
        return parseFloat(value) || 0;
      case 'html':
        return value.toString()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      default:
        return value;
    }
  }
}

// Create default validator instance
const validator = new Validator(config.ui.defaultLanguage || 'hi');

// Add custom validators for Bharatshala
validator.addCustomValidator('productSKU', (value) => {
  return PATTERNS.sku.test(value);
}, 'कृपया वैध SKU डालें');

validator.addCustomValidator('strongName', (value) => {
  return value && value.length >= 2 && !/^\s+$/.test(value);
}, 'नाम में केवल स्पेस नहीं हो सकते');

// Validation presets for common forms
const VALIDATION_PRESETS = {
  login: {
    identifier: ['required'], // email or phone
    password: ['required']
  },

  contact: {
    name: ['required', { min: 2 }, { max: 50 }],
    email: ['required', 'email'],
    phone: ['required', 'phone'],
    subject: ['required', { min: 5 }],
    message: ['required', { min: 10 }, { max: 1000 }]
  },

  address: {
    name: ['required', 'indianName'],
    phone: ['required', 'phone'],
    address: ['required', { min: 10 }],
    city: ['required', { min: 2 }],
    state: ['required'],
    pincode: ['required', 'pincode']
  },

  payment: {
    cardNumber: ['required', 'creditCard'],
    expiryMonth: ['required', { minNumber: 1 }, { maxNumber: 12 }],
    expiryYear: ['required', { minNumber: new Date().getFullYear() }],
    cvv: ['required', { min: 3 }, { max: 4 }],
    cardholderName: ['required', 'indianName']
  }
};

// Utility functions
export const validateForm = (data, rules) => {
  return validator.validateForm(data, rules);
};

export const validateField = (value, rules, fieldName) => {
  return validator.validateField(value, rules, fieldName);
};

export const sanitize = (value, type) => {
  return validator.sanitize(value, type);
};

export const useValidation = () => {
  return {
    validateForm: validator.validateForm.bind(validator),
    validateField: validator.validateField.bind(validator),
    sanitize: validator.sanitize.bind(validator),
    setLanguage: validator.setLanguage.bind(validator),
    addCustomValidator: validator.addCustomValidator.bind(validator),
    presets: VALIDATION_PRESETS
  };
};

export { validator, VALIDATION_PRESETS, PATTERNS, ERROR_MESSAGES };
export default validator;