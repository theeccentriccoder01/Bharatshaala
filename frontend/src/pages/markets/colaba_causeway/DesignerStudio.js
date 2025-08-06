// Designer Studio Component for Colaba Causeway - Bharatshala Platform
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

const DesignerStudio = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [collections, setCollections] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const studioInfo = {
    name: 'कोलाबा डिज़ाइनर स्टूडियो',
    nameEn: 'Colaba Designer Studio',
    description: 'भारत के टॉप डिज़ाइनरों का एक्सक्लूसिव कलेक्शन - लक्जरी और स्टाइल का संगम',
    established: '2010s',
    speciality: 'डिज़ाइनर वेयर, कस्टम आउटफिट्स',
    location: 'फैशन डिस्ट्रिक्ट, कोलाबा',
    heroImage: '/images/markets/colaba-designer-studio.jpg'
  };

  const designCategories = [
    { id: 'all', name: 'सभी डिज़ाइन', icon: '✨' },
    { id: 'ethnic', name: 'एथनिक वेयर', icon: '🥻' },
    { id: 'western', name: 'वेस्टर्न वेयर', icon: '👗' },
    { id: 'fusion', name: 'फ्यूज़न वेयर', icon: '🌟' },
    { id: 'bridal', name: 'ब्राइडल वेयर', icon: '👰' },
    { id: 'accessories', name: 'एक्सेसरीज़', icon: '💎' },
    { id: 'mens', name: 'मेन्स वेयर', icon: '🤵' }
  ];

  const featuredDesigners = [
    {
      name: 'अनीता डोंगरे',
      specialty: 'सस्टेनेबल लक्जरी',
      experience: '25+ वर्ष',
      style: 'बोहो-चिक इंडियन',
      achievements: 'पद्म श्री पुरस्कार',
      collections: 8,
      signature: 'ग्लोबल डेसी'
    },
    {
      name: 'मनीष मल्होत्रा',
      specialty: 'ब्राइडल कूचर',
      experience: '30+ वर्ष',
      style: 'ग्लैमरस ट्रेडिशनल',
      achievements: 'बॉलीवुड फैशन आइकन',
      collections: 12,
      signature: 'लक्जरी हैंडवर्क'
    },
    {
      name: 'सब्यसाची मुखर्जी',
      specialty: 'बंगाली ट्रेडिशनल',
      experience: '22+ वर्ष',
      style: 'रीगल वेडिंग',
      achievements: 'फिल्मफेयर अवॉर्ड',
      collections: 10,
      signature: 'विंटेज लक्जरी'
    }
  ];

  const designCollections = [
    {
      name: 'रॉयल हेरिटेज',
      designer: 'सब्यसाची मुखर्जी',
      theme: 'भारतीय शाही परंपरा',
      pieces: 25,
      priceRange: '₹50,000 - ₹5,00,000',
      season: 'विंटर 2024'
    },
    {
      name: 'अर्बन नोमैड',
      designer: 'अनीता डोंगरे',
      theme: 'आधुनिक बोहेमियन',
      pieces: 18,
      priceRange: '₹15,000 - ₹1,50,000',
      season: 'स्प्रिंग 2024'
    },
    {
      name: 'ब्राइडल ड्रीम्स',
      designer: 'मनीष मल्होत्रा',
      theme: 'लक्जरी वेडिंग',
      pieces: 30,
      priceRange: '₹1,00,000 - ₹10,00,000',
      season: 'वेडिंग सीज़न'
    }
  ];

  const designServices = [
    { service: 'कस्टम डिज़ाइन', description: 'व्यक्तिगत पसंद के अनुसार डिज़ाइन', duration: '4-6 सप्ताह' },
    { service: 'पर्सनल स्टाइलिंग', description: 'एक्सपर्ट स्टाइलिस्ट की सलाह', duration: '2-3 घंटे' },
    { service: 'अल्टरेशन्स', description: 'परफेक्ट फिटिंग के लिए', duration: '1-2 सप्ताह' },
    { service: 'स्पेशल ऑकेज़न', description: 'इवेंट स्पेसिफिक आउटफिट्स', duration: '3-4 सप्ताह' }
  ];

  useEffect(() => {
    trackPageView('colaba_designer_studio');
    loadStudioData();
  }, []);

  const loadStudioData = async () => {
    try {
      setLoading(true);
      
      const [collectionsResponse, designersResponse] = await Promise.all([
        apiService.get('/markets/colaba-causeway/designer-studio/collections'),
        apiService.get('/markets/colaba-causeway/designer-studio/designers')
      ]);

      if (collectionsResponse.success) {
        setCollections(collectionsResponse.data);
      }

      if (designersResponse.success) {
        setDesigners(designersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load studio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('design_category_selected', {
      market: 'colaba_causeway',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_designer_studio', {
        productId: product.id,
        market: 'colaba_causeway',
        designer: product.designer
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_designer_studio', {
        productId: product.id,
        market: 'colaba_causeway'
      });
    }
  };

  const filteredCollections = activeCategory === 'all' 
    ? collections 
    : collections.filter(collection => collection.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{studioInfo.name} - भारतशाला | कोलाबा के डिज़ाइनर आउटफिट्स</title>
        <meta name="description" content="कोलाबा डिज़ाइनर स्टूडियो से भारत के टॉप डिज़ाइनरों के एक्सक्लूसिव कलेक्शन। डिज़ाइनर वेयर, ब्राइडल आउटफिट्स और कस्टम डिज़ाइन।" />
        <meta name="keywords" content="कोलाबा डिज़ाइनर स्टूडियो, डिज़ाइनर वेयर, ब्राइडल आउटफिट्स, लक्जरी फैशन, मुंबई डिज़ाइनर" />
        <link rel="canonical" href="https://bharatshala.com/markets/colaba-causeway/designer-studio" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${studioInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">✨</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{studioInfo.name}</h1>
                  <p className="text-xl opacity-90">{studioInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-rose-200">{studioInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-rose-200">{studioInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-rose-200">{studioInfo.location}</p>
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
              <span className="text-gray-900">डिज़ाइनर स्टूडियो</span>
            </nav>
          </div>
        </div>

        {/* Featured Collections */}
        <section className="py-12 bg-pink-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फीचर्ड कलेक्शन्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {designCollections.map((collection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{collection.name}</h3>
                  <p className="text-gray-600 mb-2"><strong>डिज़ाइनर:</strong> {collection.designer}</p>
                  <p className="text-gray-600 mb-2"><strong>थीम:</strong> {collection.theme}</p>
                  <p className="text-gray-600 mb-2"><strong>पीसेस:</strong> {collection.pieces}</p>
                  <p className="text-gray-600 mb-2"><strong>सीज़न:</strong> {collection.season}</p>
                  <div className="mb-4">
                    <span className="text-lg font-bold text-pink-600">{collection.priceRange}</span>
                  </div>
                  <button className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
                    कलेक्शन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">डिज़ाइन श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {designCategories.map((category) => (
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

        {/* Featured Designers */}
        <section className="py-16 bg-gradient-to-r from-rose-100 to-pink-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">सेलिब्रिटी डिज़ाइनर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredDesigners.map((designer, index) => (
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
                    <p><strong>शैली:</strong> {designer.style}</p>
                    <p><strong>अनुभव:</strong> {designer.experience}</p>
                    <p><strong>सिग्नेचर:</strong> {designer.signature}</p>
                    <p><strong>उपलब्धि:</strong> {designer.achievements}</p>
                    <p><strong>कलेक्शन्स:</strong> {designer.collections}</p>
                  </div>
                  <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200">
                    डिज़ाइन्स देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Design Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्पेशल सर्विसेज</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {designServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.service}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <p className="text-pink-700 font-medium text-sm">{service.duration}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="डिज़ाइन्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी डिज़ाइन्स' : designCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCollections.map((collection) => (
                  <ProductCard
                    key={collection.id}
                    product={collection}
                    onAddToCart={() => handleAddToCart(collection)}
                    onAddToWishlist={() => handleAddToWishlist(collection)}
                    showDesignerBadge={true}
                    showLuxuryBadge={true}
                    showCustomBadge={true}
                  />
                ))}
              </div>

              {filteredCollections.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई डिज़ाइन नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Styling Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्टाइलिंग प्रोसेस</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">कंसल्टेशन</h3>
                <p className="text-gray-600">व्यक्तिगत स्टाइल और जरूरतों की समझ</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✏️</div>
                <h3 className="text-xl font-semibold mb-2">डिज़ाइन</h3>
                <p className="text-gray-600">कस्टम डिज़ाइन और स्केच तैयार करना</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✂️</div>
                <h3 className="text-xl font-semibold mb-2">टेलरिंग</h3>
                <p className="text-gray-600">एक्सपर्ट क्राफ्ट्समैन द्वारा सिलाई</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👗</div>
                <h3 className="text-xl font-semibold mb-2">फाइनल फिटिंग</h3>
                <p className="text-gray-600">परफेक्ट फिट और स्टाइलिंग टिप्स</p>
              </div>
            </div>
          </div>
        </section>

        {/* Designer Studio Experience */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">कोलाबा डिज़ाइनर स्टूडियो का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                15 साल से कोलाबा डिज़ाइनर स्टूडियो भारतीय फैशन को नई दिशा दे रहा है। 
                यहाँ हर आउटफिट में मिलता है अंतर्राष्ट्रीय स्टैंडर्ड और भारतीय संस्कार का मेल। 
                सेलिब्रिटी डिज़ाइनर्स से लेकर इमर्जिंग टैलेंट तक, यहाँ है हर स्टाइल का जवाब।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>फैशन डिस्ट्रिक्ट, कोलाबा, मुंबई</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 11:00 - रात 9:00 (रविवार बंद)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>लक्जरी डिज़ाइनर वेयर और कस्टम डिज़ाइन</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DesignerStudio;