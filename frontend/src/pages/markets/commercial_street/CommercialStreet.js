import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ShopCard from '../../../components/ShopCard';
import '../../../App.css';

const CommercialStreet = () => {
  const [loading, setLoading] = useState(true);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const shops = [
    {
      id: 'silk-weaving-house',
      name: 'बेंगलुरु सिल्क वीविंग हाउस',
      nameEn: 'Bangalore Silk Weaving House',
      specialty: 'हैंडलूम सिल्क साड़ी, कांचीपुरम साड़ी और साउथ इंडियन ट्रेडिशनल वेयर',
      specialtyEn: 'Handloom silk sarees, Kanchipuram sarees and South Indian traditional wear',
      rating: 4.8,
      reviews: 645,
      established: '1952',
      products: 420,
      owner: 'श्री नागराज अय्यर',
      experience: '35 साल',
      category: 'textiles',
      specialty_items: ['कांचीपुरम साड़ी', 'मैसूर सिल्क', 'हैंडलूम साड़ी', 'सिल्क ब्लाउज', 'धोती'],
      href: '/markets/commercial_street/silk-weaving-house',
      image: '/images/shops/silk-house.jpg',
      badge: '🧵 हैंडलूम सर्टिफाइड',
      timings: 'सुबह 10:00 - रात 9:00',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी', 'तमिल'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'EMI'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Silk Mark Authority', 'Handloom Development Board']
    },
    {
      id: 'modern-fashion-boutique',
      name: 'ट्रेंड सेटर्स बुटीक',
      nameEn: 'Trend Setters Boutique',
      specialty: 'मॉडर्न फैशन, डिज़ाइनर कपड़े और कॉन्टेम्परेरी एक्सेसरीज़',
      specialtyEn: 'Modern fashion, designer clothes and contemporary accessories',
      rating: 4.6,
      reviews: 423,
      established: '1985',
      products: 680,
      owner: 'श्रीमती प्रिया सिंह',
      experience: '28 साल',
      category: 'fashion',
      specialty_items: ['डिज़ाइनर कुर्ते', 'पार्टी वेयर', 'ऑफिस वेयर', 'जींस कलेक्शन', 'हैंडबैग्स'],
      href: '/markets/commercial_street/modern-fashion-boutique',
      image: '/images/shops/fashion-boutique.jpg',
      badge: '👗 ट्रेंडी कलेक्शन',
      timings: 'सुबह 10:30 - रात 9:30',
      languages: ['अंग्रेजी', 'हिंदी', 'कन्नड़'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'EMI'],
      delivery_available: true,
      wholesale_available: false,
      certifications: ['Fashion Design Council Member']
    },
    {
      id: 'traditional-jewelry',
      name: 'कर्नाटक ज्वेलर्स',
      nameEn: 'Karnataka Jewellers',
      specialty: 'दक्षिण भारतीय ज्वेलरी, टेम्पल ज्वेलरी और गोल्ड ऑर्नामेंट्स',
      specialtyEn: 'South Indian jewelry, temple jewelry and gold ornaments',
      rating: 4.9,
      reviews: 567,
      established: '1945',
      products: 350,
      owner: 'श्री रमेश चेट्टी',
      experience: '40 साल',
      category: 'jewelry',
      specialty_items: ['टेम्पल ज्वेलरी', 'गोल्ड नेकलेस', 'कुंदन सेट्स', 'डायमंड रिंग्स', 'सिल्वर आइटम्स'],
      href: '/markets/commercial_street/traditional-jewelry',
      image: '/images/shops/jewelry-store.jpg',
      badge: '💎 BIS हॉलमार्क',
      timings: 'सुबह 10:00 - रात 8:30',
      languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी', 'तेलुगु'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'चेक', 'गोल्ड लोन'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['BIS Hallmark', 'Jewellers Association']
    },
    {
      id: 'footwear-paradise',
      name: 'बेंगलुरु फुटवेयर पैराडाइज़',
      nameEn: 'Bangalore Footwear Paradise',
      specialty: 'चमड़े के जूते, स्पोर्ट्स शूज़ और सभी प्रकार के फुटवेयर',
      specialtyEn: 'Leather shoes, sports shoes and all types of footwear',
      rating: 4.5,
      reviews: 389,
      established: '1978',
      products: 890,
      owner: 'श्री राजू गुप्ता',
      experience: '30 साल',
      category: 'footwear',
      specialty_items: ['लेदर शूज़', 'स्पोर्ट्स शूज़', 'फॉर्मल शूज़', 'सैंडल्स', 'बूट्स'],
      href: '/markets/commercial_street/footwear-paradise',
      image: '/images/shops/footwear.jpg',
      badge: '👠 लेदर स्पेशलिस्ट',
      timings: 'सुबह 10:00 - रात 9:00',
      languages: ['हिंदी', 'अंग्रेजी', 'कन्नड़'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'EMI'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Leather Export Council', 'ISI Mark']
    },
    {
      id: 'electronic-zone',
      name: 'कमर्शियल इलेक्ट्रॉनिक्स हब',
      nameEn: 'Commercial Electronics Hub',
      specialty: 'मोबाइल, लैपटॉप, इलेक्ट्रॉनिक्स और टेक एक्सेसरीज़',
      specialtyEn: 'Mobiles, laptops, electronics and tech accessories',
      rating: 4.4,
      reviews: 756,
      established: '1995',
      products: 1200,
      owner: 'श्री अनिल कुमार',
      experience: '25 साल',
      category: 'electronics',
      specialty_items: ['स्मार्टफोन', 'लैपटॉप', 'टैबलेट', 'हेडफोन', 'चार्जर'],
      href: '/markets/commercial_street/electronic-zone',
      image: '/images/shops/electronics-hub.jpg',
      badge: '📱 लेटेस्ट टेक',
      timings: 'सुबह 10:00 - रात 9:30',
      languages: ['अंग्रेजी', 'हिंदी', 'कन्नड़'],
      payment_methods: ['नकद', 'UPI', 'कार्ड', 'EMI', 'क्रेडिट'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Authorized Dealer', 'Service Center']
    },
    {
      id: 'book-world',
      name: 'नॉलेज वर्ल्ड बुकस्टोर',
      nameEn: 'Knowledge World Bookstore',
      specialty: 'किताबों का विशाल संग्रह, एजुकेशनल मटेरियल और स्टेशनरी',
      specialtyEn: 'Vast book collection, educational material and stationery',
      rating: 4.7,
      reviews: 234,
      established: '1988',
      products: 680,
      owner: 'श्री विजय शर्मा',
      experience: '32 साल',
      category: 'books',
      specialty_items: ['टेक्स्टबुक्स', 'कॉम्पिटिटिव एग्जाम बुक्स', 'नोवेल्स', 'मैगज़ीन्स', 'स्टेशनरी'],
      href: '/markets/commercial_street/book-world',
      image: '/images/shops/bookstore.jpg',
      badge: '📚 नॉलेज सेंटर',
      timings: 'सुबह 9:00 - रात 9:00',
      languages: ['अंग्रेजी', 'हिंदी', 'कन्नड़'],
      payment_methods: ['नकद', 'UPI', 'कार्ड'],
      delivery_available: true,
      wholesale_available: true,
      certifications: ['Educational Board Approved', 'Publisher Partner']
    }
  ];

  const marketInfo = {
    name: 'Commercial Street',
    nameHindi: 'कमर्शियल स्ट्रीट',
    city: 'Bangalore',
    cityHindi: 'बेंगलुरु',
    established: '1884',
    totalShops: 1500,
    totalVendors: 200,
    specialties: ['सिल्क', 'फैशन', 'ज्वेलरी', 'फुटवेयर', 'इलेक्ट्रॉनिक्स', 'किताबें'],
    openingHours: 'सुबह 10:00 - रात 9:30',
    bestTime: 'अक्टूबर से मार्च',
    nearbyAttractions: ['UB City Mall', 'Cubbon Park', 'Vidhana Soudha', 'Lalbagh Gardens'],
    transport: ['मेट्रो: MG Road', 'BMTC बस', 'ऑटो रिक्शा', 'Ola/Uber'],
    parkingAvailable: true,
    history: 'ब्रिटिश काल से चला आ रहा यह बाजार बेंगलुरु का प्रमुख शॉपिंग डेस्टिनेशन है।'
  };

  const categories = [
    { id: 'all', name: 'सभी दुकानें', icon: '🏪', count: shops.length },
    { id: 'textiles', name: 'कपड़े', icon: '🧵', count: shops.filter(s => s.category === 'textiles').length },
    { id: 'fashion', name: 'फैशन', icon: '👗', count: shops.filter(s => s.category === 'fashion').length },
    { id: 'jewelry', name: 'ज्वेलरी', icon: '💎', count: shops.filter(s => s.category === 'jewelry').length },
    { id: 'footwear', name: 'फुटवेयर', icon: '👠', count: shops.filter(s => s.category === 'footwear').length },
    { id: 'electronics', name: 'इलेक्ट्रॉनिक्स', icon: '📱', count: shops.filter(s => s.category === 'electronics').length },
    { id: 'books', name: 'किताबें', icon: '📚', count: shops.filter(s => s.category === 'books').length }
  ];

  const filteredShops = activeFilter === 'all' 
    ? shops 
    : shops.filter(shop => shop.category === activeFilter);

  if (loading) {
    return <LoadingSpinner message="Commercial Street लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full px-6 py-3 mb-6 shadow-lg border border-gray-200'>
                <span className='text-2xl'>🏙️</span>
                <span className='text-gray-800 font-bold'>IT शहर का दिल</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-600 via-slate-500 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight'>
                {marketInfo.nameHindi}
              </h1>
              <h2 className='text-2xl md:text-3xl text-emerald-700 font-semibold mb-6'>
                Commercial Street, {marketInfo.cityHindi}
              </h2>
              
              <p className='text-xl text-emerald-600 max-w-4xl mx-auto leading-relaxed mb-8'>
                भारत की IT राजधानी बेंगलुरु का यह प्रसिद्ध शॉपिंग स्ट्रीट पुराने और नए का संगम है। 
                यहाँ आपको पारंपरिक कांचीपुरम सिल्क से लेकर मॉडर्न फैशन तक, हर चीज़ मिलेगी। 
                MG Road के पास स्थित यह बाजार टेक सिटी के युवाओं और पारंपरिक खरीदारों दोनों की पसंद है।
              </p>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12'>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200'>
                  <div className='text-2xl font-bold text-gray-600'>{marketInfo.established}</div>
                  <div className='text-gray-600 text-sm font-medium'>स्थापना</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200'>
                  <div className='text-2xl font-bold text-gray-600'>{marketInfo.totalShops.toLocaleString()}+</div>
                  <div className='text-gray-600 text-sm font-medium'>कुल दुकानें</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200'>
                  <div className='text-2xl font-bold text-gray-600'>{marketInfo.totalVendors}+</div>
                  <div className='text-gray-600 text-sm font-medium'>विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200'>
                  <div className='text-2xl font-bold text-gray-600'>141</div>
                  <div className='text-gray-600 text-sm font-medium'>साल पुराना</div>
                </div>
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
                      ? 'bg-gradient-to-br from-gray-500 to-slate-500 text-white shadow-lg scale-105'
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
                ? 'कमर्शियल स्ट्रीट की सभी प्रसिद्ध दुकानें' 
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
                  marketTheme="commercial"
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
    </React.StrictMode>
  );
};

export default CommercialStreet;