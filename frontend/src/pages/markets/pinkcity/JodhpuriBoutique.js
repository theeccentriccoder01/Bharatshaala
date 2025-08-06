// Jodhpuri Boutique Component for Pink City - Bharatshaala Platform
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

const JodhpuriBoutique = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [garments, setGarments] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const boutiqueInfo = {
    name: 'जोधपुरी बुटीक',
    nameEn: 'Jodhpuri Boutique',
    description: 'राजस्थानी शाही परंपरा के अनुसार बने जोधपुरी सूट और रॉयल वेयर का विशेष संग्रह',
    established: '1970s',
    speciality: 'जोधपुरी सूट, शेरवानी, राजस्थानी रॉयल वेयर',
    location: 'पिंक सिटी, जयपुर',
    heroImage: '/images/markets/jodhpuri-boutique.jpg'
  };

  const garmentCategories = [
    { id: 'all', name: 'सभी वस्त्र', icon: '🤵' },
    { id: 'jodhpuri-suits', name: 'जोधपुरी सूट', icon: '👔' },
    { id: 'sherwanis', name: 'शेरवानी', icon: '🥻' },
    { id: 'bandgala', name: 'बंदगला', icon: '👘' },
    { id: 'royal-wear', name: 'रॉयल वेयर', icon: '👑' },
    { id: 'indo-western', name: 'इंडो-वेस्टर्न', icon: '🎩' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '🎀' }
  ];

  const featuredGarments = [
    {
      name: 'रॉयल वेलवेट जोधपुरी सूट',
      description: 'हैंडवर्क के साथ प्रीमियम वेलवेट जोधपुरी',
      designer: 'राज कुमार टेलर्स',
      price: '₹18,000',
      fabric: 'इंपोर्टेड वेलवेट',
      work: 'गोल्ड जरी एम्ब्रॉयडरी',
      fitting: 'स्लिम फिट',
      occasion: 'वेडिंग/फेस्टिवल',
      colors: 'मैरून, नेवी, ब्लैक'
    },
    {
      name: 'पारंपरिक शेरवानी सेट',
      description: 'चूड़ीदार पजामे के साथ कम्प्लीट सेट',
      designer: 'महाराजा कलेक्शन',
      price: '₹12,500',
      fabric: 'सिल्क ब्रोकेड',
      work: 'हैंड एम्ब्रॉयडरी',
      includes: 'शेरवानी + चूड़ीदार + दुपट्टा',
      sizes: 'XS से XXL तक',
      style: 'ट्रेडिशनल कट'
    },
    {
      name: 'मॉडर्न बंदगला जैकेट',
      description: 'कंटेम्पोरेरी स्टाइल का बंदगला',
      designer: 'न्यू एज फैशन',
      price: '₹8,500',
      fabric: 'लिनन ब्लेंड',
      style: 'स्लीवलेस बंदगला',
      pairing: 'कुर्ता-पजामे के साथ',
      colors: 'आइवरी, बेज, ग्रे',
      fit: 'रेगुलर फिट'
    }
  ];

  const topDesigners = [
    {
      name: 'राज कुमार टेलर्स',
      specialty: 'रॉयल जोधपुरी सूट्स',
      experience: '45+ वर्ष',
      clientele: 'राजघराने और सेलिब्रिटीज',
      signature: 'हैवी एम्ब्रॉयडरी वर्क',
      awards: 'राजस्थान राज्य पुरस्कार'
    },
    {
      name: 'महाराजा कलेक्शन',
      specialty: 'ट्रेडिशनल शेरवानी',
      experience: '35+ वर्ष',
      clientele: 'वेडिंग और फेस्टिवल्स',
      signature: 'क्लासिकल डिज़ाइन्स',
      awards: 'बेस्ट ट्रेडिशनल वेयर'
    },
    {
      name: 'न्यू एज फैशन',
      specialty: 'मॉडर्न इंडो-वेस्टर्न',
      experience: '20+ वर्ष',
      clientele: 'यंग प्रोफेशनल्स',
      signature: 'कंटेम्पोरेरी कट्स',
      awards: 'यूथ फैशन आइकॉन'
    }
  ];

  const jodhpuriStyles = [
    {
      style: 'क्लासिकल जोधपुरी',
      features: ['हाई नेकलाइन', 'फ्रंट बटन', 'फिटेड सिल्हूट'],
      occasions: ['वेडिंग', 'फॉर्मल इवेंट्स']
    },
    {
      style: 'मॉडर्न जोधपुरी',
      features: ['कंटेम्पोरेरी कट', 'मिनिमल डिज़ाइन', 'वर्सेटाइल'],
      occasions: ['पार्टी', 'कैजुअल वेयर']
    },
    {
      style: 'रॉयल जोधपुरी',
      features: ['हैवी एम्ब्रॉयडरी', 'लक्जूरियस फैब्रिक', 'ट्रेडिशनल'],
      occasions: ['रॉयल फंक्शन्स', 'फेस्टिवल्स']
    },
    {
      style: 'इंडो-वेस्टर्न',
      features: ['फ्यूजन डिज़ाइन', 'मॉडर्न फिट', 'वेस्टर्न टच'],
      occasions: ['कॉकटेल पार्टी', 'सोशल इवेंट्स']
    }
  ];

  const fabricGuide = [
    { fabric: 'सिल्क', characteristics: 'लक्जूरियस फील, शाइनी लुक', care: 'ड्राई क्लीन ओनली' },
    { fabric: 'वेलवेट', characteristics: 'रिच टेक्सचर, रॉयल अपीयरेंस', care: 'प्रोफेशनल केयर' },
    { fabric: 'ब्रोकेड', characteristics: 'हैवी पैटर्न, फेस्टिव लुक', care: 'जेंटल हैंडलिंग' },
    { fabric: 'लिनन', characteristics: 'ब्रीदेबल, कैजुअल', care: 'मशीन वॉश' }
  ];

  useEffect(() => {
    trackPageView('pinkcity_jodhpuri_boutique');
    loadBoutiqueData();
  }, []);

  const loadBoutiqueData = async () => {
    try {
      setLoading(true);
      
      const [garmentsResponse, designersResponse] = await Promise.all([
        apiService.get('/markets/pinkcity/jodhpuri-boutique/garments'),
        apiService.get('/markets/pinkcity/jodhpuri-boutique/designers')
      ]);

      if (garmentsResponse.success) {
        setGarments(garmentsResponse.data);
      }

      if (designersResponse.success) {
        setDesigners(designersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load boutique data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('jodhpuri_category_selected', {
      market: 'pinkcity',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_jodhpuri_boutique', {
        productId: product.id,
        market: 'pinkcity',
        designer: product.designer
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_jodhpuri_boutique', {
        productId: product.id,
        market: 'pinkcity'
      });
    }
  };

  const filteredGarments = activeCategory === 'all' 
    ? garments 
    : garments.filter(garment => garment.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{boutiqueInfo.name} - भारतशाला | राजस्थानी जोधपुरी सूट</title>
        <meta name="description" content="जयपुर से प्रीमियम जोधपुरी सूट, शेरवानी और राजस्थानी रॉयल वेयर। हैंडमेड एम्ब्रॉयडरी और ट्रेडिशनल डिज़ाइन्स।" />
        <meta name="keywords" content="जोधपुरी सूट, राजस्थानी शेरवानी, जयपुर फैशन, रॉयल वेयर, इंडियन वेडिंग ड्रेस, बंदगला" />
        <link rel="canonical" href="https://bharatshaala.com/markets/pinkcity/jodhpuri-boutique" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${boutiqueInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🤵</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{boutiqueInfo.name}</h1>
                  <p className="text-xl opacity-90">{boutiqueInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-blue-200">{boutiqueInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-blue-200">{boutiqueInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-blue-200">{boutiqueInfo.location}</p>
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
              <span className="text-gray-900">जोधपुरी बुटीक</span>
            </nav>
          </div>
        </div>

        {/* Featured Garments */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रीमियम कलेक्शन</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredGarments.map((garment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{garment.name}</h3>
                  <p className="text-gray-600 mb-3">{garment.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-purple-600">{garment.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>डिज़ाइनर:</strong> {garment.designer}</p>
                    <p><strong>फैब्रिक:</strong> {garment.fabric}</p>
                    <p><strong>काम:</strong> {garment.work}</p>
                    {garment.fitting && <p><strong>फिटिंग:</strong> {garment.fitting}</p>}
                    {garment.includes && <p><strong>शामिल:</strong> {garment.includes}</p>}
                    {garment.sizes && <p><strong>साइज़ेस:</strong> {garment.sizes}</p>}
                    {garment.style && <p><strong>स्टाइल:</strong> {garment.style}</p>}
                    {garment.pairing && <p><strong>पेयरिंग:</strong> {garment.pairing}</p>}
                    {garment.fit && <p><strong>फिट:</strong> {garment.fit}</p>}
                    <p><strong>अवसर:</strong> {garment.occasion}</p>
                    <p><strong>रंग:</strong> {garment.colors}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">वस्त्र श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {garmentCategories.map((category) => (
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

        {/* Jodhpuri Styles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">जोधपुरी स्टाइल्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {jodhpuriStyles.map((style, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{style.style}</h3>
                  <div className="space-y-2 mb-4">
                    {style.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700 mb-1">उपयुक्त अवसर:</p>
                    {style.occasions.map((occasion, occasionIndex) => (
                      <span key={occasionIndex} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mr-1">
                        {occasion}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="वस्त्र लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी वस्त्र' : garmentCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGarments.map((garment) => (
                  <ProductCard
                    key={garment.id}
                    product={garment}
                    onAddToCart={() => handleAddToCart(garment)}
                    onAddToWishlist={() => handleAddToWishlist(garment)}
                    showDesignerBadge={true}
                    showPremiumBadge={true}
                    showCustomFitBadge={true}
                  />
                ))}
              </div>

              {filteredGarments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤵</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई वस्त्र नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top Designers */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-blue-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध डिज़ाइनर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topDesigners.map((designer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{designer.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {designer.specialty}</p>
                    <p><strong>अनुभव:</strong> {designer.experience}</p>
                    <p><strong>क्लाइंटेल:</strong> {designer.clientele}</p>
                    <p><strong>सिग्नेचर:</strong> {designer.signature}</p>
                    <p><strong>पुरस्कार:</strong> {designer.awards}</p>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    कलेक्शन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fabric Guide */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फैब्रिक गाइड</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {fabricGuide.map((fabric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{fabric.fabric}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>विशेषताएं:</strong> {fabric.characteristics}</p>
                    <p><strong>देखभाल:</strong> {fabric.care}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Tailoring */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">कस्टम टेलरिंग सर्विस</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                हमारे एक्सपर्ट टेलर्स द्वारा आपकी पसंद के अनुसार परफेक्ट फिटिंग के साथ जोधपुरी सूट तैयार कराएं। 
                प्रीमियम फैब्रिक से लेकर हैंड एम्ब्रॉयडरी तक, हर डिटेल आपकी पसंद के अनुसार।
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-4">📏</div>
                  <h3 className="text-xl font-semibold mb-2">परफेक्ट फिटिंग</h3>
                  <p className="text-gray-600">एक्सपर्ट टेलर्स द्वारा सटीक नाप</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">कस्टम डिज़ाइन</h3>
                  <p className="text-gray-600">आपकी पसंद के अनुसार डिज़ाइन</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-xl font-semibold mb-2">टाइमली डिलीवरी</h3>
                  <p className="text-gray-600">7-15 दिन में तैयार</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Royal Heritage */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">जोधपुरी वस्त्र की शाही परंपरा</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                50 साल से जोधपुरी बुटीक राजस्थान की शाही परंपरा को आधुनिक फैशन के साथ मिलाकर प्रस्तुत कर रहा है। 
                महाराजाओं के पारंपरिक पहनावे से प्रेरित ये डिज़ाइन आज भी उसी शान और गरिमा के साथ पहने जाते हैं। 
                हर जोधपुरी सूट में छुपी है राजस्थानी संस्कृति और कलाकारी की कहानी।
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
                  <div className="text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>रॉयल राजस्थानी फैशन</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default JodhpuriBoutique;