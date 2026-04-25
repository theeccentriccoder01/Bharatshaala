// Bapu Bazaar Component for Pink City - Bharatshaala Platform
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

const BapuBazaar = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const bazaarInfo = {
    name: 'बापू बाजार',
    nameEn: 'Bapu Bazaar',
    description: 'जयपुर का सबसे पुराना और प्रसिद्ध बाजार - राजस्थानी वस्त्र और हस्तशिल्प का केंद्र',
    established: '1960s',
    speciality: 'राजस्थानी वस्त्र, जूतियां, हस्तशिल्प',
    location: 'पिंक सिटी, जयपुर',
    heroImage: '/images/markets/bapu-bazaar.jpg'
  };

  const productCategories = [
    { id: 'all', name: 'सभी उत्पाद', icon: '🛍️' },
    { id: 'textiles', name: 'वस्त्र', icon: '👕' },
    { id: 'juttis', name: 'जूतियां', icon: '👠' },
    { id: 'handicrafts', name: 'हस्तशिल्प', icon: '🎨' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '💍' },
    { id: 'home-decor', name: 'होम डेकोर', icon: '🏠' },
    { id: 'bags-purses', name: 'बैग्स और पर्स', icon: '👜' }
  ];

  const featuredProducts = [
    {
      name: 'राजस्थानी बंधनी दुपट्टा',
      description: 'हाथ से बना पारंपरिक बंधनी दुपट्टा',
      vendor: 'महावीर टेक्सटाइल्स',
      price: '₹1,200',
      material: 'जॉर्जेट',
      technique: 'हैंड टाई-डाई',
      colors: 'मल्टीकलर',
      size: '2.5 मीटर',
      origin: 'सांगानेर, जयपुर'
    },
    {
      name: 'राजस्थानी मोजड़ी',
      description: 'हस्तनिर्मित चमड़े की राजस्थानी जूती',
      vendor: 'जयपुर फुटवियर',
      price: '₹850',
      material: 'असली चमड़ा',
      work: 'हैंड एम्ब्रॉयडरी',
      sizes: 'सभी साइज़ उपलब्ध',
      style: 'ट्रेडिशनल पॉइंटेड',
      comfort: 'सॉफ्ट सोल'
    },
    {
      name: 'ब्लू पॉटरी वाज़',
      description: 'जयपुर की प्रसिद्ध ब्लू पॉटरी',
      vendor: 'राजस्थान आर्ट एंड क्राफ्ट',
      price: '₹2,500',
      technique: 'हैंड पेंटेड',
      material: 'मिट्टी और क्वार्ट्ज',
      size: '10 इंच ऊंचाई',
      pattern: 'फ्लोरल मोटिफ',
      finish: 'ग्लेज़्ड'
    }
  ];

  const topVendors = [
    {
      name: 'महावीर टेक्सटाइल्स',
      speciality: 'बंधनी और ब्लॉक प्रिंट',
      experience: '40+ वर्ष',
      products: 200,
      location: 'बापू बाजार मेन रोड',
      rating: 4.7
    },
    {
      name: 'जयपुर फुटवियर',
      speciality: 'राजस्थानी जूतियां',
      experience: '35+ वर्ष',
      products: 150,
      location: 'कुल्हड़ गली',
      rating: 4.6
    },
    {
      name: 'राजस्थान आर्ट एंड क्राफ्ट',
      speciality: 'ब्लू पॉटरी और हैंडिक्राफ्ट्स',
      experience: '25+ वर्ष',
      products: 300,
      location: 'चौड़ा रास्ता',
      rating: 4.8
    }
  ];

  const rajasthaniCrafts = [
    {
      craft: 'बंधनी',
      description: 'टाई-डाई तकनीक से बने रंग-बिरंगे कपड़े',
      origin: 'सांगानेर/बगरू'
    },
    {
      craft: 'ब्लॉक प्रिंटिंग',
      description: 'लकड़ी के ब्लॉक से छपे कपड़े',
      origin: 'बगरू/सांगानेर'
    },
    {
      craft: 'ब्लू पॉटरी',
      description: 'नीले रंग की चमकदार मिट्टी के बर्तन',
      origin: 'जयपुर'
    },
    {
      craft: 'मोजड़ी',
      description: 'राजस्थानी पारंपरिक जूतियां',
      origin: 'जयपुर'
    },
    {
      craft: 'लाख की चूड़ियां',
      description: 'लाख से बनी रंग-बिरंगी चूड़ियां',
      origin: 'जयपुर'
    },
    {
      craft: 'कठपुतली',
      description: 'राजस्थानी पारंपरिक कठपुतलियां',
      origin: 'उदयपुर/जयपुर'
    }
  ];

  const shoppingTips = [
    { tip: 'सुबह जल्दी जाएं', reason: 'भीड़ कम होती है और अच्छे सामान का चयन मिलता है' },
    { tip: 'मोल-भाव करें', reason: 'बापू बाजार में मोल-भाव की परंपरा है' },
    { tip: 'कैश लेकर जाएं', reason: 'अधिकतर दुकानें कैश में बेहतर रेट देती हैं' },
    { tip: 'ऑथेंटिसिटी चेक करें', reason: 'असली राजस्थानी सामान खरीदने के लिए' }
  ];

  useEffect(() => {
    trackPageView('pinkcity_bapu_bazaar');
    loadBazaarData();
  }, []);

  const loadBazaarData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/pinkcity/bapu-bazaar/products'),
        apiService.get('/markets/pinkcity/bapu-bazaar/vendors')
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load bazaar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('bapu_bazaar_category_selected', {
      market: 'pinkcity',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_bapu_bazaar', {
        productId: product.id,
        market: 'pinkcity',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_bapu_bazaar', {
        productId: product.id,
        market: 'pinkcity'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{bazaarInfo.name} - भारतशाला | जयपुर का प्रसिद्ध बाजार</title>
        <meta name="description" content="बापू बाजार जयपुर से राजस्थानी वस्त्र, जूतियां, हस्तशिल्प खरीदें। बंधनी, ब्लॉक प्रिंट, ब्लू पॉटरी और पारंपरिक राजस्थानी सामान।" />
        <meta name="keywords" content="बापू बाजार, जयपुर शॉपिंग, राजस्थानी वस्त्र, बंधनी, ब्लॉक प्रिंट, राजस्थानी जूतियां, ब्लू पॉटरी" />
        <link rel="canonical" href="https://bharatshaala.com/markets/pinkcity/bapu-bazaar" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-pink-600 to-orange-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${bazaarInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🛍️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{bazaarInfo.name}</h1>
                  <p className="text-xl opacity-90">{bazaarInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-orange-200">{bazaarInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-orange-200">{bazaarInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-orange-200">{bazaarInfo.location}</p>
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
              <Link to="/markets/pinkcity" className="hover:text-emerald-600">पिंक सिटी</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">बापू बाजार</span>
            </nav>
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-12 bg-pink-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख राजस्थानी उत्पाद</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-3">{product.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-pink-600">{product.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विक्रेता:</strong> {product.vendor}</p>
                    <p><strong>सामग्री:</strong> {product.material}</p>
                    {product.technique && <p><strong>तकनीक:</strong> {product.technique}</p>}
                    {product.work && <p><strong>काम:</strong> {product.work}</p>}
                    {product.colors && <p><strong>रंग:</strong> {product.colors}</p>}
                    {product.sizes && <p><strong>साइज़:</strong> {product.sizes}</p>}
                    {product.size && <p><strong>साइज़:</strong> {product.size}</p>}
                    {product.style && <p><strong>स्टाइल:</strong> {product.style}</p>}
                    {product.pattern && <p><strong>पैटर्न:</strong> {product.pattern}</p>}
                    {product.comfort && <p><strong>आराम:</strong> {product.comfort}</p>}
                    {product.finish && <p><strong>फिनिश:</strong> {product.finish}</p>}
                    <p><strong>मूल:</strong> {product.origin}</p>
                  </div>
                  <button className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">उत्पाद श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-pink-600 text-white'
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

        {/* Rajasthani Crafts */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">राजस्थानी शिल्प</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rajasthaniCrafts.map((craft, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{craft.craft}</h3>
                  <p className="text-gray-600 mb-2">{craft.description}</p>
                  <p className="text-pink-600 font-medium text-sm">{craft.origin}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="उत्पाद लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी उत्पाद' : productCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showRajasthaniCraftBadge={true}
                    showHandmadeBadge={true}
                    showTraditionalBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई उत्पाद नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top Vendors */}
        <section className="py-16 bg-gradient-to-r from-pink-100 to-orange-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध विक्रेता</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topVendors.map((vendor, index) => (
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
                    <p><strong>उत्पाद:</strong> {vendor.products}</p>
                    <p><strong>स्थान:</strong> {vendor.location}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                  </div>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">शॉपिंग टिप्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {shoppingTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold mb-2">{tip.tip}</h3>
                  <p className="text-gray-600">{tip.reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Heritage */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-orange-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">बापू बाजार की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                60 साल से बापू बाजार जयपुर का दिल है। यहाँ राजस्थान की समृद्ध संस्कृति और कलाकारी का खजाना मिलता है। 
                हर गली में बसी है पारंपरिक शिल्प की कहानी और आधुनिकता का मेल। 
                यह सिर्फ एक बाजार नहीं बल्कि राजस्थानी विरासत का जीवंत प्रतीक है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>पिंक सिटी, जयपुर, राजस्थान</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - रात 9:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>राजस्थानी हस्तशिल्प और वस्त्र</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BapuBazaar;
