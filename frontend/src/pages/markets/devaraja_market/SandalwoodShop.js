// Sandalwood Shop Component for Devaraja Market - Bharatshaala Platform
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

const SandalwoodShop = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [sandalwoodProducts, setSandalwoodProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const shopInfo = {
    name: 'मैसूर चंदन शॉप',
    nameEn: 'Mysore Sandalwood Shop',
    description: 'विश्व प्रसिद्ध मैसूर चंदन उत्पादों का मुख्य केंद्र - शुद्धता और सुगंध की गारंटी',
    established: '1940s',
    speciality: 'चंदन की लकड़ी, तेल और हस्तशिल्प',
    location: 'देवराज मार्केट, मैसूर',
    heroImage: '/images/markets/devaraja-sandalwood.jpg'
  };

  const sandalwoodCategories = [
    { id: 'all', name: 'सभी चंदन उत्पाद', icon: '🪵' },
    { id: 'wood', name: 'चंदन की लकड़ी', icon: '🪵' },
    { id: 'oil', name: 'चंदन का तेल', icon: '🫖' },
    { id: 'powder', name: 'चंदन पाउडर', icon: '🥄' },
    { id: 'crafts', name: 'चंदन शिल्प', icon: '🎨' },
    { id: 'cosmetics', name: 'कॉस्मेटिक्स', icon: '💄' },
    { id: 'incense', name: 'अगरबत्ती', icon: '🕯️' }
  ];

  const featuredProducts = [
    {
      name: 'शुद्ध मैसूर चंदन तेल',
      description: '100% प्राकृतिक मैसूर चंदन का तेल',
      price: '₹2,500/10ml',
      purity: '100% शुद्ध',
      age: '25+ वर्ष पुराना वृक्ष',
      extraction: 'स्टीम डिस्टिलेशन',
      uses: 'अरोमा थेरेपी, त्वचा केयर',
      vendor: 'गवर्नमेंट सैंडल ऑयल फैक्ट्री'
    },
    {
      name: 'चंदन की पूजा की लकड़ी',
      description: 'पूजा और हवन के लिए विशेष चंदन',
      price: '₹800/50g',
      purity: 'ग्रेड A क्वालिटी',
      age: '30+ वर्ष पुराना',
      origin: 'मैसूर रिजर्व फॉरेस्ट',
      uses: 'पूजा, हवन, धार्मिक अनुष्ठान',
      vendor: 'श्री चंदना इंडस्ट्रीज'
    },
    {
      name: 'हैंडकार्व्ड चंदन गणेश',
      description: 'हस्तनिर्मित चंदन की गणेश मूर्ति',
      price: '₹3,200',
      size: '6 इंच ऊंचाई',
      artisan: 'मास्टर कारीगर श्यामसुंदर',
      wood_age: '20+ वर्ष',
      finish: 'नेचुरल पॉलिश',
      vendor: 'आर्ट ऑफ सैंडल'
    }
  ];

  const masterArtisans = [
    {
      name: 'श्यामसुंदर कारीगर',
      experience: '35+ वर्ष',
      specialty: 'धार्मिक मूर्तियां',
      awards: 'राष्ट्रीय शिल्प पुरस्कार 2018',
      signature: 'गणेश और लक्ष्मी मूर्तियां',
      apprentices: 15
    },
    {
      name: 'रामप्पा वुडकार्वर',
      experience: '40+ वर्ष',
      specialty: 'डेकोरेटिव आइटम्स',
      awards: 'कर्नाटक राज्य पुरस्कार',
      signature: 'चंदन बॉक्स और ट्रे',
      apprentices: 12
    },
    {
      name: 'लक्ष्मी शिल्पकार',
      experience: '25+ वर्ष',
      specialty: 'ज्वेलरी बॉक्सेस',
      awards: 'शिल्प गुरु सम्मान',
      signature: 'इंले वर्क डिजाइन्स',
      apprentices: 8
    }
  ];

  const sandalwoodGrades = [
    { grade: 'गोल्ड क्लास', description: '30+ वर्ष पुराना, हार्टवुड', aroma: 'इंटेंस फ्रेग्रेंस', price: 'प्रीमियम' },
    { grade: 'सिल्वर क्लास', description: '20-30 वर्ष पुराना', aroma: 'स्ट्रॉन्ग फ्रेग्रेंस', price: 'हाई' },
    { grade: 'स्टैंडर्ड क्लास', description: '15-20 वर्ष पुराना', aroma: 'गुड फ्रेग्रेंस', price: 'मॉडरेट' },
    { grade: 'रेगुलर क्लास', description: '10-15 वर्ष पुराना', aroma: 'माइल्ड फ्रेग्रेंस', price: 'इकॉनोमिकल' }
  ];

  const benefits = [
    { benefit: 'त्वचा की देखभाल', description: 'एंटी-एजिंग और मॉइस्चराइजिंग गुण' },
    { benefit: 'मानसिक शांति', description: 'तनाव कम करने और ध्यान में सहायक' },
    { benefit: 'एंटी-बैक्टीरियल', description: 'प्राकृतिक जीवाणुरोधी गुण' },
    { benefit: 'अरोमा थेरेपी', description: 'श्वसन संस्थान और मूड इंप्रूवमेंट' }
  ];

  useEffect(() => {
    trackPageView('devaraja_sandalwood_shop');
    loadShopData();
  }, []);

  const loadShopData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, artisansResponse] = await Promise.all([
        apiService.get('/markets/devaraja-market/sandalwood-shop/products'),
        apiService.get('/markets/devaraja-market/sandalwood-shop/artisans')
      ]);

      if (productsResponse.success) {
        setSandalwoodProducts(productsResponse.data);
      }

      if (artisansResponse.success) {
        setArtisans(artisansResponse.data);
      }
    } catch (error) {
      console.error('Failed to load shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('sandalwood_category_selected', {
      market: 'devaraja_market',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_sandalwood_shop', {
        productId: product.id,
        market: 'devaraja_market',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_sandalwood_shop', {
        productId: product.id,
        market: 'devaraja_market'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? sandalwoodProducts 
    : sandalwoodProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{shopInfo.name} - भारतशाला | मैसूर का प्रसिद्ध चंदन</title>
        <meta name="description" content="मैसूर चंदन शॉप से शुद्ध चंदन का तेल, लकड़ी, पाउडर और हस्तनिर्मित चंदन शिल्प। गवर्नमेंट सर्टिफाइड मैसूर सैंडलवुड प्रोडक्ट्स।" />
        <meta name="keywords" content="मैसूर चंदन, सैंडलवुड ऑयल, चंदन की लकड़ी, देवराज मार्केट, प्राकृतिक चंदन, हैंडकार्व्ड" />
        <link rel="canonical" href="https://bharatshaala.com/markets/devaraja-market/sandalwood-shop" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-700 to-yellow-600 text-white py-16">
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
                <span className="text-6xl">🪵</span>
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
              <Link to="/markets/devaraja-market" className="hover:text-emerald-600">देवराज मार्केट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">चंदन शॉप</span>
            </nav>
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रीमियम चंदन उत्पाद</h2>
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
                    <span className="text-2xl font-bold text-amber-600">{product.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {product.purity && <p><strong>शुद्धता:</strong> {product.purity}</p>}
                    {product.age && <p><strong>आयु:</strong> {product.age}</p>}
                    {product.size && <p><strong>साइज:</strong> {product.size}</p>}
                    {product.extraction && <p><strong>निष्कर्षण:</strong> {product.extraction}</p>}
                    {product.artisan && <p><strong>कारीगर:</strong> {product.artisan}</p>}
                    <p><strong>उपयोग:</strong> {product.uses}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{product.vendor}</span>
                    <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                      कार्ट में जोड़ें
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">चंदन श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {sandalwoodCategories.map((category) => (
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

        {/* Sandalwood Grades */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">चंदन की ग्रेडिंग</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sandalwoodGrades.map((grade, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{grade.grade}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विवरण:</strong> {grade.description}</p>
                    <p><strong>सुगंध:</strong> {grade.aroma}</p>
                    <p><strong>प्राइस रेंज:</strong> {grade.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="चंदन उत्पाद लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी चंदन उत्पाद' : sandalwoodCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showPurityBadge={true}
                    showHandcraftedBadge={true}
                    showAgeBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🪵</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई उत्पाद नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Master Artisans */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-yellow-100">
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
                    <p><strong>अनुभव:</strong> {artisan.experience}</p>
                    <p><strong>विशेषता:</strong> {artisan.specialty}</p>
                    <p><strong>सिग्नेचर:</strong> {artisan.signature}</p>
                    <p><strong>पुरस्कार:</strong> {artisan.awards}</p>
                    <p><strong>शिष्य:</strong> {artisan.apprentices}</p>
                  </div>
                  <button className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    कृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits of Sandalwood */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">चंदन के फायदे</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.benefit}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Authenticity Guarantee */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">प्रामाणिकता की गारंटी</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold mb-2">गवर्नमेंट सर्टिफाइड</h3>
                <p className="text-gray-600">कर्नाटक फॉरेस्ट डिपार्टमेंट की आधिकारिक मुहर</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold mb-2">लैब टेस्टेड</h3>
                <p className="text-gray-600">प्रत्येक बैच की गुणवत्ता की जांच</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-semibold mb-2">ऑथेंटिसिटी सर्टिफिकेट</h3>
                <p className="text-gray-600">प्रत्येक उत्पाद के साथ प्रामाणिकता प्रमाणपत्र</p>
              </div>
            </div>
          </div>
        </section>

        {/* Shop Experience */}
        <section className="py-16 bg-gradient-to-r from-amber-700 to-yellow-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">मैसूर चंदन शॉप का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                80 साल से मैसूर चंदन शॉप विश्व प्रसिद्ध मैसूर सैंडलवुड की सुगंध को पूरे विश्व में फैला रही है। 
                यहाँ की हर वस्तु में बसी है प्राकृतिक शुद्धता और पारंपरिक कारीगरी का अनमोल संयोजन। 
                चंदन की दुनिया में आपका स्वागत है।
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
                  <p>सुबह 9:00 - रात 8:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>100% प्राकृतिक मैसूर सैंडलवुड</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SandalwoodShop;
