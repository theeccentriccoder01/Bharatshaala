import React, { useState, useEffect } from 'react';

const QuantitySelector = ({
  value = 1,
  min = 1,
  max = 10,
  step = 1,
  onChange,
  disabled = false,
  size = 'medium',
  showLabel = true,
  label = 'मात्रा',
  error = null
}) => {
  const [quantity, setQuantity] = useState(value);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setQuantity(value);
    setInputValue(value.toString());
  }, [value]);

  const handleIncrement = () => {
    if (disabled) return;
    
    const newValue = Math.min(quantity + step, max);
    if (newValue !== quantity) {
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange?.(newValue);
    }
  };

  const handleDecrement = () => {
    if (disabled) return;
    
    const newValue = Math.max(quantity - step, min);
    if (newValue !== quantity) {
      setQuantity(newValue);
      setInputValue(newValue.toString());
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Validate and update quantity
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setQuantity(numValue);
      onChange?.(numValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure input value is valid when losing focus
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setInputValue(quantity.toString());
    }
  };

  const sizeClasses = {
    small: {
      container: 'w-24',
      button: 'w-6 h-6 text-sm',
      input: 'h-6 px-2 text-sm',
      label: 'text-sm'
    },
    medium: {
      container: 'w-32',
      button: 'w-8 h-8 text-base',
      input: 'h-8 px-3 text-base',
      label: 'text-base'
    },
    large: {
      container: 'w-40',
      button: 'w-10 h-10 text-lg',
      input: 'h-10 px-4 text-lg',
      label: 'text-lg'
    }
  };

  const sizeConfig = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="space-y-2">
      {/* Label */}
      {showLabel && (
        <label className={`block font-medium text-emerald-800 ${sizeConfig.label}`}>
          {label}:
        </label>
      )}

      {/* Quantity Selector */}
      <div className={`relative ${sizeConfig.container}`}>
        <div className={`flex items-center border-2 rounded-lg transition-all duration-200 ${
          error 
            ? 'border-red-300 focus-within:border-red-500' 
            : 'border-emerald-200 focus-within:border-emerald-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          
          {/* Decrement Button */}
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || quantity <= min}
            className={`${sizeConfig.button} flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-r border-emerald-200`}
            aria-label="मात्रा घटाएं"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Quantity Input */}
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={`${sizeConfig.input} flex-1 text-center border-0 focus:outline-none bg-white text-emerald-800 font-semibold`}
            aria-label={`${label} (${min} से ${max} तक)`}
          />

          {/* Increment Button */}
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || quantity >= max}
            className={`${sizeConfig.button} flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-l border-emerald-200`}
            aria-label="मात्रा बढ़ाएं"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>

        {/* Stock Indicator */}
        {max <= 5 && (
          <div className="absolute -top-1 -right-1">
            <span className="bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-full">
              {max} बचे
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </p>
      )}

      {/* Help Text */}
      {!error && (
        <p className="text-gray-500 text-xs">
          न्यूनतम: {min}, अधिकतम: {max}
        </p>
      )}
    </div>
  );
};

// Advanced Quantity Selector with Bulk Options
export const BulkQuantitySelector = ({
  value = 1,
  min = 1,
  max = 100,
  bulkOptions = [5, 10, 25, 50],
  onChange,
  disabled = false,
  showBulkDiscounts = false,
  bulkDiscounts = {}
}) => {
  const [selectedBulk, setSelectedBulk] = useState(null);

  const handleBulkSelect = (bulkValue) => {
    setSelectedBulk(bulkValue);
    onChange?.(bulkValue);
  };

  const getBulkDiscount = (quantity) => {
    return bulkDiscounts[quantity] || 0;
  };

  return (
    <div className="space-y-4">
      {/* Regular Quantity Selector */}
      <QuantitySelector
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        disabled={disabled}
      />

      {/* Bulk Options */}
      <div>
        <h4 className="text-sm font-medium text-emerald-800 mb-2">थोक मात्रा:</h4>
        <div className="flex flex-wrap gap-2">
          {bulkOptions.map((bulkValue) => (
            <button
              key={bulkValue}
              onClick={() => handleBulkSelect(bulkValue)}
              disabled={disabled || bulkValue > max}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                value === bulkValue
                  ? 'bg-emerald-500 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {bulkValue}
              {showBulkDiscounts && getBulkDiscount(bulkValue) > 0 && (
                <span className="ml-1 text-xs">(-{getBulkDiscount(bulkValue)}%)</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Discount Info */}
      {showBulkDiscounts && value >= Math.min(...bulkOptions) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-green-700 font-medium text-sm">
              {getBulkDiscount(value)}% छूट लागू!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;