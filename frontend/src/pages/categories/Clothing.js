import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/clothing.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Clothing = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'भारत के सबसे पुराने और व्यस्त बाजारों में से एक, इसकी संकरी गलियों और भीड़भाड़ का माहौल अनुभव करें।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'पारंपरिक कपड़े और शादी के जोड़े',
      rating: 4.8,
      vendors: 250
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'ये जीवंत बाजार गहने, कपड़े और हस्तशिल्प की विविधता का घर हैं।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी बंधेज और ब्लॉक प्रिंट',
      rating: 4.9,
      vendors: 180
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'प्रतिष्ठित चार मीनार के सामने स्थित, यह बाजार चूड़ियों, मोतियों और पारंपरिक हैदराबादी आभूषण डिज़ाइन का शानदार संग्रह प्रस्तुत करता है।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'हैदराबादी शेरवानी और खाड़ा दुपट्टा',
      rating: 4.7,
      vendors: 120
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'यह रंग-बिरंगा बाजार एक पर्यटक आकर्षण भी है, जहाँ फूलों के गुच्छे, फल और विभिन्न रंगों का कुमकुम पाउडर मिलता है।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'मैसूर सिल्क और पारंपरिक साड़ियां',
      rating: 4.6,
      vendors: 95
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'यह लोकप्रिय शॉपिंग गंतव्य अपने ट्रेंडी फैशन बुटीक और प्राचीन वस्तुओं के लिए जाना जाता है।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'फ्यूजन वियर और डिज़ाइनर कलेक्शन',
      rating: 4.5,
      vendors: 300
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'बैंगलोर के दिल में स्थित इस बाजार में दुकानों की विविध श्रृंखला देखने लायक है।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'आधुनिक फैशन और एक्सेसरीज',
      rating: 4.4,
      vendors: 200
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">वस्त्र संग्रह लोड हो रहा है...</h2>
          <p className="text-emerald-600">कृपया प्रतीक्षा करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg'>
                <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm8 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V8z" clipRule="evenodd"/>
                </svg>
                <span className='text-emerald-700 font-semibold'>फैशन श्रेणी</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold text-emerald-800 mb-6 leading-tight'>
                वस्त्र संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <img 
                    src={img} 
                    className='h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='वस्त्र संग्रह'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent rounded-3xl group-hover:from-emerald-500/30 transition-all duration-500'></div>
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और विभिन्न प्रकार के कपड़े<br/>
                और अन्य फैशन आइटम खोजें। परंपरा से आधुनिकता तक का सफर।
              </p>

              {/* Quick Stats */}
              <div className='grid grid-cols-3 gap-6 max-w-md mx-auto mt-12'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>6</div>
                  <div className='text-emerald-600 text-sm'>प्रमुख बाजार</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>1000+</div>
                  <div className='text-emerald-600 text-sm'>वस्त्र विकल्प</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>50+</div>
                  <div className='text-emerald-600 text-sm'>डिज़ाइनर ब्रांड</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {markets.map((market) => (
              <a 
                key={market.id}
                href={market.href} 
                className='group block'
                onMouseEnter={() => setHoveredCard(market.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  hoveredCard === market.id ? 'scale-[1.02]' : ''
                }`}>
                  
                  {/* Image Section */}
                  <div className='relative h-64 overflow-hidden'>
                    <img 
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredCard === market.id ? 'scale-110' : 'scale-100'
                      }`} 
                      src={market.image} 
                      alt={market.name}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
                      hoveredCard === market.id ? 'opacity-70' : 'opacity-50'
                    }`}></div>
                    
                    {/* Floating Badge */}
                    <div className='absolute top-4 left-4'>
                      <div className='bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2'>
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className='text-sm font-semibold text-gray-800'>{market.rating}</span>
                      </div>
                    </div>

                    {/* Vendors Count */}
                    <div className='absolute top-4 right-4'>
                      <div className='bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-white text-sm font-medium'>{market.vendors} दुकानें</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className='p-8'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h2 className='text-2xl font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors duration-300'>
                          {market.name}
                        </h2>
                        <div className='flex items-center space-x-2 text-emerald-600'>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className='font-medium'>{market.city}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                        hoveredCard === market.id ? 'rotate-12 scale-110' : ''
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className='text-gray-600 leading-relaxed mb-6 line-clamp-3'>
                      {market.description}
                    </p>

                    {/* Specialty Tag */}
                    <div className='mb-6'>
                      <div className='inline-flex items-center bg-emerald-50 rounded-full px-4 py-2 border border-emerald-200'>
                        <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className='text-emerald-700 text-sm font-medium'>{market.specialty}</span>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className={`flex items-center justify-between transition-all duration-300 ${
                      hoveredCard === market.id ? 'transform translate-x-2' : ''
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
              </a>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-12 text-white'>
              <h3 className='text-3xl font-bold mb-4'>अपना पसंदीदा स्टाइल खोजें</h3>
              <p className='text-xl text-emerald-100 mb-8 max-w-2xl mx-auto'>
                पारंपरिक से लेकर आधुनिक तक, हमारे पास हर अवसर के लिए वस्त्र हैं
              </p>
              <button className='bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105'>
                सभी संग्रह देखें
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Clothing;