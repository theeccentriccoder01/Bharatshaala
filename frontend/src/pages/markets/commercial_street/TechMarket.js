// Tech Market Component for Commercial Street - Bharatshaala Platform
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

const TechMarket = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [techProducts, setTechProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const marketInfo = {
    name: 'कमर्शियल स्ट्रीट टेक मार्केट',
    nameEn: 'Commercial Street Tech Market',
    description: 'बेंगलुरु का IT हब - लेटेस्ट टेक्नोलॉजी और गैजेट्स का घर',
    established: '2000s',
    speciality: 'लैपटॉप्स, स्मार्टफोन्स, गैजेट्स',
    location: 'कमर्शियल स्ट्रीट, बेंगलुरु',
    heroImage: '/images/markets/commercial-street-tech.jpg'
  };

  const techCategories = [
    { id: 'all', name: 'सभी टेक प्रोडक्ट्स', icon: '💻' },
    { id: 'laptops', name: 'लैपटॉप्स', icon: '💻' },
    { id: 'smartphones', name: 'स्मार्टफोन्स', icon: '📱' },
    { id: 'tablets', name: 'टैबलेट्स', icon: '📱' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '🔌' },
    { id: 'gaming', name: 'गेमिंग', icon: '🎮' },
    { id: 'smart-devices', name: 'स्मार्ट डिवाइसेज', icon: '🏠' }
  ];

  const featuredProducts = [
    {
      name: 'Dell Inspiron 15 3000',
      category: 'Laptop',
      price: '₹42,990',
      originalPrice: '₹55,000',
      discount: '22% OFF',
      specs: ['Intel Core i5', '8GB RAM', '512GB SSD', 'Windows 11'],
      rating: 4.3,
      vendor: 'TechZone'
    },
    {
      name: 'iPhone 14',
      category: 'Smartphone',
      price: '₹69,900',
      originalPrice: '₹79,900',
      discount: '12% OFF',
      specs: ['A15 Bionic', '128GB Storage', 'Dual Camera', 'iOS 16'],
      rating: 4.7,
      vendor: 'Mobile Hub'
    },
    {
      name: 'Samsung Galaxy Tab S8',
      category: 'Tablet',
      price: '₹45,999',
      originalPrice: '₹54,999',
      discount: '16% OFF',
      specs: ['Snapdragon 8 Gen 1', '8GB RAM', '11 inch Display', 'S Pen'],
      rating: 4.5,
      vendor: 'Gadget World'
    }
  ];

  const topVendors = [
    {
      name: 'TechZone',
      speciality: 'लैपटॉप्स और डेस्कटॉप्स',
      rating: 4.6,
      experience: '12+ वर्ष',
      products: 200,
      services: ['रिपेयर', 'अपग्रेड', 'वारंटी']
    },
    {
      name: 'Mobile Hub',
      speciality: 'स्मार्टफोन्स और टैबलेट्स',
      rating: 4.5,
      experience: '8+ वर्ष',
      products: 150,
      services: ['स्क्रीन रिप्लेसमेंट', 'अनलॉकिंग', 'डेटा रिकवरी']
    },
    {
      name: 'Gadget World',
      speciality: 'गेमिंग और एक्सेसरीज',
      rating: 4.4,
      experience: '10+ वर्ष',
      products: 300,
      services: ['कस्टम बिल्ड', 'गेमिंग सेटअप', 'टेक सपोर्ट']
    }
  ];

  const techTrends = [
    { trend: 'AI और ML डिवाइसेज', description: 'आर्टिफिशियल इंटेलिजेंस इनेबल्ड गैजेट्स', growth: '85%' },
    { trend: '5G कनेक्टिविटी', description: 'हाई-स्पीड इंटरनेट सपोर्ट', growth: '78%' },
    { trend: 'वियरेबल टेक', description: 'स्मार्ट वॉचेस और फिटनेस ट्रैकर्स', growth: '92%' },
    { trend: 'क्लाउड गेमिंग', description: 'स्ट्रीमिंग बेस्ड गेमिंग सोल्यूशन्स', growth: '67%' }
  ];

  const techServices = [
    { service: 'डेटा रिकवरी', description: 'डिलीटेड या करप्टेड डेटा को रिकवर करना', duration: '2-5 दिन' },
    { service: 'हार्डवेयर अपग्रेड', description: 'RAM, SSD और अन्य कंपोनेंट्स का अपग्रेड', duration: '1-2 घंटे' },
    { service: 'वायरस रिमूवल', description: 'मैलवेयर और वायरस की सफाई', duration: '2-4 घंटे' },
    { service: 'स्क्रीन रिप्लेसमेंट', description: 'फोन और लैपटॉप स्क्रीन रिपेयर', duration: '1-3 घंटे' }
  ];

  useEffect(() => {
    trackPageView('commercial_street_tech_market');
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/commercial-street/tech-market/products'),
        apiService.get('/markets/commercial-street/tech-market/vendors')
      ]);

      if (productsResponse.success) {
        setTechProducts(productsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('tech_category_selected', {
      market: 'commercial_street',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_tech_market', {
        productId: product.id,
        market: 'commercial_street',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_tech_market', {
        productId: product.id,
        market: 'commercial_street'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? techProducts 
    : techProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{marketInfo.name} - भारतशाला | बेंगलुरु का टेक हब</title>
        <meta name="description" content="कमर्शियल स्ट्रीट टेक मार्केट से लेटेस्ट लैपटॉप्स, स्मार्टफोन्स, गैजेट्स और टेक एक्सेसरीज खरीदें। बेस्ट प्राइसेस और एक्सपर्ट सर्विस।" />
        <meta name="keywords" content="बेंगलुरु टेक मार्केट, लैपटॉप्स, स्मार्टफोन्स, कमर्शियल स्ट्रीट, टेक गैजेट्स, कंप्यूटर रिपेयर" />
        <link rel="canonical" href="https://bharatshaala.com/markets/commercial-street/tech-market" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
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
                <span className="text-6xl">💻</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{marketInfo.name}</h1>
                  <p className="text-xl opacity-90">{marketInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-purple-200">{marketInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-purple-200">{marketInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-purple-200">{marketInfo.location}</p>
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
              <span className="text-gray-900">टेक मार्केट</span>
            </nav>
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के बेस्ट डील्स</h2>
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
                  <p className="text-blue-600 font-medium mb-3">{product.category}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <span className="text-gray-400 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {product.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="bg-gray-50 rounded-lg p-2 text-sm text-gray-700">
                        • {spec}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{product.vendor}</span>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">टेक श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {techCategories.map((category) => (
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

        {/* Tech Trends */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">टेक ट्रेंड्स 2024</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {techTrends.map((trend, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{trend.trend}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{trend.description}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: trend.growth }}
                    ></div>
                  </div>
                  <p className="text-blue-700 font-medium text-sm">{trend.growth} ग्रोथ</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="टेक प्रोडक्ट्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी टेक प्रोडक्ट्स' : techCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showTechSpecsBadge={true}
                    showWarrantyBadge={true}
                    showEMIBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई प्रोडक्ट नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Top Vendors */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">टॉप टेक वेंडर्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {topVendors.map((vendor, index) => (
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
                    <p><strong>विशेषता:</strong> {vendor.speciality}</p>
                    <p><strong>अनुभव:</strong> {vendor.experience}</p>
                    <p><strong>प्रोडक्ट्स:</strong> {vendor.products}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{vendor.rating}</span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {vendor.services.map((service, serviceIndex) => (
                      <span key={serviceIndex} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">
                        {service}
                      </span>
                    ))}
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    स्टोर देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Services */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">टेक सर्विसेज</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {techServices.map((service, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-xl font-semibold mb-2">{service.service}</h3>
                  <p className="text-gray-600 mb-2">{service.description}</p>
                  <p className="text-blue-600 font-medium text-sm">{service.duration}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Market Experience */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">टेक मार्केट का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                25 साल से कमर्शियल स्ट्रीट टेक मार्केट बेंगलुरु का टेक हब है। 
                यहाँ मिलता है लेटेस्ट टेक्नोलॉजी का बेस्ट कॉम्बिनेशन कम्पेटिटिव प्राइसेस के साथ। 
                एक्सपर्ट टेक्निशियन्स और ऑथराइज़्ड डीलर्स से खरीदारी करें।
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
                  <div className="text-4xl mb-4">💻</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>लेटेस्ट टेक्नोलॉजी और बेस्ट प्राइसेस</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TechMarket;
