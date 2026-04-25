// Johri Market Component for Pink City - Bharatshaala Platform
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

const JohriMarket = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [jewelry, setJewelry] = useState([]);
  const [jewelers, setJewelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const marketInfo = {
    name: 'जौहरी मार्केट',
    nameEn: 'Johri Market',
    description: 'जयपुर का प्रसिद्ध ज्वेलरी मार्केट - राजस्थानी आभूषणों और रत्नों का केंद्र',
    established: '1930s',
    speciality: 'कुंदन, मीनाकारी, पॉकी स्टोन ज्वेलरी',
    location: 'पिंक सिटी, जयपुर',
    heroImage: '/images/markets/johri-market.jpg'
  };

  const jewelryCategories = [
    { id: 'all', name: 'सभी आभूषण', icon: '💎' },
    { id: 'kundan', name: 'कुंदन ज्वेलरी', icon: '👑' },
    { id: 'meenakari', name: 'मीनाकारी', icon: '🎨' },
    { id: 'polki', name: 'पॉकी स्टोन', icon: '💍' },
    { id: 'rajasthani-sets', name: 'राजस्थानी सेट्स', icon: '📿' },
    { id: 'antique', name: 'एंटीक ज्वेलरी', icon: '🏺' },
    { id: 'silver', name: 'सिल्वर ज्वेलरी', icon: '⚪' }
  ];

  const featuredJewelry = [
    {
      name: 'कुंदन ब्राइडल सेट',
      description: 'हैवी कुंदन वर्क के साथ कम्प्लीट ब्राइडल सेट',
      jeweler: 'राज ज्वेलर्स',
      price: '₹85,000',
      metal: '22K गोल्ड प्लेटेड',
      stones: 'कुंदन, पर्ल, एमराल्ड',
      weight: '150 ग्राम',
      includes: 'नेकलेस, इयरिंग्स, मांगटीका, नोज रिंग',
      warranty: '1 साल वारंटी'
    },
    {
      name: 'मीनाकारी चांदी का हार',
      description: 'ट्रेडिशनल मीनाकारी वर्क सिल्वर नेकलेस',
      jeweler: 'सिल्वर पैलेस',
      price: '₹12,500',
      metal: '92.5% प्योर सिल्वर',
      work: 'हैंड पेंटेड मीनाकारी',
      design: 'फ्लोरल मोटिफ्स',
      length: '16 इंच',
      care: 'एंटी-टार्निश कोटिंग'
    },
    {
      name: 'पॉकी डायमंड इयरिंग्स',
      description: 'अनकट डायमंड्स के साथ एलिगेंट इयरिंग्स',
      jeweler: 'हेरिटेज ज्वेलर्स',
      price: '₹45,000',
      metal: '18K व्हाइट गोल्ड',
      stones: 'पॉकी डायमंड्स',
      certification: 'IGI सर्टिफाइड',
      style: 'चांदबाली स्टाइल',
      occasion: 'फेस्टिवल वेयर'
    }
  ];

  const topJewelers = [
    {
      name: 'राज ज्वेलर्स',
      specialty: 'कुंदन और पॉकी ज्वेलरी',
      experience: '75+ वर्ष',
      location: 'जौहरी बाजार मेन रोड',
      certification: 'BIS हॉलमार्क',
      rating: 4.8,
      heritage: '3 पीढ़ियों का कारोबार'
    },
    {
      name: 'सिल्वर पैलेस',
      specialty: 'मीनाकारी सिल्वर ज्वेलरी',
      experience: '50+ वर्ष',
      location: 'चांदी की टकसाल',
      certification: 'हॉलमार्क सिल्वर',
      rating: 4.7,
      heritage: 'ट्रेडिशनल क्राफ्ट्समेन'
    },
    {
      name: 'हेरिटेज ज्वेलर्स',
      specialty: 'डायमंड और प्रीशियस स्टोन्स',
      experience: '40+ वर्ष',
      location: 'गोपाल जी का रास्ता',
      certification: 'GIA/IGI सर्टिफाइड',
      rating: 4.9,
      heritage: 'इंटरनेशनल क्वालिटी'
    }
  ];

  const craftTechniques = [
    {
      technique: 'कुंदन सेटिंग',
      description: '24K गोल्ड फॉयल में स्टोन सेटिंग',
      origin: 'राजस्थान/गुजरात',
      timeRequired: '15-30 दिन'
    },
    {
      technique: 'मीनाकारी',
      description: 'रंगीन एनामल पेंटिंग',
      origin: 'जयपुर',
      timeRequired: '10-20 दिन'
    },
    {
      technique: 'पॉकी कटिंग',
      description: 'अनकट डायमंड्स की नेचुरल शाइन',
      origin: 'सूरत/जयपुर',
      timeRequired: '7-15 दिन'
    },
    {
      technique: 'जाली वर्क',
      description: 'डेलिकेट मेटल फिलाग्री',
      origin: 'जयपुर',
      timeRequired: '20-40 दिन'
    }
  ];

  const gemstoneGuide = [
    { stone: 'रूबी (माणिक)', properties: 'साहस और शक्ति', price: '₹5,000-50,000/कैरेट' },
    { stone: 'एमराल्ड (पन्ना)', properties: 'बुद्धि और समृद्धि', price: '₹3,000-30,000/कैरेट' },
    { stone: 'सैफायर (नीलम)', properties: 'शांति और स्थिरता', price: '₹2,000-25,000/कैरेट' },
    { stone: 'पर्ल (मोती)', properties: 'शुद्धता और शांति', price: '₹500-10,000/रत्ती' }
  ];

  const careInstructions = [
    { care: 'सॉफ्ट ब्रश', description: 'मुलायम ब्रश से साफ करें' },
    { care: 'अलग स्टोरेज', description: 'हर पीस को अलग रखें' },
    { care: 'केमिकल्स से बचाव', description: 'परफ्यूम/लोशन से दूर रखें' },
    { care: 'रेगुलर पॉलिशिंग', description: '6 महीने में पॉलिश कराएं' }
  ];

  useEffect(() => {
    trackPageView('pinkcity_johri_market');
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      const [jewelryResponse, jewelersResponse] = await Promise.all([
        apiService.get('/markets/pinkcity/johri-market/jewelry'),
        apiService.get('/markets/pinkcity/johri-market/jewelers')
      ]);

      if (jewelryResponse.success) {
        setJewelry(jewelryResponse.data);
      }

      if (jewelersResponse.success) {
        setJewelers(jewelersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('johri_market_category_selected', {
      market: 'pinkcity',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_johri_market', {
        productId: product.id,
        market: 'pinkcity',
        jeweler: product.jeweler
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_johri_market', {
        productId: product.id,
        market: 'pinkcity'
      });
    }
  };

  const filteredJewelry = activeCategory === 'all' 
    ? jewelry 
    : jewelry.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{marketInfo.name} - भारतशाला | जयपुर की प्रसिद्ध ज्वेलरी मार्केट</title>
        <meta name="description" content="जौहरी मार्केट जयपुर से कुंदन, मीनाकारी, पॉकी स्टोन ज्वेलरी खरीदें। राजस्थानी ट्रेडिशनल आभूषण और हॉलमार्क ज्वेलरी।" />
        <meta name="keywords" content="जौहरी मार्केट, जयपुर ज्वेलरी, कुंदन ज्वेलरी, मीनाकारी, पॉकी स्टोन, राजस्थानी आभूषण, हॉलमार्क ज्वेलरी" />
        <link rel="canonical" href="https://bharatshaala.com/markets/pinkcity/johri-market" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-16">
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
                <span className="text-6xl">💎</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{marketInfo.name}</h1>
                  <p className="text-xl opacity-90">{marketInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-amber-200">{marketInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-amber-200">{marketInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-amber-200">{marketInfo.location}</p>
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
              <span className="text-gray-900">जौहरी मार्केट</span>
            </nav>
          </div>
        </div>

        {/* Featured Jewelry */}
        <section className="py-12 bg-yellow-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रीमियम ज्वेलरी कलेक्शन</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredJewelry.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>ज्वेलर:</strong> {item.jeweler}</p>
                    <p><strong>मेटल:</strong> {item.metal}</p>
                    {item.stones && <p><strong>स्टोन्स:</strong> {item.stones}</p>}
                    {item.work && <p><strong>वर्क:</strong> {item.work}</p>}
                    {item.weight && <p><strong>वजन:</strong> {item.weight}</p>}
                    {item.design && <p><strong>डिज़ाइन:</strong> {item.design}</p>}
                    {item.length && <p><strong>लंबाई:</strong> {item.length}</p>}
                    {item.certification && <p><strong>सर्टिफिकेशन:</strong> {item.certification}</p>}
                    {item.style && <p><strong>स्टाइल:</strong> {item.style}</p>}
                    {item.includes && <p><strong>शामिल:</strong> {item.includes}</p>}
                    {item.care && <p><strong>केयर:</strong> {item.care}</p>}
                    {item.warranty && <p><strong>वारंटी:</strong> {item.warranty}</p>}
                    {item.occasion && <p><strong>अवसर:</strong> {item.occasion}</p>}
                  </div>
                  <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ज्वेलरी श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {jewelryCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-yellow-600 text-white'
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

        {/* Craft Techniques */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">पारंपरिक तकनीकें</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {craftTechniques.map((technique, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{technique.technique}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>विवरण:</strong> {technique.description}</p>
                    <p><strong>मूल:</strong> {technique.origin}</p>
                    <p><strong>समय:</strong> {technique.timeRequired}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="ज्वेलरी लोड हो रही है..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी आभूषण' : jewelryCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredJewelry.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={() => handleAddToCart(item)}
                    onAddToWishlist={() => handleAddToWishlist(item)}
                    showHallmarkBadge={true}
                    showCertifiedBadge={true}
                    showTraditionalBadge={true}
                  />
                ))}
              </div>

              {filteredJewelry.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई आभूषण नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top Jewelers */}
        <section className="py-16 bg-gradient-to-r from-yellow-100 to-amber-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध ज्वेलर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topJewelers.map((jeweler, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">💍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{jeweler.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {jeweler.specialty}</p>
                    <p><strong>अनुभव:</strong> {jeweler.experience}</p>
                    <p><strong>स्थान:</strong> {jeweler.location}</p>
                    <p><strong>सर्टिफिकेशन:</strong> {jeweler.certification}</p>
                    <p><strong>विरासत:</strong> {jeweler.heritage}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(jeweler.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{jeweler.rating}</span>
                  </div>
                  <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200">
                    कलेक्शन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gemstone Guide */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">रत्न गाइड</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {gemstoneGuide.map((gem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{gem.stone}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>गुण:</strong> {gem.properties}</p>
                    <p><strong>मूल्य सीमा:</strong> {gem.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="py-16 bg-yellow-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">ज्वेलरी की देखभाल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {careInstructions.map((instruction, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-2">{instruction.care}</h3>
                  <p className="text-gray-600">{instruction.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Market Heritage */}
        <section className="py-16 bg-gradient-to-r from-yellow-600 to-amber-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">जौहरी मार्केट की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                90 साल से जौहरी मार्केट राजस्थान की ज्वेलरी कैपिटल है। यहाँ की हर दुकान में छुपा है सदियों पुराने 
                कुंदन और मीनाकारी की कला का खजाना। राजघरानों से लेकर आम जनता तक, सभी का भरोसा जीतने वाला यह बाजार 
                आज भी अपनी पारंपरिक गुणवत्ता और कलाकारी के लिए प्रसिद्ध है।
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
                  <p>सुबह 10:00 - रात 8:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>कुंदन और मीनाकारी ज्वेलरी</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default JohriMarket;
