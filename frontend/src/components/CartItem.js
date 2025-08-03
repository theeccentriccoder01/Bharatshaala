import React, { useState } from 'react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(item);
  };

  return (
    <div className={`flex items-center space-x-4 p-4 bg-white rounded-xl border border-emerald-200 transition-all duration-300 ${
      isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md'
    }`}>
      
      {/* Product Image */}
      <div className='flex-shrink-0'>
        <img 
          src={item.image} 
          alt={item.ItemName}
          className='w-20 h-20 object-cover rounded-lg'
        />
      </div>

      {/* Product Details */}
      <div className='flex-1'>
        <h3 className='font-semibold text-emerald-800 text-lg mb-1'>
          {item.ItemName}
        </h3>
        <p className='text-emerald-600 text-sm mb-2'>
          {item.description}
        </p>
        <div className='flex items-center space-x-3 text-sm text-emerald-600'>
          <span>विक्रेता: {item.seller}</span>
          <span>•</span>
          <span>₹{item.Price.toLocaleString()}</span>
        </div>
      </div>

      {/* Quantity Selector */}
      <div className='flex items-center space-x-3'>
        <label className='text-emerald-700 font-medium text-sm'>मात्रा:</label>
        <select
          value={item.Quantity}
          onChange={(e) => onQuantityChange(e, item)}
          className="bg-white border-2 border-emerald-200 px-3 py-2 rounded-lg focus:border-emerald-500 focus:outline-none"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Total Price */}
      <div className='text-right min-w-[100px]'>
        <div className='text-lg font-bold text-emerald-600'>
          ₹{(item.Price * item.Quantity).toLocaleString()}
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50'
        title="आइटम हटाएं"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;