import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/handicrafts.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Handicrafts = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCraft, setSelectedCraft] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  const craftTypes = [
    { id: 'all', name: 'सभी हस्तशिल्प', icon: '🎨', color: 'from-emerald-500 to-green-500' },
    { id: 'pottery', name: 'मिट्टी के बर्तन', icon: '🏺', color: 'from-amber-500 to-orange-500' },
    { id: 'textile', name: 'वस्त्र कला', icon: '🧵', color: 'from-purple-500 to-pink-500' },
    { id: 'metalwork', name: 'धातु कार्य', icon: '⚒️', color: 'from-gray-500 to-slate-600' },
    { id: 'woodwork', name: 'लकड़ी का काम', icon: '🪵', color: 'from-yellow-600 to-amber-600' },
    { id: 'painting', name: 'चित्रकारी', icon: '🖼️', color: 'from-blue-500 to-indigo-500' }
  ];

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'दिल्ली के इस ऐतिहासिक बाजार में मुगलकालीन हस्तशिल्प और पारंपरिक कलाकृतियों का अनूठा संग्रह मिलता है।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'मुगल काल की हस्तशिल्प और पीतल के बर्तन',
      rating: 4.8,
      vendors: 120,
      craftTypes: ['metalwork', 'textile', 'painting'],
      heritage: 'मुगल काल',
      established: '1650'
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'राजस्थानी हस्तशिल्प की समृद्ध परंपरा का केंद्र, जहाँ ब्लॉक प्रिंटिंग से लेकर मीनाकारी तक सब कुछ मिलता है।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी ब्लॉक प्रिंट और मीनाकारी',
      rating: 4.9,
      vendors: 200,
      craftTypes: ['textile', 'painting', 'metalwork'],
      heritage: 'राजपूत काल',
      established: '1727'
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'निज़ामी संस्कृति का प्रतिबिंब, यहाँ बिदरी कार्य और पारंपरिक हैदराबादी हस्तशिल्प की अनूठी कलाकृतियाँ मिलती हैं।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'बिदरी वर्क और निज़ामी हस्तशिल्प',
      rating: 4.7,
      vendors: 85,
      craftTypes: ['metalwork', 'textile'],
      heritage: 'निज़ाम काल',
      established: '1591'
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'दक्षिण भारतीय हस्तशिल्प का खजाना, जहाँ मैसूर पेंटिंग और चंदन की लकड़ी के उत्पाद मिलते हैं।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'मैसूर पेंटिंग और चंदन शिल्प',
      rating: 4.6,
      vendors: 110,
      craftTypes: ['painting', 'woodwork'],
      heritage: 'विजयनगर काल',
      established: '1905'
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'पारंपरिक और आधुनिक हस्तशिल्प का संगम, जहाँ समकालीन कलाकारों की रचनाएँ भी मिलती हैं।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'कंटेम्पररी आर्ट और फ्यूजन हैंडिक्राफ्ट्स',
      rating: 4.5,
      vendors: 150,
      craftTypes: ['painting', 'textile', 'pottery'],
      heritage: 'औपनिवेशिक काल',
      established: '1838'
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'कर्नाटक की पारंपरिक कलाओं से लेकर आधुनिक डिज़ाइन तक, यहाँ हर प्रकार का हस्तशिल्प उपलब्ध है।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'कर्नाटक हैंडलूम और मॉडर्न क्राफ्ट्स',
      rating: 4.4,
      vendors: 90,
      craftTypes: ['textile', 'woodwork', 'pottery'],
      heritage: 'टीपू सुल्तान काल',
      established: '1884'
    }
  ];

  const filteredMarkets = selectedCraft === 'all' 
    ? markets 
    : markets.filter(market => market.craftTypes.includes(selectedCraft));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-emerald-200 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-emerald-400 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🎨</div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">हस्तशिल्प संग्रह तैयार हो रहा है...</h2>
          <p className="text-emerald-600">कलाकारों की अनूठी कृतियों का इंतज़ार करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Artistic Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.4'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2L74 40h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-emerald-200'>
                <span className='text-2xl'>🎨</span>
                <span className='text-emerald-800 font-bold'>हस्तनिर्मित कलाकृतियाँ</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                शिल्प संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500'></div>
                  <img 
                    src={img} 
                    className='relative h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='हस्तशिल्प संग्रह'
                  />
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और पारंपरिक भारतीय हस्तशिल्प की<br/>
                अनमोल कलाकृतियाँ खोजें। हर टुकड़े में छुपी है सदियों पुरानी कहानी।
              </p>

              {/* Heritage Timeline */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12'>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🏛️</div>
                  <div className='text-sm text-emerald-600 font-medium'>5000+ साल</div>
                  <div className='text-xs text-emerald-500'>पुरानी परंपरा</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>👨‍🎨</div>
                  <div className='text-sm text-emerald-600 font-medium'>500+</div>
                  <div className='text-xs text-emerald-500'>कुशल कारीगर</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🎁</div>
                  <div className='text-sm text-emerald-600 font-medium'>1000+</div>
                  <div className='text-xs text-emerald-500'>अनूठे उत्पाद</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl mb-2'>🌏</div>
                  <div className='text-sm text-emerald-600 font-medium'>50+</div>
                  <div className='text-xs text-emerald-500'>देशों में निर्यात</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Craft Types Filter */}
        <div className='max-w-6xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            <h3 className='text-lg font-semibold text-emerald-800 mb-6 text-center'>शिल्प प्रकार</h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              {craftTypes.map((craft) => (
                <button
                  key={craft.id}
                  onClick={() => setSelectedCraft(craft.id)}
                  className={`group flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 ${
                    selectedCraft === craft.id
                      ? `bg-gradient-to-br ${craft.color} text-white shadow-lg scale-105`
                      : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <span className='text-2xl'>{craft.icon}</span>
                  <span className='font-medium text-sm text-center leading-tight'>{craft.name}</span>
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
                    
                    {/* Heritage Badge */}
                    <div className='absolute top-4 left-4'>
                      <div className='bg-gradient-to-r from-amber-400 to-orange-400 rounded-full px-4 py-2 flex items-center space-x-2'>
                        <svg className="w-4 h-4 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span className='text-xs font-bold text-amber-900'>{market.rating}</span>
                      </div>
                    </div>

                    {/* Established Year */}
                    <div className='absolute top-4 right-4'>
                      <div className='bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-white text-xs font-medium'>स्थापना {market.established}</span>
                      </div>
                    </div>

                    {/* Heritage Info */}
                    <div className='absolute bottom-4 left-4'>
                      <div className='bg-white/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-emerald-600 text-sm font-medium'>{market.heritage}</span>
                      </div>
                    </div>

                    {/* Artisan Count */}
                    <div className='absolute bottom-4 right-4'>
                      <div className='bg-purple-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                        <span className='text-white text-sm font-medium'>{market.vendors} कारीगर</span>
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
                        <span className='text-white text-xl'>🎨</span>
                      </div>
                    </div>

                    <p className='text-gray-600 leading-relaxed mb-6'>
                      {market.description}
                    </p>

                    {/* Specialty & Craft Types */}
                    <div className='space-y-3 mb-6'>
                      <div className='inline-flex items-center bg-emerald-50 rounded-full px-4 py-2 border border-emerald-200'>
                        <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className='text-emerald-700 text-sm font-medium'>{market.specialty}</span>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {market.craftTypes.map((craftType) => {
                          const craftInfo = craftTypes.find(c => c.id === craftType);
                          return (
                            <span key={craftType} className={`inline-flex items-center space-x-1 bg-gradient-to-r ${craftInfo?.color} text-white px-3 py-1 rounded-full text-xs`}>
                              <span>{craftInfo?.icon}</span>
                              <span>{craftInfo?.name}</span>
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
                        कलाकृतियाँ देखें
                      </span>
                      <div className='flex items-center space-x-1'>
                        <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse'></div>
                        <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75'></div>
                        <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-150'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-3xl p-12 text-white relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative z-10">
                <h3 className='text-3xl font-bold mb-4'>अपनी पसंदीदा हस्तशिल्प खोजें</h3>
                <p className='text-xl text-emerald-100 mb-8 max-w-2xl mx-auto'>
                  हमारे कुशल कारीगरों से मिलें और उनकी अनमोल कलाकृतियों को अपना बनाएं
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <button className='bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
                    कारीगर से मिलें
                  </button>
                  <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-105'>
                    कस्टम ऑर्डर करें
                  </button>
                </div>
                <div className='mt-8 text-emerald-200 text-sm'>
                  🏆 "मेड इन इंडिया" सर्टिफाइड • 🌿 इको-फ्रेंडली मटेरियल • ✨ हैंडमेड क्वालिटी गारंटी
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Handicrafts;