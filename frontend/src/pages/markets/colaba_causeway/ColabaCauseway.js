import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ShopCard from '../../../components/ShopCard';
import '../../../App.css';

import map from '../../../images/carousel/5.png';

const ColabaCauseway = () => {
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shops = [
    {
      id: 'fashion-street-boutique',
      name: 'मुंबई फैशन स्ट्रीट',
      nameEn: 'Mumbai Fashion Street',
      specialty: 'ट्रेंडी कपड़े, एक्सेसरीज़ और बॉलीवुड स्टाइल फैशन का अनूठा संग्रह',
      specialtyEn: 'Trendy clothes, accessories and unique Bollywood style fashion collection',
      rating: 4.6,
      reviews: 892,
      established: '1980',
      products: 650,
      owner: 'श्री राजेश जैन',
      experience: '25 साल',
      category: 'fashion',
      specialty_items: ['बॉलीवुड ड्रेसेस', 'डिज़ाइनर कुर्ते', 'वेस्टर्न वियर', 'पार्टी आउटफिट्स', 'एक्सेसरीज़'],
      href: '/markets/colaba_causeway/fashion-street-boutique',
      image: '/images/shops/fashion-street.jpg',
      badge: '👗 ट्रेंडी फैशन',
      timings: 'सुबह 10:00 - रात 11:00',
      languages: ['हिंदी', 'अंग्रेजी', 'मराठी', 'गुजराती'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: false,
      certifications: ['Fashion Design Council Member']
    },
    {
      id: 'antique-collectors',
      name: 'कॉलाबा एंटीक्स',
      nameEn: 'Colaba Antiques',
      specialty: 'दुर्लभ प्राचीन वस्तुएं, विंटेज सामान और कलेक्टिबल आइटम्स',
      specialtyEn: 'Rare antiques, vintage items and collectible pieces',
      rating: 4.8,
      reviews: 234,
      established: '1965',
      products: 480,
      owner: 'श्री फ़रीद अली',
      experience: '40 साल',
      category: 'antiques',
      specialty_items: ['विंटेज घड़ियां', 'प्राचीन सिक्के', 'कलाकृतियां', 'पुराने कैमरे', 'एंटीक फर्नीचर'],
      href: '/markets/colaba_causeway/antique-collectors',
      image: '/images/shops/antiques.jpg',
      badge: '🏺 दुर्लभ संग्रह',
      timings: 'सुबह 11:00 - रात 8:00',
      languages: ['हिंदी', 'अंग्रेजी', 'उर्दू'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'चेक'],
      delivery_available: false,
      wholesale_available: false,
      certifications: ['Antique Dealers Association']
    },
    {
      id: 'street-food-corner',
      name: 'कॉलाबा चाट कार्नर',
      nameEn: 'Colaba Chaat Corner',
      specialty: 'प्रसिद्ध मुंबई स्ट्रीट फूड, चाट और स्नैक्स का लाजवाब स्वाद',
      specialtyEn: 'Famous Mumbai street food, chaat and delicious snacks',
      rating: 4.7,
      reviews: 1245,
      established: '1975',
      products: 75,
      owner: 'श्री अशोक शर्मा',
      experience: '30 साल',
      category: 'food',
      specialty_items: ['पाव भाजी', 'भेल पुरी', 'सेव पुरी', 'वड़ा पाव', 'दही पुरी'],
      href: '/markets/colaba_causeway/street-food-corner',
      image: '/images/shops/street-food.jpg',
      badge: '🍛 मुंबई का स्वाद',
      timings: 'सुबह 8:00 - रात 12:00',
      languages: ['हिंदी', 'मराठी', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI'],
      delivery_available: true,
      wholesale_available: false,
      certifications: ['FSSAI Certified', 'Hygiene Rated']
    },
    {
      id: 'jewelry-bazaar',
      name: 'मुंबई ज्वेलरी बाज़ार',
      nameEn: 'Mumbai Jewelry Bazaar',
      specialty: 'इमिटेशन ज्वेलरी, फैशन एक्सेसरीज़ और ट्रेंडी आभूषण',
      specialtyEn: 'Imitation jewelry, fashion accessories and trendy ornaments',
      rating: 4.5,
      reviews: 567,
      established: '1985',
      products: 890,
      owner: 'श्रीमती प्रिया मेहता',
      experience: '20 साल',
      category: 'jewelry',
      specialty_items: ['इमिटेशन नेकलेस', 'फैशन ईयरिंग्स', 'ब्रेसलेट्स', 'हेयर एक्सेसरीज़', 'रिंग्स'],
      href: '/markets/colaba_causeway/jewelry-bazaar',
      image: '/images/shops/jewelry-bazaar.jpg',
      badge: '💎 फैशन ज्वेलरी',
      timings: 'सुबह 10:30 - रात 10:00',
      languages: ['हिंदी', 'अंग्रेजी', 'गुजराती'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Fashion Jewelry Association']
    },
    {
      id: 'book-cafe',
      name: 'कॉलाबा बुक कैफे',
      nameEn: 'Colaba Book Cafe',
      specialty: 'किताबों का विशाल संग्रह, कॉफी और शांत पढ़ने का माहौल',
      specialtyEn: 'Vast book collection, coffee and peaceful reading environment',
      rating: 4.9,
      reviews: 378,
      established: '1990',
      products: 520,
      owner: 'श्री अनिल वर्मा',
      experience: '35 साल',
      category: 'books',
      specialty_items: ['उपन्यास', 'कविता संग्रह', 'इतिहास की किताबें', 'फिल्म पत्रिकाएं', 'कॉमिक्स'],
      href: '/markets/colaba_causeway/book-cafe',
      image: '/images/shops/book-cafe.jpg',
      badge: '📚 बुक लवर्स',
      timings: 'सुबह 9:00 - रात 11:00',
      languages: ['हिंदी', 'अंग्रेजी', 'मराठी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: false,
      wholesale_available: false,
      certifications: ['Bestseller Partner', 'Literary Society Member']
    },
    {
      id: 'tourist-souvenirs',
      name: 'गेटवे ऑफ इंडिया गिफ्ट्स',
      nameEn: 'Gateway of India Gifts',
      specialty: 'मुंबई और भारत की यादगार, सुवेनिर्स और टूरिस्ट गिफ्ट्स',
      specialtyEn: 'Mumbai and India memorabilia, souvenirs and tourist gifts',
      rating: 4.4,
      reviews: 689,
      established: '1995',
      products: 340,
      owner: 'श्री सुनील कुमार',
      experience: '18 साल',
      category: 'souvenirs',
      specialty_items: ['गेटवे ऑफ इंडिया मॉडल', 'मुंबई टी-शर्ट्स', 'इंडियन हैंडीक्राफ्ट्स', 'की चेन्स', 'पोस्टकार्ड्स'],
      href: '/markets/colaba_causeway/tourist-souvenirs',
      image: '/images/shops/souvenirs.jpg',
      badge: '🗽 मुंबई यादें',
      timings: 'सुबह 8:00 - रात 10:00',
      languages: ['हिंदी', 'अंग्रेजी', 'मराठी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Tourism Board Approved']
    }
  ];

  const marketInfo = {
    name: 'Colaba Causeway',
    nameHindi: 'कॉलाबा कॉज़वे',
    city: 'Mumbai',
    cityHindi: 'मुंबई',
    established: '1860',
    totalShops: 800,
    totalVendors: 120,
    specialties: ['फैशन', 'एंटीक्स', 'स्ट्रीट फूड', 'ज्वेलरी', 'किताबें', 'सुवेनिर्स'],
    openingHours: 'सुबह 9:00 - रात 11:00',
    bestTime: 'नवंबर से फरवरी',
    nearbyAttractions: ['गेटवे ऑफ इंडिया', 'ताज होटल', 'रीगल सिनेमा', 'अफगान चर्च'],
    transport: ['मेट्रो: चर्चगेट', 'BEST बस', 'टैक्सी', 'कैब'],
    parkingAvailable: false,
    history: 'गेटवे ऑफ इंडिया के पास स्थित यह बाजार मुंबई का प्रसिद्ध शॉपिंग डेस्टिनेशन है।'
  };

  const categories = [
    { id: 'all', name: 'सभी दुकानें', icon: '🏪', count: shops.length },
    { id: 'fashion', name: 'फैशन', icon: '👗', count: shops.filter(s => s.category === 'fashion').length },
    { id: 'antiques', name: 'एंटीक्स', icon: '🏺', count: shops.filter(s => s.category === 'antiques').length },
    { id: 'food', name: 'फूड', icon: '🍛', count: shops.filter(s => s.category === 'food').length },
    { id: 'jewelry', name: 'ज्वेलरी', icon: '💎', count: shops.filter(s => s.category === 'jewelry').length },
    { id: 'books', name: 'किताबें', icon: '📚', count: shops.filter(s => s.category === 'books').length },
    { id: 'souvenirs', name: 'सुवेनिर्स', icon: '🗽', count: shops.filter(s => s.category === 'souvenirs').length }
  ];

  const filteredShops = activeFilter === 'all' 
    ? shops 
    : shops.filter(shop => shop.category === activeFilter);

  if (loading) {
    return <LoadingSpinner message="Colaba Causeway लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Mumbai Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float">🗽</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-float delay-1000">👗</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float delay-2000">🍛</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-float delay-3000">📚</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              {/* Mumbai Spirit Badge */}
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-blue-200'>
                <span className='text-2xl'>🌊</span>
                <span className='text-blue-800 font-bold'>मुंबई की आत्मा</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight'>
                {marketInfo.nameHindi}
              </h1>
              <h2 className='text-2xl md:text-3xl text-emerald-700 font-semibold mb-6'>
                Colaba Causeway, {marketInfo.cityHindi}
              </h2>
              
              <p className='text-xl text-emerald-600 max-w-4xl mx-auto leading-relaxed mb-8'>
                गेटवे ऑफ इंडिया के बगल में स्थित यह बाजार मुंबई का दिल है। यहाँ आपको फैशन से लेकर एंटीक्स तक, 
                स्ट्रीट फूड से लेकर हैंडीक्राफ्ट्स तक सब कुछ मिलेगा। मुंबई की स्पिरिट को जानना है तो कॉलाबा कॉज़वे आना ज़रूरी है। 
                यहाँ की हर गली में कुछ नया और दिलचस्प छुपा हुआ है।
              </p>

              {/* Market Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12'>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200'>
                  <div className='text-2xl font-bold text-blue-600'>{marketInfo.established}</div>
                  <div className='text-blue-600 text-sm font-medium'>स्थापना</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200'>
                  <div className='text-2xl font-bold text-blue-600'>{marketInfo.totalShops.toLocaleString()}+</div>
                  <div className='text-blue-600 text-sm font-medium'>कुल दुकानें</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200'>
                  <div className='text-2xl font-bold text-blue-600'>{marketInfo.totalVendors}+</div>
                  <div className='text-blue-600 text-sm font-medium'>विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200'>
                  <div className='text-2xl font-bold text-blue-600'>165</div>
                  <div className='text-blue-600 text-sm font-medium'>साल पुराना</div>
                </div>
              </div>

              {/* Special Features */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200'>
                  <div className='text-3xl mb-3'>👗</div>
                  <h3 className='font-bold text-blue-800 mb-2'>फैशन हब</h3>
                  <p className='text-blue-600 text-sm'>ट्रेंडी कपड़े और एक्सेसरीज़</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200'>
                  <div className='text-3xl mb-3'>🍛</div>
                  <h3 className='font-bold text-blue-800 mb-2'>स्ट्रीट फूड</h3>
                  <p className='text-blue-600 text-sm'>मुंबई का असली स्वाद</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200'>
                  <div className='text-3xl mb-3'>🏺</div>
                  <h3 className='font-bold text-blue-800 mb-2'>एंटीक्स</h3>
                  <p className='text-blue-600 text-sm'>दुर्लभ पुरानी वस्तुएं</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gateway of India Connection */}
        <div className='max-w-7xl mx-auto px-6 mb-16'>
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>गेटवे ऑफ इंडिया से जुड़ाव</h3>
              <p className='text-xl text-blue-100 max-w-3xl mx-auto'>
                भारत के प्रवेश द्वार से सिर्फ 200 मीटर की दूरी पर स्थित यह बाजार मुंबई का गौरव है
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🗽</div>
                <h4 className='text-lg font-semibold mb-2'>गेटवे व्यू</h4>
                <p className='text-blue-100 text-sm'>200 मीटर की दूरी</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🚢</div>
                <h4 className='text-lg font-semibold mb-2'>हार्बर व्यू</h4>
                <p className='text-blue-100 text-sm'>अरब सागर का नज़ारा</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🏨</div>
                <h4 className='text-lg font-semibold mb-2'>ताज होटल</h4>
                <p className='text-blue-100 text-sm'>विश्व प्रसिद्ध होटल</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🎬</div>
                <h4 className='text-lg font-semibold mb-2'>फिल्म लोकेशन</h4>
                <p className='text-blue-100 text-sm'>बॉलीवुड की पसंद</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className='max-w-7xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            <h3 className='text-xl font-bold text-emerald-800 mb-4 text-center'>दुकान श्रेणियां</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3'>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-xl transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                      : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <span className='text-2xl'>{category.icon}</span>
                  <span className='font-medium text-sm text-center leading-tight'>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeFilter === category.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shops Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          <div className='text-center mb-12'>
            <h3 className='text-3xl md:text-4xl font-bold text-emerald-800 mb-4'>प्रमुख दुकानें</h3>
            <p className='text-xl text-emerald-600'>
              {activeFilter === 'all' 
                ? 'कॉलाबा कॉज़वे की सभी प्रसिद्ध दुकानें' 
                : `${categories.find(c => c.id === activeFilter)?.name} की दुकानें`
              }
            </p>
          </div>

          {filteredShops.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {filteredShops.map((shop, index) => (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  index={index}
                  isHovered={hoveredShop === shop.id}
                  onHover={setHoveredShop}
                  marketTheme="colaba"
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-2xl font-bold text-emerald-800 mb-2'>कोई दुकान नहीं मिली</h3>
              <p className='text-emerald-600'>इस श्रेणी में कोई दुकान उपलब्ध नहीं है</p>
            </div>
          )}

          {/* Mumbai Spirit Section */}
          <div className='mt-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>मुंबई की स्पिरिट</h3>
              <p className='text-xl text-orange-100 max-w-3xl mx-auto'>
                कॉलाबा कॉज़वे सिर्फ एक बाज़ार नहीं, यह मुंबई की आत्मा है - जहाँ सपने मिलते हैं और यादें बनती हैं
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🎭</div>
                <h4 className='text-lg font-semibold mb-2'>कल्चरल हब</h4>
                <p className='text-orange-100 text-sm'>कला, संस्कृति और विविधता का केंद्र</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>💝</div>
                <h4 className='text-lg font-semibold mb-2'>शॉपिंग पैराडाइज़</h4>
                <p className='text-orange-100 text-sm'>हर बजट में कुछ न कुछ खास</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🌟</div>
                <h4 className='text-lg font-semibold mb-2'>टूरिस्ट फेवरेट</h4>
                <p className='text-orange-100 text-sm'>दुनिया भर के सैलानियों की पसंद</p>
              </div>
            </div>
            
            <div className='text-center mt-8'>
              <button className='bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-300 transform hover:scale-105'>
                मुंबई एक्सप्लोर करें
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(3deg); }
          66% { transform: translateY(8px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </React.StrictMode>
  );
};

export default ColabaCauseway;