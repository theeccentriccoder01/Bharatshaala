import React, { useState } from 'react';

const MarketCard = ({ market, viewMode = 'grid', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Add safety checks for market data
  if (!market) {
    return null;
  }

  // Ensure specialties is an array
  const specialties = market.specialties || [];

  if (viewMode === 'list') {
    return (
      <div 
        className='group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer'
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='flex flex-col md:flex-row'>
          {/* Image Section */}
          <div className='md:w-1/3 h-48 md:h-auto relative overflow-hidden'>
            <img 
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`} 
              src={market.image || '/images/placeholder.png'} 
              alt={market.name || 'Market'}
            />
            <div className='absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
              स्थापना {market.established || 'N/A'}
            </div>
            <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
              <span className='text-yellow-500'>⭐</span>
              <span className='text-emerald-800 font-semibold text-sm'>{market.rating || '0'}</span>
            </div>
          </div>

          {/* Content Section */}
          <div className='md:w-2/3 p-6'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-emerald-800 mb-1 group-hover:text-emerald-600 transition-colors duration-300'>
                  {market.nameHindi || market.name}
                </h3>
                <p className='text-lg text-emerald-600 font-medium'>{market.name}</p>
                <div className='flex items-center space-x-2 text-emerald-600 mt-1'>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <span>{market.cityHindi || market.city}</span>
                </div>
              </div>
            </div>

            <p className='text-gray-600 mb-4 line-clamp-2'>
              {market.description || 'No description available'}
            </p>

            {/* Market Stats */}
            <div className='grid grid-cols-3 gap-4 mb-4'>
              <div className='text-center bg-emerald-50 rounded-lg p-3'>
                <div className='text-lg font-bold text-emerald-600'>{market.vendors || 0}</div>
                <div className='text-emerald-600 text-xs'>विक्रेता</div>
              </div>
              <div className='text-center bg-emerald-50 rounded-lg p-3'>
                <div className='text-lg font-bold text-emerald-600'>{market.reviews || 0}</div>
                <div className='text-emerald-600 text-xs'>समीक्षाएं</div>
              </div>
              <div className='text-center bg-emerald-50 rounded-lg p-3'>
                <div className='text-lg font-bold text-emerald-600'>{market.openingHours || 'N/A'}</div>
                <div className='text-emerald-600 text-xs'>समय</div>
              </div>
            </div>

            {/* Specialties - FIXED: Added safety check */}
            <div className='mb-4'>
              <div className='flex flex-wrap gap-2'>
                {specialties.slice(0, 4).map((specialty, index) => (
                  <span key={index} className='bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs border border-yellow-200'>
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className='flex justify-between items-center'>
              <div className='text-emerald-600 font-semibold'>
                बाजार देखें
              </div>
              <div className='flex space-x-2'>
                <button className='bg-emerald-100 text-emerald-600 p-2 rounded-lg hover:bg-emerald-200 transition-colors duration-200'>
                  📍
                </button>
                <button className='bg-emerald-100 text-emerald-600 p-2 rounded-lg hover:bg-emerald-200 transition-colors duration-200'>
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
      className='group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer'
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
          src={market.image || '/images/placeholder.png'} 
          alt={market.name || 'Market'}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-70' : 'opacity-50'
        }`}></div>
        
        {/* Heritage Badge */}
        <div className='absolute top-4 left-4'>
          <div className='bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
            स्थापना {market.established || 'N/A'}
          </div>
        </div>

        {/* Rating Badge */}
        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className='text-emerald-800 font-semibold text-sm'>{market.rating || '0'}</span>
        </div>

        {/* Quick Info */}
        <div className='absolute bottom-4 left-4 right-4'>
          <div className='bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white'>
            <div className='flex justify-between items-center text-sm'>
              <span>{market.vendors || 0} विक्रेता</span>
              <span>{market.openingHours || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-6'>
        <div className='mb-4'>
          <h3 className='text-2xl font-bold text-emerald-800 mb-1 group-hover:text-emerald-600 transition-colors duration-300'>
            {market.nameHindi || market.name}
          </h3>
          <p className='text-lg text-emerald-600 font-medium'>{market.name}</p>
          <div className='flex items-center space-x-2 text-emerald-600 mt-1'>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span>{market.cityHindi || market.city}</span>
          </div>
        </div>

        <p className='text-gray-600 leading-relaxed mb-6 line-clamp-3'>
          {market.description || 'No description available'}
        </p>

        {/* Specialties - FIXED: Added safety check */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            {specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className='bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200'>
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='text-center bg-emerald-50 rounded-lg p-3'>
            <div className='text-lg font-bold text-emerald-600'>{market.reviews || 0}</div>
            <div className='text-emerald-600 text-xs'>समीक्षाएं</div>
          </div>
          <div className='text-center bg-emerald-50 rounded-lg p-3'>
            <div className='text-lg font-bold text-emerald-600'>{market.avgPrice || 'N/A'}</div>
            <div className='text-emerald-600 text-xs'>मूल्य सीमा</div>
          </div>
        </div>

        {/* Action Button */}
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isHovered ? 'transform translate-x-2' : ''
        }`}>
          <span className='text-emerald-600 font-semibold group-hover:text-emerald-700'>
            बाजार देखें
          </span>
          <div className='flex items-center space-x-1'>
            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></div>
            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75'></div>
            <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-150'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;