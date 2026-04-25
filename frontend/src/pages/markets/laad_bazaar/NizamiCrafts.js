// Nizami Crafts Component for Laad Bazaar - Bharatshaala Platform
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

const NizamiCrafts = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [crafts, setCrafts] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const craftsInfo = {
    name: 'निज़ामी शिल्प केंद्र',
    nameEn: 'Nizami Crafts Center',
    description: 'हैदराबाद की शाही निज़ामी परंपरा के अनुसार बने हस्तशिल्प - रॉयल कलाकारी का खजाना',
    established: '18वीं सदी',
    speciality: 'निज़ामी आर्ट, रॉयल हैंडिक्राफ्ट्स',
    location: 'लाड बाजार, हैदराबाद',
    heroImage: '/images/markets/nizami-crafts.jpg'
  };

  const craftCategories = [
    { id: 'all', name: 'सभी निज़ामी शिल्प', icon: '👑' },
    { id: 'bidriware', name: 'बिदरी वर्क', icon: '⚫' },
    { id: 'zardozi', name: 'ज़रदोज़ी', icon: '🧵' },
    { id: 'calligraphy', name: 'कैलिग्राफी', icon: '✍️' },
    { id: 'metalwork', name: 'धातु शिल्प', icon: '⚒️' },
    { id: 'textiles', name: 'वस्त्र कला', icon: '🧶' },
    { id: 'jewelry', name: 'आभूषण', icon: '💎' }
  ];

  const featuredCrafts = [
    {
      name: 'बिदरी वाज़',
      description: 'पारंपरिक हैदराबादी बिदरी कला से बना फूलदान',
      craftsman: 'उस्ताद मोहम्मद हुसैन',
      price: '₹4,500',
      material: 'जिंक और कॉपर अल्लॉय',
      technique: 'सिल्वर इनले वर्क',
      origin: 'बीदर, कर्नाटक',
      age: '15वीं सदी की परंपरा',
      size: '12 इंच ऊंचाई'
    },
    {
      name: 'ज़रदोज़ी शेरवानी',
      description: 'हैंडमेड गोल्ड थ्रेड एम्ब्रॉयडरी शेरवानी',
      craftsman: 'अनीस अहमद',
      price: '₹15,000',
      material: 'सिल्क और गोल्ड थ्रेड',
      technique: 'हैंड एम्ब्रॉयडरी',
      origin: 'लखनऊ/हैदराबाद',
      age: 'मुगल काल की परंपरा',
      time: '3 महीने की मेहनत'
    },
    {
      name: 'निज़ामी कैलिग्राफी आर्ट',
      description: 'अरबी/उर्दू कैलिग्राफी में कुरान के आयतें',
      craftsman: 'ख्वाजा सलीम',
      price: '₹2,800',
      material: 'हैंडमेड पेपर और इंक',
      technique: 'क्लासिकल कैलिग्राफी',
      origin: 'इस्लामिक ट्रेडिशन',
      age: '7वीं सदी की कला',
      frame: 'वुडन फ्रेम के साथ'
    }
  ];

  const masterCraftsmen = [
    {
      name: 'उस्ताद अब्दुल रहमान',
      craft: 'बिदरी वर्क',
      experience: '45+ वर्ष',
      speciality: 'सिल्वर इनले आर्ट',
      awards: 'पद्म श्री 2015',
      lineage: '6 पीढ़ियों का कारोबार'
    },
    {
      name: 'मीर जाफर अली',
      craft: 'ज़रदोज़ी एम्ब्रॉयडरी',
      experience: '35+ वर्ष',
      speciality: 'गोल्ड थ्रेड वर्क',
      awards: 'राष्ट्रीय शिल्प पुरस्कार',
      lineage: 'मुगल दरबारी परिवार'
    },
    {
      name: 'ख्वाजा नसीरुद्दीन',
      craft: 'इस्लामिक कैलिग्राफी',
      experience: '30+ वर्ष',
      speciality: 'नस्तालीक़ स्क्रिप्ट',
      awards: 'तेलंगाना राज्य पुरस्कार',
      lineage: 'सूफी खानकाह परंपरा'
    }
  ];

  const nizamiTraditions = [
    {
      craft: 'बिदरी वर्क',
      origin: 'बीदर, कर्नाटक',
      technique: 'मेटल इनले वर्क',
      history: '15वीं सदी',
      specialty: 'ब्लैक मेटल पर सिल्वर डिज़ाइन'
    },
    {
      craft: 'ज़रदोज़ी',
      origin: 'मुगल दरबार',
      technique: 'गोल्ड थ्रेड एम्ब्रॉयडरी',
      history: '12वीं सदी',
      specialty: 'रॉयल गारमेंट्स'
    },
    {
      craft: 'कैलिग्राफी',
      origin: 'इस्लामिक ट्रेडिशन',
      technique: 'हैंड राइटिंग आर्ट',
      history: '7वीं सदी',
      specialty: 'धार्मिक टेक्स्ट्स'
    },
    {
      craft: 'गुलदस्ता',
      origin: 'निज़ामी दरबार',
      technique: 'फ्लोरल आर्ट',
      history: '18वीं सदी',
      specialty: 'सिल्क फ्लावर्स'
    }
  ];

  const craftProcesses = [
    {
      step: 'डिज़ाइन',
      description: 'पारंपरिक पैटर्न का चयन और स्केचिंग',
      time: '1-2 दिन'
    },
    {
      step: 'मटेरियल तैयारी',
      description: 'धातु, कपड़ा या अन्य सामग्री की तैयारी',
      time: '2-3 दिन'
    },
    {
      step: 'मुख्य कार्य',
      description: 'हैंड क्राफ्टिंग और डिटेल वर्क',
      time: '1-8 सप्ताह'
    },
    {
      step: 'फिनिशिंग',
      description: 'पॉलिशिंग और क्वालिटी चेक',
      time: '2-3 दिन'
    }
  ];

  useEffect(() => {
    trackPageView('laad_bazaar_nizami_crafts');
    loadCraftsData();
  }, []);

  const loadCraftsData = async () => {
    try {
      setLoading(true);
      
      const [craftsResponse, craftsmenResponse] = await Promise.all([
        apiService.get('/markets/laad-bazaar/nizami-crafts/crafts'),
        apiService.get('/markets/laad-bazaar/nizami-crafts/craftsmen')
      ]);

      if (craftsResponse.success) {
        setCrafts(craftsResponse.data);
      }

      if (craftsmenResponse.success) {
        setCraftsmen(craftsmenResponse.data);
      }
    } catch (error) {
      console.error('Failed to load crafts data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('nizami_craft_category_selected', {
      market: 'laad_bazaar',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_nizami_crafts', {
        productId: product.id,
        market: 'laad_bazaar',
        craftsman: product.craftsman
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_nizami_crafts', {
        productId: product.id,
        market: 'laad_bazaar'
      });
    }
  };

  const filteredCrafts = activeCategory === 'all' 
    ? crafts 
    : crafts.filter(craft => craft.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{craftsInfo.name} - भारतशाला | निज़ामी हस्तशिल्प</title>
        <meta name="description" content="लाड बाजार से निज़ामी परंपरा के हस्तशिल्प। बिदरी वर्क, ज़रदोज़ी, कैलिग्राफी और रॉयल हैदराबादी क्राफ्ट्स। मास्टर कारीगरों द्वारा निर्मित।" />
        <meta name="keywords" content="निज़ामी शिल्प, बिदरी वर्क, ज़रदोज़ी, हैदराबादी हैंडिक्राफ्ट्स, लाड बाजार, इस्लामिक आर्ट" />
        <link rel="canonical" href="https://bharatshaala.com/markets/laad-bazaar/nizami-crafts" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${craftsInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">👑</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{craftsInfo.name}</h1>
                  <p className="text-xl opacity-90">{craftsInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-indigo-200">{craftsInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-indigo-200">{craftsInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-indigo-200">{craftsInfo.location}</p>
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
              <span className="text-gray-900">निज़ामी शिल्प</span>
            </nav>
          </div>
        </div>

        {/* Featured Crafts */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख निज़ामी शिल्प</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCrafts.map((craft, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{craft.name}</h3>
                  <p className="text-gray-600 mb-3">{craft.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-600">{craft.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कारीगर:</strong> {craft.craftsman}</p>
                    <p><strong>सामग्री:</strong> {craft.material}</p>
                    <p><strong>तकनीक:</strong> {craft.technique}</p>
                    <p><strong>मूल:</strong> {craft.origin}</p>
                    <p><strong>परंपरा:</strong> {craft.age}</p>
                    {craft.size && <p><strong>साइज़:</strong> {craft.size}</p>}
                    {craft.time && <p><strong>समय:</strong> {craft.time}</p>}
                    {craft.frame && <p><strong>फ्रेम:</strong> {craft.frame}</p>}
                  </div>
                  <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">शिल्प श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {craftCategories.map((category) => (
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

        {/* Nizami Traditions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">निज़ामी शिल्प परंपराएं</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nizamiTraditions.map((tradition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tradition.craft}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {tradition.origin}</p>
                    <p><strong>तकनीक:</strong> {tradition.technique}</p>
                    <p><strong>इतिहास:</strong> {tradition.history}</p>
                    <p><strong>विशेषता:</strong> {tradition.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="निज़ामी शिल्प लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी निज़ामी शिल्प' : craftCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCrafts.map((craft) => (
                  <ProductCard
                    key={craft.id}
                    product={craft}
                    onAddToCart={() => handleAddToCart(craft)}
                    onAddToWishlist={() => handleAddToWishlist(craft)}
                    showRoyalBadge={true}
                    showHandmadeBadge={true}
                    showHeritageBadge={true}
                  />
                ))}
              </div>

              {filteredCrafts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई शिल्प नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Master Craftsmen */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मास्टर कारीगर</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {masterCraftsmen.map((craftsman, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{craftsman.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>शिल्प:</strong> {craftsman.craft}</p>
                    <p><strong>अनुभव:</strong> {craftsman.experience}</p>
                    <p><strong>विशेषता:</strong> {craftsman.speciality}</p>
                    <p><strong>पुरस्कार:</strong> {craftsman.awards}</p>
                    <p><strong>वंशावली:</strong> {craftsman.lineage}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Craft Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">शिल्प निर्माण प्रक्रिया</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {craftProcesses.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{process.step}</h3>
                  <p className="text-gray-600 text-sm mb-2">{process.description}</p>
                  <p className="text-purple-600 font-medium text-sm">{process.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Royal Heritage */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">निज़ामी शिल्प की शाही विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                निज़ामी शिल्प हैदराबाद रियासत की शाही परंपरा का प्रतीक हैं। ये कलाएं न सिर्फ सुंदरता बल्कि उच्च कोटि की कारीगरी 
                और कलात्मकता का प्रमाण हैं। हर शिल्प में बसी है सदियों पुरानी तकनीक और रॉयल एलिगेंस।
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">🏰</div>
                  <h3 className="text-xl font-semibold mb-2">रॉयल पैट्रोनेज</h3>
                  <p className="text-gray-600">निज़ामों का संरक्षण और प्रोत्साहन</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">कलात्मक उत्कृष्टता</h3>
                  <p className="text-gray-600">विश्व स्तरीय शिल्पकारी और डिज़ाइन</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="text-xl font-semibold mb-2">सांस्कृतिक विरासत</h3>
                  <p className="text-gray-600">सदियों पुरानी परंपराओं का संरक्षण</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nizami Heritage */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">निज़ामी शिल्प की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                300 साल से निज़ामी शिल्प केंद्र हैदराबाद की शाही परंपरा को जीवित रखे हुए है। यहाँ की हर कलाकृति में बसी है 
                निज़ामों के दरबार की शान, मुगल कालीन तकनीक और इस्लामिक कला की सुंदरता। 
                ये शिल्प न सिर्फ कलाकारी हैं बल्कि हमारी सांस्कृतिक पहचान के वाहक भी हैं।
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
                  <p>सुबह 10:00 - रात 8:00 (सोमवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>रॉयल निज़ामी हैंडिक्राफ्ट्स</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NizamiCrafts;
