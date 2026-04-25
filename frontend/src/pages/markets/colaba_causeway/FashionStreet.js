// Fashion Street Component for Colaba Causeway - Bharatshaala Platform
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

const FashionStreet = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [fashionItems, setFashionItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const streetInfo = {
    name: 'कोलाबा फैशन स्ट्रीट',
    nameEn: 'Colaba Fashion Street',
    description: 'मुंबई का सबसे प्रसिद्ध स्ट्रीट फैशन हब - ट्रेंडी और किफायती कपड़ों का स्वर्ग',
    established: '1990s',
    speciality: 'स्ट्रीट फैशन, ट्रेंडी आउटफिट्स',
    location: 'कॉज़वे रोड, कोलाबा',
    heroImage: '/images/markets/colaba-fashion-street.jpg'
  };

  const fashionCategories = [
    { id: 'all', name: 'सभी फैशन', icon: '👕' },
    { id: 'tops', name: 'टॉप्स', icon: '👚' },
    { id: 'dresses', name: 'ड्रेसेज', icon: '👗' },
    { id: 'jeans', name: 'जींस', icon: '👖' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '👜' },
    { id: 'footwear', name: 'फुटवेयर', icon: '👠' },
    { id: 'ethnic', name: 'एथनिक फ्यूजन', icon: '🥻' }
  ];

  const trendingItems = [
    {
      name: 'बोहो चिक टॉप',
      description: 'लेटेस्ट बोहेमियन स्टाइल टॉप',
      price: '₹599',
      originalPrice: '₹1,200',
      discount: '50% OFF',
      vendor: 'ट्रेंड बज़ार'
    },
    {
      name: 'हाई वेस्ट जींस',
      description: 'कॉम्फर्टेबल स्ट्रेच जींस',
      price: '₹899',
      originalPrice: '₹1,800',
      discount: '50% OFF',
      vendor: 'डेनिम हब'
    },
    {
      name: 'इंडो-वेस्टर्न कुर्ता',
      description: 'मॉडर्न कट के साथ ट्रेडिशनल टच',
      price: '₹799',
      originalPrice: '₹1,500',
      discount: '47% OFF',
      vendor: 'फ्यूजन फैशन'
    }
  ];

  const popularVendors = [
    {
      name: 'ट्रेंड बज़ार',
      specialty: 'वेस्टर्न वेयर',
      rating: 4.6,
      items: 150,
      experience: '8+ वर्ष',
      bestseller: 'ट्रेंडी टॉप्स'
    },
    {
      name: 'डेनिम हब',
      specialty: 'जींस और पैंट्स',
      rating: 4.7,
      items: 85,
      experience: '12+ वर्ष',
      bestseller: 'डिज़ाइनर जींस'
    },
    {
      name: 'फ्यूजन फैशन',
      specialty: 'इंडो-वेस्टर्न',
      rating: 4.5,
      items: 120,
      experience: '6+ वर्ष',
      bestseller: 'फ्यूजन कुर्ते'
    }
  ];

  const fashionTrends = [
    { trend: 'बोहो चिक', description: 'फ्लोरल प्रिंट्स और लूज़ फिटिंग', popularity: '85%' },
    { trend: 'मिनिमलिस्ट', description: 'सिंपल और क्लीन लुक', popularity: '78%' },
    { trend: 'स्ट्रीट स्टाइल', description: 'कैजुअल और कम्फर्टेबल', popularity: '92%' },
    { trend: 'इंडो-वेस्टर्न', description: 'ट्रेडिशनल और मॉडर्न का मिक्स', popularity: '88%' }
  ];

  const shoppingTips = [
    { tip: 'मोल-भाव', description: 'यहाँ बार्गेनिंग जरूरी है, आधी कीमत से शुरू करें' },
    { tip: 'क्वालिटी चेक', description: 'कपड़े की सिलाई और फैब्रिक को अच्छे से देखें' },
    { tip: 'साइज़ चेक', description: 'खरीदने से पहले साइज़ जरूर ट्राई करें' },
    { tip: 'टाइमिंग', description: 'दोपहर के बाद कम भीड़ होती है' }
  ];

  useEffect(() => {
    trackPageView('colaba_fashion_street');
    loadStreetData();
  }, []);

  const loadStreetData = async () => {
    try {
      setLoading(true);
      
      const [itemsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/colaba-causeway/fashion-street/items'),
        apiService.get('/markets/colaba-causeway/fashion-street/vendors')
      ]);

      if (itemsResponse.success) {
        setFashionItems(itemsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load street data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('fashion_category_selected', {
      market: 'colaba_causeway',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_fashion_street', {
        productId: product.id,
        market: 'colaba_causeway',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_fashion_street', {
        productId: product.id,
        market: 'colaba_causeway'
      });
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? fashionItems 
    : fashionItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{streetInfo.name} - भारतशाला | कोलाबा का ट्रेंडी फैशन</title>
        <meta name="description" content="कोलाबा फैशन स्ट्रीट से ट्रेंडी और किफायती फैशन आइटम्स। स्ट्रीट स्टाइल, बोहो चिक, इंडो-वेस्टर्न और एक्सेसरीज़।" />
        <meta name="keywords" content="कोलाबा फैशन स्ट्रीट, ट्रेंडी कपड़े, किफायती फैशन, स्ट्रीट स्टाइल, मुंबई फैशन" />
        <link rel="canonical" href="https://bharatshaala.com/markets/colaba-causeway/fashion-street" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${streetInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">👕</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{streetInfo.name}</h1>
                  <p className="text-xl opacity-90">{streetInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-pink-200">{streetInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-pink-200">{streetInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-pink-200">{streetInfo.location}</p>
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
              <span className="text-gray-900">फैशन स्ट्रीट</span>
            </nav>
          </div>
        </div>

        {/* Trending Items */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के ट्रेंडिंग आइटम्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {trendingItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-purple-600">{item.price}</span>
                    <span className="text-gray-400 line-through">{item.originalPrice}</span>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {item.discount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.vendor}</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                      खरीदें
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">फैशन श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {fashionCategories.map((category) => (
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

        {/* Fashion Trends */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">लेटेस्ट ट्रेंड्स</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {fashionTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{trend.trend}</h3>
                  <p className="text-gray-600 mb-4">{trend.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: trend.popularity }}
                    ></div>
                  </div>
                  <p className="text-purple-700 font-medium">{trend.popularity} लोकप्रिय</p>
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
          <section className="py-12 bg-gray-50">
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
                    showTrendingBadge={true}
                    showDiscountBadge={true}
                    showSizeBadge={true}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👕</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई आइटम नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Vendors */}
        <section className="py-16 bg-gradient-to-r from-pink-100 to-purple-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">पॉपुलर वेंडर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {popularVendors.map((vendor, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">🏪</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{vendor.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {vendor.specialty}</p>
                    <p><strong>बेस्टसेलर:</strong> {vendor.bestseller}</p>
                    <p><strong>आइटम्स:</strong> {vendor.items}</p>
                    <p><strong>अनुभव:</strong> {vendor.experience}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    शॉप देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Shopping Tips */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">शॉपिंग टिप्स</h2>
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

        {/* Fashion Street Experience */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">कोलाबा फैशन स्ट्रीट का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                30 साल से कोलाबा फैशन स्ट्रीट मुंबई की फैशन राजधानी है। 
                यहाँ मिलता है इंटरनेशनल ट्रेंड्स का लोकल टच और किफायती कीमतों में लेटेस्ट स्टाइल। 
                फैशन लवर्स के लिए यह जन्नत है जहाँ हर स्टाइल और हर बजट का इंतजाम है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>कॉज़वे रोड, कोलाबा, मुंबई</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 11:00 - रात 11:00 (रोज़ाना खुला)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>किफायती ट्रेंडी फैशन</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FashionStreet;
