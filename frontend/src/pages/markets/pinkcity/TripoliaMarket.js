// Tripolia Market Component for Pink City - Bharatshaala Platform
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

const TripoliaMarket = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const marketInfo = {
    name: 'त्रिपोलिया मार्केट',
    nameEn: 'Tripolia Market',
    description: 'जयपुर का ऐतिहासिक बाजार - धातु शिल्प और पारंपरिक हस्तकला का केंद्र',
    established: '1727',
    speciality: 'मेटल क्राफ्ट, ब्रास वर्क, कॉपर आइटम्स',
    location: 'पिंक सिटी, जयपुर',
    heroImage: '/images/markets/tripolia-market.jpg'
  };

  const productCategories = [
    { id: 'all', name: 'सभी उत्पाद', icon: '⚒️' },
    { id: 'brass-items', name: 'पीतल के सामान', icon: '🥇' },
    { id: 'copper-vessels', name: 'तांबे के बर्तन', icon: '🔶' },
    { id: 'iron-crafts', name: 'लोहे की कलाकृतियां', icon: '🔩' },
    { id: 'utensils', name: 'बर्तन', icon: '🍳' },
    { id: 'decoratives', name: 'सजावटी सामान', icon: '🏺' },
    { id: 'religious-items', name: 'धार्मिक सामान', icon: '🕉️' }
  ];

  const featuredProducts = [
    {
      name: 'हैंडक्राफ्टेड ब्रास वाज़',
      description: 'पारंपरिक राजस्थानी डिज़ाइन में पीतल का फूलदान',
      artisan: 'रामचंद्र मेटल वर्क्स',
      price: '₹3,500',
      material: 'प्योर ब्रास',
      technique: 'हैंड एंग्रेविंग',
      size: '12 इंच ऊंचाई',
      weight: '1.5 किग्रा',
      finish: 'एंटीक गोल्ड'
    },
    {
      name: 'कॉपर वॉटर बॉटल',
      description: 'आयुर्वेदिक गुणों के साथ तांबे की पानी की बोतल',
      artisan: 'तांबा शिल्प केंद्र',
      price: '₹1,200',
      material: '99.9% प्योर कॉपर',
      capacity: '1 लीटर',
      benefits: 'एंटी-बैक्टीरियल',
      maintenance: 'आसान सफाई',
      certification: 'फूड सेफ'
    },
    {
      name: 'आयरन कैंडल स्टैंड',
      description: 'राजपूत शैली में बना लोहे का दीपक स्टैंड',
      artisan: 'लोहार शिल्प समूह',
      price: '₹2,800',
      material: 'रिसाइकल्ड आयरन',
      style: 'राजपूती डिज़ाइन',
      finish: 'ब्लैक एंटीक',
      usage: 'इंडोर/आउटडोर',
      durability: '25+ वर्ष'
    }
  ];

  const masterArtisans = [
    {
      name: 'रामचंद्र सोनी',
      craft: 'ब्रास एंग्रेविंग',
      experience: '40+ वर्ष',
      specialty: 'रिलीजियस आइटम्स',
      awards: 'राष्ट्रीय शिल्प पुरस्कार',
      family: '4 पीढ़ियों का कारोबार'
    },
    {
      name: 'मुकेश तांबा वाला',
      craft: 'कॉपर वेसल मेकिंग',
      experience: '35+ वर्ष',
      specialty: 'किचन यूटेंसिल्स',
      awards: 'राजस्थान राज्य पुरस्कार',
      family: 'हेरेडिटरी कॉपर स्मिथ'
    },
    {
      name: 'भवानी लाल लोहार',
      craft: 'आयरन फोर्जिंग',
      experience: '45+ वर्ष',
      specialty: 'डेकोरेटिव आइटम्स',
      awards: 'शिल्प गुरु सम्मान',
      family: 'पारंपरिक लोहार परिवार'
    }
  ];

  const metalProperties = [
    {
      metal: 'पीतल (Brass)',
      properties: ['एंटी-बैक्टीरियल', 'कॉरोजन रेसिस्टेंट', 'डयूरेबल'],
      uses: ['बर्तन', 'सजावटी सामान', 'धार्मिक वस्तुएं'],
      care: 'नियमित पॉलिशिंग'
    },
    {
      metal: 'तांबा (Copper)',
      properties: ['आयुर्वेदिक गुण', 'एंटी-माइक्रोबियल', 'हेल्थ बेनिफिट्स'],
      uses: ['पानी की बोतल', 'खाना पकाने के बर्तन', 'योग एक्सेसरीज'],
      care: 'नींबू और नमक से सफाई'
    },
    {
      metal: 'लोहा (Iron)',
      properties: ['मजबूत', 'लॉन्ग लास्टिंग', 'रीसाइकलेबल'],
      uses: ['डेकोरेटिव आइटम्स', 'फर्नीचर', 'गार्डन एक्सेसरीज'],
      care: 'रस्ट प्रोटेक्शन'
    },
    {
      metal: 'कांसा (Bronze)',
      properties: ['ट्रेडिशनल', 'रेसोनेंट', 'ऑक्सीडेशन रेसिस्टेंट'],
      uses: ['मूर्तियां', 'घंटियां', 'थालियां'],
      care: 'मुलायम कपड़े से सफाई'
    }
  ];

  const craftingProcess = [
    {
      step: 'डिज़ाइन तैयारी',
      description: 'पारंपरिक पैटर्न का चयन और स्केच',
      time: '1-2 दिन'
    },
    {
      step: 'मेटल प्रिपरेशन',
      description: 'धातु को साफ करना और शेप देना',
      time: '2-3 दिन'
    },
    {
      step: 'शेपिंग/फोर्जिंग',
      description: 'हथौड़े और टूल्स से आकार देना',
      time: '3-7 दिन'
    },
    {
      step: 'एंग्रेविंग/डेकोरेशन',
      description: 'हैंड टूल्स से डिज़ाइन बनाना',
      time: '5-10 दिन'
    },
    {
      step: 'फिनिशिंग',
      description: 'पॉलिशिंग और क्वालिटी चेक',
      time: '1-2 दिन'
    }
  ];

  const healthBenefits = [
    { metal: 'तांबा', benefit: 'पानी को प्यूरिफाई करता है', science: 'ऑलिगोडायनामिक इफेक्ट' },
    { metal: 'पीतल', benefit: 'एंटी-बैक्टीरियल गुण', science: 'कॉपर-जिंक एलॉय' },
    { metal: 'कांसा', benefit: 'फूड सेफ मटेरियल', science: 'कॉपर-टिन कंपोज़िशन' },
    { metal: 'स्टेनलेस स्टील', benefit: 'हाइजीनिक और डयूरेबल', science: 'आयरन-क्रोमियम एलॉय' }
  ];

  useEffect(() => {
    trackPageView('pinkcity_tripolia_market');
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, artisansResponse] = await Promise.all([
        apiService.get('/markets/pinkcity/tripolia-market/products'),
        apiService.get('/markets/pinkcity/tripolia-market/artisans')
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }

      if (artisansResponse.success) {
        setArtisans(artisansResponse.data);
      }
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('tripolia_market_category_selected', {
      market: 'pinkcity',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_tripolia_market', {
        productId: product.id,
        market: 'pinkcity',
        artisan: product.artisan
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_tripolia_market', {
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
        <title>{marketInfo.name} - भारतशाला | जयपुर का ऐतिहासिक धातु शिल्प बाजार</title>
        <meta name="description" content="त्रिपोलिया मार्केट जयपुर से पारंपरिक धातु शिल्प। पीतल, तांबा, लोहे के बर्तन और हस्तशिल्प। हैंडमेड मेटल क्राफ्ट्स।" />
        <meta name="keywords" content="त्रिपोलिया मार्केट, जयपुर मेटल क्राफ्ट, पीतल के बर्तन, तांबे के बर्तन, धातु शिल्प, हैंडमेड मेटल आइटम्स" />
        <link rel="canonical" href="https://bharatshaala.com/markets/pinkcity/tripolia-market" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
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
                <span className="text-6xl">⚒️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{marketInfo.name}</h1>
                  <p className="text-xl opacity-90">{marketInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-red-200">{marketInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-red-200">{marketInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-red-200">{marketInfo.location}</p>
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
              <span className="text-gray-900">त्रिपोलिया मार्केट</span>
            </nav>
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-12 bg-orange-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख धातु शिल्प</h2>
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
                    <span className="text-2xl font-bold text-orange-600">{product.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कारीगर:</strong> {product.artisan}</p>
                    <p><strong>सामग्री:</strong> {product.material}</p>
                    {product.technique && <p><strong>तकनीक:</strong> {product.technique}</p>}
                    {product.size && <p><strong>साइज़:</strong> {product.size}</p>}
                    {product.weight && <p><strong>वजन:</strong> {product.weight}</p>}
                    {product.capacity && <p><strong>क्षमता:</strong> {product.capacity}</p>}
                    {product.style && <p><strong>स्टाइल:</strong> {product.style}</p>}
                    {product.finish && <p><strong>फिनिश:</strong> {product.finish}</p>}
                    {product.benefits && <p><strong>फायदे:</strong> {product.benefits}</p>}
                    {product.usage && <p><strong>उपयोग:</strong> {product.usage}</p>}
                    {product.maintenance && <p><strong>रखरखाव:</strong> {product.maintenance}</p>}
                    {product.certification && <p><strong>सर्टिफिकेशन:</strong> {product.certification}</p>}
                    {product.durability && <p><strong>टिकाऊपन:</strong> {product.durability}</p>}
                  </div>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
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
                      ? 'bg-orange-600 text-white'
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

        {/* Metal Properties */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">धातुओं के गुण</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {metalProperties.map((metal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{metal.metal}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">गुण:</p>
                      {metal.properties.map((property, propIndex) => (
                        <div key={propIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {property}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">उपयोग:</p>
                      {metal.uses.map((use, useIndex) => (
                        <div key={useIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {use}
                        </div>
                      ))}
                    </div>
                    <p className="text-orange-600 font-medium text-sm">देखभाल: {metal.care}</p>
                  </div>
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
                    showHandcraftedBadge={true}
                    showMetalQualityBadge={true}
                    showTraditionalBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚒️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई उत्पाद नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Master Artisans */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मास्टर कारीगर</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {masterArtisans.map((artisan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🔧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>शिल्प:</strong> {artisan.craft}</p>
                    <p><strong>अनुभव:</strong> {artisan.experience}</p>
                    <p><strong>विशेषता:</strong> {artisan.specialty}</p>
                    <p><strong>पुरस्कार:</strong> {artisan.awards}</p>
                    <p><strong>पारिवारिक:</strong> {artisan.family}</p>
                  </div>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Crafting Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">शिल्प निर्माण प्रक्रिया</h2>
            <div className="grid md:grid-cols-5 gap-6">
              {craftingProcess.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{process.step}</h3>
                  <p className="text-gray-600 text-sm mb-2">{process.description}</p>
                  <p className="text-orange-600 font-medium text-sm">{process.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Benefits */}
        <section className="py-16 bg-orange-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्वास्थ्य लाभ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {healthBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">🏥</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.metal}</h3>
                  <p className="text-gray-600 mb-2">{benefit.benefit}</p>
                  <p className="text-orange-600 font-medium text-sm">{benefit.science}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Heritage */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">त्रिपोलिया मार्केट की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                300 साल से त्रिपोलिया मार्केट जयपुर की धातु शिल्प की राजधानी है। महाराजा सवाई जय सिंह द्वारा स्थापित यह बाजार 
                आज भी अपनी पारंपरिक कलाकारी और गुणवत्ता के लिए विश्व प्रसिद्ध है। यहाँ के कारीगरों की तकनीक पीढ़ियों से चली 
                आ रही है और आज भी उसी मेहनत और लगन से बेहतरीन धातु शिल्प बनाए जाते हैं।
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
                  <p>सुबह 9:00 - शाम 7:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">⚒️</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>पारंपरिक धातु शिल्प और बर्तन</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TripoliaMarket;
