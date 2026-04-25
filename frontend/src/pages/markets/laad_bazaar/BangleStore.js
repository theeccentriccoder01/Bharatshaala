// Bangle Store Component for Laad Bazaar - Bharatshaala Platform
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

const BangleStore = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [bangles, setBangles] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const storeInfo = {
    name: 'लाड बाजार चूड़ी दुकान',
    nameEn: 'Laad Bazaar Bangle Store',
    description: 'हैदराबाद की प्रसिद्ध चूड़ियों का खजाना - निज़ामी शैली के रंग-बिरंगे कंगन',
    established: '16वीं सदी',
    speciality: 'लाक चूड़ियां, मोती और कुंदन कार्य',
    location: 'लाड बाजार, हैदराबाद',
    heroImage: '/images/markets/laad-bazaar-bangles.jpg'
  };

  const bangleCategories = [
    { id: 'all', name: 'सभी चूड़ियां', icon: '💍' },
    { id: 'lac-bangles', name: 'लाक चूड़ियां', icon: '🔴' },
    { id: 'glass-bangles', name: 'कांच की चूड़ियां', icon: '🌈' },
    { id: 'metal-bangles', name: 'धातु चूड़ियां', icon: '⚱️' },
    { id: 'kundan-bangles', name: 'कुंदन चूड़ियां', icon: '💎' },
    { id: 'pearl-bangles', name: 'मोती चूड़ियां', icon: '🦪' },
    { id: 'bridal-sets', name: 'दुल्हन सेट', icon: '👰' }
  ];

  const featuredBangles = [
    {
      name: 'निज़ामी लाक चूड़ी सेट',
      description: 'पारंपरिक हैदराबादी डिज़ाइन में लाक चूड़ियां',
      artisan: 'उस्ताद अली अकबर',
      price: '₹1,200/सेट',
      material: 'लाक और सोने की पत्ती',
      colors: 'लाल, हरा, गुलाबी',
      pieces: '12 चूड़ियां',
      size: 'सभी साइज़ उपलब्ध',
      occasion: 'शादी-विवाह'
    },
    {
      name: 'मोती वर्क ब्राइडल सेट',
      description: 'हैदराबादी मोतियों से सजी दुल्हन की चूड़ियां',
      artisan: 'फातिमा बेगम',
      price: '₹2,800/सेट',
      material: 'लाक, मोती, कुंदन',
      colors: 'सुनहरा, लाल',
      pieces: '24 चूड़ियां',
      size: 'कस्टम साइज़िंग',
      occasion: 'दुल्हन स्पेशल'
    },
    {
      name: 'कांच की रंगबिरंगी चूड़ियां',
      description: 'हाथ से बनी कांच की महीन चूड़ियां',
      artisan: 'रमेश कारीगर',
      price: '₹300/दर्जन',
      material: 'फाइन ग्लास',
      colors: 'मल्टीकलर',
      pieces: '12 चूड़ियां',
      size: 'स्टैंडर्ड साइज़',
      occasion: 'डेली वेयर'
    }
  ];

  const masterArtisans = [
    {
      name: 'उस्ताद अली अकबर खान',
      craft: 'लाक बैंगल मेकिंग',
      experience: '40+ वर्ष',
      speciality: 'निज़ामी डिज़ाइन',
      awards: 'राष्ट्रीय शिल्प पुरस्कार',
      family: '5 पीढ़ियों का कारोबार'
    },
    {
      name: 'फातिमा बेगम',
      craft: 'मोती और कुंदन वर्क',
      experience: '30+ वर्ष',
      speciality: 'ब्राइडल ज्वेलरी',
      awards: 'तेलंगाना राज्य पुरस्कार',
      family: 'महिला कारीगर समूह की प्रमुख'
    },
    {
      name: 'मोहम्मद रशीद',
      craft: 'ग्लास बैंगल आर्ट',
      experience: '25+ वर्ष',
      speciality: 'फाइन ग्लास वर्क',
      awards: 'हैदराबाद शिल्प सम्मान',
      family: 'परंपरागत ग्लास आर्टिस्ट'
    }
  ];

  const bangleTypes = [
    {
      type: 'लाक चूड़ियां',
      origin: 'राजस्थान/हैदराबाद',
      material: 'लाख राल',
      specialty: 'हैंडपेंटेड डिज़ाइन',
      durability: '2-3 साल'
    },
    {
      type: 'कांच की चूड़ियां',
      origin: 'फिरोज़ाबाद/हैदराबाद',
      material: 'रंगीन कांच',
      specialty: 'ब्राइट कलर्स',
      durability: '6 महीने - 1 साल'
    },
    {
      type: 'मेटल चूड़ियां',
      origin: 'मुरादाबाद',
      material: 'पीतल/चांदी',
      specialty: 'एंग्रेविंग वर्क',
      durability: '5-10 साल'
    },
    {
      type: 'कुंदन चूड़ियां',
      origin: 'जयपुर/हैदराबाद',
      material: 'कुंदन स्टोन्स',
      specialty: 'रॉयल लुक',
      durability: '10+ साल'
    }
  ];

  const colorSignificance = [
    { color: 'लाल', significance: 'सुहाग, शक्ति', occasions: 'शादी, त्योहार' },
    { color: 'हरा', significance: 'समृद्धि, नई शुरुआत', occasions: 'तीज, हरियाली' },
    { color: 'गुलाबी', significance: 'प्रेम, कोमलता', occasions: 'सगाई, रोमांस' },
    { color: 'सुनहरा', significance: 'धन, वैभव', occasions: 'दीवाली, धनतेरस' },
    { color: 'सफेद', significance: 'शांति, पवित्रता', occasions: 'पूजा, व्रत' },
    { color: 'नीला', significance: 'शांति, स्थिरता', occasions: 'कृष्ण जन्माष्टमी' }
  ];

  useEffect(() => {
    trackPageView('laad_bazaar_bangle_store');
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      const [banglesResponse, artisansResponse] = await Promise.all([
        apiService.get('/markets/laad-bazaar/bangle-store/bangles'),
        apiService.get('/markets/laad-bazaar/bangle-store/artisans')
      ]);

      if (banglesResponse.success) {
        setBangles(banglesResponse.data);
      }

      if (artisansResponse.success) {
        setArtisans(artisansResponse.data);
      }
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('bangle_category_selected', {
      market: 'laad_bazaar',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_bangle_store', {
        productId: product.id,
        market: 'laad_bazaar',
        artisan: product.artisan
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_bangle_store', {
        productId: product.id,
        market: 'laad_bazaar'
      });
    }
  };

  const filteredBangles = activeCategory === 'all' 
    ? bangles 
    : bangles.filter(bangle => bangle.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{storeInfo.name} - भारतशाला | हैदराबाद की प्रसिद्ध चूड़ियां</title>
        <meta name="description" content="लाड बाजार से हैदराबाद की प्रसिद्ध चूड़ियां। लाक चूड़ियां, मोती वर्क, कुंदन चूड़ियां और ब्राइडल सेट्स। पारंपरिक निज़ामी डिज़ाइन।" />
        <meta name="keywords" content="लाड बाजार, हैदराबाद चूड़ियां, लाक बैंगल्स, निज़ामी ज्वेलरी, मोती चूड़ियां, कुंदन बैंगल्स" />
        <link rel="canonical" href="https://bharatshaala.com/markets/laad-bazaar/bangle-store" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
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
                <span className="text-6xl">💍</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{storeInfo.name}</h1>
                  <p className="text-xl opacity-90">{storeInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-rose-200">{storeInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-rose-200">{storeInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-rose-200">{storeInfo.location}</p>
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
              <span className="text-gray-900">चूड़ी दुकान</span>
            </nav>
          </div>
        </div>

        {/* Featured Bangles */}
        <section className="py-12 bg-pink-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख चूड़ी संग्रह</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBangles.map((bangle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{bangle.name}</h3>
                  <p className="text-gray-600 mb-3">{bangle.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-pink-600">{bangle.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कारीगर:</strong> {bangle.artisan}</p>
                    <p><strong>सामग्री:</strong> {bangle.material}</p>
                    <p><strong>रंग:</strong> {bangle.colors}</p>
                    <p><strong>पीसेस:</strong> {bangle.pieces}</p>
                    <p><strong>साइज़:</strong> {bangle.size}</p>
                    <p><strong>अवसर:</strong> {bangle.occasion}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">चूड़ी श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {bangleCategories.map((category) => (
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

        {/* Bangle Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">चूड़ियों के प्रकार</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {bangleTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.type}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {type.origin}</p>
                    <p><strong>सामग्री:</strong> {type.material}</p>
                    <p><strong>विशेषता:</strong> {type.specialty}</p>
                    <p><strong>टिकाऊपन:</strong> {type.durability}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="चूड़ियां लोड हो रही हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी चूड़ियां' : bangleCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBangles.map((bangle) => (
                  <ProductCard
                    key={bangle.id}
                    product={bangle}
                    onAddToCart={() => handleAddToCart(bangle)}
                    onAddToWishlist={() => handleAddToWishlist(bangle)}
                    showHandmadeBadge={true}
                    showTraditionalBadge={true}
                    showArtisanBadge={true}
                  />
                ))}
              </div>

              {filteredBangles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई चूड़ी नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Master Artisans */}
        <section className="py-16 bg-gradient-to-r from-pink-100 to-rose-100">
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
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कला:</strong> {artisan.craft}</p>
                    <p><strong>अनुभव:</strong> {artisan.experience}</p>
                    <p><strong>विशेषता:</strong> {artisan.speciality}</p>
                    <p><strong>पुरस्कार:</strong> {artisan.awards}</p>
                    <p><strong>पारिवारिक:</strong> {artisan.family}</p>
                  </div>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Color Significance */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">रंगों का महत्व</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colorSignificance.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{color.color}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>महत्व:</strong> {color.significance}</p>
                    <p><strong>अवसर:</strong> {color.occasions}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Care Instructions */}
        <section className="py-16 bg-pink-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">चूड़ियों की देखभाल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🧼</div>
                <h3 className="text-xl font-semibold mb-2">सफाई</h3>
                <p className="text-gray-600">नरम कपड़े से पोंछें, पानी से बचाएं</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">भंडारण</h3>
                <p className="text-gray-600">अलग-अलग डिब्बों में रखें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">☀️</div>
                <h3 className="text-xl font-semibold mb-2">धूप से बचाव</h3>
                <p className="text-gray-600">सीधी धूप में न रखें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤲</div>
                <h3 className="text-xl font-semibold mb-2">सावधानी</h3>
                <p className="text-gray-600">रसायनों से दूर रखें</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bangle Heritage */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">लाड बाजार की चूड़ी परंपरा</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                400 साल से लाड बाजार भारत की चूड़ी राजधानी है। यहाँ निज़ामों के समय से चली आ रही चूड़ी बनाने की कला आज भी जीवित है। 
                हर चूड़ी में बुनी है हैदराबादी संस्कृति की कहानी और कारीगरों के हुनर का जादू। 
                भारतीय महिलाओं के श्रृंगार का यह अनमोल हिस्सा है।
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
                  <p>सुबह 10:00 - रात 10:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">💍</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>निज़ामी स्टाइल की चूड़ियां</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BangleStore;
