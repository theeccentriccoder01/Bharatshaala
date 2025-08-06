// Handloom Pavilion Component for Dilli Haat - Bharatshaala Platform
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

const HandloomPavilion = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [handloomProducts, setHandloomProducts] = useState([]);
  const [weavers, setWeavers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const pavilionInfo = {
    name: 'दिल्ली हाट हैंडलूम पवेलियन',
    nameEn: 'Dilli Haat Handloom Pavilion',
    description: 'भारतीय हैंडलूम की समृद्ध परंपरा - हाथ से बुने गए वस्त्रों का अनूठा संग्रह',
    established: '1994',
    speciality: 'पारंपरिक हैंडलूम वस्त्र, हस्तशिल्प',
    location: 'दिल्ली हाट, INA, नई दिल्ली',
    heroImage: '/images/markets/dilli-haat-handloom.jpg'
  };

  const handloomCategories = [
    { id: 'all', name: 'सभी हैंडलूम', icon: '🧵' },
    { id: 'sarees', name: 'साड़ियां', icon: '🥻' },
    { id: 'dress-materials', name: 'ड्रेस मटेरियल', icon: '👗' },
    { id: 'shawls', name: 'शॉल्स', icon: '🧣' },
    { id: 'fabrics', name: 'फैब्रिक्स', icon: '🪡' },
    { id: 'home-textiles', name: 'होम टेक्सटाइल्स', icon: '🏠' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '👜' }
  ];

  const featuredHandlooms = [
    {
      name: 'बनारसी सिल्क साड़ी',
      description: 'वाराणसी की पारंपरिक जरी वर्क साड़ी',
      weaver: 'मास्टर अब्दुल खान',
      region: 'वाराणसी, उत्तर प्रदेश',
      price: '₹15,000',
      material: 'प्योर सिल्क',
      weave: 'बनारसी जरी',
      pattern: 'मुगल मोटिफ्स',
      timeToMake: '45 दिन'
    },
    {
      name: 'कांजीवरम सिल्क',
      description: 'तमिलनाडु की प्रसिद्ध कांजीवरम साड़ी',
      weaver: 'श्री वेंकटेश',
      region: 'कांचीपुरम, तमिलनाडु',
      price: '₹22,000',
      material: 'मल्बेरी सिल्क',
      weave: 'कांजीवरम',
      pattern: 'टेम्पल बॉर्डर',
      timeToMake: '60 दिन'
    },
    {
      name: 'चंदेरी कॉटन',
      description: 'मध्य प्रदेश का हल्का और सुंदर कपड़ा',
      weaver: 'लक्ष्मी बाई',
      region: 'चंदेरी, मध्य प्रदेश',
      price: '₹3,500',
      material: 'कॉटन सिल्क',
      weave: 'चंदेरी',
      pattern: 'फ्लोरल बूटी',
      timeToMake: '20 दिन'
    }
  ];

  const renownedWeavers = [
    {
      name: 'उस्ताद अज़हरुद्दीन',
      specialty: 'बनारसी जरी वर्क',
      location: 'वाराणसी',
      experience: '40+ वर्ष',
      awards: 'राष्ट्रीय पुरस्कार 2018',
      signature: 'मुगल पैटर्न',
      apprentices: 15
    },
    {
      name: 'के. वेणुगोपाल',
      specialty: 'कांजीवरम वीविंग',
      location: 'कांचीपुरम',
      experience: '35+ वर्ष',
      awards: 'तमिलनाडु राज्य पुरस्कार',
      signature: 'टेम्पल डिज़ाइन',
      apprentices: 20
    },
    {
      name: 'राधा श्रीवास्तव',
      specialty: 'चंदेरी हैंडलूम',
      location: 'चंदेरी',
      experience: '25+ वर्ष',
      awards: 'शिल्प गुरु सम्मान',
      signature: 'ट्रेडिशनल मोटिफ्स',
      apprentices: 12
    }
  ];

  const handloomTraditions = [
    {
      tradition: 'बनारसी',
      origin: 'वाराणसी, UP',
      specialty: 'सिल्क और जरी वर्क',
      history: '14वीं सदी से',
      uniqueFeature: 'मुगल डिज़ाइन'
    },
    {
      tradition: 'कांजीवरम',
      origin: 'तमिलनाडु',
      specialty: 'टेम्पल बॉर्डर सिल्क',
      history: '400+ वर्ष',
      uniqueFeature: 'गोल्ड जरी'
    },
    {
      tradition: 'चंदेरी',
      origin: 'मध्य प्रदेश',
      specialty: 'हल्का ट्रांसपेरेंट फैब्रिक',
      history: '13वीं सदी से',
      uniqueFeature: 'फाइन वीव'
    },
    {
      tradition: 'इकत',
      origin: 'ओडिशा, आंध्र प्रदेश',
      specialty: 'रेसिस्ट डाइंग',
      history: '12वीं सदी से',
      uniqueFeature: 'टाई-डाई पैटर्न'
    },
    {
      tradition: 'पटोला',
      origin: 'गुजरात',
      specialty: 'डबल इकत',
      history: '11वीं सदी से',
      uniqueFeature: 'ज्यामितीय पैटर्न'
    },
    {
      tradition: 'खादी',
      origin: 'पूरा भारत',
      specialty: 'हाथ से कते सूत',
      history: 'गांधी युग से',
      uniqueFeature: 'स्वदेशी'
    }
  ];

  const weavingProcess = [
    { step: 'सूत की तैयारी', description: 'कॉटन/सिल्क सूत को साफ करना और तैयार करना', time: '2-3 दिन' },
    { step: 'डिज़ाइन प्लानिंग', description: 'पैटर्न और कलर स्कीम का चयन', time: '1 दिन' },
    { step: 'वारपिंग', description: 'लूम पर सूत की व्यवस्था', time: '1-2 दिन' },
    { step: 'वीविंग', description: 'हाथ से बुनाई की प्रक्रिया', time: '15-45 दिन' },
    { step: 'फिनिशिंग', description: 'अंतिम टच और क्वालिटी चेक', time: '2-3 दिन' }
  ];

  useEffect(() => {
    trackPageView('dilli_haat_handloom_pavilion');
    loadPavilionData();
  }, []);

  const loadPavilionData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, weaversResponse] = await Promise.all([
        apiService.get('/markets/dilli-haat/handloom-pavilion/products'),
        apiService.get('/markets/dilli-haat/handloom-pavilion/weavers')
      ]);

      if (productsResponse.success) {
        setHandloomProducts(productsResponse.data);
      }

      if (weaversResponse.success) {
        setWeavers(weaversResponse.data);
      }
    } catch (error) {
      console.error('Failed to load pavilion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('handloom_category_selected', {
      market: 'dilli_haat',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_handloom_pavilion', {
        productId: product.id,
        market: 'dilli_haat',
        weaver: product.weaver
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_handloom_pavilion', {
        productId: product.id,
        market: 'dilli_haat'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? handloomProducts 
    : handloomProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{pavilionInfo.name} - भारतशाला | भारतीय हैंडलूम पवेलियन</title>
        <meta name="description" content="दिल्ली हाट हैंडलूम पवेलियन में भारतीय पारंपरिक हैंडलूम वस्त्र। बनारसी, कांजीवरम, चंदेरी और अन्य हस्तनिर्मित वस्त्र।" />
        <meta name="keywords" content="दिल्ली हाट, हैंडलूम, बनारसी साड़ी, कांजीवरम सिल्क, चंदेरी, पारंपरिक वस्त्र, हस्तनिर्मित कपड़े" />
        <link rel="canonical" href="https://bharatshaala.com/markets/dilli-haat/handloom-pavilion" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${pavilionInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🧵</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{pavilionInfo.name}</h1>
                  <p className="text-xl opacity-90">{pavilionInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-indigo-200">{pavilionInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-indigo-200">{pavilionInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-indigo-200">{pavilionInfo.location}</p>
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
              <Link to="/markets/dilli-haat" className="hover:text-emerald-600">दिल्ली हाट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">हैंडलूम पवेलियन</span>
            </nav>
          </div>
        </div>

        {/* Featured Handlooms */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख हैंडलूम संग्रह</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredHandlooms.map((handloom, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{handloom.name}</h3>
                  <p className="text-gray-600 mb-3">{handloom.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-600">{handloom.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>बुनकर:</strong> {handloom.weaver}</p>
                    <p><strong>क्षेत्र:</strong> {handloom.region}</p>
                    <p><strong>सामग्री:</strong> {handloom.material}</p>
                    <p><strong>बुनाई:</strong> {handloom.weave}</p>
                    <p><strong>पैटर्न:</strong> {handloom.pattern}</p>
                    <p><strong>निर्माण समय:</strong> {handloom.timeToMake}</p>
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
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">हैंडलूम श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {handloomCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
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

        {/* Handloom Traditions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">भारतीय हैंडलूम परंपराएं</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {handloomTraditions.map((tradition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tradition.tradition}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {tradition.origin}</p>
                    <p><strong>विशेषता:</strong> {tradition.specialty}</p>
                    <p><strong>इतिहास:</strong> {tradition.history}</p>
                    <p><strong>अनूठापन:</strong> {tradition.uniqueFeature}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="हैंडलूम उत्पाद लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी हैंडलूम' : handloomCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showHandloomBadge={true}
                    showWeaverBadge={true}
                    showAuthenticityBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🧵</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई उत्पाद नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Renowned Weavers */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-indigo-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध बुनकर</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {renownedWeavers.map((weaver, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{weaver.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {weaver.specialty}</p>
                    <p><strong>स्थान:</strong> {weaver.location}</p>
                    <p><strong>अनुभव:</strong> {weaver.experience}</p>
                    <p><strong>सिग्नेचर:</strong> {weaver.signature}</p>
                    <p><strong>पुरस्कार:</strong> {weaver.awards}</p>
                    <p><strong>शिष्य:</strong> {weaver.apprentices}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Weaving Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">हैंडलूम बुनाई की प्रक्रिया</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {weavingProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.step}</h3>
                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                  <p className="text-blue-600 font-medium text-sm">{step.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">गुणवत्ता आश्वासन</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">✋</div>
                <h3 className="text-xl font-semibold mb-2">हस्तनिर्मित</h3>
                <p className="text-gray-600">100% हाथ से बुना गया</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🧵</div>
                <h3 className="text-xl font-semibold mb-2">प्राकृतिक सूत</h3>
                <p className="text-gray-600">शुद्ध कॉटन और सिल्क</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold mb-2">हैंडलूम मार्क</h3>
                <p className="text-gray-600">सरकारी प्रमाणीकरण</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">पारंपरिक डिज़ाइन</h3>
                <p className="text-gray-600">सदियों पुराने पैटर्न</p>
              </div>
            </div>
          </div>
        </section>

        {/* Handloom Heritage */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">भारतीय हैंडलूम की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                30 साल से दिल्ली हाट हैंडलूम पवेलियन भारत की अमूल्य हैंडलूम परंपरा को जीवित रखने में योगदान दे रहा है। 
                यहाँ हर वस्त्र में बुनी है हमारे बुनकरों की मेहनत, कलाकारी और पीढ़ियों से चली आ रही तकनीक। 
                भारत की सांस्कृतिक पहचान और कुशल हस्तशिल्प का यह अनूठा केंद्र है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>दिल्ली हाट, INA, नई दिल्ली</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🧵</div>
                  <h3 className="text-xl font-semibold mb-2">परंपराएं</h3>
                  <p>20+ हैंडलूम ट्रेडिशन्स</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-semibold mb-2">बुनकर</h3>
                  <p>150+ कुशल कारीगर</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HandloomPavilion;