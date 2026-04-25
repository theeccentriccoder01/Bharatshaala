// Traditional Sweets Component for Chandni Chowk - Bharatshaala Platform
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

const TraditionalSweets = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [sweets, setSweets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const sweetShopInfo = {
    name: 'चांदनी चौक मिठाई की दुकानें',
    nameEn: 'Chandni Chowk Traditional Sweets',
    description: '200+ साल पुराना मिठाई का स्वर्ग - दिल्ली की सबसे प्रसिद्ध मिठाइयों का घर',
    established: '1800s',
    speciality: 'बेसन के लड्डू, जलेबी, रबड़ी',
    location: 'दरीबा कलां, चांदनी चौक',
    heroImage: '/images/markets/chandni-chowk-sweets.jpg'
  };

  const sweetCategories = [
    { id: 'all', name: 'सभी मिठाइयां', icon: '🍯' },
    { id: 'traditional', name: 'पारंपरिक', icon: '🪔' },
    { id: 'seasonal', name: 'मौसमी', icon: '🌙' },
    { id: 'festival', name: 'त्योहारी', icon: '🎉' },
    { id: 'dry-fruits', name: 'ड्राई फ्रूट्स', icon: '🥜' },
    { id: 'milk-based', name: 'दूध आधारित', icon: '🥛' },
    { id: 'fried', name: 'तली हुई', icon: '🔥' }
  ];

  const famousSweets = [
    {
      name: 'घेवर (राजस्थानी)',
      description: 'पारंपरिक राजस्थानी मिठाई - मुंह में घुल जाने वाली',
      price: '₹350/kg',
      specialty: 'तीज-तेओहार विशेष',
      vendor: 'ओल्ड फेमस जलेबी वाला'
    },
    {
      name: 'बेसन लड्डू',
      description: 'शुद्ध घी में बने बेसन के लड्डू',
      price: '₹480/kg',
      specialty: '100 साल पुराना रेसिपी',
      vendor: 'गुरु कृपा स्वीट्स'
    },
    {
      name: 'दिल्ली की जलेबी',
      description: 'गर्म-गर्म कुरकुरी जलेबी',
      price: '₹320/kg',
      specialty: 'सुबह ताज़ी बनी',
      vendor: 'जलेबी महल'
    }
  ];

  const famousShops = [
    {
      name: 'ओल्ड फेमस जलेबी वाला',
      established: '1884',
      specialty: 'जलेबी, रबड़ी',
      rating: 4.9,
      experience: '140+ वर्ष',
      famous_for: 'सुबह की ताज़ी जलेबी'
    },
    {
      name: 'गुरु कृपा स्वीट्स',
      established: '1902',
      specialty: 'बेसन लड्डू, मिठाई',
      rating: 4.8,
      experience: '120+ वर्ष',
      famous_for: 'शुद्ध घी की मिठाई'
    },
    {
      name: 'जलेबी महल',
      established: '1925',
      specialty: 'जलेबी, समोसा',
      rating: 4.7,
      experience: '98+ वर्ष',
      famous_for: 'कुरकुरी जलेबी'
    }
  ];

  const sweetsByOccasion = [
    { occasion: 'दिवाली', sweets: ['कजू कतली', 'गुलाब जामुन', 'मोतीचूर लड्डू'] },
    { occasion: 'होली', sweets: ['गुझिया', 'ठंडाई', 'मालपुआ'] },
    { occasion: 'करवा चौथ', sweets: ['खीर', 'हलवा', 'मेवा मिठाई'] },
    { occasion: 'राखी', sweets: ['कजू बर्फी', 'रसमलाई', 'पेड़ा'] }
  ];

  useEffect(() => {
    trackPageView('chandni_chowk_traditional_sweets');
    loadSweetShopData();
  }, []);

  const loadSweetShopData = async () => {
    try {
      setLoading(true);
      
      const [sweetsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/chandni-chowk/traditional-sweets/products'),
        apiService.get('/markets/chandni-chowk/traditional-sweets/vendors')
      ]);

      if (sweetsResponse.success) {
        setSweets(sweetsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load sweet shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('sweet_category_selected', {
      market: 'chandni_chowk',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_sweets', {
        productId: product.id,
        market: 'chandni_chowk',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_sweets', {
        productId: product.id,
        market: 'chandni_chowk'
      });
    }
  };

  const filteredSweets = activeCategory === 'all' 
    ? sweets 
    : sweets.filter(sweet => sweet.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{sweetShopInfo.name} - भारतशाला | चांदनी चौक की प्रसिद्ध मिठाइयां</title>
        <meta name="description" content="चांदनी चौक की 200 साल पुराने मिठाई की दुकानों से घेवर, जलेबी, बेसन लड्डू और अन्य पारंपरिक मिठाइयां।" />
        <meta name="keywords" content="चांदनी चौक मिठाई, जलेबी वाला, घेवर, बेसन लड्डू, दिल्ली स्वीट्स, पारंपरिक मिठाई" />
        <link rel="canonical" href="https://bharatshaala.com/markets/chandni-chowk/traditional-sweets" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${sweetShopInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🍯</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{sweetShopInfo.name}</h1>
                  <p className="text-xl opacity-90">{sweetShopInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-yellow-200">{sweetShopInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">प्रसिद्ध</h3>
                  <p className="text-yellow-200">{sweetShopInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-yellow-200">{sweetShopInfo.location}</p>
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
              <span className="text-gray-900">पारंपरिक मिठाइयां</span>
            </nav>
          </div>
        </div>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">मिठाई श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {sweetCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-orange-500 text-white'
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

        {/* Famous Sweets */}
        <section className="py-12 bg-orange-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज की विशेष मिठाइयां</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {famousSweets.map((sweet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sweet.name}</h3>
                  <p className="text-gray-600 mb-3">{sweet.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-orange-600">{sweet.price}</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      {sweet.specialty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{sweet.vendor}</span>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
                      ऑर्डर करें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Festival Sweets */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">त्योहारी मिठाइयां</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sweetsByOccasion.map((occasion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{occasion.occasion}</h3>
                  <div className="space-y-2">
                    {occasion.sweets.map((sweet, sweetIndex) => (
                      <div key={sweetIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                        {sweet}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Famous Shops */}
        <section className="py-16 bg-gradient-to-r from-yellow-100 to-orange-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध मिठाई की दुकानें</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {famousShops.map((shop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">🏪</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{shop.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>स्थापना:</strong> {shop.established}</p>
                    <p><strong>विशेषता:</strong> {shop.specialty}</p>
                    <p><strong>प्रसिद्ध:</strong> {shop.famous_for}</p>
                    <p><strong>अनुभव:</strong> {shop.experience}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(shop.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{shop.rating}</span>
                  </div>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sweet Making Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मिठाई बनाने की कला</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🥛</div>
                <h3 className="text-xl font-semibold mb-2">शुद्ध सामग्री</h3>
                <p className="text-gray-600">केवल शुद्ध दूध, घी और प्राकृतिक चीनी का उपयोग</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🍳</div>
                <h3 className="text-xl font-semibold mb-2">कुशल हलवाई</h3>
                <p className="text-gray-600">पीढ़ियों का अनुभव और पारंपरिक तकनीक</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-semibold mb-2">धीमी आंच</h3>
                <p className="text-gray-600">धैर्य और समय से बनाई गई स्वादिष्ट मिठाई</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-xl font-semibold mb-2">प्राकृतिक मिठास</h3>
                <p className="text-gray-600">कृत्रिम रंग या स्वाद से मुक्त</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="मिठाइयां लोड हो रही हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी मिठाइयां' : sweetCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSweets.map((sweet) => (
                  <ProductCard
                    key={sweet.id}
                    product={sweet}
                    onAddToCart={() => handleAddToCart(sweet)}
                    onAddToWishlist={() => handleAddToWishlist(sweet)}
                    showFreshnessBadge={true}
                    showTraditionalBadge={true}
                  />
                ))}
              </div>

              {filteredSweets.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍯</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई मिठाई नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Sweet Experience */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-yellow-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">चांदनी चौक मिठाई का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                200 साल पुराने इन मिठाई की दुकानों में छुपी है दिल्ली की मिठास। 
                यहाँ हर सुबह ताज़ी जलेबी की खुशबू और हलवाइयों की मेहनत देखने को मिलती है। 
                हर मिठाई में बसा है प्रेम और हर स्वाद में छुपी है पुरानी दिल्ली की रवायत।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>दरीबा कलां, चांदनी चौक</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 8:00 - रात 10:00</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>ताज़ी और पारंपरिक मिठाई</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TraditionalSweets;
