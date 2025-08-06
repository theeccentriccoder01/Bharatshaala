// Startup Store Component for Commercial Street - Bharatshaala Platform
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

const StartupStore = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const storeInfo = {
    name: 'कमर्शियल स्ट्रीट स्टार्टअप स्टोर',
    nameEn: 'Commercial Street Startup Store',
    description: 'भारतीय स्टार्टअप्स के इनोवेटिव प्रोडक्ट्स का प्लेटफॉर्म - नवाचार और उद्यमिता का केंद्र',
    established: '2015',
    speciality: 'इनोवेटिव प्रोडक्ट्स, स्टार्टअप सपोर्ट',
    location: 'कमर्शियल स्ट्रीट, बेंगलुरु',
    heroImage: '/images/markets/commercial-street-startup.jpg'
  };

  const productCategories = [
    { id: 'all', name: 'सभी प्रोडक्ट्स', icon: '🚀' },
    { id: 'tech-gadgets', name: 'टेक गैजेट्स', icon: '📱' },
    { id: 'health-wellness', name: 'हेल्थ & वेलनेस', icon: '💪' },
    { id: 'home-lifestyle', name: 'होम & लाइफस्टाइल', icon: '🏠' },
    { id: 'sustainable', name: 'सस्टेनेबल प्रोडक्ट्स', icon: '🌱' },
    { id: 'fashion-accessories', name: 'फैशन एक्सेसरीज', icon: '👜' },
    { id: 'food-beverages', name: 'फूड & बेवरेजेस', icon: '🍯' }
  ];

  const featuredStartups = [
    {
      name: 'EcoWrap',
      founder: 'अनुपमा रंगनाथन',
      category: 'सस्टेनेबल पैकेजिंग',
      founded: '2017',
      products: 12,
      specialty: 'बायो-डिग्रेडेबल फूड रैप',
      funding: 'Series A',
      location: 'बेंगलुरु'
    },
    {
      name: 'SleepyOwl Coffee',
      founder: 'अर्जुन कार्तिक',
      category: 'कॉफी & बेवरेजेस',
      founded: '2016',
      products: 25,
      specialty: 'कोल्ड ब्रू कॉफी',
      funding: 'Series B',
      location: 'मुंबई/बेंगलुरु'
    },
    {
      name: 'Pee Safe',
      founder: 'विकास बागरिया',
      category: 'हेल्थ & हाइजीन',
      founded: '2013',
      products: 18,
      specialty: 'पर्सनल हाइजीन प्रोडक्ट्स',
      funding: 'Series C',
      location: 'गुरुग्राम/बेंगलुरु'
    }
  ];

  const innovativeProducts = [
    {
      name: 'स्मार्ट प्लांट पॉट',
      startup: 'GreenTech Solutions',
      description: 'IoT इनेबल्ड प्लांट मॉनिटरिंग सिस्टम',
      price: '₹2,499',
      category: 'Tech Gadgets',
      features: ['ऑटो वाटरिंग', 'स्मार्ट सेंसर', 'मोबाइल ऐप']
    },
    {
      name: 'ऑर्गेनिक स्किन केयर किट',
      startup: 'Pure Earth Cosmetics',
      description: '100% नेचुरल और वीगन स्किन केयर',
      price: '₹1,299',
      category: 'Health & Wellness',
      features: ['केमिकल-फ्री', 'वीगन फॉर्मुला', 'इको पैकेजिंग']
    },
    {
      name: 'बांस फाइबर डिनर सेट',
      startup: 'Bamboo Innovations',
      description: 'सस्टेनेबल और बायो-डिग्रेडेबल',
      price: '₹999',
      category: 'Sustainable',
      features: ['100% बांस', 'माइक्रोवेव सेफ', 'डिशवाशर फ्रेंडली']
    }
  ];

  const startupPrograms = [
    { program: 'इनक्यूबेशन सपोर्ट', description: 'नए स्टार्टअप्स के लिए मेंटरशिप और गाइडेंस' },
    { program: 'प्रोडक्ट लॉन्च पैड', description: 'प्रोडक्ट लॉन्च और मार्केटिंग सपोर्ट' },
    { program: 'इन्वेस्टर कनेक्ट', description: 'फंडिंग के लिए इन्वेस्टर नेटवर्किंग' },
    { program: 'कस्टमर फीडबैक', description: 'रियल-टाइम कस्टमर इनसाइट्स और फीडबैक' }
  ];

  useEffect(() => {
    trackPageView('commercial_street_startup_store');
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, startupsResponse] = await Promise.all([
        apiService.get('/markets/commercial-street/startup-store/products'),
        apiService.get('/markets/commercial-street/startup-store/startups')
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }

      if (startupsResponse.success) {
        setStartups(startupsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('startup_category_selected', {
      market: 'commercial_street',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_startup_store', {
        productId: product.id,
        market: 'commercial_street',
        startup: product.startup
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_startup_store', {
        productId: product.id,
        market: 'commercial_street'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{storeInfo.name} - भारतशाला | भारतीय स्टार्टअप प्रोडक्ट्स</title>
        <meta name="description" content="भारतीय स्टार्टअप्स के इनोवेटिव प्रोडक्ट्स खरीदें। टेक गैजेट्स, हेल्थ प्रोडक्ट्स, सस्टेनेबल आइटम्स और लाइफस्टाइल प्रोडक्ट्स।" />
        <meta name="keywords" content="भारतीय स्टार्टअप, इनोवेटिव प्रोडक्ट्स, टेक गैजेट्स, सस्टेनेबल प्रोडक्ट्स, बेंगलुरु स्टार्टअप" />
        <link rel="canonical" href="https://bharatshaala.com/markets/commercial-street/startup-store" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${storeInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🚀</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{storeInfo.name}</h1>
                  <p className="text-xl opacity-90">{storeInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-cyan-200">{storeInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-cyan-200">{storeInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-cyan-200">{storeInfo.location}</p>
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
              <Link to="/markets/commercial-street" className="hover:text-emerald-600">कमर्शियल स्ट्रीट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">स्टार्टअप स्टोर</span>
            </nav>
          </div>
        </div>

        {/* Featured Startups */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फीचर्ड स्टार्टअप्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredStartups.map((startup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🚀</div>
                    <h3 className="text-xl font-bold text-gray-900">{startup.name}</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>फाउंडर:</strong> {startup.founder}</p>
                    <p><strong>कैटेगरी:</strong> {startup.category}</p>
                    <p><strong>स्थापित:</strong> {startup.founded}</p>
                    <p><strong>लोकेशन:</strong> {startup.location}</p>
                    <p><strong>प्रोडक्ट्स:</strong> {startup.products}</p>
                    <p><strong>स्पेशलिटी:</strong> {startup.specialty}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {startup.funding}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      प्रोडक्ट्स देखें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovative Products */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">इनोवेटिव प्रोडक्ट्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {innovativeProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">by {product.startup}</p>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    कार्ट में जोड़ें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">प्रोडक्ट श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="प्रोडक्ट्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी प्रोडक्ट्स' : productCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showStartupBadge={true}
                    showInnovationBadge={true}
                    showEcoFriendlyBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई प्रोडक्ट नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Startup Programs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्टार्टअप प्रोग्राम्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {startupPrograms.map((program, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold mb-2">{program.program}</h3>
                  <p className="text-gray-600">{program.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation Stats */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">इनोवेशन स्टैट्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                <p className="text-gray-600">रजिस्टर्ड स्टार्टअप्स</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600">इनोवेटिव प्रोडक्ट्स</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">₹50Cr+</div>
                <p className="text-gray-600">कुल फंडिंग</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                <p className="text-gray-600">जॉब्स क्रिएटेड</p>
              </div>
            </div>
          </div>
        </section>

        {/* Startup Store Experience */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">स्टार्टअप स्टोर का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                10 साल से कमर्शियल स्ट्रीट स्टार्टअप स्टोर भारतीय इनोवेशन को बढ़ावा दे रहा है। 
                यहाँ मिलते हैं नए विचारों से बने प्रोडक्ट्स जो जिंदगी को आसान और बेहतर बनाते हैं। 
                हर प्रोडक्ट के पीछे है एक सपना और एक कहानी।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>कमर्शियल स्ट्रीट, बेंगलुरु</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - रात 8:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>इनोवेटिव भारतीय प्रोडक्ट्स</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default StartupStore;