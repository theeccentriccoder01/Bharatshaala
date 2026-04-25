// Char Minar Souvenirs Component for Laad Bazaar - Bharatshaala Platform
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

const CharMinarSouvenirs = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [souvenirs, setSouvenirs] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const shopInfo = {
    name: 'चारमीनार स्मृति चिह्न दुकान',
    nameEn: 'Charminar Souvenirs Shop',
    description: 'हैदराबाद की ऐतिहासिक चारमीनार की यादगार - निज़ामी संस्कृति के स्मृति चिह्न',
    established: '1950s',
    speciality: 'चारमीनार मॉडल्स, निज़ामी आर्टिफैक्ट्स',
    location: 'लाड बाजार, हैदराबाद',
    heroImage: '/images/markets/charminar-souvenirs.jpg'
  };

  const souvenirCategories = [
    { id: 'all', name: 'सभी स्मृति चिह्न', icon: '🏛️' },
    { id: 'charminar-models', name: 'चारमीनार मॉडल्स', icon: '🕌' },
    { id: 'nizami-artifacts', name: 'निज़ामी आर्टिफैक्ट्स', icon: '👑' },
    { id: 'traditional-crafts', name: 'पारंपरिक शिल्प', icon: '🎨' },
    { id: 'home-decor', name: 'होम डेकोर', icon: '🏠' },
    { id: 'miniatures', name: 'मिनिएचर्स', icon: '🔍' },
    { id: 'postcards-prints', name: 'पोस्टकार्ड्स और प्रिंट्स', icon: '📮' }
  ];

  const featuredSouvenirs = [
    {
      name: 'चारमीनार सिल्वर मॉडल',
      description: 'हैंडमेड सिल्वर प्लेटेड चारमीनार रेप्लिका',
      vendor: 'निज़ाम आर्ट गैलरी',
      price: '₹3,500',
      material: 'सिल्वर प्लेटेड मेटल',
      size: '8 इंच ऊंचाई',
      weight: '750 ग्राम',
      finish: 'एंटीक सिल्वर',
      gift: 'परफेक्ट गिफ्ट आइटम'
    },
    {
      name: 'निज़ामी डाइनिंग सेट',
      description: 'ट्रेडिशनल निज़ामी स्टाइल मिनिएचर डाइनिंग सेट',
      vendor: 'हैदराबाद हेरिटेज क्राफ्ट्स',
      price: '₹1,200',
      material: 'ब्रास और कॉपर',
      size: 'मिनिएचर साइज़',
      pieces: '12 पीस सेट',
      theme: 'रॉयल निज़ामी',
      collection: 'हेरिटेज कलेक्शन'
    },
    {
      name: 'हैदराबादी पर्ल फ्रेम',
      description: 'मोतियों से सजा चारमीनार फोटो फ्रेम',
      vendor: 'पर्ल आर्ट स्टूडियो',
      price: '₹850',
      material: 'लकड़ी और मोती',
      size: '6x8 इंच',
      design: 'हैंडक्राफ्टेड',
      specialty: 'हैदराबादी पर्ल वर्क',
      use: 'डेस्क/वॉल डेकोरेशन'
    }
  ];

  const popularVendors = [
    {
      name: 'निज़ाम आर्ट गैलरी',
      speciality: 'चारमीनार मॉडल्स',
      experience: '30+ वर्ष',
      signature: 'सिल्वर रेप्लिकास',
      products: 50,
      rating: 4.8
    },
    {
      name: 'हैदराबाद हेरिटेज क्राफ्ट्स',
      speciality: 'निज़ामी आर्टिफैक्ट्स',
      experience: '25+ वर्ष',
      signature: 'रॉयल कलेक्शन',
      products: 80,
      rating: 4.7
    },
    {
      name: 'पर्ल आर्ट स्टूडियो',
      speciality: 'पर्ल वर्क आइटम्स',
      experience: '20+ वर्ष',
      signature: 'हैंडक्राफ्टेड फ्रेम्स',
      products: 35,
      rating: 4.6
    }
  ];

  const souvenirTypes = [
    {
      type: 'चारमीनार मॉडल्स',
      description: 'विभिन्न साइज़ में चारमीनार के रेप्लिकास',
      materials: ['मेटल', 'मार्बल', 'लकड़ी'],
      priceRange: '₹200 - ₹5,000'
    },
    {
      type: 'निज़ामी ज्वेलरी बॉक्स',
      description: 'रॉयल स्टाइल के ज्वेलरी स्टोरेज बॉक्सेस',
      materials: ['लकड़ी', 'वेलवेट', 'मेटल'],
      priceRange: '₹500 - ₹2,500'
    },
    {
      type: 'हैदराबादी पेंटिंग्स',
      description: 'चारमीनार और निज़ामी कल्चर की पेंटिंग्स',
      materials: ['कैनवास', 'पेपर', 'सिल्क'],
      priceRange: '₹300 - ₹3,000'
    },
    {
      type: 'मिनिएचर सेट्स',
      description: 'छोटे साइज़ के डेकोरेटिव आइटम्स',
      materials: ['ब्रास', 'सिल्वर', 'कॉपर'],
      priceRange: '₹150 - ₹1,500'
    }
  ];

  const giftIdeas = [
    {
      occasion: 'हाउसवार्मिंग',
      suggestions: ['चारमीनार मॉडल', 'निज़ामी वॉल आर्ट', 'डेकोरेटिव लैंप्स'],
      budget: '₹500 - ₹3,000'
    },
    {
      occasion: 'टूरिस्ट मेमेंटो',
      suggestions: ['मिनी चारमीनार', 'पोस्टकार्ड्स', 'कीचेन्स'],
      budget: '₹50 - ₹500'
    },
    {
      occasion: 'बिजनेस गिफ्ट्स',
      suggestions: ['प्रीमियम चारमीनार मॉडल', 'निज़ामी पेपरवेट', 'डेस्क एक्सेसरीज'],
      budget: '₹1,000 - ₹5,000'
    },
    {
      occasion: 'फेस्टिवल गिफ्ट्स',
      suggestions: ['डेकोरेटिव थाली', 'दीया सेट्स', 'फेस्टिवल पेंटिंग्स'],
      budget: '₹300 - ₹2,000'
    }
  ];

  useEffect(() => {
    trackPageView('laad_bazaar_charminar_souvenirs');
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      const [souvenirsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/laad-bazaar/charminar-souvenirs/souvenirs'),
        apiService.get('/markets/laad-bazaar/charminar-souvenirs/vendors')
      ]);

      if (souvenirsResponse.success) {
        setSouvenirs(souvenirsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('souvenir_category_selected', {
      market: 'laad_bazaar',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_charminar_souvenirs', {
        productId: product.id,
        market: 'laad_bazaar',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_charminar_souvenirs', {
        productId: product.id,
        market: 'laad_bazaar'
      });
    }
  };

  const filteredSouvenirs = activeCategory === 'all' 
    ? souvenirs 
    : souvenirs.filter(souvenir => souvenir.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{shopInfo.name} - भारतशाला | चारमीनार स्मृति चिह्न</title>
        <meta name="description" content="लाड बाजार से चारमीनार और हैदराबाद के स्मृति चिह्न। चारमीनार मॉडल्स, निज़ामी आर्टिफैक्ट्स, हैदराबादी सूवेनियर्स और गिफ्ट आइटम्स।" />
        <meta name="keywords" content="चारमीनार सूवेनियर्स, हैदराबाद स्मृति चिह्न, निज़ामी आर्टिफैक्ट्स, लाड बाजार, हैदराबाद गिफ्ट्स" />
        <link rel="canonical" href="https://bharatshaala.com/markets/laad-bazaar/charminar-souvenirs" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${shopInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🏛️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{shopInfo.name}</h1>
                  <p className="text-xl opacity-90">{shopInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-yellow-200">{shopInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-yellow-200">{shopInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-yellow-200">{shopInfo.location}</p>
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
              <Link to="/markets/laad-bazaar" className="hover:text-emerald-600">लाड बाजार</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">चारमीनार स्मृति चिह्न</span>
            </nav>
          </div>
        </div>

        {/* Featured Souvenirs */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख स्मृति चिह्न</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredSouvenirs.map((souvenir, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{souvenir.name}</h3>
                  <p className="text-gray-600 mb-3">{souvenir.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-amber-600">{souvenir.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विक्रेता:</strong> {souvenir.vendor}</p>
                    <p><strong>सामग्री:</strong> {souvenir.material}</p>
                    <p><strong>साइज़:</strong> {souvenir.size}</p>
                    {souvenir.weight && <p><strong>वजन:</strong> {souvenir.weight}</p>}
                    {souvenir.pieces && <p><strong>पीसेस:</strong> {souvenir.pieces}</p>}
                    {souvenir.finish && <p><strong>फिनिश:</strong> {souvenir.finish}</p>}
                    {souvenir.theme && <p><strong>थीम:</strong> {souvenir.theme}</p>}
                    {souvenir.specialty && <p><strong>विशेषता:</strong> {souvenir.specialty}</p>}
                    {souvenir.use && <p><strong>उपयोग:</strong> {souvenir.use}</p>}
                    <p><strong>गिफ्ट:</strong> {souvenir.gift || souvenir.collection}</p>
                  </div>
                  <button className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">स्मृति चिह्न श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {souvenirCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-amber-600 text-white'
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

        {/* Souvenir Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्मृति चिह्न के प्रकार</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {souvenirTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.type}</h3>
                  <p className="text-gray-600 mb-3 text-sm">{type.description}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold">सामग्री:</p>
                      {type.materials.map((material, materialIndex) => (
                        <span key={materialIndex} className="inline-block bg-white rounded-lg px-2 py-1 text-xs mr-1 mb-1">
                          {material}
                        </span>
                      ))}
                    </div>
                    <p><strong>मूल्य सीमा:</strong> {type.priceRange}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="स्मृति चिह्न लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी स्मृति चिह्न' : souvenirCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSouvenirs.map((souvenir) => (
                  <ProductCard
                    key={souvenir.id}
                    product={souvenir}
                    onAddToCart={() => handleAddToCart(souvenir)}
                    onAddToWishlist={() => handleAddToWishlist(souvenir)}
                    showSouvenirBadge={true}
                    showGiftBadge={true}
                    showHeritagyBadge={true}
                  />
                ))}
              </div>

              {filteredSouvenirs.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई स्मृति चिह्न नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Vendors */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-yellow-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध विक्रेता</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {popularVendors.map((vendor, index) => (
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
                    <p><strong>विशेषता:</strong> {vendor.speciality}</p>
                    <p><strong>अनुभव:</strong> {vendor.experience}</p>
                    <p><strong>सिग्नेचर:</strong> {vendor.signature}</p>
                    <p><strong>प्रोडक्ट्स:</strong> {vendor.products}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                  </div>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gift Ideas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">गिफ्ट आइडियाज़</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {giftIdeas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.occasion}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    {idea.suggestions.map((suggestion, suggestionIndex) => (
                      <div key={suggestionIndex} className="bg-white rounded-lg p-2">
                        • {suggestion}
                      </div>
                    ))}
                  </div>
                  <p className="text-amber-600 font-medium text-sm">{idea.budget}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Historical Significance */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">चारमीनार का ऐतिहासिक महत्व</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                1591 में निर्मित चारमीनार हैदराबाद की पहचान है। यह निज़ामों की विरासत और वास्तुकला का अद्भुत नमूना है। 
                यहाँ के स्मृति चिह्न इस महान इतिहास और संस्कृति को संजोकर रखते हैं।
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">🕌</div>
                  <h3 className="text-xl font-semibold mb-2">वास्तुकला</h3>
                  <p className="text-gray-600">इंडो-इस्लामिक आर्किटेक्चर का बेहतरीन उदाहरण</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold mb-2">निज़ामी विरासत</h3>
                  <p className="text-gray-600">हैदराबाद रियासत की शाही परंपरा</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">कलात्मक परंपरा</h3>
                  <p className="text-gray-600">सदियों पुरानी हस्तशिल्प कलाएं</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Souvenir Heritage */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">चारमीनार स्मृति चिह्न की परंपरा</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                70 साल से लाड बाजार में चारमीनार के स्मृति चिह्न बनाए जा रहे हैं। यहाँ का हर आइटम हैदराबाद की संस्कृति, 
                निज़ामी शान और इतिहास की गवाही देता है। ये स्मृति चिह्न न सिर्फ यादगार हैं बल्कि हमारी विरासत के संरक्षक भी हैं।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>लाड बाजार, हैदराबाद, तेलंगाना</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - रात 9:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>चारमीनार और निज़ामी स्मृति चिह्न</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CharMinarSouvenirs;
