import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ShopCard from '../../../components/ShopCard';
import '../../../App.css';

import map from '../../../images/carousel/5.png';

const PinkCity = () => {
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShop, setHoveredShop] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shops = [
    {
      id: 'shop1',
      name: 'राजस्थानी रत्न भंडार',
      nameEn: 'Rajasthani Gems Palace',
      specialty: 'हस्तनिर्मित चांदी के आभूषण, रत्न जड़ित गहने और पारंपरिक राजस्थानी डिज़ाइन',
      specialtyEn: 'Handcrafted silver jewelry, gemstone-studded ornaments, and traditional Rajasthani designs',
      rating: 4.9,
      reviews: 245,
      established: '1962',
      products: 350,
      owner: 'श्री रामकिशन सोनी',
      experience: '58 साल',
      specialty_items: ['मीनाकारी हार', 'कुंदन झुमके', 'चांदी की चूड़ियां'],
      href: '/markets/pinkcity_bazaar/shop1',
      image: '/images/shops/gems-palace.jpg',
      badge: '🏆 विरासत पुरस्कार'
    },
    {
      id: 'shop2',
      name: 'हस्तशिल्प महल',
      nameEn: 'Handicrafts Mahal',
      specialty: 'रंग-बिरंगे कपड़े और ब्लॉक प्रिंटेड टेक्सटाइल, लकड़ी की नक्काशी और जयपुर की प्रसिद्ध नीली मिट्टी के बर्तन',
      specialtyEn: 'Colorful fabrics and block-printed textiles along with wooden carvings and Jaipur\'s famous blue pottery',
      rating: 4.8,
      reviews: 189,
      established: '1975',
      products: 420,
      owner: 'श्रीमती सुनीता शर्मा',
      experience: '45 साल',
      specialty_items: ['ब्लॉक प्रिंट साड़ी', 'लकड़ी की मूर्तियां', 'नीली मिट्टी के बर्तन'],
      href: '/markets/pinkcity_bazaar/shop2',
      image: '/images/shops/handicrafts-mahal.jpg',
      badge: '🎨 कलाकार पसंद'
    },
    {
      id: 'shop3',
      name: 'मार्बल शिल्प केंद्र',
      nameEn: 'Marble Craft Center',
      specialty: 'संगमरमर की मूर्तियां और पारंपरिक राजस्थानी हस्तशिल्प जैसे कठपुतली, लाख की चूड़ियां और ऊंट के चमड़े की वस्तुएं',
      specialtyEn: 'Marble sculptures and traditional Rajasthani handicrafts like puppets, lac bangles, and camel leather items',
      rating: 4.7,
      reviews: 167,
      established: '1980',
      products: 280,
      owner: 'श्री विकास गुप्ता',
      experience: '40 साल',
      specialty_items: ['संगमरमर की मूर्तियां', 'राजस्थानी कठपुतली', 'ऊंट के चमड़े के बैग'],
      href: '/markets/pinkcity_bazaar/shop3',
      image: '/images/shops/marble-craft.jpg',
      badge: '🏛️ पारंपरिक कला'
    },
    {
      id: 'shop4',
      name: 'जोधपुरी बुटीक',
      nameEn: 'Jodhpuri Boutique',
      specialty: 'पारंपरिक राजस्थानी पोशाकें, बंधेज साड़ियां और राजसी जोधपुरी कपड़े',
      specialtyEn: 'Traditional Rajasthani attire, Bandhej sarees and royal Jodhpuri clothing',
      rating: 4.6,
      reviews: 134,
      established: '1985',
      products: 195,
      owner: 'श्री अनिल सिंह',
      experience: '35 साल',
      specialty_items: ['जोधपुरी कोट', 'बंधेज दुपट्टा', 'राजस्थानी लहंगा'],
      href: '/markets/pinkcity_bazaar/shop4',
      image: '/images/shops/jodhpuri-boutique.jpg',
      badge: '👑 रॉयल कलेक्शन'
    }
  ];

  const marketInfo = {
    name: 'Pink City Bazaars',
    nameHindi: 'गुलाबी शहर बाजार',
    city: 'Jaipur',
    cityHindi: 'जयपुर',
    established: '1727',
    totalShops: 450,
    totalVendors: 220,
    specialties: ['आभूषण', 'हस्तशिल्प', 'टेक्सटाइल', 'मिट्टी के बर्तन'],
    openingHours: 'सुबह 10:00 - रात 9:00',
    bestTime: 'अक्टूबर से मार्च'
  };

  if (loading) {
    return <LoadingSpinner message="Pink City Bazaars लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              {/* Market Badge */}
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-pink-200'>
                <span className='text-2xl'>🏰</span>
                <span className='text-pink-800 font-bold'>ऐतिहासिक बाजार</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent mb-4 leading-tight'>
                {marketInfo.nameHindi}
              </h1>
              <h2 className='text-2xl md:text-3xl text-emerald-700 font-semibold mb-6'>
                Pink City Bazaars, {marketInfo.cityHindi}
              </h2>
              
              <p className='text-xl text-emerald-600 max-w-4xl mx-auto leading-relaxed mb-8'>
                जयपुर अपने जीवंत बाजारों के लिए प्रसिद्ध है जो ऐतिहासिक गुलाबी शहर में स्थित हैं। 
                प्रमुख बाजारों में जोहरी बाजार (आभूषणों के लिए प्रसिद्ध), बापू बाजार (कपड़े और हस्तशिल्प के लिए प्रसिद्ध), 
                और चांदपोल बाजार (संगमरमर की मूर्तियों और पारंपरिक राजस्थानी कलाकृतियों के लिए प्रसिद्ध) शामिल हैं।
              </p>

              {/* Market Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12'>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-200'>
                  <div className='text-2xl font-bold text-pink-600'>{marketInfo.established}</div>
                  <div className='text-pink-600 text-sm font-medium'>स्थापना वर्ष</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-200'>
                  <div className='text-2xl font-bold text-pink-600'>{marketInfo.totalShops}+</div>
                  <div className='text-pink-600 text-sm font-medium'>कुल दुकानें</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-200'>
                  <div className='text-2xl font-bold text-pink-600'>{marketInfo.totalVendors}+</div>
                  <div className='text-pink-600 text-sm font-medium'>विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-200'>
                  <div className='text-2xl font-bold text-pink-600'>4.8⭐</div>
                  <div className='text-pink-600 text-sm font-medium'>औसत रेटिंग</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className='max-w-7xl mx-auto px-6 mb-16'>
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
            <h3 className='text-2xl font-bold text-emerald-800 mb-6 text-center'>बाजार का नक्शा</h3>
            <div className='relative flex justify-center'>
              <img 
                src={map} 
                alt='Pink City Bazaar Map' 
                className='rounded-2xl w-full max-w-4xl shadow-lg hover:scale-105 transition-transform duration-500' 
              />
              <div className='absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium'>
                🗺️ इंटरेक्टिव मैप
              </div>
            </div>
            <div className='mt-6 text-center'>
              <p className='text-emerald-600 text-lg'>
                📍 समय: {marketInfo.openingHours} | 🌟 घूमने का सबसे अच्छा समय: {marketInfo.bestTime}
              </p>
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          <div className='text-center mb-12'>
            <h3 className='text-3xl md:text-4xl font-bold text-emerald-800 mb-4'>प्रमुख दुकानें</h3>
            <p className='text-xl text-emerald-600'>हमारे चुनिंदा और प्रतिष्ठित व्यापारियों से मिलें</p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {shops.map((shop, index) => (
              <div
                key={shop.id}
                className='group'
                onMouseEnter={() => setHoveredShop(shop.id)}
                onMouseLeave={() => setHoveredShop(null)}
              >
                <div className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  hoveredShop === shop.id ? 'scale-[1.02]' : ''
                }`}>
                  
                  {/* Header Section */}
                  <div className='bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white relative overflow-hidden'>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className='relative z-10'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h2 className='text-2xl font-bold mb-1'>{shop.name}</h2>
                          <p className='text-pink-100 text-lg'>{shop.nameEn}</p>
                        </div>
                        <div className='bg-white/20 backdrop-blur-sm rounded-full px-3 py-1'>
                          <span className='text-sm font-medium'>{shop.badge}</span>
                        </div>
                      </div>
                      
                      <div className='flex items-center space-x-4 text-pink-100'>
                        <div className='flex items-center space-x-1'>
                          <span>⭐</span>
                          <span className='font-medium'>{shop.rating}</span>
                          <span className='text-sm'>({shop.reviews} समीक्षाएं)</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <span>📅</span>
                          <span className='text-sm'>स्थापना {shop.established}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className='p-8'>
                    <p className='text-gray-600 leading-relaxed mb-6 text-lg'>
                      {shop.specialty}
                    </p>

                    {/* Shop Details */}
                    <div className='grid grid-cols-2 gap-4 mb-6'>
                      <div className='bg-emerald-50 rounded-xl p-4 border border-emerald-200'>
                        <div className='text-emerald-600 text-sm font-medium mb-1'>दुकान मालिक</div>
                        <div className='text-emerald-800 font-semibold'>{shop.owner}</div>
                        <div className='text-emerald-600 text-sm'>{shop.experience} का अनुभव</div>
                      </div>
                      <div className='bg-pink-50 rounded-xl p-4 border border-pink-200'>
                        <div className='text-pink-600 text-sm font-medium mb-1'>उत्पाद श्रृंखला</div>
                        <div className='text-pink-800 font-semibold'>{shop.products}+ आइटम्स</div>
                        <div className='text-pink-600 text-sm'>प्रामाणिक वस्तुएं</div>
                      </div>
                    </div>

                    {/* Specialty Items */}
                    <div className='mb-6'>
                      <h4 className='text-sm font-semibold text-gray-700 mb-3'>विशेष वस्तुएं:</h4>
                      <div className='flex flex-wrap gap-2'>
                        {shop.specialty_items.map((item, idx) => (
                          <span key={idx} className='bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm border border-orange-200'>
                            ✨ {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <a 
                      href={shop.href} 
                      className={`block w-full text-center py-4 rounded-xl font-semibold transition-all duration-300 ${
                        hoveredShop === shop.id 
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg transform scale-105' 
                          : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg'
                      }`}
                    >
                      दुकान में जाएं
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Specialties */}
          <div className='mt-20 bg-gradient-to-r from-pink-600 to-rose-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>Pink City की विशेषताएं</h3>
              <p className='text-xl text-pink-100'>जयपुर की समृद्ध सांस्कृतिक विरासत का अनुभव करें</p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              {marketInfo.specialties.map((specialty, index) => (
                <div key={index} className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                  <div className='text-3xl mb-3'>
                    {index === 0 && '💎'}
                    {index === 1 && '🎨'}
                    {index === 2 && '🧵'}
                    {index === 3 && '🏺'}
                  </div>
                  <h4 className='text-lg font-semibold'>{specialty}</h4>
                </div>
              ))}
            </div>
            
            <div className='text-center mt-8'>
              <button className='bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-pink-50 transition-colors duration-300 transform hover:scale-105'>
                सभी श्रेणियां देखें
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default PinkCity;