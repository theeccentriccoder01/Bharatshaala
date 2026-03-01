import React, { useState } from 'react';


const MarketCard = ({ market, viewMode = 'grid', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Add safety checks for market data
  if (!market) {
    return null;
  }

  // Debug: Log the market image
  console.log('MarketCard Debug:', {
    marketName: market.name,
    marketImage: market.image,
    imageType: typeof market.image,
    imageError
  });

  // Ensure specialties is an array
  const specialties = market.specialties || [];

  // Handle image loading with proper fallback
  const getImageSrc = () => {
    // Check if image exists and is not an error state
    if (!imageError && market.image && typeof market.image === 'string' && market.image.length > 0) {
      return market.image;
    }
    
    // Return a placeholder SVG
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzEwYjk4MSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn4+qPC90ZXh0Pgo8L3N2Zz4K';
  };

  const handleImageError = (e) => {
    console.log('Image load error for:', market.name, 'Image src:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = (e) => {
    console.log('Image loaded successfully for:', market.name, 'Image src:', e.target.src);
    setImageError(false);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className='overflow-hidden transition-all duration-500 bg-white shadow-lg cursor-pointer group rounded-2xl hover:shadow-2xl'
        onClick={()=>onClick(market.href)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='flex flex-col md:flex-row'>
          {/* Image Section */}
          <div className='relative h-48 overflow-hidden md:w-1/3 md:h-auto'>
            <img 
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`} 
              src={getImageSrc()}
              alt={market.name || 'Market'}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className='absolute px-3 py-1 text-sm font-medium text-white rounded-full top-4 left-4 bg-emerald-500'>
              स्थापना {market.established || 'N/A'}
            </div>
            <div className='absolute flex items-center px-3 py-1 space-x-1 rounded-full top-4 right-4 bg-white/90 backdrop-blur-sm'>
              <span className='text-yellow-500'>⭐</span>
              <span className='text-sm font-semibold text-emerald-800'>{market.rating || '0'}</span>
            </div>
          </div>

          {/* Rest of your list view code remains the same... */}
          <div className='p-6 md:w-2/3'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='mb-1 text-2xl font-bold transition-colors duration-300 text-emerald-800 group-hover:text-emerald-600'>
                  {market.nameHindi || market.name}
                </h3>
                <p className='text-lg font-medium text-emerald-600'>{market.name}</p>
                <div className='flex items-center mt-1 space-x-2 text-emerald-600'>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span>{market.cityHindi || market.city}</span>
                </div>
              </div>
            </div>

            <p className='mb-4 text-gray-600 line-clamp-2'>
              {market.description || 'No description available'}
            </p>

            {/* Market Stats */}
            <div className='grid grid-cols-3 gap-4 mb-4'>
              <div className='p-3 text-center rounded-lg bg-emerald-50'>
                <div className='text-lg font-bold text-emerald-600'>{market.vendors || 0}</div>
                <div className='text-xs text-emerald-600'>विक्रेता</div>
              </div>
              <div className='p-3 text-center rounded-lg bg-emerald-50'>
                <div className='text-lg font-bold text-emerald-600'>{market.reviews || 0}</div>
                <div className='text-xs text-emerald-600'>समीक्षाएं</div>
              </div>
              <div className='p-3 text-center rounded-lg bg-emerald-50'>
                <div className='text-lg font-bold text-emerald-600'>{market.openingHours || 'N/A'}</div>
                <div className='text-xs text-emerald-600'>समय</div>
              </div>
            </div>

            {/* Specialties */}
            <div className='mb-4'>
              <div className='flex flex-wrap gap-2'>
                {specialties.slice(0, 4).map((specialty, index) => (
                  <span key={index} className='px-3 py-1 text-xs text-yellow-700 bg-yellow-100 border border-yellow-200 rounded-full'>
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className='flex items-center justify-between'>
              <div className='font-semibold text-emerald-600'>
                बाजार देखें
              </div>
              <div className='flex space-x-2'>
                <button className='p-2 transition-colors duration-200 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200'>
                  📍
                </button>
                <button className='p-2 transition-colors duration-200 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200'>
                  📞
                </button>
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
      className='overflow-hidden transition-all duration-500 transform bg-white shadow-lg cursor-pointer group rounded-3xl hover:shadow-2xl hover:-translate-y-2'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className='relative h-64 overflow-hidden'>
        <img 
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`} 
          src={getImageSrc()}
          alt={market.name || 'Market'}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-70' : 'opacity-50'
        }`}></div>
        
        {/* Heritage Badge */}
        <div className='absolute top-4 left-4'>
          <div className='px-3 py-1 text-sm font-medium text-white rounded-full bg-emerald-500'>
            स्थापना {market.established || 'N/A'}
          </div>
        </div>

        {/* Rating Badge */}
        <div className='absolute flex items-center px-3 py-1 space-x-1 rounded-full top-4 right-4 bg-white/90 backdrop-blur-sm'>
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className='text-sm font-semibold text-emerald-800'>{market.rating || '0'}</span>
        </div>

        {/* Quick Info */}
        <div className='absolute bottom-4 left-4 right-4'>
          <div className='p-3 text-white bg-white/20 backdrop-blur-sm rounded-xl'>
            <div className='flex items-center justify-between text-sm'>
              <span>{market.vendors || 0} विक्रेता</span>
              <span>{market.openingHours || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-6'>
        <div className='mb-4'>
          <h3 className='mb-1 text-2xl font-bold transition-colors duration-300 text-emerald-800 group-hover:text-emerald-600'>
            {market.nameHindi || market.name}
          </h3>
          <p className='text-lg font-medium text-emerald-600'>{market.name}</p>
          <div className='flex items-center mt-1 space-x-2 text-emerald-600'>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span>{market.cityHindi || market.city}</span>
          </div>
        </div>

        <p className='mb-6 leading-relaxed text-gray-600 line-clamp-3'>
          {market.description || 'No description available'}
        </p>

        {/* Specialties */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className='px-3 py-1 text-sm border rounded-full bg-emerald-50 text-emerald-700 border-emerald-200'>
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='p-3 text-center rounded-lg bg-emerald-50'>
            <div className='text-lg font-bold text-emerald-600'>{market.reviews || 0}</div>
            <div className='text-xs text-emerald-600'>समीक्षाएं</div>
          </div>
          <div className='p-3 text-center rounded-lg bg-emerald-50'>
            <div className='text-lg font-bold text-emerald-600'>{market.avgPrice || 'N/A'}</div>
            <div className='text-xs text-emerald-600'>मूल्य सीमा</div>
          </div>
        </div>

        {/* Action Button */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isHovered ? 'transform translate-x-2' : ''
        }`}>
          <span className='font-semibold text-emerald-600 group-hover:text-emerald-700'>
            बाजार देखें
          </span>
          <div className='flex items-center space-x-1'>
            <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></div>
            <div className='w-2 h-2 delay-75 rounded-full bg-emerald-400 animate-pulse'></div>
            <div className='w-2 h-2 delay-150 rounded-full bg-emerald-400 animate-pulse'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MarketCard);