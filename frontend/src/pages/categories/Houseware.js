import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/houseware.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Houseware = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const roomCategories = [
    { id: 'all', name: 'सभी कमरे', icon: '🏠', gradient: 'from-emerald-500 to-green-500' },
    { id: 'kitchen', name: 'रसोई', icon: '🍳', gradient: 'from-orange-500 to-red-500' },
    { id: 'livingroom', name: 'बैठक', icon: '🛋️', gradient: 'from-blue-500 to-indigo-500' },
    { id: 'bedroom', name: 'शयनकक्ष', icon: '🛏️', gradient: 'from-purple-500 to-pink-500' },
    { id: 'bathroom', name: 'स्नानघर', icon: '🚿', gradient: 'from-cyan-500 to-blue-500' },
    { id: 'dining', name: 'भोजन कक्ष', icon: '🍽️', gradient: 'from-amber-500 to-yellow-500' },
    { id: 'garden', name: 'बागीचा', icon: '🌱', gradient: 'from-green-500 to-emerald-500' }
  ];

  const materialTypes = [
    { id: 'all', name: 'सभी सामग्री', icon: '✨' },
    { id: 'copper', name: 'तांबा', icon: '🔶' },
    { id: 'brass', name: 'पीतल', icon: '🟡' },
    { id: 'steel', name: 'स्टील', icon: '⚪' },
    { id: 'ceramic', name: 'मिट्टी', icon: '🟤' },
    { id: 'wood', name: 'लकड़ी', icon: '🟫' },
    { id: 'bamboo', name: 'बांस', icon: '🎋' }
  ];

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'दिल्ली के इस पुराने बाजार में पारंपरिक भारतीय बर्तनों और घरेलू सामान का शानदार संग्रह मिलता है। यहाँ तांबे और पीतल के बर्तन विशेष रूप से प्रसिद्ध हैं।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'पारंपरिक तांबे और पीतल के बर्तन',
      rating: 4.8,
      vendors: 200,
      rooms: ['kitchen', 'dining', 'livingroom'],
      materials: ['copper', 'brass', 'steel'],
      priceRange: '₹200 - ₹15,000',
      heritage: 'मुगल काल',
      eco_friendly: true
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'राजस्थानी हस्तशिल्प के घरेलू सामान का केंद्र। यहाँ हाथ से बने मिट्टी के बर्तन और लकड़ी के फर्नीचर की अद्भुत वैरायटी मिलती है।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी मिट्टी के बर्तन और लकड़ी का फर्नीचर',
      rating: 4.9,
      vendors: 180,
      rooms: ['kitchen', 'livingroom', 'bedroom'],
      materials: ['ceramic', 'wood', 'brass'],
      priceRange: '₹150 - ₹25,000',
      heritage: 'राजपूत काल',
      eco_friendly: true
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'निज़ामी शैली के घरेलू सामान का केंद्र। यहाँ चांदी के बर्तन और पारंपरिक डेकोरेटिव आइटम्स की विशेषता है।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'निज़ामी स्टाइल चांदी के बर्तन और डेकोर',
      rating: 4.7,
      vendors: 120,
      rooms: ['dining', 'livingroom', 'bedroom'],
      materials: ['steel', 'brass', 'ceramic'],
      priceRange: '₹500 - ₹50,000',
      heritage: 'निज़ाम काल',
      eco_friendly: false
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'दक्षिण भारतीय पारंपरिक घरेलू सामान का केंद्र। यहाँ चंदन की लकड़ी के सामान और पारंपरिक स्टील के बर्तन मिलते हैं।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'चंदन की लकड़ी के सामान और स्टील के बर्तन',
      rating: 4.6,
      vendors: 95,
      rooms: ['kitchen', 'bathroom', 'livingroom'],
      materials: ['wood', 'steel', 'bamboo'],
      priceRange: '₹300 - ₹20,000',
      heritage: 'मैसूर साम्राज्य',
      eco_friendly: true
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'आधुनिक और ट्रेंडी होम डेकोर का हब। यहाँ इंटरनेशनल डिज़ाइन्स के साथ-साथ मॉडर्न इंडियन स्टाइल के सामान मिलते हैं।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'मॉडर्न होम डेकोर और कंटेम्पररी फर्नीचर',
      rating: 4.5,
      vendors: 250,
      rooms: ['livingroom', 'bedroom', 'bathroom'],
      materials: ['steel', 'ceramic', 'wood'],
      priceRange: '₹500 - ₹1,00,000',
      heritage: 'औपनिवेशिक काल',
      eco_friendly: false
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'मॉडर्न लाइफस्टाइल के लिए डिज़ाइन किए गए घरेलू सामान। यहाँ टेक-सेवी और इको-फ्रेंडली प्रोडक्ट्स की विशेषता है।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'इको-फ्रेंडली और स्मार्ट होम प्रोडक्ट्स',
      rating: 4.4,
      vendors: 160,
      rooms: ['kitchen', 'livingroom', 'garden'],
      materials: ['bamboo', 'steel', 'ceramic'],
      priceRange: '₹400 - ₹30,000',
      heritage: 'आधुनिक काल',
      eco_friendly: true
    }
  ];

  const filteredMarkets = markets.filter(market => {
    const matchesRoom = selectedRoom === 'all' || market.rooms.includes(selectedRoom);
    const matchesMaterial = selectedMaterial === 'all' || market.materials.includes(selectedMaterial);
    return matchesRoom && matchesMaterial;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-emerald-200 dark:border-emerald-700 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl animate-bounce">🏠</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">घरेलू सामान व्यवस्थित हो रहा है...</h2>
          <p className="text-emerald-600 dark:text-emerald-400">आपके घर को सुंदर बनाने वाले सामान का इंतज़ार करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Home Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float">🍳</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-float delay-1000">🛋️</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float delay-2000">🏺</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-float delay-3000">🌱</div>
            <div className="absolute top-32 left-1/2 text-3xl opacity-20 animate-float delay-500">🍽️</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-green-100 dark:from-gray-800 to-emerald-100 dark:to-gray-800 rounded-full px-6 py-3 mb-6 shadow-lg border border-green-200 dark:border-green-700'>
                <span className='text-2xl'>🏠</span>
                <span className='text-green-800 dark:text-green-400 font-bold'>घरेलू सामग्री</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                गृह संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500'></div>
                  <img 
                    src={img} 
                    className='relative h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='घरेलू सामान संग्रह'
                  />
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 dark:text-emerald-300 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और विभिन्न घरेलू उपकरणों<br/>
                की खोज करें। हर सामान आपके घर को और भी सुंदर बनाने के लिए।
              </p>

              {/* Home Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12'>
                <div className='text-center bg-gradient-to-br from-orange-100 dark:from-orange-900/30 to-red-100 dark:to-red-900/30 rounded-xl p-4 border border-orange-200 dark:border-orange-700'>
                  <div className='text-3xl mb-2'>🍳</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>5000+</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>रसोई के सामान</div>
                </div>
                <div className='text-center bg-gradient-to-br from-blue-100 dark:from-blue-900/30 to-indigo-100 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700'>
                  <div className='text-3xl mb-2'>🛋️</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>3000+</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>फर्नीचर आइटम्स</div>
                </div>
                <div className='text-center bg-gradient-to-br from-amber-100 dark:from-amber-900/30 to-yellow-100 dark:to-yellow-900/30 rounded-xl p-4 border border-amber-200 dark:border-amber-700'>
                  <div className='text-3xl mb-2'>🏺</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>2000+</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>डेकोरेटिव पीसेस</div>
                </div>
                <div className='text-center bg-gradient-to-br from-green-100 dark:from-gray-800 to-emerald-100 dark:to-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700'>
                  <div className='text-3xl mb-2'>🌱</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>100%</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>इको-फ्रेंडली ऑप्शन</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className='max-w-6xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            
            {/* Room Filter */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4 text-center'>कमरे के अनुसार</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3'>
                {roomCategories.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`group flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
                      selectedRoom === room.id
                        ? `bg-gradient-to-br ${room.gradient} text-white shadow-lg scale-105`
                        : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300'
                    }`}
                  >
                    <span className='text-xl'>{room.icon}</span>
                    <span className='font-medium text-xs text-center leading-tight'>{room.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className='text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4 text-center'>सामग्री के अनुसार</h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {materialTypes.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      selectedMaterial === material.id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700'
                    }`}
                  >
                    <span className='text-lg'>{material.icon}</span>
                    <span className='font-medium'>{material.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          {filteredMarkets.length === 0 ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2'>कोई सामान नहीं मिला</h3>
              <p className='text-emerald-600 dark:text-emerald-400'>कृपया अपना फ़िल्टर बदलें</p>
            </div>
          ) : (
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
                      
                      {/* Rating Badge */}
                      <div className='absolute top-4 left-4'>
                        <div className='bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-4 py-2 flex items-center space-x-2'>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className='text-sm font-bold text-white'>{market.rating}</span>
                        </div>
                      </div>

                      {/* Price Range */}
                      <div className='absolute top-4 right-4'>
                        <div className='bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                          <span className='text-white text-xs font-medium'>{market.priceRange}</span>
                        </div>
                      </div>

                      {/* Eco-Friendly Badge */}
                      {market.eco_friendly && (
                        <div className='absolute bottom-4 right-4'>
                          <div className='bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
                            <span className='text-white text-xs'>🌱</span>
                            <span className='text-white text-xs font-medium'>इको-फ्रेंडली</span>
                          </div>
                        </div>
                      )}

                      {/* Heritage Info */}
                      <div className='absolute bottom-4 left-4'>
                        <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1'>
                          <span className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>{market.heritage}</span>
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
                        <div className={`w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                          hoveredCard === market.id ? 'rotate-12 scale-110' : ''
                        }`}>
                          <span className='text-white text-xl'>🏠</span>
                        </div>
                      </div>

                      <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-6'>
                        {market.description}
                      </p>

                      {/* Specialty */}
                      <div className='mb-4'>
                        <div className='inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-200 dark:border-emerald-700'>
                          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className='text-emerald-700 dark:text-emerald-300 text-sm font-medium'>{market.specialty}</span>
                        </div>
                      </div>

                      {/* Room Categories */}
                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>उपलब्ध कमरों के लिए:</h4>
                        <div className='flex flex-wrap gap-2'>
                          {market.rooms.map((roomId) => {
                            const roomInfo = roomCategories.find(r => r.id === roomId);
                            return (
                              <span key={roomId} className={`inline-flex items-center space-x-1 bg-gradient-to-r ${roomInfo?.gradient} text-white px-3 py-1 rounded-full text-xs`}>
                                <span>{roomInfo?.icon}</span>
                                <span>{roomInfo?.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Materials */}
                      <div className='mb-6'>
                        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>उपलब्ध सामग्री:</h4>
                        <div className='flex flex-wrap gap-2'>
                          {market.materials.map((materialId) => {
                            const materialInfo = materialTypes.find(m => m.id === materialId);
                            return (
                              <span key={materialId} className='inline-flex items-center space-x-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 px-3 py-1 rounded-full text-xs border border-amber-200 dark:border-amber-700'>
                                <span>{materialInfo?.icon}</span>
                                <span>{materialInfo?.name}</span>
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
                          घरेलू सामान देखें
                        </span>
                        <div className='flex items-center space-x-1'>
                          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                          <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-75'></div>
                          <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Bottom CTA Section */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-3xl p-12 text-white relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative z-10">
                <h3 className='text-3xl font-bold mb-4'>अपने सपनों का घर बनाएं</h3>
                <p className='text-xl text-green-100 mb-8 max-w-2xl mx-auto'>
                  हमारे होम डेकोर एक्सपर्ट्स से सलाह लें और अपने घर को खूबसूरत बनाएं
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <button className='bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-full font-semibold hover:bg-green-50 dark:hover:bg-gray-700 dark:bg-green-900/20 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
                    होम कंसल्टेशन बुक करें
                  </button>
                  <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white dark:bg-gray-800 hover:text-green-600 dark:text-green-400 transition-all duration-300 transform hover:scale-105'>
                    वर्चुअल होम टूर लें
                  </button>
                </div>
                <div className='mt-8 text-green-200 text-sm flex flex-wrap items-center justify-center gap-6'>
                  <span className='flex items-center space-x-2'>
                    <span>🚚</span>
                    <span>फ्री इंस्टॉलेशन</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>🔧</span>
                    <span>1 साल वारंटी</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>🌱</span>
                    <span>100% इको-फ्रेंडली</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>💯</span>
                    <span>क्वालिटी गारंटी</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Houseware;