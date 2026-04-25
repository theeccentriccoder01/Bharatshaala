// Incense Store Component for Devaraja Market - Bharatshaala Platform
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

const IncenseStore = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [incenseProducts, setIncenseProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const storeInfo = {
    name: 'देवराज मार्केट अगरबत्ती स्टोर',
    nameEn: 'Devaraja Market Incense Store',
    description: 'मैसूर की प्रसिद्ध अगरबत्ती की दुकान - पारंपरिक सुगंध और आध्यात्मिकता का केंद्र',
    established: '1920s',
    speciality: 'चंदन अगरबत्ती, औषधीय धूप',
    location: 'देवराज मार्केट, मैसूर',
    heroImage: '/images/markets/devaraja-incense.jpg'
  };

  const incenseCategories = [
    { id: 'all', name: 'सभी अगरबत्ती', icon: '🕯️' },
    { id: 'sandalwood', name: 'चंदन अगरबत्ती', icon: '🪵' },
    { id: 'jasmine', name: 'चमेली अगरबत्ती', icon: '🌸' },
    { id: 'rose', name: 'गुलाब अगरबत्ती', icon: '🌹' },
    { id: 'medicinal', name: 'औषधीय धूप', icon: '🌿' },
    { id: 'temple', name: 'मंदिर स्पेशल', icon: '🏛️' },
    { id: 'organic', name: 'ऑर्गेनिक धूप', icon: '🍃' }
  ];

  const featuredIncense = [
    {
      name: 'मैसूर चंदन अगरबत्ती',
      description: 'शुद्ध मैसूर चंदन से बनी प्रीमियम अगरबत्ती',
      price: '₹450/पैक',
      sticks: '50 स्टिक्स',
      burnTime: '45 मिनट प्रति स्टिक',
      specialty: 'शुद्ध चंदन तेल',
      vendor: 'चंदन इंसेंस वर्क्स'
    },
    {
      name: 'नग चम्पा धूप',
      description: 'पारंपरिक नग चम्पा की मिठास',
      price: '₹180/पैक',
      sticks: '25 स्टिक्स',
      burnTime: '30 मिनट प्रति स्टिक',
      specialty: 'हस्तनिर्मित',
      vendor: 'प्रेम इंसेंस'
    },
    {
      name: 'गुग्गल धूप कोण',
      description: 'शुद्ध गुग्गल से बने धूप कोण',
      price: '₹120/बॉक्स',
      sticks: '12 कोण',
      burnTime: '25 मिनट प्रति कोण',
      specialty: 'वैदिक मंत्रोचार के साथ निर्मित',
      vendor: 'वैदिक धूप भंडार'
    }
  ];

  const famousVendors = [
    {
      name: 'चंदन इंसेंस वर्क्स',
      established: '1925',
      specialty: 'चंदन आधारित उत्पाद',
      rating: 4.9,
      experience: '98+ वर्ष',
      signature: 'मैसूर चंदन अगरबत्ती'
    },
    {
      name: 'प्रेम इंसेंस',
      established: '1940',
      specialty: 'फ्लोरल इंसेंस',
      rating: 4.7,
      experience: '83+ वर्ष',
      signature: 'जस्मीन और रोज़ स्टिक्स'
    },
    {
      name: 'वैदिक धूप भंडार',
      established: '1952',
      specialty: 'औषधीय और धार्मिक धूप',
      rating: 4.8,
      experience: '71+ वर्ष',
      signature: 'हवन सामग्री और कपूर'
    }
  ];

  const incenseTypes = [
    { type: 'मसाला अगरबत्ती', description: 'विभिन्न मसालों का मिश्रण', burnTime: '30-45 मिनट' },
    { type: 'चारकोल अगरबत्ती', description: 'चारकोल बेस पर सुगंध', burnTime: '25-35 मिनट' },
    { type: 'धूप कोण', description: 'शंक्वाकार धूप', burnTime: '20-30 मिनट' },
    { type: 'गुग्गल धूप', description: 'पारंपरिक गुग्गल राल', burnTime: '15-25 मिनट' },
    { type: 'कपूर', description: 'शुद्ध कपूर टैबलेट्स', burnTime: '5-10 मिनट' },
    { type: 'हवन सामग्री', description: 'हवन कुंड के लिए मिश्रण', burnTime: '1-2 घंटे' }
  ];

  const benefits = [
    { benefit: 'मानसिक शांति', description: 'तनाव कम करना और मन को शांत करना' },
    { benefit: 'वायु शुद्धीकरण', description: 'हवा में नकारात्मक ऊर्जा को दूर करना' },
    { benefit: 'ध्यान में सहायक', description: 'ध्यान और प्रार्थना में एकाग्रता' },
    { benefit: 'सुगंध चिकित्सा', description: 'अरोमा थेरेपी के लाभ' }
  ];

  useEffect(() => {
    trackPageView('devaraja_incense_store');
    loadStoreData();
  }, []);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      
      const [productsResponse, vendorsResponse] = await Promise.all([
        apiService.get('/markets/devaraja-market/incense-store/products'),
        apiService.get('/markets/devaraja-market/incense-store/vendors')
      ]);

      if (productsResponse.success) {
        setIncenseProducts(productsResponse.data);
      }

      if (vendorsResponse.success) {
        setVendors(vendorsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('incense_category_selected', {
      market: 'devaraja_market',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_incense_store', {
        productId: product.id,
        market: 'devaraja_market',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_incense_store', {
        productId: product.id,
        market: 'devaraja_market'
      });
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? incenseProducts 
    : incenseProducts.filter(product => product.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{storeInfo.name} - भारतशाला | मैसूर की प्रसिद्ध अगरबत्ती</title>
        <meta name="description" content="देवराज मार्केट से प्रामाणिक मैसूर चंदन अगरबत्ती, औषधीय धूप और पारंपरिक सुगंधित उत्पाद। शुद्ध चंदन और हर्बल अगरबत्ती।" />
        <meta name="keywords" content="मैसूर अगरबत्ती, चंदन धूप, देवराज मार्केट, हैंडमेड इंसेंस, औषधीय धूप, वैदिक हवन सामग्री" />
        <link rel="canonical" href="https://bharatshaala.com/markets/devaraja-market/incense-store" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-amber-600 text-white py-16">
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
                <span className="text-6xl">🕯️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{storeInfo.name}</h1>
                  <p className="text-xl opacity-90">{storeInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-amber-200">{storeInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-amber-200">{storeInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-amber-200">{storeInfo.location}</p>
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
              <span className="text-gray-900">अगरबत्ती स्टोर</span>
            </nav>
          </div>
        </div>

        {/* Featured Incense */}
        <section className="py-12 bg-orange-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रीमियम अगरबत्ती संग्रह</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredIncense.map((incense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{incense.name}</h3>
                  <p className="text-gray-600 mb-3">{incense.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-orange-600">{incense.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>स्टिक्स:</strong> {incense.sticks}</p>
                    <p><strong>जलने का समय:</strong> {incense.burnTime}</p>
                    <p><strong>विशेषता:</strong> {incense.specialty}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{incense.vendor}</span>
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">अगरबत्ती श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {incenseCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-orange-600 text-white'
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

        {/* Incense Types */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">धूप के प्रकार</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {incenseTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.type}</h3>
                  <p className="text-gray-600 mb-3">{type.description}</p>
                  <p className="text-orange-700 font-medium text-sm">{type.burnTime}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="अगरबत्ती लोड हो रही हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी अगरबत्ती' : incenseCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    showFragranceBadge={true}
                    showHandmadeBadge={true}
                    showBurnTimeBadge={true}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🕯️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई अगरबत्ती नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Famous Vendors */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध अगरबत्ती निर्माता</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {famousVendors.map((vendor, index) => (
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
                    <p><strong>स्थापना:</strong> {vendor.established}</p>
                    <p><strong>विशेषता:</strong> {vendor.specialty}</p>
                    <p><strong>सिग्नेचर:</strong> {vendor.signature}</p>
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
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    दुकान देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits of Incense */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">अगरबत्ती के फायदे</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">🙏</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.benefit}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Store Experience */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">देवराज अगरबत्ती स्टोर का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                100 साल से देवराज मार्केट की अगरबत्ती की दुकानें मैसूर की सुगंध को पूरे भारत में फैला रही हैं। 
                यहाँ की हर अगरबत्ती में बसी है मैसूर चंदन की खुशबू और पारंपरिक कारीगरी का जादू। 
                आध्यात्मिकता और शांति की तलाश में यह स्थान आपका स्वागत करता है।
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
                  <p>सुबह 8:00 - रात 9:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>चंदन आधारित सुगंधित उत्पाद</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default IncenseStore;
