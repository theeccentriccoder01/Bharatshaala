import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";
import "../App.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, accountType } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(accountType === 'vendor' ? '/vendor/dashboard' : '/user/account');
    }
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, accountType, navigate]);

  const validateEmail = (email) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailError("अमान्य ईमेल प्रारूप");
      return "अमान्य ईमेल प्रारूप";
    }
    setEmailError("");
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("कृपया पासवर्ड दर्ज करें");
      return "कृपया पासवर्ड दर्ज करें";
    }
    setPasswordError("");
    return "";
  };

  const handleLogin = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    if (eErr || pErr) return;

    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);

    if (result.success) {
      if (rememberMe) localStorage.setItem('rememberLogin', 'true');
      navigate(result.accountType === 'vendor' ? '/vendor/dashboard' : '/user/account');
    } else {
      setPasswordError(result.message || 'लॉगिन में त्रुटि');
    }
  };

  const socialLogin = (provider) => {
    console.log(`Login with ${provider} - not implemented`);
  };

  if (pageLoading) {
    return <LoadingSpinner message="भारतशाला में प्रवेश..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-md mx-auto px-6 py-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full px-6 py-3 mb-6 shadow-lg border border-emerald-200 dark:border-emerald-700'>
              <span className='text-2xl'>🙏</span>
              <span className='text-emerald-800 dark:text-emerald-300 font-bold'>स्वागत वापसी</span>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent mb-4">
              लॉग इन करें
            </h1>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg">
              सच्चे भारतशाला अनुभव का आनंद लेने के लिए,<br/>
              अपना ईमेल और पासवर्ड दर्ज करें
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200 dark:border-gray-700">

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-emerald-800 dark:text-emerald-300 font-semibold text-lg mb-2">
                ईमेल पता
              </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => validateEmail(e.target.value)}
                      className={`w-full px-4 py-4 pl-12 border-2 rounded-xl transition-all duration-300 ${
                        emailError
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-emerald-200 dark:border-gray-600 focus:border-emerald-500'
                      } focus:outline-none bg-white dark:bg-gray-700 dark:text-gray-100 text-lg`}
                      placeholder="आपका ईमेल पता"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  {emailError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-6">
                  <label className="block text-emerald-800 dark:text-emerald-300 font-semibold text-lg mb-2">
                    पासवर्ड
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={(e) => validatePassword(e.target.value)}
                      className={`w-full px-4 py-4 pl-12 pr-12 border-2 rounded-xl transition-all duration-300 ${
                        passwordError
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-emerald-200 dark:border-gray-600 focus:border-emerald-500'
                      } focus:outline-none bg-white dark:bg-gray-700 dark:text-gray-100 text-lg`}
                      placeholder="आपका पासवर्ड"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                    {passwordError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {passwordError}
                    </p>
                  )}
                </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-emerald-300 dark:border-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-emerald-700 dark:text-emerald-300 text-sm">मुझे याद रखें</span>
              </label>
              <a href="/forgot-password" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
                पासवर्ड भूल गए?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-emerald-600 hover:to-green-600 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>प्रतीक्षा करें...</span>
                </div>
              ) : 'लॉग इन करें'}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 font-medium">या इससे लॉगिन करें</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => socialLogin('google')}
                className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 border-2 border-emerald-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-gray-500 py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">Google</span>
              </button>
              <button
                onClick={() => socialLogin('facebook')}
                className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-700 border-2 border-emerald-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-gray-500 py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-md"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-emerald-600 dark:text-emerald-400 mb-4">
                खाता नहीं है?
              </p>
              <a
                href="/signup"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-lg border-b-2 border-transparent hover:border-emerald-600 transition-all duration-300"
              >
                साइन अप करें!
              </a>
            </div>
          </div>

          {/* Additional Links */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-6 text-sm text-emerald-600 dark:text-emerald-400">
              <a href="/help" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200">
                सहायता
              </a>
              <a href="/privacy" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200">
                गोपनीयता नीति
              </a>
              <a href="/terms" className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200">
                नियम और शर्तें
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Login;
