import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import "../../../App.css";

import necklace from "../../../images/items/kundan-necklace.jpg";
import earrings from "../../../images/items/earrings.jpg";
import bangles from "../../../images/items/bangles.jpg";
import ring from "../../../images/items/ring.jpg";
import set from "../../../images/items/set.jpeg";

const Shop1 = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [notification, setNotification] = useState(null);

  const shopInfo = {
    name: 'राजस्थानी रत्न भंडार',
    nameEn: 'Rajasthani Gems Palace',
    owner: 'श्री रामकिशन सोनी',
    established: '1962',
    rating: 4.9,
    reviews: 245,
    location: 'जोहरी बाजार, जयपुर',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    specialties: ['मीनाकारी आभूषण', 'कुंदन ज्वेलरी', 'चांदी के गहने', 'रत्न जड़ित अंगूठियां'],
    description: 'तीन पीढ़ियों से राजस्थानी पारंपरिक आभूषणों की कला को संजोते हुए, हम आपको प्रामाणिक और खूबसूरत गहने प्रदान करते हैं।',
    awards: ['राजस्थान सरकार पुरस्कार 2019', 'हस्तशिल्प एक्सीलेंस अवार्ड', 'ट्रेडिशनल आर्ट पुरस्कार'],
    certifications: ['हॉलमार्क सर्टिफाइड', 'BIS अप्रूव्ड', 'गवर्नमेंट ऑथराइज़्ड'],
    openingHours: 'सुबह 10:00 - रात 8:30'
  };

  const categories = [
    { id: 'all', name: 'सभी उत्पाद', icon: '✨' },
    { id: 'necklaces', name: 'हार', icon: '📿' },
    { id: 'earrings', name: 'झुमके', icon: '💎' },
    { id: 'bangles', name: 'चूड़ियां', icon: '🔗' },
    { id: 'rings', name: 'अंगूठियां', icon: '💍' },
    { id: 'sets', name: 'सेट्स', icon: '👑' }
  ];

  useEffect(() => {
    getData();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  function SendData(item) {
    axios
      .post("/Item", { item })
      .then((response) => {
        setNotification({
          type: 'success',
          message: `${item.name} को कार्ट में जोड़ दिया गया!`,
          duration: 3000
        });
        setTimeout(() => setNotification(null), 3000);
      })
      .catch((error) => {
        setNotification({
          type: 'error',
          message: 'कार्ट में जोड़ने में समस्या हुई',
          duration: 3000
        });
        setTimeout(() => setNotification(null), 3000);
      });
  }

  function getData() {
    axios({
      method: "GET",
      url: "/Store",
    })
      .then((response) => {
        const res = response.data;
        const profileDataArray = res.map((item) => ({
          store_id: item[0],
          id: item[1],
          price: item[3],
          name: item[4],
          category: item[5] || 'necklaces',
          description: item[6] || 'हाथ से बना पारंपरिक राजस्थानी आभूषण',
          image: item[7] || necklace,
          inStock: item[8] || true,
          discount: item[9] || 0,
          originalPrice: item[10] || item[3]
        }));

        setProfileData(profileDataArray);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Fallback mock data
        setProfileData([
          { store_id: 1, id: 1, name: "कुंदन हार", price: 15000, category: 'necklaces', description: 'पारंपरिक कुंदन और मीनाकारी से सजा हुआ खूबसूरत हार', image: necklace, inStock: true, discount: 10, originalPrice: 16500 },
          { store_id: 1, id: 2, name: "चांदी के झुमके", price: 3500, category: 'earrings', description: 'हाथ से बने चांदी के झुमके, मीनाकारी के साथ', image: earrings, inStock: true, discount: 15, originalPrice: 4000 },
          { store_id: 1, id: 3, name: "राजस्थानी चूड़ी सेट", price: 2800, category: 'bangles', description: 'लाख और मीनाकारी से सजी हुई चूड़ियों का सेट', image: bangles, inStock: true, discount: 0, originalPrice: 2800 },
          { store_id: 1, id: 4, name: "नवरत्न अंगूठी", price: 8500, category: 'rings', description: 'प्रामाणिक नवरत्न से सजी हुई चांदी की अंगूठी', image: ring, inStock: false, discount: 5, originalPrice: 9000 },
          { store_id: 1, id: 5, name: "डुलहन जेवर सेट", price: 45000, category: 'sets', description: 'संपूर्ण दुलहन सेट - हार, झुमके, मांगटीका, हाथफूल', image: set, inStock: true, discount: 20, originalPrice: 55000 }
        ]);
      });
  }

  const filteredData = profileData ? profileData.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  ) : [];

  const sortedData = filteredData.sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  if (loading) {
    return <LoadingSpinner message="दुकान लोड हो रही है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        
        {/* Notification */}
        {notification && (
          <div className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-fade-in`}>
            {notification.message}
          </div>
        )}

        {/* Shop Header */}
        <div className='bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 py-16'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-center'>
              
              {/* Shop Info */}
              <div className='lg:col-span-2'>

                <div className='bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center space-x-2 mb-4'>
                  <span className='text-yellow-900'>🏆</span>
                  <span className='text-yellow-900 font-medium text-sm'>प्रमाणित विक्रेता</span>
                </div>
                
                <h1 className='text-4xl md:text-5xl font-bold text-yellow-900 mb-2'>
                  {shopInfo.name}
                </h1>
                <h2 className='text-xl text-yellow-800 mb-4'>{shopInfo.nameEn}</h2>
                
                <p className='text-lg text-yellow-800 mb-6 leading-relaxed'>
                  {shopInfo.description}
                </p>

                <div className='flex flex-wrap gap-4 mb-6'>
                  <div className='bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2'>
                    <span>⭐</span>
                    <span className='font-semibold'>{shopInfo.rating}</span>
                    <span className='text-sm'>({shopInfo.reviews} समीक्षाएं)</span>
                  </div>
                  <div className='bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2'>
                    <span>📅</span>
                    <span className='text-sm'>स्थापना {shopInfo.established}</span>
                  </div>
                  <div className='bg-white/30 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2'>
                    <span>📍</span>
                    <span className='text-sm'>{shopInfo.location}</span>
                  </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                  <button className='bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center space-x-2'>
                    <span>📞</span>
                    <span>कॉल करें</span>
                  </button>
                  <button className='bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors duration-300 flex items-center space-x-2'>
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </button>
                  <button className='bg-white/30 backdrop-blur-sm text-yellow-900 px-6 py-3 rounded-full font-semibold hover:bg-white/40 transition-colors duration-300'>
                    दुकान के बारे में
                  </button>
                </div>
              </div>

              {/* Shop Image/Logo */}
              <div className='text-center'>
                <div className='relative'>
                  <div className='w-48 h-48 mx-auto bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50'>
                    <span className='text-6xl'>💎</span>
                  </div>
                  <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-medium'>
                    {shopInfo.openingHours}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Credentials */}
        <div className='bg-white/80 backdrop-blur-sm border-b border-emerald-200'>
          <div className='max-w-7xl mx-auto px-6 py-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              
              {/* Specialties */}
              <div>
                <h3 className='font-semibold text-emerald-800 mb-3'>विशेषताएं</h3>
                <div className='flex flex-wrap gap-2'>
                  {shopInfo.specialties.map((specialty, index) => (
                    <span key={index} className='bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm border border-emerald-200'>
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div>
                <h3 className='font-semibold text-emerald-800 mb-3'>पुरस्कार</h3>
                <div className='space-y-1'>
                  {shopInfo.awards.slice(0, 3).map((award, index) => (
                    <div key={index} className='text-sm text-emerald-600 flex items-center space-x-2'>
                      <span>🏆</span>
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h3 className='font-semibold text-emerald-800 mb-3'>प्रमाणन</h3>
                <div className='space-y-1'>
                  {shopInfo.certifications.map((cert, index) => (
                    <div key={index} className='text-sm text-emerald-600 flex items-center space-x-2'>
                      <span>✅</span>
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className='max-w-7xl mx-auto px-6 py-8'>
          <div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              
              {/* Categories */}
              <div>
                <h3 className='text-lg font-semibold text-emerald-800 mb-4'>श्रेणी चुनें</h3>
                <div className='flex flex-wrap gap-3'>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg scale-105'
                          : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className='font-medium'>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className='text-lg font-semibold text-emerald-800 mb-4'>क्रमबद्ध करें</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='px-4 py-2 rounded-lg border border-emerald-200 focus:border-emerald-500 focus:outline-none bg-white'
                >
                  <option value="name">नाम के अनुसार</option>
                  <option value="price-low">कम कीमत पहले</option>
                  <option value="price-high">ज्यादा कीमत पहले</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {sortedData.map((item, index) => (
              <div key={item.id} className='group'>
                <div className='bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2'>
                  
                  {/* Product Image */}
                  <div className='relative h-64 overflow-hidden'>
                    <img 
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' 
                      src={item.image} 
                      alt={item.name}
                    />
                    
                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                        -{item.discount}%
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className='absolute top-4 right-4'>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.inStock 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {item.inStock ? 'उपलब्ध' : 'स्टॉक खत्म'}
                      </div>
                    </div>

                    {/* Quick View Overlay */}
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                      <button className='bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold transform scale-0 group-hover:scale-100 transition-transform duration-300'>
                        विस्तार से देखें
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className='p-6'>
                    <h3 className='font-bold text-xl text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300'>
                      {item.name}
                    </h3>
                    <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                      {item.description}
                    </p>

                    {/* Price Section */}
                    <div className='flex items-center space-x-3 mb-4'>
                      <span className='text-2xl font-bold text-emerald-600'>
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.discount > 0 && (
                        <span className='text-lg text-gray-400 line-through'>
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => SendData(item)}
                      disabled={!item.inStock}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        item.inStock
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.inStock ? 'कार्ट में जोड़ें' : 'स्टॉक में नहीं'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {sortedData.length === 0 && (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-2xl font-bold text-emerald-800 mb-2'>कोई उत्पाद नहीं मिला</h3>
              <p className='text-emerald-600'>कृपया अपना फ़िल्टर बदलें या बाद में कोशिश करें</p>
            </div>
          )}

          {/* Shop Contact Info */}
          <div className='mt-20 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl p-12 text-white'>
            <div className='text-center mb-8'>
              <h3 className='text-3xl font-bold mb-4'>संपर्क करें</h3>
              <p className='text-xl text-emerald-100'>किसी भी प्रश्न के लिए हमसे जुड़ें</p>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
              <div className='bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>📞</div>
                <h4 className='text-lg font-semibold mb-2'>फोन</h4>
                <p className='text-emerald-100'>{shopInfo.phone}</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>💬</div>
                <h4 className='text-lg font-semibold mb-2'>WhatsApp</h4>
                <p className='text-emerald-100'>{shopInfo.whatsapp}</p>
              </div>
              <div className='bg-white/20 backdrop-blur-sm rounded-xl p-6'>
                <div className='text-3xl mb-3'>📍</div>
                <h4 className='text-lg font-semibold mb-2'>पता</h4>
                <p className='text-emerald-100'>{shopInfo.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Shop1;