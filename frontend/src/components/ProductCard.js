import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ 
  item, 
  viewMode = 'grid', 
  isSelected = false, 
  onSelect, 
  onEdit, 
  stockStatus, 
  isVendorView = false,
  onAddToCart,
  onAddToWishlist 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isVendorView) {
      onEdit?.();
    } else {
      navigate(`/products/${item.id}`);
    }
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    switch (action) {
      case 'edit':
        onEdit?.();
        break;
      case 'cart':
        onAddToCart?.(item);
        break;
      case 'wishlist':
        onAddToWishlist?.(item);
        break;
      case 'select':
        onSelect?.();
        break;
    }
  };

  const getDiscountPercent = () => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    }
    return 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      gray: 'bg-gray-500'
    };
    return colors[status] || colors.gray;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 ${
          isSelected ? 'border-emerald-500' : 'border-transparent'
        }`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Image Section */}
          <div className="w-48 h-32 relative overflow-hidden flex-shrink-0">
            {imageLoading && (
              <div className="absolute inset-0 bg-emerald-100 animate-pulse"></div>
            )}
            <img 
              src={item.images?.[0]?.url || item.images?.[0] || '/images/placeholder.jpg'}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            
            {/* Discount Badge */}
            {getDiscountPercent() > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{getDiscountPercent()}%
              </div>
            )}

            {/* Selection Checkbox */}
            {isVendorView && onSelect && (
              <div className="absolute top-2 right-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => handleActionClick(e, 'select')}
                  className="w-5 h-5 text-emerald-600 bg-white rounded border-2 border-emerald-300"
                />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-emerald-800 mb-2 hover:text-emerald-600 transition-colors duration-300">
                  {item.name}
                </h3>
                {item.nameEn && (
                  <p className="text-emerald-600 text-sm mb-2">{item.nameEn}</p>
                )}
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Category and Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs">
                    {item.category}
                  </span>
                  {item.subcategory && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      {item.subcategory}
                    </span>
                  )}
                  {item.isHandmade && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs">
                      हस्तनिर्मित
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{item.price?.toLocaleString()}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-lg text-gray-400 line-through">
                      ₹{item.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Vendor View Stats */}
                {isVendorView && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-sm font-bold text-gray-800">{item.sales || 0}</div>
                      <div className="text-xs text-gray-600">बिक्री</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-sm font-bold text-gray-800">{item.views || 0}</div>
                      <div className="text-xs text-gray-600">व्यू</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-sm font-bold text-gray-800">{item.rating || 0}⭐</div>
                      <div className="text-xs text-gray-600">रेटिंग</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side Actions */}
              <div className="flex flex-col items-end space-y-3 ml-4">
                {/* Stock Status */}
                {stockStatus && (
                  <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(stockStatus.color)}`}>
                    {stockStatus.text}
                  </div>
                )}

                {/* Active Status for Vendor */}
                {isVendorView && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </div>
                )}

                {/* Stock Count */}
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{item.quantity || 0}</div>
                  <div className="text-xs text-gray-600">स्टॉक</div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  {isVendorView ? (
                    <button
                      onClick={(e) => handleActionClick(e, 'edit')}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                    >
                      संपादित करें
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleActionClick(e, 'cart')}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                        disabled={item.quantity === 0}
                      >
                        {item.quantity === 0 ? 'स्टॉक नहीं' : 'कार्ट में जोड़ें'}
                      </button>
                      <button
                        onClick={(e) => handleActionClick(e, 'wishlist')}
                        className="border-2 border-emerald-500 text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors duration-200 text-sm"
                      >
                        पसंदीदा
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border-2 ${
        isSelected ? 'border-emerald-500' : 'border-transparent'
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-emerald-100 animate-pulse"></div>
        )}
        <img 
          src={item.images?.[0]?.url || item.images?.[0] || '/images/placeholder.jpg'}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-70' : 'opacity-50'
        }`}></div>
        
        {/* Discount Badge */}
        {getDiscountPercent() > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{getDiscountPercent()}% OFF
          </div>
        )}

        {/* Selection Checkbox */}
        {isVendorView && onSelect && (
          <div className="absolute top-4 right-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => handleActionClick(e, 'select')}
              className="w-5 h-5 text-emerald-600 bg-white rounded border-2 border-emerald-300"
            />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
          {stockStatus && (
            <div className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(stockStatus.color)}`}>
              {stockStatus.text}
            </div>
          )}
          
          {item.isHandmade && (
            <div className="bg-amber-500/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-medium">हस्तनिर्मित</span>
            </div>
          )}
        </div>

        {/* Active Status for Vendor */}
        {isVendorView && (
          <div className="absolute bottom-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.isActive 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}>
              {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
            </div>
          </div>
        )}

        {/* Quick Action Overlay */}
        {!isVendorView && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-3">
              <button
                onClick={(e) => handleActionClick(e, 'cart')}
                className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors duration-200 transform hover:scale-110"
                disabled={item.quantity === 0}
              >
                🛒
              </button>
              <button
                onClick={(e) => handleActionClick(e, 'wishlist')}
                className="bg-white text-emerald-600 p-3 rounded-full hover:bg-emerald-50 transition-colors duration-200 transform hover:scale-110"
              >
                ❤️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
            {item.name}
          </h3>
          {item.nameEn && (
            <p className="text-emerald-600 font-medium">{item.nameEn}</p>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Category and Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs border border-emerald-200">
            {item.category}
          </span>
          {item.subcategory && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200">
              {item.subcategory}
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            ₹{item.price?.toLocaleString()}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-lg text-gray-400 line-through">
              ₹{item.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Vendor View Stats */}
        {isVendorView && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center bg-emerald-50 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-600">{item.sales || 0}</div>
              <div className="text-emerald-600 text-xs">बिक्री</div>
            </div>
            <div className="text-center bg-emerald-50 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-600">{item.views || 0}</div>
              <div className="text-emerald-600 text-xs">व्यू</div>
            </div>
            <div className="text-center bg-emerald-50 rounded-lg p-3">
              <div className="text-lg font-bold text-emerald-600">{item.rating || 0}⭐</div>
              <div className="text-emerald-600 text-xs">रेटिंग</div>
            </div>
          </div>
        )}

        {/* Customer View Rating */}
        {!isVendorView && item.rating && (
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < Math.floor(item.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-emerald-600 text-sm">
              {item.rating} ({item.reviewCount || 0} समीक्षाएं)
            </span>
          </div>
        )}

        {/* Stock Information */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-emerald-600 text-sm">
            स्टॉक: <span className="font-semibold">{item.quantity || 0}</span>
          </div>
          {isVendorView && (
            <div className="text-emerald-600 text-sm">
              आईडी: <span className="font-mono">{item.id}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className={`transition-all duration-300 ${
          isHovered ? 'transform translate-x-2' : ''
        }`}>
          {isVendorView ? (
            <button
              onClick={(e) => handleActionClick(e, 'edit')}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              संपादित करें
            </button>
          ) : (
            <button
              onClick={(e) => handleActionClick(e, 'cart')}
              disabled={item.quantity === 0}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                item.quantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {item.quantity === 0 ? 'स्टॉक में नहीं' : 'कार्ट में जोड़ें'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;