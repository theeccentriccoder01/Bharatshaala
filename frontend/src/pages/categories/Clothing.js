import React from 'react';
import '../../App.css';

import img from '../../images/categories/clothing.png'

import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Clothing = () => {
  return (
    <React.StrictMode>
      <div className='bg-brsl_cream h-full min-h-screen'>

        {/* Main text */}
        <div className='max-w-lg mx-auto'>
          <h1 className='flex'></h1>
          <h1 className='flex text-brsl_brick font-bharatshaala text-6xl mt-5 justify-center text-center'>Clothing</h1>
          <div className='flex justify-center p-3'>
            <img src={img} className='h-52'></img>
          </div>
          <p className='flex text-brsl_moss font-body text-xl mb-5 justify-center text-center'>Browse through some of the most famous local markets of India<br></br>to find various clothes and other fashion items</p>
        </div>

        {/* Categories */}
        <div className='max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto'>
          <div className='grid grid-cols-6 gap-8 mt-5'>
            <a href='/markets/chandni_chowk' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Chandni Chowk</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Delhi</h4>
                    <p className='font-body text-md leading-tight lg:w-56 xl:w-80'>One of the oldest and busiest in India, explore this market's narrow lanes and bustling atmosphere.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-40 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img1} alt='Chandni Chowk' />
              </div>
            </a>

            <a href='/markets/pinkcity_bazaar' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Pink City Bazaars</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Jaipur</h4>
                    <p className='font-body text-md leading-tight md:w-48 xl:w-80'>These vibrant bazaars are host to a variety of jewellery, textiles and handicrafts.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-44 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img2} alt='Pink City Bazaars' />
              </div>
            </a>

            <a href='/markets/laad_bazaar' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Laad Bazaar</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Hyderabad</h4>
                    <p className='font-body text-md leading-tight lg:w-64 xl:w-96'>Facing the iconic monument of Char Minar, this market offers a stunning array of bangles, pearls and traditional Hyderabadi jewellery designs.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-44 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img3} alt='Laad Bazaar' />
              </div>
            </a>

            <a href='/markets/devaraja_market' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Devaraja Market</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Mysore</h4>
                    <p className='font-body text-md leading-tight md:w-56 lg:w-64 xl:w-96'>This colourful market also doubles as a tourist attraction, with bundles of flowers, fruits and various coloured Kumkum powder.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-44 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img4} alt='Devaraja Market' />
              </div>
            </a>

            <a href='/markets/colaba_causeway' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Colaba Causeway</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Mumbai</h4>
                    <p className='font-body text-md leading-tight md:w-64 lg:w-64 xl:w-96'>This popular shopping destination is known for its trendy fashion boutiques and antiques.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-44 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img5} alt='Colaba Causeway' />
              </div>
            </a>

            <a href='/markets/commercial_street' className='col-span-6 sm:col-span-3'>
              <div className='group flex relative bg-brsl_brick p-5 rounded-2xl'>
                <div className='text-white text-left z-10'>
                    <h2 className='font-bharatshaala text-4xl sm:text-3xl'>Commercial Street</h2>
                    <h4 className='relative bottom-2 font-bharatshaala text-2xl sm:text-xl'>Bengaluru</h4>
                    <p className='font-body text-md leading-tight md:w-52 lg:w-48 xl:w-80'>The diverse range of shops in this market in the heart of Bangalore is a sight to behold.</p>
                </div>
                <img className='transition ease-in-out absolute bottom-0 right-0 h-40 z-0 rounded-e-2xl opacity-0 origin-bottom-right group-hover:scale-105 lg:opacity-100' src={img6} alt='Commercial Street' />
              </div>
            </a>
          </div>
        </div>
        <br></br>
      </div>
    </React.StrictMode>
  );
};

export default Clothing;
