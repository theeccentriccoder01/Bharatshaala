// Textile Hub Component for Chandni Chowk - Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAnalytics } from '../../analytics';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import apiService from '../../apiService';

const TextileHub = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [textiles, setTextiles] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const hubInfo = {
    name: 'चांदनी चौक वस्त्र केंद्र',
    nameEn: 'Chandni Chowk Textile Hub',
    description: 'भारत के सबसे पुराने वस्त्र बाजार में पारंपरिक और आधुनिक कपड़ों का अनूठा संग्रह',
    established: '1650s',
    speciality: 'साड़ी, लहंगा, सलवार कमीज',
    location: 'किनारी बाजार, चांदनी चौक',
    heroImage: '/images/markets/chandni-chowk-textile.jpg'
  };

  const textileCategories = [
    { id: 'all', name: 'सभी वस्त्र', icon: '👗' },
    { id: 'sarees', name: 'साड़ियां', icon: '🥻' },
    { id: 'lehengas', name: 'लहंगे', icon: '👑' },
    { id: 'suits', name: 'सलवार सूट', icon: '👘' },
    { id: 'fabrics', name: 'कपड़े', icon: '🧵' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '💎' },
    { id: 'men-wear', name: 'पुरुष वस्त्र', icon: '👔' }
  ];

  const featuredTextiles = [
    {
      name: 'बनारसी साड़ी',
      description: 'हस्तनिर्मित सोने के धागे से बुनी गई बनारसी साड़ी',
      price: '₹15,000 - ₹50,000',
      specialty: 'शुद्ध सिल्क, जरी का काम',
      vendor: 'अग्रवाल साड़ी हाउस'
    },
    {
      name: 'राजस्थानी लहंगा',
      description: 'पारंपरिक राजस्थानी कढ़ाई के साथ ब्राइडल लहंगा',
      price: '₹25,000 - ₹1,00,000',
      specialty: 'मिरर वर्क, जरदोजी',
      vendor: 'महारानी कलेक्शन'
    },
    {
      name: 'चंदेरी सूट',
      description: 'हल्की और सुंदर चंदेरी सिल्क का सलवार सूट',
      price: '₹3,500 - ₹8,000',
      specialty: 'हाथ से बुना, हल्का',
      vendor: 'चंदेरी पैलेस'
    }
  ];

  const famousVendors = [
    {
      name: 'अग्रवाल साड़ी हाउस',
      established: '1942',
      specialty: 'बनारसी साड़ी',
      rating: 4.9,
      experience: '80+ वर्ष'
    },
    {
      name: 'महारानी कलेक्शन',
      established: '1955',
      specialty: 'ब्राइडल वेयर',
      rating: 4.8,
      experience: '68+ वर्ष'
    },
    {
      name: 'चंदेरी पैलेस',
      established: '1960',
      specialty: 'चंदेरी व कोटा सिल्क',
      rating: 4.7,
      experience: '63+ वर्ष'
    }
  ];

  const fabricTypes = [
    { name: 'बनारसी सिल्क', origin: 'वाराणसी', feature: 'जरी का काम' },
    { name: 'चंदेरी', origin: 'मध्य प्रदेश', feature: 'हल्का और पारदर्शी' },
    { name: 'कांजीवरम्', origin: 'तमिलनाडु', feature: 'शुद्ध सिल्क' },
    { name: 'मुलमुल', origin: 'बंगाल', feature: 'मुलायम कॉटन' },
    { name: 'इकत', origin: 'ओडिशा', feature: 'बांधनी पैटर्न' },
    { name: 'पटोला', origin: 'गुजरात', feature: 'डबल इकत' }
  ];

  useEffect(() => {
    trackPageView('chandni_chowk_textile_hub');
    loadHubData();
  }, []);

  const loadHubData = async () => {
    try {
      setLoading(true);
      
      const [textilesResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/chandni-chowk/textile-hub/products'),
        apiService.get('/markets/chandni-chowk/textile-hub/vendors')
      ]);

      if (textilesResponse.success) {
        setTextiles(textilesResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('textile_category_selected', {
      market: 'chandni_chowk',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_textile_hub', {
        productId: product.id,
        market: 'chandni_chowk',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_textile_hub', {
        productId: product.id,
        market: 'chandni_chowk'
      });
    }
  };

  const filteredTextiles = activeCategory === 'all' 
    ? textiles 
    : textiles.filter(textile => textile.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{hubInfo.name} - भारतशाला | चांदनी चौक के पारंपरिक वस्त्र</title>
        <meta name="description" content="चांदनी चौक के प्रसिद्ध वस्त्र बाजार से बनारसी साड़ी, राजस्थानी लहंगा, चंदेरी सूट और अन्य पारंपरिक वस्त्र।" />
        <meta name="keywords" content="चांदनी चौक वस्त्र, बनारसी साड़ी, लहंगा, सलवार सूट, किनारी बाजार, पारंपरिक कपड़े" />
        <link rel="canonical" href="https://bharatshaala.com/markets/chandni-chowk/textile-hub" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${hubInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">👗</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{hubInfo.name}</h1>
                  <p className="text-xl opacity-90">{hubInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-pink-200">{hubInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-pink-200">{hubInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-pink-200">{hubInfo.location}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-6 py-4">
            <nav className="text-sm text-gray-600">
              <Link to="/" className="hover:text-emerald-600">होम</Link>
              <span className="mx-2">›</span>
              <Link to="/markets" className="hover:text-emerald-600">बाजार</Link>
              <span className="mx-2">›</span>
              <Link to="/markets/chandni-chowk" className="hover:text-emerald-600">चांदनी चौक</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">वस्त्र केंद्र</span>
            </nav>
          </div>
        </div>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">वस्त्र श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {textileCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Textiles */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के विशेष वस्त्र</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTextiles.map((textile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{textile.name}</h3>
                  <p className="text-gray-600 mb-3">{textile.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-600">{textile.price}</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {textile.specialty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{textile.vendor}</span>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200">
                      देखें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fabric Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कपड़ों के प्रकार</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fabricTypes.map((fabric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{fabric.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {fabric.origin}</p>
                    <p><strong>विशेषता:</strong> {fabric.feature}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="वस्त्र लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी वस्त्र' : textileCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTextiles.map((textile) => (
                  <ProductCard
                    key={textile.id}
                    product={textile}
                    onAddToCart={() => handleAddToCart(textile)}
                    onAddToWishlist={() => handleAddToWishlist(textile)}
                    showFabricBadge={true}
                    showHandmadeBadge={true}
                  />
                ))}
              </div>

              {filteredTextiles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👗</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई वस्त्र नहीं मिले</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Famous Vendors */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध वस्त्र व्यापारी</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {famousVendors.map((vendor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">🏪</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>स्थापना:</strong> {vendor.established}</p>
                    <p><strong>विशेषता:</strong> {vendor.specialty}</p>
                    <p><strong>अनुभव:</strong> {vendor.experience}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                  </div>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Shopping Tips */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">खरीदारी की जानकारी</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">मोल-भाव</h3>
                <p className="text-gray-600">यहाँ मोल-भाव करना सामान्य है, विनम्रता से दाम तय करें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">गुणवत्ता जांच</h3>
                <p className="text-gray-600">कपड़े की बुनाई, रंग और फिनिशिंग को ध्यान से देखें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📏</div>
                <h3 className="text-xl font-semibold mb-2">नाप-जोख</h3>
                <p className="text-gray-600">सिलाई से पहले सही नाप और डिजाइन पर चर्चा करें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold mb-2">डिलीवरी</h3>
                <p className="text-gray-600">भारी सामान के लिए होम डिलीवरी की सुविधा उपलब्ध</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Experience */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">चांदनी चौक वस्त्र का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                सदियों से यहाँ के कारीगर भारत की समृद्ध वस्त्र परंपरा को जीवित रखे हुए हैं। 
                किनारी बाजार से लेकर फतेहपुरी तक, यहाँ आपको मिलेगा हर तरह का पारंपरिक और आधुनिक वस्त्र। 
                हर दुकान में छुपी है कहानियां और हर कपड़े में बुना है भारतीय संस्कृति का जादू।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>किनारी बाजार, चांदनी चौक</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 11:00 - शाम 8:00 (सोमवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>ब्राइडल वेयर और पारंपरिक वस्त्र</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TextileHub;