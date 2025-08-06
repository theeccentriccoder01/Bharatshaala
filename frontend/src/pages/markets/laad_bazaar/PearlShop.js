// Pearl Shop Component for Laad Bazaar - Bharatshaala Platform
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

const PearlShop = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [pearls, setPearls] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const shopInfo = {
    name: 'लाड बाजार मोती दुकान',
    nameEn: 'Laad Bazaar Pearl Shop',
    description: 'हैदराबाद की विश्व प्रसिद्ध मोती की दुकान - प्राकृतिक और कल्चर्ड पर्ल्स का स्वर्ग',
    established: '1880s',
    speciality: 'हैदराबादी पर्ल्स, पर्ल ज्वेलरी',
    location: 'लाड बाजार, हैदराबाद',
    heroImage: '/images/markets/laad-bazaar-pearls.jpg'
  };

  const pearlCategories = [
    { id: 'all', name: 'सभी मोती', icon: '🦪' },
    { id: 'natural-pearls', name: 'प्राकृतिक मोती', icon: '💎' },
    { id: 'cultured-pearls', name: 'कल्चर्ड पर्ल्स', icon: '⚪' },
    { id: 'pearl-jewelry', name: 'पर्ल ज्वेलरी', icon: '📿' },
    { id: 'pearl-sets', name: 'पर्ल सेट्स', icon: '💍' },
    { id: 'loose-pearls', name: 'लूज़ पर्ल्स', icon: '🔴' },
    { id: 'designer-pieces', name: 'डिज़ाइनर पीसेस', icon: '✨' }
  ];

  const featuredPearls = [
    {
      name: 'हैदराबादी नेचुरल पर्ल नेकलेस',
      description: 'बसरा की खाड़ी से प्राकृतिक मोतियों का हार',
      dealer: 'हाजी मोहम्मद पर्ल मर्चेंट',
      price: '₹45,000',
      origin: 'बसरा खाड़ी, इराक',
      size: '6-10mm',
      quality: 'AAA ग्रेड',
      luster: 'हाई लस्टर',
      certificate: 'जेमोलॉजिकल सर्टिफाइड'
    },
    {
      name: 'कल्चर्ड पर्ल टिकका सेट',
      description: 'दुल्हन के लिए पारंपरिक पर्ल टिकका',
      dealer: 'निज़ाम पर्ल हाउस',
      price: '₹8,500',
      origin: 'जापान/चीन',
      size: '4-8mm',
      quality: 'AA+ ग्रेड',
      setting: 'गोल्ड प्लेटेड',
      pieces: '5 पीस सेट'
    },
    {
      name: 'साउथ सी पर्ल इयरिंग्स',
      description: 'दक्षिण सागर के बड़े मोतियों की बालियां',
      dealer: 'रॉयल पर्ल कलेक्शन',
      price: '₹15,000',
      origin: 'ऑस्ट्रेलिया/फिलीपींस',
      size: '10-12mm',
      quality: 'AA ग्रेड',
      color: 'गोल्डन/सिल्वर',
      style: 'क्लासिक ड्रॉप'
    }
  ];

  const topDealers = [
    {
      name: 'हाजी मोहम्मद पर्ल मर्चेंट',
      speciality: 'नेचुरल पर्ल्स',
      experience: '70+ वर्ष',
      reputation: 'इंटरनेशनल डीलर',
      certification: 'GIA सर्टिफाइड',
      heritage: '4 पीढ़ियों का कारोबार'
    },
    {
      name: 'निज़ाम पर्ल हाउस',
      speciality: 'ब्राइडल कलेक्शन',
      experience: '50+ वर्ष',
      reputation: 'रॉयल सप्लायर',
      certification: 'पर्ल एक्सपर्ट',
      heritage: 'निज़ामी दरबार से जुड़ाव'
    },
    {
      name: 'रॉयल पर्ल कलेक्शन',
      speciality: 'साउथ सी पर्ल्स',
      experience: '35+ वर्ष',
      reputation: 'प्रीमियम डीलर',
      certification: 'इंटरनेशनल स्टैंडर्ड',
      heritage: 'मॉडर्न पर्ल एक्सपर्ट'
    }
  ];

  const pearlTypes = [
    {
      type: 'नेचुरल पर्ल्स',
      origin: 'प्राकृतिक सीप',
      formation: 'प्राकृतिक प्रक्रिया',
      timeToForm: '5-20 साल',
      rarity: 'अत्यंत दुर्लभ',
      value: 'सबसे महंगे'
    },
    {
      type: 'कल्चर्ड पर्ल्स',
      origin: 'फार्म्ड सीप',
      formation: 'मानव सहायता',
      timeToForm: '6 महीने - 6 साल',
      rarity: 'कॉमन',
      value: 'किफायती'
    },
    {
      type: 'अकोया पर्ल्स',
      origin: 'जापान',
      formation: 'कल्चर्ड',
      timeToForm: '10-16 महीने',
      rarity: 'कम',
      value: 'मध्यम'
    },
    {
      type: 'साउथ सी पर्ल्स',
      origin: 'ऑस्ट्रेलिया',
      formation: 'कल्चर्ड',
      timeToForm: '2-3 साल',
      rarity: 'दुर्लभ',
      value: 'महंगे'
    }
  ];

  const pearlGrading = [
    { grade: 'AAA', luster: 'एक्सीलेंट', surface: 'क्लीन', shape: 'राउंड', value: 'प्रीमियम' },
    { grade: 'AA+', luster: 'वेरी गुड', surface: 'नियर क्लीन', shape: 'नियर राउंड', value: 'हाई' },
    { grade: 'AA', luster: 'गुड', surface: 'लाइट स्पॉट्स', shape: 'ऑफ राउंड', value: 'मीडियम' },
    { grade: 'A', luster: 'फेयर', surface: 'स्पॉट्स', shape: 'इरेगुलर', value: 'बेसिक' }
  ];

  const careInstructions = [
    { instruction: 'सॉफ्ट क्लॉथ', description: 'हमेशा मुलायम कपड़े से साफ करें' },
    { instruction: 'केमिकल्स से बचाव', description: 'परफ्यूम, लोशन से दूर रखें' },
    { instruction: 'अलग स्टोरेज', description: 'अन्य ज्वेलरी से अलग रखें' },
    { instruction: 'नमी कंट्रोल', description: 'सूखी जगह पर स्टोर करें' }
  ];

  useEffect(() => {
    trackPageView('laad_bazaar_pearl_shop');
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      const [pearlsResponse, dealersResponse] = await Promise.all([
        apiService.get('/markets/laad-bazaar/pearl-shop/pearls'),
        apiService.get('/markets/laad-bazaar/pearl-shop/dealers')
      ]);

      if (pearlsResponse.success) {
        setPearls(pearlsResponse.data);
      }

      if (dealersResponse.success) {
        setDealers(dealersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('pearl_category_selected', {
      market: 'laad_bazaar',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_pearl_shop', {
        productId: product.id,
        market: 'laad_bazaar',
        dealer: product.dealer
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_pearl_shop', {
        productId: product.id,
        market: 'laad_bazaar'
      });
    }
  };

  const filteredPearls = activeCategory === 'all' 
    ? pearls 
    : pearls.filter(pearl => pearl.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{shopInfo.name} - भारतशाला | हैदराबाद के प्रसिद्ध मोती</title>
        <meta name="description" content="लाड बाजार से हैदराबाद के विश्व प्रसिद्ध मोती। नेचुरल पर्ल्स, कल्चर्ड पर्ल्स, पर्ल ज्वेलरी और सर्टिफाइड हैदराबादी पर्ल्स।" />
        <meta name="keywords" content="हैदराबाद मोती, लाड बाजार पर्ल्स, नेचुरल पर्ल्स, पर्ल ज्वेलरी, हैदराबादी पर्ल, मोती की दुकान" />
        <link rel="canonical" href="https://bharatshaala.com/markets/laad-bazaar/pearl-shop" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
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
                <span className="text-6xl">🦪</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{shopInfo.name}</h1>
                  <p className="text-xl opacity-90">{shopInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-cyan-200">{shopInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-cyan-200">{shopInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-cyan-200">{shopInfo.location}</p>
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
              <span className="text-gray-900">मोती दुकान</span>
            </nav>
          </div>
        </div>

        {/* Featured Pearls */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख पर्ल कलेक्शन</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPearls.map((pearl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pearl.name}</h3>
                  <p className="text-gray-600 mb-3">{pearl.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-blue-600">{pearl.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>डीलर:</strong> {pearl.dealer}</p>
                    <p><strong>मूल:</strong> {pearl.origin}</p>
                    <p><strong>साइज़:</strong> {pearl.size}</p>
                    <p><strong>क्वालिटी:</strong> {pearl.quality}</p>
                    {pearl.luster && <p><strong>लस्टर:</strong> {pearl.luster}</p>}
                    {pearl.setting && <p><strong>सेटिंग:</strong> {pearl.setting}</p>}
                    {pearl.color && <p><strong>रंग:</strong> {pearl.color}</p>}
                    {pearl.style && <p><strong>स्टाइल:</strong> {pearl.style}</p>}
                    {pearl.pieces && <p><strong>पीसेस:</strong> {pearl.pieces}</p>}
                    {pearl.certificate && <p><strong>सर्टिफिकेट:</strong> {pearl.certificate}</p>}
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">पर्ल श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {pearlCategories.map((category) => (
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

        {/* Pearl Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मोतियों के प्रकार</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pearlTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.type}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {type.origin}</p>
                    <p><strong>निर्माण:</strong> {type.formation}</p>
                    <p><strong>समय:</strong> {type.timeToForm}</p>
                    <p><strong>दुर्लभता:</strong> {type.rarity}</p>
                    <p><strong>मूल्य:</strong> {type.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="मोती लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी मोती' : pearlCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPearls.map((pearl) => (
                  <ProductCard
                    key={pearl.id}
                    product={pearl}
                    onAddToCart={() => handleAddToCart(pearl)}
                    onAddToWishlist={() => handleAddToWishlist(pearl)}
                    showCertifiedBadge={true}
                    showPearlGradeBadge={true}
                    showAuthenticityBadge={true}
                  />
                ))}
              </div>

              {filteredPearls.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🦪</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई मोती नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top Dealers */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-cyan-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध मोती व्यापारी</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topDealers.map((dealer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dealer.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {dealer.speciality}</p>
                    <p><strong>अनुभव:</strong> {dealer.experience}</p>
                    <p><strong>प्रतिष्ठा:</strong> {dealer.reputation}</p>
                    <p><strong>सर्टिफिकेशन:</strong> {dealer.certification}</p>
                    <p><strong>विरासत:</strong> {dealer.heritage}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    कलेक्शन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pearl Grading */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">पर्ल ग्रेडिंग सिस्टम</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pearlGrading.map((grade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">ग्रेड {grade.grade}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>लस्टर:</strong> {grade.luster}</p>
                    <p><strong>सरफेस:</strong> {grade.surface}</p>
                    <p><strong>शेप:</strong> {grade.shape}</p>
                    <p><strong>मूल्य:</strong> {grade.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मोतियों की देखभाल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {careInstructions.map((instruction, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">💧</div>
                  <h3 className="text-xl font-semibold mb-2">{instruction.instruction}</h3>
                  <p className="text-gray-600">{instruction.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authentication Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">मोती प्रमाणीकरण प्रक्रिया</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                हमारे सभी मोती विशेषज्ञों द्वारा जांचे जाते हैं और प्रामाणिक सर्टिफिकेट के साथ बेचे जाते हैं। 
                हर मोती की गुणवत्ता, मूल और ग्रेड की पूरी जानकारी प्रदान की जाती है।
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषज्ञ जांच</h3>
                  <p className="text-gray-600">सर्टिफाइड जेमोलॉजिस्ट द्वारा परीक्षण</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">📜</div>
                  <h3 className="text-xl font-semibold mb-2">प्रमाण पत्र</h3>
                  <p className="text-gray-600">अंतर्राष्ट्रीय मानकों के अनुसार सर्टिफिकेट</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🛡️</div>
                  <h3 className="text-xl font-semibold mb-2">गुणवत्ता गारंटी</h3>
                  <p className="text-gray-600">100% प्रामाणिकता की गारंटी</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pearl Heritage */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">हैदराबाद पर्ल की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                140 साल से लाड बाजार मोती दुकान हैदराबाद को विश्व की पर्ल कैपिटल बनाने में योगदान दे रही है। 
                यहाँ निज़ामों के समय से चली आ रही मोती व्यापार की परंपरा आज भी जीवित है। 
                हर मोती में छुपी है समुद्र की गहराई और कारीगरों की कलाकारी की कहानी।
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
                  <div className="text-4xl mb-4">🦪</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>विश्व प्रसिद्ध हैदराबादी पर्ल्स</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PearlShop;