// Mysore Silk Emporium Component for Devaraja Market - Bharatshala Platform
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

const MysoresilkEmporium = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [silkProducts, setSilkProducts] = useState([]);
  const [weavers, setWeavers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const emporiumInfo = {
    name: 'मैसूर सिल्क एम्पोरियम',
    nameEn: 'Mysore Silk Emporium',
    description: 'विश्व प्रसिद्ध मैसूर सिल्क का घर - पारंपरिक बुनाई और शाही परंपरा',
    established: '1932',
    speciality: 'पारंपरिक मैसूर सिल्क साड़ियां',
    location: 'देवराज मार्केट, मैसूर',
    heroImage: '/images/markets/devaraja-silk.jpg'
  };

  const silkCategories = [
    { id: 'all', name: 'सभी सिल्क उत्पाद', icon: '🥻' },
    { id: 'sarees', name: 'साड़ियां', icon: '🥻' },
    { id: 'dress-materials', name: 'ड्रेस मटेरियल', icon: '🧵' },
    { id: 'dupattas', name: 'दुपट्टे', icon: '🧣' },
    { id: 'fabrics', name: 'फैब्रिक्स', icon: '🪡' },
    { id: 'blouse-pieces', name: 'ब्लाउज पीस', icon: '👚' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '👜' }
  ];

  const featuredSilks = [
    {
      name: 'मैसूर पैलेस सिल्क साड़ी',
      description: 'हस्तनिर्मित जरी वर्क के साथ शाही डिजाइन',
      price: '₹25,000',
      weight: '850 ग्राम',
      weave: 'ट्रेडिशनल हैंडलूम',
      zari: 'शुद्ध गोल्ड जरी',
      pattern: 'पैलेस मोटिफ्स',
      vendor: 'राज सिल्क वीवर्स'
    },
    {
      name: 'क्रेप सिल्क साड़ी',
      description: 'मॉडर्न फिनिश के साथ ट्रेडिशनल पैटर्न',
      price: '₹8,500',
      weight: '450 ग्राम',
      weave: 'क्रेप वीव',
      zari: 'सिल्वर जरी',
      pattern: 'फ्लोरल बॉर्डर',
      vendor: 'मैसूर वीवर्स गिल्ड'
    },
    {
      name: 'कंजीवरम स्टाइल मैसूर सिल्क',
      description: 'कंजीवरम तकनीक में मैसूर सिल्क',
      price: '₹18,000',
      weight: '720 ग्राम',
      weave: 'कंजीवरम स्टाइल',
      zari: 'गोल्ड एंड सिल्वर मिक्स',
      pattern: 'टेम्पल बॉर्डर',
      vendor: 'हेरिटेज वीवर्स'
    }
  ];

  const masterWeavers = [
    {
      name: 'रामय्या मास्टर',
      experience: '45+ वर्ष',
      specialty: 'रॉयल पैलेस डिजाइन्स',
      awards: 'राष्ट्रीय शिल्प पुरस्कार',
      signature: 'गोल्ड जरी वर्क',
      apprentices: 25
    },
    {
      name: 'लक्ष्मी देवी',
      experience: '35+ वर्ष',
      specialty: 'फ्लोरल पैटर्न्स',
      awards: 'कर्नाटक राज्य पुरस्कार',
      signature: 'डेलिकेट मोटिफ्स',
      apprentices: 18
    },
    {
      name: 'नागराज वीवर',
      experience: '40+ वर्ष',
      specialty: 'मॉडर्न फ्यूजन डिजाइन्स',
      awards: 'शिल्प गुरु सम्मान',
      signature: 'कंटेंपररी पैटर्न्स',
      apprentices: 22
    }
  ];

  const silkQualities = [
    { quality: 'प्योर मल्बेरी सिल्क', description: 'शुद्ध मल्बेरी कोकून से निर्मित', durability: '25+ वर्ष' },
    { quality: 'हैंडलूम वीवन', description: 'पारंपरिक हाथ की करघे पर बुनी गई', uniqueness: '100% हस्तनिर्मित' },
    { quality: 'नेचुरल डाईंग', description: 'प्राकृतिक रंगों का उपयोग', colorfastness: 'फेड रेसिस्टेंट' },
    { quality: 'जरी वर्क', description: 'असली सोने-चांदी का धागा', authenticity: 'गवर्नमेंट सर्टिफाइड' }
  ];

  const careInstructions = [
    { instruction: 'ड्राई क्लीनिंग', description: 'केवल प्रोफेशनल ड्राई क्लीनर्स से धुलवाएं' },
    { instruction: 'स्टोरेज', description: 'मस्लिन कपड़े में लपेटकर रखें' },
    { instruction: 'इस्त्री', description: 'कम गर्मी पर रिवर्स साइड से इस्त्री करें' },
    { instruction: 'नमी से बचाव', description: 'नमी और सीधी धूप से बचाकर रखें' }
  ];

  useEffect(() => {
    trackPageView('devaraja_mysore_silk_emporium');
    loadEmporiumData();
  }, []);

  const loadEmporiumData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, weaversResponse] = await Promise.all([
        apiService.get('/markets/devaraja-market/mysore-silk-emporium/products'),
        apiService.get('/markets/devaraja-market/mysore-silk-emporium/weavers')
      ]);

      if (productsResponse.success) {
        setSilkProducts(productsResponse.data);
      }

      if (weaversResponse.success) {
        setWeavers(weaversResponse.data);
      }
    } catch (error) {
      console.error('Failed to load emporium data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('silk_category_selected', {
      market: 'devaraja_market',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_silk_emporium', {
        productId: product.id,
        market: 'devaraja_market',
        weaver: product.weaver
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_silk_emporium', {
        productId: product.id,
        market: 'devaraja_market'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? silkProducts 
    : silkProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{emporiumInfo.name} - भारतशाला | मैसूर की प्रसिद्ध सिल्क साड़ियां</title>
        <meta name="description" content="मैसूर सिल्क एम्पोरियम से विश्व प्रसिद्ध मैसूर सिल्क साड़ियां, हैंडलूम फैब्रिक्स और पारंपरिक जरी वर्क। शुद्ध मल्बेरी सिल्क उत्पाद।" />
        <meta name="keywords" content="मैसूर सिल्क, देवराज मार्केट, सिल्क साड़ी, हैंडलूम, जरी वर्क, कर्नाटक सिल्क, मल्बेरी सिल्क" />
        <link rel="canonical" href="https://bharatshala.com/markets/devaraja-market/mysore-silk-emporium" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${emporiumInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🥻</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{emporiumInfo.name}</h1>
                  <p className="text-xl opacity-90">{emporiumInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-pink-200">{emporiumInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-pink-200">{emporiumInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-pink-200">{emporiumInfo.location}</p>
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
              <Link to="/markets/devaraja-market" className="hover:text-emerald-600">देवराज मार्केट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">मैसूर सिल्क एम्पोरियम</span>
            </nav>
          </div>
        </div>

        {/* Featured Silks */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रीमियम सिल्क कलेक्शन</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredSilks.map((silk, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{silk.name}</h3>
                  <p className="text-gray-600 mb-3">{silk.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-600">{silk.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>वजन:</strong> {silk.weight}</p>
                    <p><strong>बुनाई:</strong> {silk.weave}</p>
                    <p><strong>जरी:</strong> {silk.zari}</p>
                    <p><strong>पैटर्न:</strong> {silk.pattern}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{silk.vendor}</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                      देखें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">सिल्क श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {silkCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white'
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

        {/* Master Weavers */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-pink-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मास्टर वीवर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {masterWeavers.map((weaver, index) => (
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
                    <p><strong>अनुभव:</strong> {weaver.experience}</p>
                    <p><strong>विशेषता:</strong> {weaver.specialty}</p>
                    <p><strong>सिग्नेचर:</strong> {weaver.signature}</p>
                    <p><strong>पुरस्कार:</strong> {weaver.awards}</p>
                    <p><strong>शिष्य:</strong> {weaver.apprentices}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Silk Qualities */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मैसूर सिल्क की गुणवत्ता</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {silkQualities.map((quality, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{quality.quality}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{quality.description}</p>
                  <p className="text-purple-700 font-medium text-sm">
                    {quality.durability || quality.uniqueness || quality.colorfastness || quality.authenticity}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="सिल्क उत्पाद लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी सिल्क उत्पाद' : silkCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showSilkQualityBadge={true}
                    showHandloomBadge={true}
                    showZariBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🥻</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई उत्पाद नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Care Instructions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">सिल्क की देखभाल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {careInstructions.map((instruction, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">🧺</div>
                  <h3 className="text-xl font-semibold mb-2">{instruction.instruction}</h3>
                  <p className="text-gray-600">{instruction.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">मैसूर सिल्क की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                टीपू सुल्तान के समय से चली आ रही मैसूर सिल्क की परंपरा आज भी देवराज मार्केट में जीवित है। 
                यहाँ की हर साड़ी में बुना है इतिहास और कारीगरी का अनमोल खजाना। 
                विश्व प्रसिद्ध मैसूर सिल्क की यह विरासत पीढ़ियों से संजोकर रखी गई है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>देवराज मार्केट, मैसूर, कर्नाटक</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - शाम 8:00 (सोमवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>रॉयल मैसूर सिल्क और हैंडलूम</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default MysoresilkEmporium;