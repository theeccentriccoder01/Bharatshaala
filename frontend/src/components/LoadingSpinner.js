import React from 'react';

const LoadingSpinner = ({ message = "लोड हो रहा है..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-emerald-200 dark:border-emerald-700 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-emerald-400 mx-auto"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-3xl animate-bounce">🏛️</div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">{message}</h2>
        <p className="text-emerald-600 dark:text-emerald-400">कृपया प्रतीक्षा करें...</p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
        </div>

        {/* Cultural Touch */}
        <div className="mt-8 text-emerald-600 dark:text-emerald-400 text-sm">
          "धैर्य सबसे बड़ा धन है" 🙏
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;