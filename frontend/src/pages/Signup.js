import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";
import "../App.css";
import axios from "axios";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    accountType: "",
    phoneNumber: "",
    invitationCode: "",
    repeatPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [validations, setValidations] = useState({
    validPhoneNumber: false,
    validPassword: false
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    specialChar: false,
    uppercase: false,
    lowercase: false
  });

  const [otp, setOTP] = useState('');
  const [correctOTP, setCorrectOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'खाता प्रकार', icon: '👤' },
    { id: 2, title: 'व्यक्तिगत जानकारी', icon: '📝' },
    { id: 3, title: 'सत्यापन', icon: '✅' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = async (email) => {
    if (!email) {
      return "कृपया ईमेल दर्ज करें";
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      return "अमान्य ईमेल प्रारूप";
    }

    try {
      const response = await axios.post("/AuthenticateEmail", { email });
      if (response.data.exists) {
        return response.data.message;
      } else {
        return '';
      }
    } catch (error) {
      return "ईमेल जांचने में त्रुटि";
    }
  };

  const validatePassword = (password) => {
    const lengthRegex = /.{8,}/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    const requirements = {
      length: lengthRegex.test(password),
      number: numberRegex.test(password),
      specialChar: specialCharRegex.test(password),
      uppercase: uppercaseRegex.test(password),
      lowercase: lowercaseRegex.test(password)
    };

    setPasswordRequirements(requirements);

    const isPasswordValid = Object.values(requirements).every(req => req);
    setValidations(prev => ({ ...prev, validPassword: isPasswordValid }));
    
    return isPasswordValid ? '' : 'पासवर्ड आवश्यकताओं को पूरा नहीं करता';
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return "कृपया वैध फोन नंबर दर्ज करें";
    }
    setValidations(prev => ({ ...prev, validPhoneNumber: true }));
    return '';
  };

  const validateInvitationCode = async (code) => {
    if (formData.accountType === "vendor" && !code) {
      return "कृपया निमंत्रण कोड दर्ज करें";
    }
    
    if (code && formData.accountType === "vendor") {
      try {
        const response = await axios.post("/AuthenticateInvitationCode", { value: code });
        return response.data.exists ? "" : response.data.message;
      } catch (error) {
        return "निमंत्रण कोड जांचने में त्रुटि";
      }
    }
    return '';
  };

  const handleInputChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    let error = '';
    switch (field) {
      case 'email':
        error = await validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'phoneNumber':
        error = validatePhoneNumber(value);
        break;
      case 'name':
        error = !value ? "कृपया नाम दर्ज करें" : '';
        break;
      case 'repeatPassword':
        error = value !== formData.password ? 'पासवर्ड मैच नहीं करता' : '';
        break;
      case 'invitationCode':
        error = await validateInvitationCode(value);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const sendOTP = async () => {
    const phoneError = validatePhoneNumber(formData.phoneNumber);
    if (phoneError) {
      setErrors(prev => ({ ...prev, phoneNumber: phoneError }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/SendOTP", { 
        name: formData.name, 
        phoneNumber: formData.phoneNumber 
      });
      
      if (response.data.success) {
        setOtpSent(true);
        setCorrectOTP(response.data.otp);
        setErrors(prev => ({ ...prev, phoneNumber: '' }));
      } else {
        setErrors(prev => ({ ...prev, phoneNumber: "OTP भेजने में समस्या" }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, phoneNumber: "OTP भेजने में त्रुटि" }));
    }
    setIsLoading(false);
  };

  const verifyOTP = async () => {
    if (otp === correctOTP) {
      setOtpValid(true);
      setCurrentStep(3);
      await signup();
    } else {
      setErrors(prev => ({ ...prev, otp: "गलत OTP" }));
    }
  };

  const signup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/Signup", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        accountType: formData.accountType,
        phoneNumber: formData.phoneNumber,
        invitationCode: formData.invitationCode
      });
      
      // Success - redirect to success page or login
      navigate('/login?signup=success');
    } catch (error) {
      setErrors(prev => ({ ...prev, general: "साइन अप में त्रुटि" }));
    }
    setIsLoading(false);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (pageLoading) {
    return <LoadingSpinner message="साइन अप पेज लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        <div className="max-w-2xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-emerald-200'>
              <span className='text-2xl'>🌟</span>
              <span className='text-emerald-800 font-bold'>नया सदस्य</span>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-4">
              साइन अप करें
            </h1>
            <p className="text-emerald-600 text-lg">
              सच्चे भारतशाला अनुभव का आनंद लेने के लिए,<br/>
              अपनी जानकारी दर्ज करें
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`flex flex-col items-center ${
                    currentStep >= step.id ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                      currentStep >= step.id 
                        ? 'bg-emerald-500 text-white border-emerald-500' 
                        : 'bg-white border-gray-300'
                    }`}>
                      {currentStep > step.id ? '✓' : step.icon}
                    </div>
                    <span className="text-sm font-medium mt-2">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 rounded transition-all duration-300 ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
            
            {/* Step 1: Account Type */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-emerald-800 text-center mb-6">
                  खाता प्रकार चुनें
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 ${
                    formData.accountType === 'customer' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-emerald-200 hover:border-emerald-300'
                  }`}>
                    <input
                      type="radio"
                      name="accountType"
                      value="customer"
                      checked={formData.accountType === 'customer'}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-4xl mb-3">🛍️</div>
                      <h4 className="text-lg font-semibold text-emerald-800 mb-2">ग्राहक</h4>
                      <p className="text-emerald-600 text-sm">
                        खरीदारी करें और भारत के बेहतरीन उत्पादों का आनंद लें
                      </p>
                    </div>
                  </label>

                  <label className={`cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 ${
                    formData.accountType === 'vendor' 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-emerald-200 hover:border-emerald-300'
                  }`}>
                    <input
                      type="radio"
                      name="accountType"
                      value="vendor"
                      checked={formData.accountType === 'vendor'}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-4xl mb-3">🏪</div>
                      <h4 className="text-lg font-semibold text-emerald-800 mb-2">विक्रेता</h4>
                      <p className="text-emerald-600 text-sm">
                        अपने उत्पाद बेचें और व्यापार बढ़ाएं
                      </p>
                    </div>
                  </label>
                </div>

                {/* Vendor Invitation Code */}
                {formData.accountType === "vendor" && (
                  <div className="mt-6">
                    <label className="block text-emerald-800 font-semibold text-lg mb-2">
                      निमंत्रण कोड
                    </label>
                    <input
                      type="text"
                      value={formData.invitationCode}
                      onChange={(e) => handleInputChange('invitationCode', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
                        errors.invitationCode 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-emerald-200 focus:border-emerald-500'
                      } focus:outline-none bg-white text-lg`}
                      placeholder="विक्रेता निमंत्रण कोड"
                    />
                    {errors.invitationCode && (
                      <p className="text-red-500 text-sm mt-2">{errors.invitationCode}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={nextStep}
                  disabled={!formData.accountType || (formData.accountType === 'vendor' && errors.invitationCode)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  आगे बढ़ें
                </button>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-emerald-800 text-center mb-6">
                  व्यक्तिगत जानकारी
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-emerald-800 font-semibold text-lg mb-2">
                    पूरा नाम
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-emerald-200 focus:border-emerald-500'
                    } focus:outline-none bg-white text-lg`}
                    placeholder="आपका पूरा नाम"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-emerald-800 font-semibold text-lg mb-2">
                    ईमेल पता
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-emerald-200 focus:border-emerald-500'
                    } focus:outline-none bg-white text-lg`}
                    placeholder="आपका ईमेल पता"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-emerald-800 font-semibold text-lg mb-2">
                    फोन नंबर
                  </label>
                  <PhoneInput
                    country={'in'}
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange('phoneNumber', value)}
                    inputStyle={{
                      width: '100%',
                      height: '64px',
                      fontSize: '18px',
                      border: errors.phoneNumber ? '2px solid #fca5a5' : '2px solid #d1fae5',
                      borderRadius: '12px'
                    }}
                    containerStyle={{
                      width: '100%'
                    }}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-2">{errors.phoneNumber}</p>
                  )}
                  
                  <button
                    onClick={sendOTP}
                    disabled={!validations.validPhoneNumber || otpSent}
                    className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpSent ? 'OTP भेजा गया ✓' : 'OTP भेजें'}
                  </button>
                </div>

                {/* OTP Verification */}
                {otpSent && (
                  <div>
                    <label className="block text-emerald-800 font-semibold text-lg mb-2">
                      OTP दर्ज करें
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOTP(e.target.value)}
                      className="w-full px-4 py-4 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none bg-white text-lg text-center tracking-widest"
                      placeholder="6 अंकों का OTP"
                      maxLength={6}
                    />
                    {errors.otp && (
                      <p className="text-red-500 text-sm mt-2">{errors.otp}</p>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-emerald-800 font-semibold text-lg mb-2">
                    पासवर्ड
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full px-4 py-4 pr-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none bg-white text-lg"
                      placeholder="मजबूत पासवर्ड बनाएं"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="mt-3 space-y-1">
                    {Object.entries({
                      length: 'कम से कम 8 अक्षर',
                      number: 'कम से कम एक संख्या',
                      specialChar: 'कम से कम एक विशेष चिह्न',
                      uppercase: 'कम से कम एक बड़ा अक्षर',
                      lowercase: 'कम से कम एक छोटा अक्षर'
                    }).map(([key, text]) => (
                      <p key={key} className={`text-sm flex items-center ${
                        passwordRequirements[key] ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <span className="mr-2">{passwordRequirements[key] ? '✅' : '⭕'}</span>
                        {text}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Repeat Password */}
                <div>
                  <label className="block text-emerald-800 font-semibold text-lg mb-2">
                    पासवर्ड दोहराएं
                  </label>
                  <input
                    type="password"
                    value={formData.repeatPassword}
                    onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                    className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-300 ${
                      errors.repeatPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-emerald-200 focus:border-emerald-500'
                    } focus:outline-none bg-white text-lg`}
                    placeholder="पासवर्ड दोबारा लिखें"
                  />
                  {errors.repeatPassword && (
                    <p className="text-red-500 text-sm mt-2">{errors.repeatPassword}</p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 border-2 border-emerald-500 text-emerald-600 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-all duration-300"
                  >
                    पीछे
                  </button>
                  <button
                    onClick={otpSent ? verifyOTP : sendOTP}
                    disabled={isLoading || !validations.validPassword || !formData.name || !formData.email || errors.repeatPassword}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>प्रतीक्षा करें...</span>
                      </div>
                    ) : otpSent ? 'OTP सत्यापित करें' : 'OTP भेजें'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-emerald-800 mb-4">
                  बधाई हो!
                </h3>
                <p className="text-xl text-emerald-600 mb-8">
                  आपका खाता सफलतापूर्वक बन गया है।<br/>
                  अब आप भारतशाला का पूरा आनंद ले सकते हैं।
                </p>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                  <h4 className="font-semibold text-emerald-800 mb-3">आपकी जानकारी:</h4>
                  <div className="space-y-2 text-emerald-700">
                    <p><strong>नाम:</strong> {formData.name}</p>
                    <p><strong>ईमेल:</strong> {formData.email}</p>
                    <p><strong>खाता प्रकार:</strong> {formData.accountType === 'customer' ? 'ग्राहक' : 'विक्रेता'}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-emerald-600 hover:to-green-600"
                >
                  लॉग इन करें
                </button>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-center">{errors.general}</p>
              </div>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-emerald-600 mb-4">
              पहले से खाता है?
            </p>
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg border-b-2 border-transparent hover:border-emerald-600 transition-all duration-300"
            >
              लॉग इन करें!
            </a>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Signup;