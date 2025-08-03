import React from 'react';

const OrderSummary = ({ subtotal, discount = 0, deliveryCost = 0, total, onCheckout }) => {
  return (
    <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg sticky top-24'>
      <h3 className='text-2xl font-bold text-emerald-800 mb-6 flex items-center space-x-2'>
        <span>📋</span>
        <span>ऑर्डर सारांश</span>
      </h3>

      {/* Price Breakdown */}
      <div className='space-y-4 mb-6'>
        <div className='flex justify-between items-center py-2 border-b border-emerald-100'>
          <span className='text-emerald-700'>उप-योग:</span>
          <span className='font-semibold text-emerald-800'>₹{subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className='flex justify-between items-center py-2 border-b border-emerald-100 text-green-600'>
            <span className='flex items-center space-x-1'>
              <span>🎫</span>
              <span>छूट:</span>
            </span>
            <span className='font-semibold'>-₹{discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className='flex justify-between items-center py-2 border-b border-emerald-100'>
          <span className='text-emerald-700 flex items-center space-x-1'>
            <span>🚚</span>
            <span>डिलीवरी:</span>
          </span>
          <span className='font-semibold text-emerald-800'>
            {deliveryCost === 0 ? 'मुफ्त' : `₹${deliveryCost.toLocaleString()}`}
          </span>
        </div>
        
        <div className='flex justify-between items-center py-3 border-t-2 border-emerald-200'>
          <span className='text-lg font-bold text-emerald-800'>कुल राशि:</span>
          <span className='text-xl font-bold text-emerald-600'>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Security Features */}
      <div className='bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-200'>
        <h4 className='font-semibold text-emerald-800 mb-3 flex items-center space-x-2'>
          <span>🔒</span>
          <span>सुरक्षित पेमेंट</span>
        </h4>
        <div className='space-y-2 text-sm text-emerald-700'>
          <div className='flex items-center space-x-2'>
            <span>✅</span>
            <span>SSL एन्क्रिप्शन</span>
          </div>
          <div className='flex items-center space-x-2'>
            <span>✅</span>
            <span>100% सुरक्षित लेनदेन</span>
          </div>
          <div className='flex items-center space-x-2'>
            <span>✅</span>
            <span>तुरंत रिफंड गारंटी</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='mb-6'>
        <h4 className='font-semibold text-emerald-800 mb-3'>स्वीकृत पेमेंट:</h4>
        <div className='grid grid-cols-3 gap-2'>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-blue-600 font-bold text-xs'>💳 VISA</span>
          </div>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-red-600 font-bold text-xs'>💳 MCard</span>
          </div>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-purple-600 font-bold text-xs'>📱 UPI</span>
          </div>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-green-600 font-bold text-xs'>🏦 Net</span>
          </div>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-blue-700 font-bold text-xs'>💰 Wallet</span>
          </div>
          <div className='bg-white border border-emerald-200 rounded-lg p-2 text-center'>
            <span className='text-gray-700 font-bold text-xs'>💵 COD</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className='w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:from-emerald-600 hover:to-green-600 hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2'
      >
        <span>🛒</span>
        <span>चेकआउट करें</span>
      </button>

      {/* Trust Badges */}
      <div className='mt-6 text-center'>
        <div className='flex justify-center space-x-4 text-xs text-emerald-600'>
          <span className='flex items-center space-x-1'>
            <span>🛡️</span>
            <span>100% सुरक्षित</span>
          </span>
          <span className='flex items-center space-x-1'>
            <span>⚡</span>
            <span>तुरंत प्रक्रिया</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;