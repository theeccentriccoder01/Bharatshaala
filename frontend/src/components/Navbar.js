import React, { useState, useEffect } from "react";
import { useLanguage } from '../context/LanguageContext';
import "../App.css";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, changeLanguage, isLoading } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageToggle = (langCode) => {
    if (language !== langCode) {
      changeLanguage(langCode);
    }
  };

  return (
    <React.StrictMode>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100' 
          : 'bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700'
      }`}>
        
        {/* Top Banner */}
        {!scrolled && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-emerald-900 text-center py-2 text-sm font-medium">
            🎉 स्वतंत्रता दिवस विशेष: सभी उत्पादों पर 25% छूट! 🇮🇳
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu */}
              <button
                onClick={() => setMenu(!menu)}
                className={`relative p-2 rounded-lg transition-all duration-300 ${
                  scrolled ? 'text-emerald-600 hover:bg-emerald-50' : 'text-white hover:bg-white/10'
                }`}
              >
                <div className="w-6 h-6 relative">
                  <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${
                    menu ? 'rotate-45 translate-y-2' : 'translate-y-0'
                  } ${scrolled ? 'bg-emerald-600' : 'bg-white'}`}></span>
                  <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 translate-y-2 ${
                    menu ? 'opacity-0' : 'opacity-100'
                  } ${scrolled ? 'bg-emerald-600' : 'bg-white'}`}></span>
                  <span className={`absolute block h-0.5 w-6 transform transition-all duration-300 ${
                    menu ? '-rotate-45 translate-y-2' : 'translate-y-4'
                  } ${scrolled ? 'bg-emerald-600' : 'bg-white'}`}></span>
                </div>
              </button>

              {/* Logo */}
              <a href="/" className="flex items-center space-x-3 group">
                <div className={`relative w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110 ${
                  scrolled 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                    : 'bg-gradient-to-br from-yellow-400 to-orange-400'
                }`}>
                  <svg className={`w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                    scrolled ? 'text-white' : 'text-emerald-900'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <div className="absolute inset-0 rounded-full animate-ping bg-white/20"></div>
                </div>
                <h1 className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${
                  scrolled ? 'text-emerald-700' : 'text-white'
                }`}>
                  भारतशाला
                </h1>
              </a>
            </div>

            {/* Center - Search Bar (Hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="उत्पाद, ब्रांड या श्रेणी खोजें..."
                  className="w-full px-4 py-2 pl-10 pr-12 rounded-full border-2 border-transparent bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:border-yellow-400 focus:outline-none transition-all duration-300"
                />
                <svg className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  scrolled ? 'text-gray-400' : 'text-white/70'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-yellow-400 text-emerald-900 hover:bg-yellow-300 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Markets Button */}
              <a href="/markets" className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white hover:bg-white/10'
              }`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">बाजार</span>
              </a>

              {/* Shopping Bag */}
              <a href="/bag" className={`relative p-2 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white hover:bg-white/10'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">3</span>
              </a>

              {/* Account */}
              <a href="/login" className={`p-2 rounded-full transition-all duration-300 ${
                scrolled 
                  ? 'text-emerald-600 hover:bg-emerald-50' 
                  : 'text-white hover:bg-white/10'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Side Menu Overlay */}
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          menu ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`} onClick={() => setMenu(false)}></div>

        {/* Side Menu */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-emerald-900 via-green-800 to-emerald-950 transform transition-transform duration-500 ease-in-out ${
          menu ? 'translate-x-0' : '-translate-x-full'
        }`}>
          
          {/* Menu Header */}
          <div className="p-6 border-b border-emerald-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <span className="text-white text-lg font-semibold">मेन्यू</span>
              </div>
              <button
                onClick={() => setMenu(false)}
                className="p-2 text-white hover:text-yellow-400 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-6">
            <ul className="space-y-2">
              {[
                { name: 'होम', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                { name: 'बाजार', href: '/markets', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { name: 'श्रेणियां', href: '/categories', icon: 'M19 11H5m14-4H5m14 8H5m14 4H5' },
                { name: 'हमारे बारे में', href: '/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'संपर्क', href: '/contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { name: 'सहायता', href: '/support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { name: 'FAQ', href: '/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((item, index) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="flex items-center space-x-4 p-3 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-all duration-300 group"
                    onClick={() => setMenu(false)}
                  >
                    <svg className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="font-medium">{item.name}</span>
                    <svg className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>


        {/* Language Toggle - REPLACE THIS SECTION */}
        <div className="mt-8 pt-6 border-t border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="text-emerald-200 text-sm">भाषा</span>
            <div className="flex bg-emerald-700 rounded-full p-1">
              <button 
                onClick={() => handleLanguageToggle('hi')}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'hi' 
                    ? 'bg-yellow-400 text-emerald-900' 
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                हिंदी
              </button>
              <button 
                onClick={() => handleLanguageToggle('en')}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  language === 'en' 
                    ? 'bg-yellow-400 text-emerald-900' 
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-600'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                English
              </button>
            </div>
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center mt-2">
              <div className="w-4 h-4 border-2 border-emerald-300 border-t-yellow-400 rounded-full animate-spin"></div>
              <span className="text-emerald-200 text-xs ml-2">भाषा बदली जा रही है...</span>
            </div>
          )}
        </div>
          </div>
        </div>
      </nav>
    </React.StrictMode>
  );
};

export default Navbar;