// Spice Market Component for Chandni Chowk - Bharatshaala Platform
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

const SpiceMarket = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [spices, setSpices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const marketInfo = {
    name: 'चांदनी चौक मसाला बाजार',
    nameEn: 'Chandni Chowk Spice Market',
    description: '400 साल पुराना मसालों का केंद्र - दिल्ली के सबसे प्रसिद्ध मसाला व्यापारियों का घर',
    established: '1600s',
    speciality: 'प्रामाणिक भारतीय मसाले',
    location: 'चांदनी चौक, पुरानी दिल्ली',
    heroImage: '/images/markets/chandni-chowk-spice.jpg'
  };

  const spiceCategories = [
    { id: 'all', name: 'सभी मसाले', icon: '🌶️' },
    { id: 'whole-spices', name: 'साबुत मसाले', icon: '🌰' },
    { id: 'ground-spices', name: 'पिसे मसाले', icon: '🥄' },
    { id: 'blends', name: 'मसाला मिश्रण', icon: '🍛' },
    { id: 'premium', name: 'प्रीमियम मसाले', icon: '⭐' },
    { id: 'medicinal', name: 'औषधीय मसाले', icon: '🌿' },
    { id: 'international', name: 'विदेशी मसाले', icon: '🌍' }
  ];

  const featuredSpices = [
    {
      name: 'कश्मीरी लाल मिर्च',
      description: 'प्रामाणिक कश्मीरी लाल मिर्च - रंग और स्वाद के लिए',
      price: '₹450/100g',
      specialty: 'कम तीखा, बेहतरीन रंग',
      vendor: 'जगदीश मसाला स्टोर'
    },
    {
      name: 'केरल इलायची',
      description: 'ताजी हरी इलायची - सुगंध की रानी',
      price: '₹1200/100g',
      specialty: 'प्राकृतिक तेल भरपूर',
      vendor: 'महाराजा स्पाइसेस'
    },
    {
      name: 'गुजराती गरम मसाला',
      description: 'पारंपरिक गुजराती मिश्रण',
      price: '₹320/250g',
      specialty: 'मीठा और सुगंधित',
      vendor: 'शाह मसाला भंडार'
    }
  ];

  const famousVendors = [
    {
      name: 'जगदीश मसाला स्टोर',
      established: '1947',
      specialty: 'कश्मीरी मसाले',
      rating: 4.8,
      experience: '75+ वर्ष'
    },
    {
      name: 'महाराजा स्पाइसेस',
      established: '1923',
      specialty: 'दक्षिण भारतीय मसाले',
      rating: 4.9,
      experience: '100+ वर्ष'
    },
    {
      name: 'शाह मसाला भंडार',
      established: '1935',
      specialty: 'गुजराती मसाला मिश्रण',
      rating: 4.7,
      experience: '88+ वर्ष'
    }
  ];

  useEffect(() => {
    trackPageView('chandni_chowk_spice_market');
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      const [spicesResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/chandni-chowk/spice-market/products'),
        apiService.get('/markets/chandni-chowk/spice-market/vendors')
      ]);

      if (spicesResponse.success) {
        setSpices(spicesResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('spice_category_selected', {
      market: 'chandni_chowk',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_spice_market', {
        productId: product.id,
        market: 'chandni_chowk',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_spice_market', {
        productId: product.id,
        market: 'chandni_chowk'
      });
    }
  };

  const filteredSpices = activeCategory === 'all' 
    ? spices 
    : spices.filter(spice => spice.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{marketInfo.name} - भारतशाला | चांदनी चौक के प्रामाणिक मसाले</title>
        <meta name="description" content="चांदनी चौक के 400 साल पुराने मसाला बाजार से प्रामाणिक भारतीय मसाले। कश्मीरी लाल मिर्च, केरल इलायची और पारंपरिक मसाला मिश्रण।" />
        <meta name="keywords" content="चांदनी चौक मसाले, भारतीय मसाले, कश्मीरी मिर्च, इलायची, गरम मसाला, पुरानी दिल्ली" />
        <link rel="canonical" href="https://bharatshaala.com/markets/chandni-chowk/spice-market" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${marketInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🌶️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{marketInfo.name}</h1>
                  <p className="text-xl opacity-90">{marketInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-orange-200">{marketInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-orange-200">{marketInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-orange-200">{marketInfo.location}</p>
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
              <span className="text-gray-900">मसाला बाजार</span>
            </nav>
          </div>
        </div>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">मसालों की श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {spiceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-red-500 text-white'
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

        {/* Featured Spices */}
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के विशेष मसाले</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredSpices.map((spice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{spice.name}</h3>
                  <p className="text-gray-600 mb-3">{spice.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-red-600">{spice.price}</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {spice.specialty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{spice.vendor}</span>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200">
                      कार्ट में जोड़ें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="मसाले लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी मसाले' : spiceCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSpices.map((spice) => (
                  <ProductCard
                    key={spice.id}
                    product={spice}
                    onAddToCart={() => handleAddToCart(spice)}
                    onAddToWishlist={() => handleAddToWishlist(spice)}
                    showOriginBadge={true}
                    showFreshnessBadge={true}
                  />
                ))}
              </div>

              {filteredSpices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌶️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई मसाले नहीं मिले</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Famous Vendors */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध मसाला व्यापारी</h2>
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
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Spice Knowledge */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मसालों की जानकारी</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold mb-2">स्वास्थ्य लाभ</h3>
                <p className="text-gray-600">मसालों के औषधीय गुण और स्वास्थ्य पर प्रभाव</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👩‍🍳</div>
                <h3 className="text-xl font-semibold mb-2">उपयोग</h3>
                <p className="text-gray-600">विभिन्न व्यंजनों में मसालों का सही उपयोग</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">भंडारण</h3>
                <p className="text-gray-600">मसालों की ताजगी बनाए रखने के तरीके</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">गुणवत्ता</h3>
                <p className="text-gray-600">प्रामाणिक मसालों की पहचान कैसे करें</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Experience */}
        <section className="py-16 bg-red-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">चांदनी चौक का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                400 साल पुराने इस मसाला बाजार में आपको मिलेगा भारत की हर कोने से आए मसालों का अनूठा संग्रह। 
                यहाँ के अनुभवी व्यापारी पीढ़ियों से चली आ रही परंपरा को आगे बढ़ा रहे हैं। 
                हर मसाले की एक अलग कहानी है, हर सुगंध में छुपा है भारतीय रसोई का जादू।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>मुख्य बाजार, चांदनी चौक, दिल्ली</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - शाम 8:00 (सोमवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🚇</div>
                  <h3 className="text-xl font-semibold mb-2">पहुंचना</h3>
                  <p>चांदनी चौक मेट्रो स्टेशन से 2 मिनट</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SpiceMarket;
