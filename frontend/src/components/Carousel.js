import React, { useEffect, useState } from 'react';
import '../App.css';

const Indicators = ({ images, current, onClick }) => {
  return (
    <div className='absolute z-30 flex justify-center space-x-2 bottom-6 left-1/2 transform -translate-x-1/2'>
      {images.map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            current === index 
              ? 'bg-yellow-400 scale-125 shadow-lg' 
              : 'bg-white/60 hover:bg-white/80'
          }`}
          onClick={() => onClick(index)}
          aria-label={`स्लाइड ${index + 1} पर जाएं`}
          aria-current={current === index ? 'true' : 'false'}
        />
      ))}
    </div>
  );
};

const Carousel = ({ images, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const nextSlide = () => {
    setCurrent((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
  };
  
  const prevSlide = () => {
    setCurrent((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const autoPlay = setInterval(nextSlide, interval);
    return () => clearInterval(autoPlay);
  }, [interval, isPlaying]);

  return (
    <div className='relative w-full max-w-7xl mx-auto'>
      <div 
        className='relative overflow-hidden rounded-3xl shadow-2xl group'
        onMouseEnter={() => setIsPlaying(false)}
        onMouseLeave={() => setIsPlaying(true)}
      >
        
        {/* Main Image Container */}
        <div className='relative h-64 md:h-96 lg:h-[32rem]'>
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === current 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img 
                src={image} 
                className='w-full h-full object-cover'
                alt={`स्लाइड ${index + 1}`}
              />
              {/* Gradient Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className='absolute bottom-20 left-8 right-8 text-white z-20'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl md:text-4xl font-bold mb-4 animate-fade-in text-white'>
              भारतीय संस्कृति का डिजिटल बाजार
            </h2>
            <p className='text-lg md:text-xl mb-6 opacity-90 animate-fade-in-delay text-white'>
              पारंपरिक शिल्प से लेकर आधुनिक नवाचार तक, सभी कुछ एक ही स्थान पर
            </p>
            <button className='bg-gradient-to-r from-yellow-400 to-orange-400 text-emerald-900 px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 animate-fade-in-delay-2'>
              अभी खरीदारी करें
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          type='button' 
          onClick={prevSlide}
          className='absolute top-1/2 left-4 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100'
          aria-label='पिछली स्लाइड'
        >
          <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M15 19l-7-7 7-7'/>
          </svg>
        </button>

        <button 
          type='button' 
          onClick={nextSlide}
          className='absolute top-1/2 right-4 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100'
          aria-label='अगली स्लाइड'
        >
          <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M9 5l7 7-7 7'/>
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className='absolute top-4 right-4 z-30 w-10 h-10 bg-black/30 backdrop-blur-md hover:bg-black/50 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100'
          aria-label={isPlaying ? 'रोकें' : 'चलाएं'}
        >
          {isPlaying ? (
            <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z'/>
            </svg>
          ) : (
            <svg className='w-5 h-5 text-white' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z'/>
            </svg>
          )}
        </button>

        <Indicators images={images} current={current} onClick={setCurrent} />
      </div>

      {/* Progress Bar */}
      <div className='mt-4 w-full bg-gray-200 rounded-full h-1'>
        <div 
          className='h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-300'
          style={{ width: `${((current + 1) / images.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Carousel;