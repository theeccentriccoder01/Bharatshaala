// Fashion Hub Component for Commercial Street - Bharatshaala Platform
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

const FashionHub = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [fashionItems, setFashionItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const hubInfo = {
    name: 'कमर्शियल स्ट्रीट फैशन हब',
    nameEn: 'Commercial Street Fashion Hub',
    description: 'बेंगलुरु का प्रसिद्ध फैशन डेस्टिनेशन - ट्रेंडी से लेकर ट्रेडिशनल तक सब कुछ',
    established: '1980s',
    speciality: 'मल्टी-ब्रांड फैशन स्टोर',
    location: 'कमर्शियल स्ट्रीट, बेंगलुरु',
    heroImage: '/images/markets/commercial-street-fashion.jpg'
  };

  const fashionCategories = [
    { id: 'all', name: 'सभी फैशन', icon: '👗' },
    { id: 'western-wear', name: 'वेस्टर्न वेयर', icon: '👚' },
    { id: 'ethnic-wear', name: 'एथनिक वेयर', icon: '🥻' },
    { id: 'casual-wear', name: 'कैजुअल वेयर', icon: '👕' },
    { id: 'formal-wear', name: 'फॉर्मल वेयर', icon: '👔' },
    { id: 'footwear', name: 'फुटवेयर', icon: '👠' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '👜' }
  ];

  const featuredBrands = [
    {
      name: 'Fabindia',
      specialty: 'एथनिक और हैंडलूम',
      priceRange: '₹500 - ₹5,000',
      style: 'ट्रेडिशनल',
      items: 250,
      discount: 'Up to 30% OFF'
    },
    {
      name: 'AND',
      specialty: 'वेस्टर्न वेयर',
      priceRange: '₹800 - ₹4,000',
      style: 'कंटेंपररी',
      items: 180,
      discount: 'Buy 2 Get 1 Free'
    },
    {
      name: 'W for Woman',
      specialty: 'इंडो-वेस्टर्न',
      priceRange: '₹600 - ₹3,500',
      style: 'फ्यूजन',
      items: 220,
      discount: 'Flat 40% OFF'
    }
  ];

  const seasonCollections = [
    {
      season: 'स्प्रिंग कलेक्शन 2024',
      theme: 'फ्लोरल और पेस्टल',
      items: 150,
      brands: 8,
      highlights: ['फ्लोरल प्रिंट्स', 'पेस्टल कलर्स', 'लाइट फैब्रिक्स']
    },
    {
      season: 'समर एसेंशियल्स',
      theme: 'कूल और कम्फर्ट',
      items: 120,
      brands: 6,
      highlights: ['कॉटन फैब्रिक', 'ब्रीदेबल मटेरियल', 'यूवी प्रोटेक्शन']
    },
    {
      season: 'फेस्टिवल स्पेशल',
      theme: 'ट्रेडिशनल ग्लैम',
      items: 200,
      brands: 10,
      highlights: ['एथनिक वेयर', 'हेवी एम्ब्रॉयडरी', 'फेस्टिवल कलर्स']
    }
  ];

  const fashionTrends = [
    { trend: 'सस्टेनेबल फैशन', popularity: '78%', description: 'इको-फ्रेंडली मटेरियल्स' },
    { trend: 'मिनिमलिस्ट स्टाइल', popularity: '85%', description: 'सिंपल और एलिगेंट लुक्स' },
    { trend: 'बोल्ड प्रिंट्स', popularity: '72%', description: 'स्टेटमेंट पैटर्न्स' },
    { trend: 'कम्फर्ट वेयर', popularity: '90%', description: 'वर्क फ्रॉम होम फैशन' }
  ];

  const shoppingTips = [
    { tip: 'साइज़ गाइड', description: 'ऑनलाइन खरीदारी से पहले साइज़ चार्ट देखें' },
    { tip: 'फैब्रिक केयर', description: 'वॉशिंग इंस्ट्रक्शन्स को ध्यान से पढ़ें' },
    { tip: 'मिक्स एंड मैच', description: 'बेसिक पीसेस को अलग-अलग तरीकों से स्टाइल करें' },
    { tip: 'इन्वेस्टमेंट पीसेस', description: 'क्वालिटी फॉर्मल वेयर में इन्वेस्ट करें' }
  ];

  useEffect(() => {
    trackPageView('commercial_street_fashion_hub');
    loadHubData();
  }, []);

  const loadHubData = async () => {
    try {
      setLoading(true);
      
      const [itemsResponse, brandsResponse] = await Promise.all([
        apiService.get('/markets/commercial-street/fashion-hub/items'),
        apiService.get('/markets/commercial-street/fashion-hub/brands')
      ]);

      if (itemsResponse.success) {
        setFashionItems(itemsResponse.data);
      }

      if (brandsResponse.success) {
        setBrands(brandsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('fashion_category_selected', {
      market: 'commercial_street',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_fashion_hub', {
        productId: product.id,
        market: 'commercial_street',
        brand: product.brand
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_fashion_hub', {
        productId: product.id,
        market: 'commercial_street'
      });
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? fashionItems 
    : fashionItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{hubInfo.name} - भारतशाला | बेंगलुरु का प्रसिद्ध फैशन हब</title>
        <meta name="description" content="कमर्शियल स्ट्रीट फैशन हब से ट्रेंडी और ट्रेडिशनल फैशन आइटम्स। मल्टी-ब्रांड स्टोर्स, सीजनल कलेक्शन्स और लेटेस्ट ट्रेंड्स।" />
        <meta name="keywords" content="कमर्शियल स्ट्रीट फैशन, बेंगलुरु शॉपिंग, मल्टी-ब्रांड फैशन, ट्रेंडी कपड़े, एथनिक वेयर" />
        <link rel="canonical" href="https://bharatshaala.com/markets/commercial-street/fashion-hub" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${hubInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">👗</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{hubInfo.name}</h1>
                  <p className="text-xl opacity-90">{hubInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-pink-200">{hubInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-pink-200">{hubInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-pink-200">{hubInfo.location}</p>
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
              <Link to="/markets/commercial-street" className="hover:text-emerald-600">कमर्शियल स्ट्रीट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">फैशन हब</span>
            </nav>
          </div>
        </div>

        {/* Featured Brands */}
        <section className="py-12 bg-rose-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फीचर्ड ब्रांड्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBrands.map((brand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{brand.name}</h3>
                  <p className="text-gray-600 mb-2"><strong>विशेषता:</strong> {brand.specialty}</p>
                  <p className="text-gray-600 mb-2"><strong>स्टाइल:</strong> {brand.style}</p>
                  <p className="text-gray-600 mb-2"><strong>प्राइस रेंज:</strong> {brand.priceRange}</p>
                  <p className="text-gray-600 mb-3"><strong>आइटम्स:</strong> {brand.items}</p>
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {brand.discount}
                    </span>
                  </div>
                  <button className="w-full bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-200">
                    ब्रांड देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">फैशन श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {fashionCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-rose-600 text-white'
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

        {/* Seasonal Collections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">सीजनल कलेक्शन्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {seasonCollections.map((collection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{collection.season}</h3>
                  <p className="text-gray-600 mb-3">{collection.theme}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>आइटम्स:</strong> {collection.items}</p>
                    <p><strong>ब्रांड्स:</strong> {collection.brands}</p>
                  </div>
                  <div className="space-y-1 mb-4">
                    {collection.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700">
                        • {highlight}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-200">
                    कलेक्शन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fashion Trends */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">ट्रेंडिंग फैशन</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {fashionTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{trend.trend}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{trend.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-rose-600 h-2 rounded-full" 
                      style={{ width: trend.popularity }}
                    ></div>
                  </div>
                  <p className="text-rose-700 font-medium text-sm">{trend.popularity} लोकप्रिय</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="फैशन आइटम्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी फैशन आइटम्स' : fashionCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={() => handleAddToCart(item)}
                    onAddToWishlist={() => handleAddToWishlist(item)}
                    showBrandBadge={true}
                    showTrendingBadge={true}
                    showSizeBadge={true}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👗</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई आइटम नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Shopping Tips */}
        <section className="py-16 bg-rose-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फैशन टिप्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {shoppingTips.map((tip, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold mb-2">{tip.tip}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fashion Hub Experience */}
        <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">फैशन हब का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                40 साल से कमर्शियल स्ट्रीट फैशन हब बेंगलुरु की फैशन राजधानी है। 
                यहाँ मिलता है हर स्टाइल, हर बजट और हर उम्र के लिए फैशन का भंडार। 
                ट्रेडिशनल से लेकर कंटेंपररी तक, यहाँ है फैशन का पूरा संसार।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>कमर्शियल स्ट्रीट, बेंगलुरु</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 10:00 - रात 9:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🛍️</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>मल्टी-ब्रांड फैशन स्टोर</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FashionHub;