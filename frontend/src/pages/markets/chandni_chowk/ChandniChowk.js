import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ShopCard from '../../../components/ShopCard';
import '../../../App.css';

import map from '../../../images/markets/chandni_map.jpeg';

const ChandniChowk = () => {
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
      id: 'spice-market',
      name: 'खादी राम मसाला भंडार',
      nameEn: 'Khari Ram Spice Emporium',
      specialty: 'प्रामाणिक भारतीय मसाले, हर्बल चाय और आयुर्वेदिक सामग्री',
      specialtyEn: 'Authentic Indian spices, herbal teas and Ayurvedic ingredients',
      rating: 4.9,
      reviews: 487,
      established: '1923',
      products: 280,
      owner: 'श्री रामेश्वर गुप्ता',
      experience: '35 साल',
      category: 'spices',
      specialty_items: ['गरम मसाला', 'केसर', 'इलायची', 'दालचीनी', 'काली मिर्च'],
      href: '/markets/chandni_chowk/spice-market',
      image: '/images/shops/spice-market.jpg',
      badge: '🌶️ मसाला राजा',
      timings: 'सुबह 8:00 - रात 8:00',
      languages: ['हिंदी', 'अंग्रेजी', 'उर्दू'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true
    },
    {
      id: 'silver-jewelry',
      name: 'पुराना क्विल्ला ज्वेलर्स',
      nameEn: 'Purana Qila Jewellers',
      specialty: 'हस्तनिर्मित चांदी के गहने, पारंपरिक डिज़ाइन और कुंदन का काम',
      specialtyEn: 'Handcrafted silver jewelry, traditional designs and Kundan work',
      rating: 4.8,
      reviews: 342,
      established: '1947',
      products: 450,
      owner: 'श्री मुकेश सोनी',
      experience: '42 साल',
      category: 'jewelry',
      specialty_items: ['चांदी के हार', 'कुंदन झुमके', 'पायल', 'कड़े', 'अंगूठियां'],
      href: '/markets/chandni_chowk/silver-jewelry',
      image: '/images/shops/silver-jewelry.jpg',
      badge: '💎 HallMark प्रमाणित',
      timings: 'सुबह 10:00 - रात 8:30',
      languages: ['हिंदी', 'अंग्रेजी', 'पंजाबी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'चेक'],
      delivery_available: true,
      wholesale_available: false
    },
    {
      id: 'textile-hub',
      name: 'बनारसी साड़ी पैलेस',
      nameEn: 'Banarasi Saree Palace',
      specialty: 'बनारसी साड़ी, सिल्क फैब्रिक और पारंपरिक भारतीय वस्त्र',
      specialtyEn: 'Banarasi sarees, silk fabrics and traditional Indian textiles',
      rating: 4.7,
      reviews: 298,
      established: '1965',
      products: 320,
      owner: 'श्री विजय कुमार अग्रवाल',
      experience: '38 साल',
      category: 'textiles',
      specialty_items: ['बनारसी साड़ी', 'सिल्क दुपट्टा', 'कांजीवरम साड़ी', 'लहंगा', 'शॉल'],
      href: '/markets/chandni_chowk/textile-hub',
      image: '/images/shops/textile-hub.jpg',
      badge: '🧵 प्योर सिल्क',
      timings: 'सुबह 10:00 - रात 9:00',
      languages: ['हिंदी', 'अंग्रेजी', 'बंगाली'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true
    },
    {
      id: 'traditional-sweets',
      name: 'घंटेवाला हलवाई',
      nameEn: 'Ghantewala Halwai',
      specialty: 'पारंपरिक भारतीय मिठाइयां, नमकीन और त्योहारी व्यंजन',
      specialtyEn: 'Traditional Indian sweets, savories and festival delicacies',
      rating: 4.9,
      reviews: 612,
      established: '1790',
      products: 85,
      owner: 'श्री संजय गोयल',
      experience: '45 साल',
      category: 'food',
      specialty_items: ['सोहन हलवा', 'गाजर हलवा', 'रबड़ी', 'जलेबी', 'समोसा'],
      href: '/markets/chandni_chowk/traditional-sweets',
      image: '/images/shops/sweets.jpg',
      badge: '🍯 230+ साल पुराना',
      timings: 'सुबह 7:00 - रात 10:00',
      languages: ['हिंदी', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI'],
      delivery_available: true,
      wholesale_available: true
    },
    {
      id: 'books-stationery',
      name: 'गीता प्रेस बुक डिपो',
      nameEn: 'Gita Press Book Depot',
      specialty: 'धार्मिक पुस्तकें, उर्दू साहित्य और पारंपरिक लेखन सामग्री',
      specialtyEn: 'Religious books, Urdu literature and traditional writing materials',
      rating: 4.6,
      reviews: 189,
      established: '1955',
      products: 520,
      owner: 'श्री आनंद प्रकाश शर्मा',
      experience: '40 साल',
      category: 'books',
      specialty_items: ['गीता', 'रामायण', 'उर्दू शायरी', 'हस्तलिखित कॉपी', 'कलम'],
      href: '/markets/chandni_chowk/books-stationery',
      image: '/images/shops/books.jpg',
      badge: '📚 दुर्लभ संग्रह',
      timings: 'सुबह 9:00 - रात 8:00',
      languages: ['हिंदी', 'उर्दू', 'संस्कृत', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI'],
      delivery_available: false,
      wholesale_available: true
    },
    {
      id: 'electronics-gadgets',
      name: 'गफ्फार मार्केट इलेक्ट्रॉनिक्स',
      nameEn: 'Gaffar Market Electronics',
      specialty: 'इलेक्ट्रॉनिक सामान, मोबाइल एक्सेसरीज और तकनीकी उपकरण',
      specialtyEn: 'Electronic goods, mobile accessories and technical equipment',
      rating: 4.4,
      reviews: 234,
      established: '1980',
      products: 680,
      owner: 'श्री मोहम्मद अली',
      experience: '30 साल',
      category: 'electronics',
      specialty_items: ['मोबाइल केस', 'चार्जर', 'हेडफोन', 'स्पीकर', 'पावर बैंक'],
      href: '/markets/chandni_chowk/electronics-gadgets',
      image: '/images/shops/electronics.jpg',
      badge: '📱 लेटेस्ट टेक',
      timings: 'सुबह 10:00 - रात 9:00',
      languages: ['हिंदी', 'अंग्रेजी', 'उर्दू'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'EMI'],
      delivery_available: true,
      wholesale_available: true
    }
  ];

  const marketInfo = {
    name: 'Chandni Chowk',
    nameHindi: 'चांदनी चौक',
    city: 'Delhi',
    cityHindi: 'नई दिल्ली',
    established: '1650',
    totalShops: 9000,
    totalVendors: 350,
    specialties: ['मसाले', 'चांदी के आभूषण', 'कपड़े', 'मिठाइयां', 'पुस्तकें', 'इलेक्ट्रॉनिक्स'],
    openingHours: 'सुबह 8:00 - रात 9:00',
    bestTime: 'अक्टूबर से मार्च',
    nearbyAttractions: ['लाल किला', 'जामा मस्जिद', 'राज घाट', 'इंडिया गेट'],
    transport: ['मेट्रो: चांदनी चौक', 'बस स्टैंड', 'रिक्शा', 'ऑटो'],
    parkingAvailable: true
  };

  const categories = [
    { id: 'all', name: 'सभी दुकानें', icon: '🏪', count: shops.length },
    { id: 'spices', name: 'मसाले', icon: '🌶️', count: shops.filter(s => s.category === 'spices').length },
    { id: 'jewelry', name: 'आभूषण', icon: '💎', count: shops.filter(s => s.category === 'jewelry').length },
    { id: 'textiles', name: 'कपड़े', icon: '🧵', count: shops.filter(s => s.category === 'textiles').length },
    { id: 'food', name: 'खाना', icon: '🍯', count: shops.filter(s => s.category === 'food').length },
    { id: 'books', name: 'पुस्तकें', icon: '📚', count: shops.filter(s => s.category === 'books').length },
    { id: 'electronics', name: 'इलेक्ट्रॉनिक्स', icon: '📱', count: shops.filter(s => s.category === 'electronics').length }
  ];

  const filteredShops = activeFilter === 'all' 
    ? shops 
    : shops.filter(shop => shop.category === activeFilter);

  if (loading) {
    return <LoadingSpinner message="Chandni Chowk लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Historical Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float">🏛️</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-float delay-1000">🌶️</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float delay-2000">💎</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-float delay-3000">🕌</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              {/* Historical Badge */}
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-amber-200'>
                <span className='text-2xl'>🏛️</span>
                <span className='text-amber-800 font-bold'>मुगल काल से</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-500 to-red-700 bg-clip-text text-transparent mb-4 leading-tight'>
                {marketInfo.nameHindi}
              </h1>
              <h2 className='text-2xl md:text-3xl text-emerald-700 font-semibold mb-6'>
                Chandni Chowk, {marketInfo.cityHindi}
              </h2>
              
              <p className='text-xl text-emerald-600 max-w-4xl mx-auto leading-relaxed mb-8'>
                भारत के सबसे पुराने और व्यस्त बाजारों में से एक, इसकी संकरी गलियों और भीड़भाड़ के माहौल की खोज करें। 
                मुगल सम्राट शाहजहाँ द्वारा बसाया गया यह बाजार आज भी अपनी पुरानी रौनक बनाए हुए है। 
                यहाँ आपको मसालों की सुगंध, चांदी के गहनों की चमक और पारंपरिक मिठाइयों का स्वाद मिलेगा।
              </p>

              {/* Market Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12'>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200'>
                  <div className='text-2xl font-bold text-red-600'>{marketInfo.established}</div>
                  <div className='text-red-600 text-sm font-medium'>स्थापना</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200'>
                  <div className='text-2xl font-bold text-red-600'>{marketInfo.totalShops.toLocaleString()}+</div>
                  <div className='text-red-600 text-sm font-medium'>कुल दुकानें</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200'>
                  <div className='text-2xl font-bold text-red-600'>{marketInfo.totalVendors}+</div>
                  <div className='text-red-600 text-sm font-medium'>विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200'>
                  <div className='text-2xl font-bold text-red-600'>375</div>
                  <div className='text-red-600 text-sm font-medium'>साल पुराना</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className='max-w-7xl mx-auto px-6 mb-16'>
          <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-lg'>
            <h3 className='text-2xl font-bold text-emerald-800 mb-6 text-center flex items-center justify-center space-x-3'>
              <span>🗺️</span>
              <span>चांदनी चौक का नक्शा</span>
            </h3>
            <div className='relative flex justify-center'>
              <img 
                src={map} 
                alt='Chandni Chowk Map' 
                className='rounded-2xl w-full max-w-4xl shadow-lg hover:scale-105 transition-transform duration-500' 
              />
              <div className='absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium'>
                🚇 मेट्रो: चांदनी चौक
              </div>
            </div>
            
            {/* Market Info */}
            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='text-center bg-emerald-50 rounded-xl p-4 border border-emerald-200'>
                <h4 className='font-semibold text-emerald-800 mb-2'>⏰ समय</h4>
                <p className='text-emerald-700'>{marketInfo.openingHours}</p>
                <p className='text-emerald-600 text-sm mt-1'>सोमवार से रविवार</p>
              </div>
              <div className='text-center bg-emerald-50 rounded-xl p-4 border border-emerald-200'>
                <h4 className='font-semibold text-emerald-800 mb-2'>🌤️ बेस्ट टाइम</h4>
                <p className='text-emerald-700'>{marketInfo.bestTime}</p>
                <p className='text-emerald-600 text-sm mt-1'>ठंडा मौसम</p>
              </div>
              <div className='text-center bg-emerald-50 rounded-xl p-4 border border-emerald-200'>
                <h4 className='font-semibold text-emerald-800 mb-2'>🅿️ पार्किंग</h4>
                <p className='text-emerald-700'>उपलब्ध</p>
                <p className='text-emerald-600 text-sm mt-1'>मेट्रो पार्किंग</p>
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
                      ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg scale-105'
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
                ? 'चांदनी चौक की सभी प्रसिद्ध दुकानें' 
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
                  marketTheme="chandni"
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

          {/* Historical Information */}
          <div className='mt-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>चांदनी चौक का इतिहास</h3>
              <p className='text-xl text-red-100 max-w-3xl mx-auto'>
                मुगल सम्राट शाहजहाँ की बेटी जहांआरा बेगम द्वारा डिज़ाइन किया गया यह बाजार
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🏛️</div>
                <h4 className='text-lg font-semibold mb-2'>मुगल विरासत</h4>
                <p className='text-red-100 text-sm'>375 साल का समृद्ध इतिहास</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🕌</div>
                <h4 className='text-lg font-semibold mb-2'>लाल किला</h4>
                <p className='text-red-100 text-sm'>500 मीटर की दूरी पर</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🚇</div>
                <h4 className='text-lg font-semibold mb-2'>मेट्रो कनेक्टिविटी</h4>
                <p className='text-red-100 text-sm'>रेड लाइन और यलो लाइन</p>
              </div>
            </div>
            
            <div className='text-center mt-8'>
              <button className='bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300 transform hover:scale-105'>
                और जानें
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

export default ChandniChowk;