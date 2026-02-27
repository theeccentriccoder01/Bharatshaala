import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ShopCard from '../../../components/ShopCard';
import '../../../App.css';

const DevarajaMarket = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shops = [
    {
      id: 'sandalwood-palace',
      name: 'मैसूर संदालवुड पैलेस',
      nameEn: 'Mysore Sandalwood Palace',
      specialty: 'शुद्ध मैसूर चंदन की लकड़ी, चंदन का तेल और पारंपरिक अगरबत्ती का संग्रह',
      specialtyEn: 'Pure Mysore sandalwood, sandalwood oil and traditional incense collection',
      rating: 4.9,
      reviews: 678,
      established: '1912',
      products: 150,
      owner: 'श्री रामस्वामी अय्यर',
      experience: '40 साल',
      category: 'sandalwood',
      specialty_items: ['चंदन की लकड़ी', 'चंदन का तेल', 'चंदन साबुन', 'अगरबत्ती', 'चंदन पाउडर'],
      href: '/markets/devaraja_market/sandalwood-palace',
      image: '/images/shops/sandalwood-palace.jpg',
      badge: '🌿 प्रमाणित चंदन',
      timings: 'सुबह 7:00 - रात 8:00',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी', 'तमिल'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['GI Tag Certified', 'Forest Department Approved']
    },
    {
      id: 'mysore-silk-emporium',
      name: 'मैसूर सिल्क एम्पोरियम',
      nameEn: 'Mysore Silk Emporium',
      specialty: 'प्रामाणिक मैसूर सिल्क साड़ी, पुरे सिल्क और पारंपरिक कन्नड़ वस्त्र',
      specialtyEn: 'Authentic Mysore silk sarees, pure silk and traditional Kannada garments',
      rating: 4.8,
      reviews: 543,
      established: '1924',
      products: 380,
      owner: 'श्रीमती पद्मा देवी',
      experience: '35 साल',
      category: 'silk',
      specialty_items: ['मैसूर सिल्क साड़ी', 'कांचीपुरम साड़ी', 'सिल्क ब्लाउज', 'धोती', 'पवाड़ा'],
      href: '/markets/devaraja_market/mysore-silk-emporium',
      image: '/images/shops/silk-emporium.jpg',
      badge: '🧵 हैंडलूम सर्टिफाइड',
      timings: 'सुबह 9:00 - रात 8:30',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'चेक'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Handloom Mark', 'Silk Mark Authority']
    },
    {
      id: 'flower-garland-shop',
      name: 'श्री चामुंडेश्वरी पुष्प भंडार',
      nameEn: 'Sri Chamundeshwari Flower Store',
      specialty: 'ताजे फूलों की माला, पूजा सामग्री और धार्मिक अनुष्ठान के लिए फूल',
      specialtyEn: 'Fresh flower garlands, pooja items and flowers for religious ceremonies',
      rating: 4.7,
      reviews: 289,
      established: '1945',
      products: 85,
      owner: 'श्री वेंकटेश',
      experience: '30 साल',
      category: 'flowers',
      specialty_items: ['जैस्मिन माला', 'गुलाब की पंखुड़ी', 'मारिगोल्ड', 'तुलसी माला', 'कमल के फूल'],
      href: '/markets/devaraja_market/flower-garland-shop',
      image: '/images/shops/flower-shop.jpg',
      badge: '🌸 ताजे फूल',
      timings: 'सुबह 5:00 - रात 10:00',
      languages: ['कन्नड़', 'हिंदी', 'तमिल'],
      payment_methods: ['नकद', 'UPI'],
      delivery_available: false,
      wholesale_available: true,
      certifications: ['Organic Flowers']
    },
    {
      id: 'spice-corner',
      name: 'कर्नाटक स्पाइस कॉर्नर',
      nameEn: 'Karnataka Spice Corner',
      specialty: 'दक्षिण भारतीय मसाले, कॉफी बीन्स और पारंपरिक मालाबार व्यंजन सामग्री',
      specialtyEn: 'South Indian spices, coffee beans and traditional Malabar cuisine ingredients',
      rating: 4.6,
      reviews: 234,
      established: '1958',
      products: 320,
      owner: 'श्री कृष्णा मूर्ति',
      experience: '28 साल',
      category: 'spices',
      specialty_items: ['कुर्ग कॉफी', 'काली मिर्च', 'इलायची', 'हल्दी', 'गरम मसाला'],
      href: '/markets/devaraja_market/spice-corner',
      image: '/images/shops/spice-corner.jpg',
      badge: '☕ कुर्ग कॉफी',
      timings: 'सुबह 8:00 - रात 8:00',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Spice Board Certified', 'Coffee Board Approved']
    },
    {
      id: 'mysore-pak-house',
      name: 'गुरु स्वीट मार्ट',
      nameEn: 'Guru Sweet Mart',
      specialty: 'प्रसिद्ध मैसूर पाक, पारंपरिक कर्नाटक मिठाइयां और त्योहारी व्यंजन',
      specialtyEn: 'Famous Mysore Pak, traditional Karnataka sweets and festival delicacies',
      rating: 4.8,
      reviews: 456,
      established: '1935',
      products: 95,
      owner: 'श्री गुरुमूर्ति',
      experience: '42 साल',
      category: 'sweets',
      specialty_items: ['मैसूर पाक', 'होलिगे', 'चिरोटी', 'हेसरू बेले', 'कारजिकै'],
      href: '/markets/devaraja_market/mysore-pak-house',
      image: '/images/shops/sweet-mart.jpg',
      badge: '🍯 मूल मैसूर पाक',
      timings: 'सुबह 7:00 - रात 9:00',
      languages: ['कन्नड़', 'हिंदी'],
      payment_methods: ['नकद', 'UPI'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['FSSAI Certified', 'Heritage Recipe']
    },
    {
      id: 'traditional-crafts',
      name: 'मैसूर हैंडीक्राफ्ट्स',
      nameEn: 'Mysore Handicrafts',
      specialty: 'चंदन की नक्काशी, रोसवुड फर्नीचर और पारंपरिक मैसूर पेंटिंग्स',
      specialtyEn: 'Sandalwood carvings, rosewood furniture and traditional Mysore paintings',
      rating: 4.5,
      reviews: 178,
      established: '1968',
      products: 240,
      owner: 'श्री राजेश वर्मा',
      experience: '25 साल',
      category: 'handicrafts',
      specialty_items: ['चंदन मूर्तियां', 'मैसूर पेंटिंग', 'रोसवुड आइटम्स', 'इनले वर्क', 'बांस के सामान'],
      href: '/markets/devaraja_market/traditional-crafts',
      image: '/images/shops/handicrafts.jpg',
      badge: '🎨 हस्तनिर्मित',
      timings: 'सुबह 10:00 - रात 8:00',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: false,
      certifications: ['Handicraft Development Board', 'Artisan Certified']
    }
  ];

  const marketInfo = {
    name: 'Devaraja Market',
    nameHindi: 'देवराज मार्केट',
    city: 'Mysore',
    cityHindi: 'मैसूर',
    established: '1886',
    totalShops: 1200,
    totalVendors: 95,
    specialties: ['चंदन', 'रेशम', 'फूल', 'मसाले', 'मैसूर पाक', 'हस्तशिल्प'],
    openingHours: 'सुबह 6:00 - रात 8:00',
    bestTime: 'अक्टूबर से मार्च',
    nearbyAttractions: ['मैसूर पैलेस', 'चामुंडी हिल्स', 'सेंट फिलोमिना चर्च', 'ललिता महल'],
    transport: ['सिटी बस', 'ऑटो रिक्शा', 'टैक्सी', 'प्राइवेट वाहन'],
    parkingAvailable: true,
    history: 'टीपू सुल्तान के समय से चला आ रहा यह बाजार मैसूर की सांस्कृतिक पहचान है।'
  };

  const categories = [
    { id: 'all', name: 'सभी दुकानें', icon: '🏪', count: shops.length },
    { id: 'sandalwood', name: 'चंदन', icon: '🌿', count: shops.filter(s => s.category === 'sandalwood').length },
    { id: 'silk', name: 'सिल्क', icon: '🧵', count: shops.filter(s => s.category === 'silk').length },
    { id: 'flowers', name: 'फूल', icon: '🌸', count: shops.filter(s => s.category === 'flowers').length },
    { id: 'spices', name: 'मसाले', icon: '🌶️', count: shops.filter(s => s.category === 'spices').length },
    { id: 'sweets', name: 'मिठाइयां', icon: '🍯', count: shops.filter(s => s.category === 'sweets').length },
    { id: 'handicrafts', name: 'हस्तशिल्प', icon: '🎨', count: shops.filter(s => s.category === 'handicrafts').length }
  ];

  const filteredShops = activeFilter === 'all' 
    ? shops 
    : shops.filter(shop => shop.category === activeFilter);

  if (loading) {
    return <LoadingSpinner message="Devaraja Market लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Royal Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-10 animate-float">👑</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-float delay-1000">🌿</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float delay-2000">🧵</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-float delay-3000">🌸</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              {/* Royal Heritage Badge */}
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-amber-200'>
                <span className='text-2xl'>👑</span>
                <span className='text-amber-800 font-bold'>शाही विरासत</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent mb-4 leading-tight'>
                {marketInfo.nameHindi}
              </h1>
              <h2 className='text-2xl md:text-3xl text-emerald-700 font-semibold mb-6'>
                Devaraja Market, {marketInfo.cityHindi}
              </h2>
              
              <p className='text-xl text-emerald-600 max-w-4xl mx-auto leading-relaxed mb-8'>
                यह रंग-बिरंगा बाजार एक पर्यटक आकर्षण भी है, जहाँ फूलों के गुच्छे, फल और विभिन्न रंगों का कुमकुम पाउडर मिलता है। 
                मैसूर के महाराजाओं के समय से चला आ रहा यह बाजार आज भी अपने मूल स्वरूप में जीवित है। 
                यहाँ आपको विश्व प्रसिद्ध मैसूर चंदन, सिल्क साड़ियां और पारंपरिक मैसूर पाक मिलेगा।
              </p>

              {/* Market Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12'>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200'>
                  <div className='text-2xl font-bold text-amber-600'>{marketInfo.established}</div>
                  <div className='text-amber-600 text-sm font-medium'>स्थापना</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200'>
                  <div className='text-2xl font-bold text-amber-600'>{marketInfo.totalShops.toLocaleString()}+</div>
                  <div className='text-amber-600 text-sm font-medium'>कुल दुकानें</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200'>
                  <div className='text-2xl font-bold text-amber-600'>{marketInfo.totalVendors}+</div>
                  <div className='text-amber-600 text-sm font-medium'>विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-200'>
                  <div className='text-2xl font-bold text-amber-600'>139</div>
                  <div className='text-amber-600 text-sm font-medium'>साल पुराना</div>
                </div>
              </div>

              {/* Special Features */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200'>
                  <div className='text-3xl mb-3'>🌿</div>
                  <h3 className='font-bold text-amber-800 mb-2'>मैसूर चंदन</h3>
                  <p className='text-amber-600 text-sm'>विश्व की सबसे अच्छी चंदन की लकड़ी</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200'>
                  <div className='text-3xl mb-3'>🧵</div>
                  <h3 className='font-bold text-amber-800 mb-2'>मैसूर सिल्क</h3>
                  <p className='text-amber-600 text-sm'>प्रामाणिक हैंडलूम सिल्क साड़ियां</p>
                </div>
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200'>
                  <div className='text-3xl mb-3'>🍯</div>
                  <h3 className='font-bold text-amber-800 mb-2'>मैसूर पाक</h3>
                  <p className='text-amber-600 text-sm'>मूल रेसिपी की मिठाई</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Palace Connection */}
        <div className='max-w-7xl mx-auto px-6 mb-16'>
          <div className='bg-gradient-to-r from-amber-600 to-yellow-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>मैसूर पैलेस कनेक्शन</h3>
              <p className='text-xl text-amber-100 max-w-3xl mx-auto'>
                मैसूर पैलेस से केवल 2 किमी दूर स्थित यह बाजार शाही परिवार की पसंदीदा खरीदारी का स्थान था
              </p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🏰</div>
                <h4 className='text-lg font-semibold mb-2'>शाही संरक्षण</h4>
                <p className='text-amber-100 text-sm'>महाराजाओं द्वारा संरक्षित</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🛒</div>
                <h4 className='text-lg font-semibold mb-2'>शाही आपूर्तिकर्ता</h4>
                <p className='text-amber-100 text-sm'>पैलेस के लिए सामान</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>🎨</div>
                <h4 className='text-lg font-semibold mb-2'>पारंपरिक कला</h4>
                <p className='text-amber-100 text-sm'>दरबारी शिल्पकारी</p>
              </div>
              <div className='text-center bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>📜</div>
                <h4 className='text-lg font-semibold mb-2'>ऐतिहासिक रिकॉर्ड</h4>
                <p className='text-amber-100 text-sm'>139 साल का इतिहास</p>
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
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg scale-105'
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
                ? 'देवराज मार्केट की सभी प्रसिद्ध दुकानें' 
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
                  marketTheme="devaraja"
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

export default DevarajaMarket;