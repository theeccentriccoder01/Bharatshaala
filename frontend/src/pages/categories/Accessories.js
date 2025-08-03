import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/accessories.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Accessories = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const accessoryCategories = [
    { id: 'all', name: 'सभी एक्सेसरीज़', icon: '✨', gradient: 'from-emerald-500 to-green-500' },
    { id: 'bags', name: 'बैग्स', icon: '👜', gradient: 'from-purple-500 to-pink-500' },
    { id: 'scarves', name: 'स्कार्फ़', icon: '🧣', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'belts', name: 'बेल्ट्स', icon: '🔗', gradient: 'from-amber-500 to-orange-500' },
    { id: 'watches', name: 'घड़ियाँ', icon: '⌚', gradient: 'from-gray-500 to-slate-600' },
    { id: 'sunglasses', name: 'चश्मे', icon: '🕶️', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'traditional', name: 'पारंपरिक', icon: '🪶', gradient: 'from-red-500 to-pink-500' }
  ];

  const priceRanges = [
    { id: 'all', name: 'सभी कीमतें', range: '' },
    { id: 'budget', name: '₹500 से कम', range: '< ₹500' },
    { id: 'mid', name: '₹500 - ₹2000', range: '₹500 - ₹2000' },
    { id: 'premium', name: '₹2000 - ₹5000', range: '₹2000 - ₹5000' },
    { id: 'luxury', name: '₹5000+', range: '₹5000+' }
  ];

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'दिल्ली के इस ऐतिहासिक बाजार में पारंपरिक और आधुनिक दोनों प्रकार की एक्सेसरीज़ का शानदार संग्रह मिलता है।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'चमड़े के बैग्स और पारंपरिक एक्सेसरीज़',
      rating: 4.8,
      vendors: 180,
      categories: ['bags', 'traditional', 'belts'],
      priceCategory: 'budget',
      trending: ['जूते', 'पर्स', 'शॉल'],
      deliveryTime: '2-3 दिन'
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'राजस्थानी हस्तशिल्प की एक्सेसरीज़ का केंद्र। यहाँ मिरर वर्क और एम्ब्रॉयडरी के अनूठे डिज़ाइन मिलते हैं।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी मिरर वर्क बैग्स और एम्ब्रॉयडरी स्कार्फ़',
      rating: 4.9,
      vendors: 220,
      categories: ['bags', 'scarves', 'traditional'],
      priceCategory: 'mid',
      trending: ['मिरर बैग्स', 'बंधनी स्कार्फ़', 'मोजड़ी'],
      deliveryTime: '3-4 दिन'
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'निज़ामी संस्कृति की झलक मिलती है यहाँ की एक्सेसरीज़ में। पोत्थी बैग्स और पारंपरिक आभूषण का विशेष संग्रह।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'निज़ामी स्टाइल पोत्थी बैग्स और चांदी की एक्सेसरीज़',
      rating: 4.7,
      vendors: 120,
      categories: ['bags', 'traditional', 'watches'],
      priceCategory: 'premium',
      trending: ['पोत्थी बैग', 'चांदी के कड़े', 'इत्र की शीशियां'],
      deliveryTime: '4-5 दिन'
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'दक्षिण भारतीय पारंपरिक एक्सेसरीज़ का केंद्र। चंदन की लकड़ी से बनी वस्तुएं और सिल्क स्कार्फ़ की विशेषता।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'चंदन वुड एक्सेसरीज़ और मैसूर सिल्क स्कार्फ़',
      rating: 4.6,
      vendors: 95,
      categories: ['scarves', 'traditional', 'bags'],
      priceCategory: 'premium',
      trending: ['सिल्क स्कार्फ़', 'चंदन बॉक्स', 'कंबल'],
      deliveryTime: '5-6 दिन'
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'ट्रेंडी और फैशनेबल एक्सेसरीज़ का हब। यहाँ इंटरनेशनल ब्रांड्स के साथ-साथ लोकल डिज़ाइनर्स की क्रिएशन भी मिलती है।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'डिज़ाइनर बैग्स और इंपोर्टेड एक्सेसरीज़',
      rating: 4.5,
      vendors: 300,
      categories: ['bags', 'sunglasses', 'watches'],
      priceCategory: 'luxury',
      trending: ['डिज़ाइनर सनग्लासेज', 'लेदर बैग्स', 'वॉचेस'],
      deliveryTime: '1-2 दिन'
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'यंग पेशनल्स के लिए परफेक्ट एक्सेसरीज़ मार्केट। ऑफिस वियर से लेकर कैजुअल स्टाइल तक सब कुछ मिलता है।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'ऑफिस एक्सेसरीज़ और कैजुअल वियर',
      rating: 4.4,
      vendors: 250,
      categories: ['belts', 'watches', 'bags'],
      priceCategory: 'mid',
      trending: ['लेप्टॉप बैग्स', 'ऑफिस बेल्ट्स', 'स्मार्ट वॉचेस'],
      deliveryTime: '2-3 दिन'
    }
  ];

  const filteredMarkets = markets.filter(market => {
    const matchesCategory = selectedCategory === 'all' || market.categories.includes(selectedCategory);
    const matchesPrice = priceRange === 'all' || market.priceCategory === priceRange;
    return matchesCategory && matchesPrice;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl animate-bounce">👜</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">एक्सेसरीज़ कलेक्शन तैयार हो रहा है...</h2>
          <p className="text-emerald-600">स्टाइलिश एक्सेसरीज़ का इंतज़ार करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Fashion Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce">👜</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-bounce delay-1000">⌚</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-bounce delay-2000">🕶️</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-bounce delay-3000">🧣</div>
            <div className="absolute top-32 left-1/2 text-3xl opacity-20 animate-bounce delay-500">🔗</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-purple-200'>
                <span className='text-2xl'>✨</span>
                <span className='text-purple-800 font-bold'>फैशन एक्सेसरीज़</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                स्टाइल संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500'></div>
                  <img 
                    src={img} 
                    className='relative h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='एक्सेसरीज़ संग्रह'
                  />
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और विभिन्न प्रकार की<br/>
                अनूठी एक्सेसरीज़ खोजें। हर टुकड़ा आपकी स्टाइल को निखारने के लिए।
              </p>

              {/* Style Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12'>
                <div className='text-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200'>
                  <div className='text-3xl mb-2'>👜</div>
                  <div className='text-2xl font-bold text-emerald-600'>2000+</div>
                  <div className='text-sm text-emerald-600 font-medium'>यूनीक डिज़ाइन्स</div>
                </div>
                <div className='text-center bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-4 border border-blue-200'>
                  <div className='text-3xl mb-2'>🎨</div>
                  <div className='text-2xl font-bold text-emerald-600'>50+</div>
                  <div className='text-sm text-emerald-600 font-medium'>डिज़ाइनर ब्रांड्स</div>
                </div>
                <div className='text-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-200'>
                  <div className='text-3xl mb-2'>⚡</div>
                  <div className='text-2xl font-bold text-emerald-600'>24</div>
                  <div className='text-sm text-emerald-600 font-medium'>घंटे डिलीवरी</div>
                </div>
                <div className='text-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-4 border border-green-200'>
                  <div className='text-3xl mb-2'>⭐</div>
                  <div className='text-2xl font-bold text-emerald-600'>4.7</div>
                  <div className='text-sm text-emerald-600 font-medium'>कस्टमर रेटिंग</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className='max-w-6xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            
            {/* Category Filter */}
            <div className='mb-6'>
              <h3 className='text-lg font-semibold text-emerald-800 mb-4 text-center'>एक्सेसरी श्रेणियां</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3'>
                {accessoryCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-br ${category.gradient} text-white shadow-lg scale-105`
                        : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className='text-xl'>{category.icon}</span>
                    <span className='font-medium text-xs text-center leading-tight'>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className='text-lg font-semibold text-emerald-800 mb-4 text-center'>मूल्य श्रेणी</h3>
              <div className='flex flex-wrap justify-center gap-3'>
                {priceRanges.map((price) => (
                  <button
                    key={price.id}
                    onClick={() => setPriceRange(price.id)}
                    className={`px-6 py-3 rounded-full transition-all duration-300 ${
                      priceRange === price.id
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                        : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    <span className='font-medium text-sm'>{price.name}</span>
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
              <h3 className='text-2xl font-bold text-emerald-800 mb-2'>कोई एक्सेसरी नहीं मिली</h3>
              <p className='text-emerald-600'>कृपया अपना फ़िल्टर बदलें</p>
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
                      
                      {/* Rating Badge */}
                      <div className='absolute top-4 left-4'>
                        <div className='bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 flex items-center space-x-2'>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className='text-sm font-bold text-white'>{market.rating}</span>
                        </div>
                      </div>

                      {/* Delivery Time */}
                      <div className='absolute top-4 right-4'>
                        <div className='bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
                          <span className='text-white text-xs'>⚡</span>
                          <span className='text-white text-xs font-medium'>{market.deliveryTime}</span>
                        </div>
                      </div>

                      {/* Vendor Count */}
                      <div className='absolute bottom-4 left-4'>
                        <div className='bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
                          <span className='text-emerald-600 text-xs'>🏪</span>
                          <span className='text-emerald-600 text-xs font-medium'>{market.vendors} दुकानें</span>
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
                        <div className={`w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                          hoveredCard === market.id ? 'rotate-12 scale-110' : ''
                        }`}>
                          <span className='text-white text-xl'>✨</span>
                        </div>
                      </div>

                      <p className='text-gray-600 leading-relaxed mb-6'>
                        {market.description}
                      </p>

                      {/* Specialty */}
                      <div className='mb-4'>
                        <div className='inline-flex items-center bg-emerald-50 rounded-full px-4 py-2 border border-emerald-200'>
                          <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className='text-emerald-700 text-sm font-medium'>{market.specialty}</span>
                        </div>
                      </div>

                      {/* Trending Items */}
                      <div className='mb-6'>
                        <h4 className='text-sm font-semibold text-gray-700 mb-2'>ट्रेंडिंग आइटम्स:</h4>
                        <div className='flex flex-wrap gap-2'>
                          {market.trending.map((item, index) => (
                            <span key={index} className='bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs border border-orange-200'>
                              🔥 {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Categories */}
                      <div className='mb-6'>
                        <div className='flex flex-wrap gap-2'>
                          {market.categories.map((categoryId) => {
                            const categoryInfo = accessoryCategories.find(c => c.id === categoryId);
                            return (
                              <span key={categoryId} className={`inline-flex items-center space-x-1 bg-gradient-to-r ${categoryInfo?.gradient} text-white px-3 py-1 rounded-full text-xs`}>
                                <span>{categoryInfo?.icon}</span>
                                <span>{categoryInfo?.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Call to Action */}
                      <div className={`flex items-center justify-between transition-all duration-300 ${
                        hoveredCard === market.id ? 'transform translate-x-2' : ''
                      }`}>
                        <span className='text-emerald-600 font-semibold group-hover:text-emerald-700'>
                          एक्सेसरीज़ देखें
                        </span>
                        <div className='flex items-center space-x-1'>
                          <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                          <div className='w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75'></div>
                          <div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150'></div>
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
            <div className='bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-3xl p-12 text-white relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative z-10">
                <h3 className='text-3xl font-bold mb-4'>अपना स्टाइल स्टेटमेंट बनाएं</h3>
                <p className='text-xl text-purple-100 mb-8 max-w-2xl mx-auto'>
                  हमारे स्टाइल एक्सपर्ट्स से सलाह लें और अपने लिए परफेक्ट एक्सेसरी चुनें
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <button className='bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
                    स्टाइल कंसल्टेशन बुक करें
                  </button>
                  <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105'>
                    पर्सनल शॉपर हायर करें
                  </button>
                </div>
                <div className='mt-8 text-purple-200 text-sm flex flex-wrap items-center justify-center gap-6'>
                  <span className='flex items-center space-x-2'>
                    <span>🚚</span>
                    <span>फ्री डिलीवरी ₹999+</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>🔄</span>
                    <span>7 दिन एक्सचेंज</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>✨</span>
                    <span>ऑथेंटिसिटी गारंटी</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>💳</span>
                    <span>EMI उपलब्ध</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Accessories;