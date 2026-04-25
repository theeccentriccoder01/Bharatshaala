// Spice Garden Component for Devaraja Market - Bharatshaala Platform
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

const SpiceGarden = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [spices, setSpices] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const gardenInfo = {
    name: 'देवराज मार्केट स्पाइस गार्डन',
    nameEn: 'Devaraja Market Spice Garden',
    description: 'कर्नाटक के खुशबूदार मसालों का बगीचा - फार्म से डायरेक्ट फ्रेश स्पाइसेस',
    established: '1960s',
    speciality: 'कर्नाटक स्पेशल मसाले, ऑर्गेनिक स्पाइसेस',
    location: 'देवराज मार्केट, मैसूर',
    heroImage: '/images/markets/devaraja-spice-garden.jpg'
  };

  const spiceCategories = [
    { id: 'all', name: 'सभी मसाले', icon: '🌶️' },
    { id: 'karnataka-special', name: 'कर्नाटक स्पेशल', icon: '🏞️' },
    { id: 'organic', name: 'ऑर्गेनिक मसाले', icon: '🌿' },
    { id: 'whole-spices', name: 'साबुत मसाले', icon: '🌰' },
    { id: 'powdered', name: 'पिसे हुए मसाले', icon: '🥄' },
    { id: 'blends', name: 'मसाला मिश्रण', icon: '🍛' },
    { id: 'medicinal', name: 'औषधीय मसाले', icon: '💊' }
  ];

  const featuredSpices = [
    {
      name: 'मैसूर रसम पाउडर',
      description: 'पारंपरिक मैसूर स्टाइल रसम मसाला',
      price: '₹180/250g',
      origin: 'मैसूर रीजन',
      ingredients: 'धनिया, जीरा, काली मिर्च, तुवर दाल',
      shelfLife: '12 महीने',
      specialty: 'फ्रेशली ग्राउंड',
      vendor: 'मैसूर ट्रेडिशनल स्पाइसेस'
    },
    {
      name: 'कोडागु ब्लैक पेपर',
      description: 'कूर्ग के पहाड़ों से तेज काली मिर्च',
      price: '₹320/100g',
      origin: 'कोडागु हिल्स',
      grade: 'प्रीमियम ग्रेड',
      piperine: '7% + पाइपराइन कंटेंट',
      processing: 'सन ड्राईड',
      vendor: 'कोडागु स्पाइस फार्म्स'
    },
    {
      name: 'बायदगी चिली पाउडर',
      description: 'बायदगी की प्रसिद्ध लाल मिर्च',
      price: '₹240/250g',
      origin: 'बायदगी, कर्नाटक',
      scoville: '1,500-2,000 SHU',
      color: 'डीप रेड',
      texture: 'फाइन पाउडर',
      vendor: 'बायदगी चिली प्रोड्यूसर्स'
    }
  ];

  const localFarmers = [
    {
      name: 'राजू स्पाइस फार्मर',
      experience: '25+ वर्ष',
      location: 'कोडागु हिल्स',
      crops: 'काली मिर्च, इलायची, अदरक',
      farmSize: '15 एकड़',
      certification: 'ऑर्गेनिक सर्टिफाइड'
    },
    {
      name: 'सुमित्रा मसाला गार्डन',
      experience: '30+ वर्ष',
      location: 'चिकमंगलूर',
      crops: 'हल्दी, धनिया, जीरा',
      farmSize: '20 एकड़',
      certification: 'नेचुरल फार्मिंग'
    },
    {
      name: 'वेंकटेश चिली फार्म',
      experience: '20+ वर्ष',
      location: 'बायदगी',
      crops: 'लाल मिर्च, सूखी मिर्च',
      farmSize: '25 एकड़',
      certification: 'GAP सर्टिफाइड'
    }
  ];

  const spiceVarieties = [
    { spice: 'बायदगी चिली', region: 'बायदगी', uniqueness: 'कम तेज, बेहतरीन रंग' },
    { spice: 'सागर काली मिर्च', region: 'सागर', uniqueness: 'हाई पाइपराइन कंटेंट' },
    { spice: 'हासन हल्दी', region: 'हासन', uniqueness: 'हाई क्यूरकुमिन' },
    { spice: 'मैसूर धनिया', region: 'मैसूर', uniqueness: 'स्वीट अरोमा' },
    { spice: 'शिमोगा अदरक', region: 'शिमोगा', uniqueness: 'फाइबर फ्री' },
    { spice: 'चिकमंगलूर इलायची', region: 'चिकमंगलूर', uniqueness: 'इंटेंस फ्लेवर' }
  ];

  const healthBenefits = [
    { spice: 'हल्दी', benefits: ['एंटी-इंफ्लेमेटरी', 'इम्यूनिटी बूस्टर', 'एंटीऑक्सीडेंट'] },
    { spice: 'काली मिर्च', benefits: ['डाइजेशन', 'मेटाबॉलिज्म', 'एंटी-बैक्टीरियल'] },
    { spice: 'अदरक', benefits: ['नॉजिया रिलीफ', 'एंटी-इंफ्लेमेटरी', 'पेन रिलीफ'] },
    { spice: 'धनिया', benefits: ['डाइजेस्टिव एड', 'कोलेस्ट्रॉल कंट्रोल', 'ब्लड शुगर'] }
  ];

  useEffect(() => {
    trackPageView('devaraja_spice_garden');
    loadGardenData();
  }, []);

  const loadGardenData = async () => {
    try {
      setLoading(true);
      
      const [spicesResponse, farmersResponse] = await Promise.all([
        apiService.get('/markets/devaraja-market/spice-garden/spices'),
        apiService.get('/markets/devaraja-market/spice-garden/farmers')
      ]);

      if (spicesResponse.success) {
        setSpices(spicesResponse.data);
      }

      if (farmersResponse.success) {
        setFarmers(farmersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load garden data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('spice_garden_category_selected', {
      market: 'devaraja_market',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_spice_garden', {
        productId: product.id,
        market: 'devaraja_market',
        vendor: product.vendor
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_spice_garden', {
        productId: product.id,
        market: 'devaraja_market'
      });
    }
  };

  const filteredSpices = activeCategory === 'all' 
    ? spices 
    : spices.filter(spice => spice.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{gardenInfo.name} - भारतशाला | कर्नाटक के ताजे मसाले</title>
        <meta name="description" content="देवराज मार्केट स्पाइस गार्डन से कर्नाटक के विशेष मसाले। बायदगी चिली, कोडागु पेपर, मैसूर रसम पाउडर और ऑर्गेनिक स्पाइसेस।" />
        <meta name="keywords" content="कर्नाटक मसाले, बायदगी चिली, कोडागू काली मिर्च, मैसूर मसाले, ऑर्गेनिक स्पाइसेस, देवराज मार्केट" />
        <link rel="canonical" href="https://bharatshaala.com/markets/devaraja-market/spice-garden" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${gardenInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🌶️</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{gardenInfo.name}</h1>
                  <p className="text-xl opacity-90">{gardenInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-emerald-200">{gardenInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-emerald-200">{gardenInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-emerald-200">{gardenInfo.location}</p>
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
              <span className="text-gray-900">स्पाइस गार्डन</span>
            </nav>
          </div>
        </div>

        {/* Featured Spices */}
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कर्नाटक के विशेष मसाले</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredSpices.map((spice, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{spice.name}</h3>
                  <p className="text-gray-600 mb-3">{spice.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-green-600">{spice.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>मूल:</strong> {spice.origin}</p>
                    {spice.ingredients && <p><strong>सामग्री:</strong> {spice.ingredients}</p>}
                    {spice.grade && <p><strong>ग्रेड:</strong> {spice.grade}</p>}
                    {spice.piperine && <p><strong>पाइपराइन:</strong> {spice.piperine}</p>}
                    {spice.scoville && <p><strong>तीखापन:</strong> {spice.scoville}</p>}
                    <p><strong>विशेषता:</strong> {spice.specialty}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{spice.vendor}</span>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">मसाला श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {spiceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
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

        {/* Spice Varieties */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कर्नाटक की विशेष किस्में</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {spiceVarieties.map((variety, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{variety.spice}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>क्षेत्र:</strong> {variety.region}</p>
                    <p><strong>विशेषता:</strong> {variety.uniqueness}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="मसाले लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी मसाले' : spiceCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSpices.map((spice) => (
                  <ProductCard
                    key={spice.id}
                    product={spice}
                    onAddToCart={() => handleAddToCart(spice)}
                    onAddToWishlist={() => handleAddToWishlist(spice)}
                    showOriginBadge={true}
                    showFreshnessBadge={true}
                    showOrganicBadge={true}
                  />
                ))}
              </div>

              {filteredSpices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌶️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई मसाला नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Local Farmers */}
        <section className="py-16 bg-gradient-to-r from-green-100 to-emerald-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्थानीय किसान</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {localFarmers.map((farmer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🌾</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{farmer.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>अनुभव:</strong> {farmer.experience}</p>
                    <p><strong>स्थान:</strong> {farmer.location}</p>
                    <p><strong>फसलें:</strong> {farmer.crops}</p>
                    <p><strong>फार्म साइज:</strong> {farmer.farmSize}</p>
                    <p><strong>सर्टिफिकेशन:</strong> {farmer.certification}</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
                    प्रोडक्ट्स देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मसालों के स्वास्थ्य लाभ</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {healthBenefits.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">🌿</div>
                  <h3 className="text-xl font-semibold mb-3">{item.spice}</h3>
                  <div className="space-y-1">
                    {item.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="bg-green-50 rounded-lg p-2 text-sm text-gray-700">
                        • {benefit}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Farm to Table Story */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">फार्म से टेबल तक</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                60 साल से देवराज मार्केट स्पाइस गार्डन कर्नाटक के किसानों को सीधे उपभोक्ताओं से जोड़ रहा है। 
                यहाँ आपको मिलते हैं पूरी तरह से प्राकृतिक और ताजे मसाले, बिना किसी मिलावट के। 
                हर मसाले में छुपी है कर्नाटक की धरती की सुगंध और किसानों का प्रेम।
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
                  <p>सुबह 7:00 - शाम 8:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>फार्म फ्रेश ऑर्गेनिक स्पाइसेस</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SpiceGarden;
