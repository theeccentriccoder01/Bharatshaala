import React, { useState } from 'react';

const SearchBar = ({ value, onChange, placeholder = "खोजें...", suggestions = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularSearches = [
    'कुंदन ज्वेलरी', 'राजस्थानी हैंडीक्राफ्ट्स', 'चंदन की लकड़ी', 'मैसूर सिल्क',
    'जयपुरी जूते', 'बंधेज साड़ी', 'हैदराबादी पर्ल्स', 'कश्मीरी शॉल'
  ];

  return (
    <div className='relative'>
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className={`w-full px-6 py-4 pl-14 pr-16 rounded-full border-2 transition-all duration-300 ${
            isFocused
              ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-lg'
              : 'border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-gray-800/80'
          } focus:outline-none text-lg`}
        />

        {/* Search Icon */}
        <svg
          className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-colors duration-300 ${
            isFocused ? 'text-emerald-500 dark:text-emerald-400' : 'text-emerald-400'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Animated Border */}
        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
          isFocused ? 'ring-4 ring-emerald-100 dark:ring-emerald-800' : ''
        }`}></div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className='absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-emerald-200 dark:border-emerald-700 overflow-hidden z-50 animate-fade-in'>

          {/* Popular Searches */}
          <div className='p-4 border-b border-emerald-100 dark:border-gray-700'>
            <h4 className='text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3'>लोकप्रिय खोजें</h4>
            <div className='flex flex-wrap gap-2'>
              {popularSearches.slice(0, 6).map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(search);
                    setShowSuggestions(false);
                  }}
                  className='bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-colors duration-200 border border-emerald-200 dark:border-emerald-700'
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div className='p-4'>
            <h4 className='text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3'>त्वरित श्रेणियां</h4>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { name: 'आभूषण', icon: '💎', href: '/categories/jewellery' },
                { name: 'वस्त्र', icon: '👗', href: '/categories/clothing' },
                { name: 'हस्तशिल्प', icon: '🎨', href: '/categories/handicrafts' },
                { name: 'पुस्तकें', icon: '📚', href: '/categories/books' }
              ].map((category, index) => (
                <button
                  key={index}
                  className='flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-200 text-left'
                >
                  <span className='text-xl'>{category.icon}</span>
                  <span className='text-emerald-700 dark:text-emerald-300 font-medium'>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
