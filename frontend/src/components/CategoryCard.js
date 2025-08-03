import React, { useState } from 'react';

const CategoryCard = ({ category, size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  return (
    <a
      href={`/categories/${category.id}`}
      className='group block'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
        isHovered ? 'scale-105' : ''
      }`}>
        
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        {/* Content */}
        <div className={`relative z-10 ${sizeClasses[size]} text-center`}>
          
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br ${category.gradient} text-white text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {category.icon}
          </div>
          
          {/* Title */}
          <h3 className='text-xl font-bold text-emerald-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300'>
            {category.name}
          </h3>
          <p className='text-emerald-600 font-medium mb-4'>
            {category.nameEn}
          </p>
          
          {/* Count */}
          <div className='inline-flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm border border-emerald-200'>
            <span className='mr-2'>📦</span>
            <span className='font-medium'>{category.count}</span>
          </div>
          
          {/* Hover Arrow */}
          <div className={`mt-4 flex justify-center transition-all duration-300 ${
            isHovered ? 'transform translate-x-2' : ''
          }`}>
            <div className='flex items-center space-x-1'>
              <span className='text-emerald-600 font-semibold'>देखें</span>
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full"></div>
      </div>
    </a>
  );
};

export default CategoryCard;