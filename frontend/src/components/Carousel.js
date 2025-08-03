import React, { useEffect, useState} from 'react';
import '../App.css';

const Indicators = ({ images, current, onClick }) => {
  return (
    <div className='absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2'>
      {images.map((_, index) => (
        <span key={index} className='inline-block w-3 h-3 mx-2 rounded-full bg-brsl_moss cursor-pointer' onClick={() => onClick(index)} aria-label={`Go to slide ${index + 1}`} aria-current={current === index ? 'true' : 'false'} />
      ))}
    </div>
  );
};

const Carousel = ({ images, interval = 10000 }) => {
  const [current, setCurrent] = useState(0);
  
  const nextSlide = () => {
    setCurrent((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
  };
  const prevSlide = () => {
    setCurrent((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  useEffect(() => {
    const autoPlay = setInterval(nextSlide, interval);
    return () => clearInterval(autoPlay);
  }, [interval]);

  return (
    <div className='flex justify-center'>
      <div id='carousel' className='relative w-full lg:w-5/6'>
        <button type='button' onClick={prevSlide} className='absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none' data-carousel-prev>
          <span className='inline-flex items-center justify-center h-10 w-10 rounded-full bg-brsl_moss group-hover:bg-brsl_vine'>
            <svg className='h-6 w-6 text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m15 19-7-7 7-7'/>
            </svg>
            <span className='sr-only'>Previous</span>
          </span>
        </button>

        <div className='relative h-56 overflow-hidden rounded-xl md:h-96'>
          <img src={images[current]} className='absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2' alt='...'/>
        </div>

        <button type='button' onClick={nextSlide} className='absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none' data-carousel-next>
          <span className='inline-flex items-center justify-center h-10 w-10 rounded-full bg-brsl_moss group-hover:bg-brsl_vine'>
            <svg className='h-6 w-6 text-white' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m9 5 7 7-7 7'/>
            </svg>
            <span className='sr-only'>Next</span>
          </span>
        </button>

        <Indicators images={images} current={current} onClick={goToSlide => setCurrent(goToSlide)} />
      </div>
    </div>
  );
};

export default Carousel;
