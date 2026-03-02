import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/jewellery.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Jewellery = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const jewelleryTypes = [
    { id: 'all', name: 'सभी आभूषण', icon: '💎' },
    { id: 'traditional', name: 'पारंपरिक', icon: '👑' },
    { id: 'modern', name: 'आधुनिक', icon: '✨' },
    { id: 'bridal', name: 'दुल्हन के लिए', icon: '💍' },
    { id: 'casual', name: 'दैनिक उपयोग', icon: '🔗' }
  ];

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'भारत के सबसे पुराने और व्यस्त बाजारों में से एक, यहाँ पारंपरिक सोने-चांदी के आभूषणों का अनूठा संग्रह है।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'सोने की मीनाकारी और कुंदन ज्वेलरी',
      rating: 4.9,
      vendors: 180,
      types: ['traditional', 'bridal'],
      priceRange: '₹5,000 - ₹5,00,000'
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'राजस्थानी हस्तशिल्प के लिए प्रसिद्ध, यहाँ मीनाकारी और कुंदन के अद्भुत डिज़ाइन मिलते हैं।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी मीनाकारी और जयपुरी हार',
      rating: 4.8,
      vendors: 220,
      types: ['traditional', 'bridal', 'casual'],
      priceRange: '₹3,000 - ₹3,00,000'
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'चार मीनार के पास स्थित यह बाजार मोतियों और चूड़ियों के लिए विश्व प्रसिद्ध है।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'हैदराबादी मोती और लाख की चूड़ियां',
      rating: 4.7,
      vendors: 150,
      types: ['traditional', 'bridal'],
      priceRange: '₹2,000 - ₹2,50,000'
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'दक्षिण भारतीय परंपराओं के अनुसार तैयार किए गए आभूषणों का केंद्र।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'मैसूर गोल्ड और टेम्पल ज्वेलरी',
      rating: 4.6,
      vendors: 95,
      types: ['traditional', 'casual'],
      priceRange: '₹4,000 - ₹4,00,000'
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'आधुनिक डिज़ाइन और फ्यूजन ज्वेलरी के लिए मुंबई का प्रसिद्ध गंतव्य।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'कंटेम्पररी डिज़ाइन और फैशन ज्वेलरी',
      rating: 4.5,
      vendors: 200,
      types: ['modern', 'casual'],
      priceRange: '₹1,000 - ₹1,50,000'
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'ट्रेंडी और एफोर्डेबल ज्वेलरी के लिए बैंगलोर का हॉटस्पॉट।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'मॉडर्न एक्सेसरीज़ और इमिटेशन ज्वेलरी',
      rating: 4.4,
      vendors: 160,
      types: ['modern', 'casual'],
      priceRange: '₹500 - ₹50,000'
    }
  ];

  const filteredMarkets = selectedType === 'all' 
    ? markets 
    : markets.filter(market => market.types.includes(selectedType));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-emerald-200 dark:border-emerald-700 rounded-full animate-spin border-t-emerald-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-emerald-400 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">आभूषण संग्रह लोड हो रहा है...</h2>
          <p className="text-emerald-600 dark:text-emerald-400">हमारे बेहतरीन गहनों का इंतज़ार करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-200/30 to-orange-300/30 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-200/30 to-green-300/30 animate-pulse delay-1000"></div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-3 mb-6 shadow-lg'>
                <span className='text-2xl'>💎</span>
                <span className='text-emerald-900 dark:text-emerald-200 font-bold'>प्रीमियम आभूषण</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                रत्न संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500'></div>
                  <img 
                    src={img} 
                    className='relative h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='आभूषण संग्रह'
                  />
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 dark:text-emerald-300 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और अनोखे गहनों के टुकड़े खोजें।<br/>
                पारंपरिक कारीगरी से लेकर आधुनिक डिज़ाइन तक का शानदार संग्रह।
              </p>

              {/* Feature Highlights */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🏆</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>प्रमाणित गुणवत्ता</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🎨</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>हस्तनिर्मित डिज़ाइन</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>💯</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>100% असली</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>⚡</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>तुरंत डिलीवरी</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className='max-w-6xl mx-auto px-6 mb-12'>
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            <h3 className='text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4 text-center'>आभूषण प्रकार</h3>
            <div className='flex flex-wrap justify-center gap-3'>
              {jewelleryTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedType === type.id
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700'
                  }`}
                >
                  <span className='text-lg'>{type.icon}</span>
                  <span className='font-medium'>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {filteredMarkets.map((market) => (
              <a 
                key={market.id}
                href={market.href} 
                className='group block'
                onMouseEnter={() => setHoveredCard(market.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
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
                    
                    {/* Premium Badge */}
                    <div className='absolute top-4 left-4'>
                      <div className='bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-4 py-2 flex items-center space-x-2'>
                        <svg className="w-4 h-4 text-emerald-900 dark:text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className='text-sm font-bold text-emerald-900 dark:text-emerald-200'>{market.rating}</span>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className='absolute top-4 right-4'>
                      <div className='bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-white text-xs font-medium'>{market.priceRange}</span>
                      </div>
                    </div>

                    {/* Vendor Count */}
                    <div className='absolute bottom-4 left-4'>
                      <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>{market.vendors} जौहरी</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className='p-8'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors duration-300'>
                          {market.name}
                        </h2>
                        <div className='flex items-center space-x-2 text-emerald-600 dark:text-emerald-400'>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                          </svg>
                          <span className='font-medium'>{market.city}</span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                        hoveredCard === market.id ? 'rotate-12 scale-110' : ''
                      }`}>
                        <span className='text-emerald-900 dark:text-emerald-200 text-xl'>💎</span>
                      </div>
                    </div>

                    <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3'>
                      {market.description}
                    </p>

                    {/* Specialty & Types */}
                    <div className='space-y-3 mb-6'>
                      <div className='inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-200 dark:border-emerald-700'>
                        <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className='text-emerald-700 dark:text-emerald-300 text-sm font-medium'>{market.specialty}</span>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {market.types.map((type) => {
                          const typeInfo = jewelleryTypes.find(t => t.id === type);
                          return (
                            <span key={type} className='inline-flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-xs border border-yellow-200 dark:border-yellow-700'>
                              <span>{typeInfo?.icon}</span>
                              <span>{typeInfo?.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className={`flex items-center justify-between transition-all duration-300 ${
                      hoveredCard === market.id ? 'transform translate-x-2' : ''
                    }`}>
                      <span className='text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:text-emerald-300'>
                        गहने देखें
                      </span>
                      <div className='flex items-center space-x-1'>
                        <div className='w-2 h-2 bg-yellow-400 rounded-full animate-bounce'></div>
                        <div className='w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-75'></div>
                        <div className='w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-150'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-3xl p-12 text-emerald-900 dark:text-emerald-200 relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDEwMCwgMCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
              <div className="relative z-10">
                <h3 className='text-3xl font-bold mb-4'>अपना सपनों का आभूषण खोजें</h3>
                <p className='text-xl mb-8 max-w-2xl mx-auto opacity-90'>
                  हमारे विशेषज्ञ जौहरियों से सलाह लें और अपने लिए परफेक्ट ज्वेलरी चुनें
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <button className='bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
                    विशेषज्ञ से बात करें
                  </button>
                  <button className='border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105'>
                    कस्टम डिज़ाइन ऑर्डर करें
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Jewellery;