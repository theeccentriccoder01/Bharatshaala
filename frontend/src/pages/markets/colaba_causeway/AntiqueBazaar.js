// Antique Bazaar Component for Colaba Causeway - Bharatshaala Platform
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

const AntiqueBazaar = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [antiques, setAntiques] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const bazaarInfo = {
    name: 'कोलाबा एंटीक बाज़ार',
    nameEn: 'Colaba Antique Bazaar',
    description: 'मुंबई का प्रसिद्ध एंटीक बाज़ार - दुर्लभ और कलेक्टिबल वस्तुओं का खजाना',
    established: '1920s',
    speciality: 'विंटेज आइटम्स, कॉइन्स, आर्ट पीसेस',
    location: 'कोलाबा कॉज़वे, मुंबई',
    heroImage: '/images/markets/colaba-antique.jpg'
  };

  const antiqueCategories = [
    { id: 'all', name: 'सभी एंटीक', icon: '🏺' },
    { id: 'coins', name: 'सिक्के', icon: '🪙' },
    { id: 'paintings', name: 'पेंटिंग्स', icon: '🎨' },
    { id: 'sculptures', name: 'मूर्तियां', icon: '🗿' },
    { id: 'jewelry', name: 'विंटेज ज्वेलरी', icon: '💍' },
    { id: 'books', name: 'पुराने ग्रंथ', icon: '📚' },
    { id: 'artifacts', name: 'कलाकृतियां', icon: '🏛️' }
  ];

  const featuredAntiques = [
    {
      name: 'मुगल काल का सिक्का',
      description: 'अकबर काल का दुर्लभ सोने का सिक्का',
      price: '₹45,000',
      age: '400+ वर्ष',
      authenticity: 'सत्यापित',
      dealer: 'हेरिटेज कॉइन्स'
    },
    {
      name: 'राजा रवि वर्मा पेंटिंग',
      description: 'प्रामाणिक राजा रवि वर्मा की पेंटिंग',
      price: '₹2,50,000',
      age: '120+ वर्ष',
      authenticity: 'प्रमाणित',
      dealer: 'आर्ट हेरिटेज गैलरी'
    },
    {
      name: 'चोल काल की कांस्य मूर्ति',
      description: 'दक्षिण भारतीय चोल काल की नटराज मूर्ति',
      price: '₹1,80,000',
      age: '800+ वर्ष',
      authenticity: 'ASI प्रमाणित',
      dealer: 'ब्रॉन्ज़ एंटीक्स'
    }
  ];

  const expertDealers = [
    {
      name: 'हेरिटेज कॉइन्स',
      established: '1965',
      specialty: 'प्राचीन सिक्के और मुद्राएं',
      rating: 4.9,
      experience: '58+ वर्ष',
      expertise: 'न्यूमिस्मैटिक्स'
    },
    {
      name: 'आर्ट हेरिटेज गैलरी',
      established: '1958',
      specialty: 'पेंटिंग्स और आर्ट पीसेस',
      rating: 4.8,
      experience: '65+ वर्ष',
      expertise: 'भारतीय कला'
    },
    {
      name: 'ब्रॉन्ज़ एंटीक्स',
      established: '1972',
      specialty: 'कांस्य मूर्तियां और शिल्प',
      rating: 4.7,
      experience: '51+ वर्ष',
      expertise: 'धातु कलाकृतियां'
    }
  ];

  const antiqueEras = [
    { era: 'हड़प्पा सभ्यता', period: '3300-1300 BCE', items: ['मिट्टी के बर्तन', 'सील', 'गहने'] },
    { era: 'मौर्य काल', period: '322-185 BCE', items: ['सिक्के', 'शिलालेख', 'मूर्तियां'] },
    { era: 'गुप्त काल', period: '320-550 CE', items: ['स्वर्ण सिक्के', 'कलाकृतियां', 'शास्त्र'] },
    { era: 'मुगल काल', period: '1526-1857 CE', items: ['शाही सिक्के', 'हथियार', 'आभूषण'] }
  ];

  useEffect(() => {
    trackPageView('colaba_antique_bazaar');
    loadBazaarData();
  }, []);

  const loadBazaarData = async () => {
    try {
      setLoading(true);
      
      const [antiquesResponse, dealersResponse] = await Promise.all([
        apiService.get('/markets/colaba-causeway/antique-bazaar/products'),
        apiService.get('/markets/colaba-causeway/antique-bazaar/dealers')
      ]);

      if (antiquesResponse.success) {
        setAntiques(antiquesResponse.data);
      }

      if (dealersResponse.success) {
        setDealers(dealersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load bazaar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('antique_category_selected', {
      market: 'colaba_causeway',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_antique_bazaar', {
        productId: product.id,
        market: 'colaba_causeway',
        dealer: product.dealer
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_antique_bazaar', {
        productId: product.id,
        market: 'colaba_causeway'
      });
    }
  };

  const filteredAntiques = activeCategory === 'all' 
    ? antiques 
    : antiques.filter(antique => antique.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{bazaarInfo.name} - भारतशाला | कोलाबा के दुर्लभ एंटीक्स</title>
        <meta name="description" content="कोलाबा कॉज़वे के प्रसिद्ध एंटीक बाज़ार से दुर्लभ सिक्के, पेंटिंग्स, मूर्तियां और कलेक्टिबल आइटम्स।" />
        <meta name="keywords" content="कोलाबा एंटीक्स, विंटेज कॉइन्स, पुरानी पेंटिंग्स, एंटीक ज्वेलरी, मुंबई एंटीक्स" />
        <link rel="canonical" href="https://bharatshaala.com/markets/colaba-causeway/antique-bazaar" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-700 to-orange-700 text-white py-16">
          <div className="absolute inset-0 bg-black/50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
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
                <span className="text-6xl">🏺</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{bazaarInfo.name}</h1>
                  <p className="text-xl opacity-90">{bazaarInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-amber-200">{bazaarInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-amber-200">{bazaarInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-amber-200">{bazaarInfo.location}</p>
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
              <Link to="/markets/colaba-causeway" className="hover:text-emerald-600">कोलाबा कॉज़वे</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">एंटीक बाज़ार</span>
            </nav>
          </div>
        </div>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">एंटीक श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {antiqueCategories.map((category) => (
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

        {/* Featured Antiques */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के विशेष एंटीक्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredAntiques.map((antique, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{antique.name}</h3>
                  <p className="text-gray-600 mb-3">{antique.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-amber-600">{antique.price}</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">आयु:</span>
                      <span className="font-medium">{antique.age}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">प्रमाणिकता:</span>
                      <span className="text-green-600 font-medium">{antique.authenticity}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{antique.dealer}</span>
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                      देखें
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Historical Eras */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">ऐतिहासिक काल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {antiqueEras.map((era, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{era.era}</h3>
                  <p className="text-amber-700 font-medium mb-4">{era.period}</p>
                  <div className="space-y-2">
                    {era.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                        {item}
                      </div>
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
            <LoadingSpinner size="large" text="एंटीक्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी एंटीक्स' : antiqueCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredAntiques.map((antique) => (
                  <ProductCard
                    key={antique.id}
                    product={antique}
                    onAddToCart={() => handleAddToCart(antique)}
                    onAddToWishlist={() => handleAddToWishlist(antique)}
                    showAuthenticityBadge={true}
                    showAgeBadge={true}
                    showRarityBadge={true}
                  />
                ))}
              </div>

              {filteredAntiques.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏺</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई एंटीक नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Expert Dealers */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-orange-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">विशेषज्ञ एंटीक डीलर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {expertDealers.map((dealer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">🏪</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dealer.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>स्थापना:</strong> {dealer.established}</p>
                    <p><strong>विशेषता:</strong> {dealer.specialty}</p>
                    <p><strong>विशेषज्ञता:</strong> {dealer.expertise}</p>
                    <p><strong>अनुभव:</strong> {dealer.experience}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(dealer.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{dealer.rating}</span>
                  </div>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Authentication Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमाणिकता की प्रक्रिया</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">विशेषज्ञ जांच</h3>
                <p className="text-gray-600">प्रत्येक एंटीक की विशेषज्ञों द्वारा गहन जांच</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-semibold mb-2">प्रमाणपत्र</h3>
                <p className="text-gray-600">प्रामाणिकता और आयु का प्रमाणित दस्तावेज</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold mb-2">वैज्ञानिक परीक्षण</h3>
                <p className="text-gray-600">कार्बन डेटिंग और अन्य तकनीकी परीक्षण</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold mb-2">गारंटी</h3>
                <p className="text-gray-600">प्रामाणिकता की आजीवन गारंटी</p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Experience */}
        <section className="py-16 bg-gradient-to-r from-amber-700 to-orange-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">कोलाबा एंटीक का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                100 साल पुराने इस एंटीक बाज़ार में छुपी है भारत की अमूल्य धरोहर। 
                यहाँ हर वस्तु की अपनी कहानी है, हर एंटीक में बसा है इतिहास का एक टुकड़ा। 
                विशेषज्ञ डीलर्स आपको बताएंगे हर चीज़ का सच्चा मूल्य और उसकी ऐतिहासिक महत्ता।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>कॉज़वे स्ट्रीट, कोलाबा, मुंबई</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - शाम 8:00 (सोमवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>दुर्लभ और प्रमाणित एंटीक्स</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AntiqueBazaar;
