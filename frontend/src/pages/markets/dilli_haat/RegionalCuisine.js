// Regional Cuisine Component for Dilli Haat - Bharatshaala Platform
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

const RegionalCuisine = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [cuisineItems, setCuisineItems] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const cuisineInfo = {
    name: 'दिल्ली हाट क्षेत्रीय व्यंजन केंद्र',
    nameEn: 'Dilli Haat Regional Cuisine Center',
    description: 'भारत के विविध राज्यों के प्रामाणिक व्यंजनों का स्वादिष्ट संग्रह',
    established: '1994',
    speciality: 'पारंपरिक भारतीय व्यंजन',
    location: 'दिल्ली हाट, INA, नई दिल्ली',
    heroImage: '/images/markets/dilli-haat-cuisine.jpg'
  };

  const cuisineCategories = [
    { id: 'all', name: 'सभी व्यंजन', icon: '🍛' },
    { id: 'north-indian', name: 'उत्तर भारतीय', icon: '🍞' },
    { id: 'south-indian', name: 'दक्षिण भारतीय', icon: '🍚' },
    { id: 'west-indian', name: 'पश्चिम भारतीय', icon: '🫓' },
    { id: 'east-indian', name: 'पूर्व भारतीय', icon: '🍠' },
    { id: 'street-food', name: 'स्ट्रीट फूड', icon: '🌮' },
    { id: 'sweets', name: 'मिठाइयां', icon: '🍯' }
  ];

  const featuredDishes = [
    {
      name: 'लखनवी दम बिरयानी',
      description: 'अवधी शैली की सुगंधित बिरयानी',
      chef: 'उस्ताद राशिद खान',
      region: 'उत्तर प्रदेश',
      price: '₹450',
      cookingTime: '2 घंटे',
      spiceLevel: 'मध्यम',
      specialty: 'दम स्टाइल कुकिंग',
      ingredients: 'बासमती चावल, मटन, केसर'
    },
    {
      name: 'हैदराबादी हलीम',
      description: 'रमजान का पारंपरिक व्यंजन',
      chef: 'शेफ मोहम्मद इकबाल',
      region: 'तेलंगाना',
      price: '₹280',
      cookingTime: '8 घंटे',
      spiceLevel: 'तेज',
      specialty: 'स्लो कुकिंग',
      ingredients: 'दाल, मांस, गेहूं'
    },
    {
      name: 'केरल फिश करी',
      description: 'नारियल और मसालों से बना स्वादिष्ट करी',
      chef: 'शेफ प्रिया नायर',
      region: 'केरल',
      price: '₹350',
      cookingTime: '45 मिनट',
      spiceLevel: 'मध्यम तेज',
      specialty: 'कोकम फ्लेवर',
      ingredients: 'फिश, नारियल, करी पत्ता'
    }
  ];

  const regionalChefs = [
    {
      name: 'उस्ताद राशिद खान',
      specialty: 'अवधी व्यंजन',
      region: 'लखनऊ',
      experience: '35+ वर्ष',
      signature: 'दम बिरयानी और कबाब',
      awards: 'राष्ट्रीय पाक कला पुरस्कार',
      restaurant: 'अवधी दरबार'
    },
    {
      name: 'शेफ वेंकटेश्वरलू',
      specialty: 'आंध्र व्यंजन',
      region: 'हैदराबाद',
      experience: '25+ वर्ष',
      signature: 'स्पाइसी चिकन करी',
      awards: 'तेलुगु कुकिंग चैंपियन',
      restaurant: 'आंध्र प्रदेश भवन'
    },
    {
      name: 'शेफ प्रिया मेनन',
      specialty: 'केरल व्यंजन',
      region: 'कोच्चि',
      experience: '20+ वर्ष',
      signature: 'सैडया और अप्पम',
      awards: 'साउथ इंडियन कुजीन एक्सपर्ट',
      restaurant: 'केरल हाउस'
    }
  ];

  const statePavilions = [
    {
      state: 'पंजाब',
      dishes: ['मक्के दी रोटी', 'सरसों दा साग', 'बटर चिकन'],
      specialties: ['लस्सी', 'कुल्चा', 'छोले भटूरे'],
      chef: 'सरदार जसविंदर सिंह'
    },
    {
      state: 'राजस्थान',
      dishes: ['दाल बाटी चूरमा', 'गट्टे की सब्जी', 'लाल मांस'],
      specialties: ['घेवर', 'मावा कचौरी', 'पंचकूटा'],
      chef: 'शेफ भंवर लाल'
    },
    {
      state: 'गुजरात',
      dishes: ['ढोकला', 'उंधियु', 'खांडवी'],
      specialties: ['थेप्ला', 'गुजराती थाली', 'श्रीखंड'],
      chef: 'शेफ कमला बेन'
    },
    {
      state: 'पश्चिम बंगाल',
      dishes: ['मछ भात', 'रोशगुल्ला', 'कोशा मांस्हो'],
      specialties: ['संदेश', 'मिष्टी दोई', 'फुचका'],
      chef: 'शेफ सुदीप्तो सेन'
    }
  ];

  const cookingWorkshops = [
    {
      workshop: 'बिरयानी मास्टर क्लास',
      instructor: 'उस्ताद राशिद खान',
      duration: '4 घंटे',
      fee: '₹2,500',
      includes: ['सभी सामग्री', 'रेसिपी बुक', 'सर्टिफिकेट'],
      schedule: 'सप्ताहांत'
    },
    {
      workshop: 'साउथ इंडियन कुकिंग',
      instructor: 'शेफ प्रिया मेनन',
      duration: '3 घंटे',
      fee: '₹1,800',
      includes: ['सामग्री', 'रेसिपी गाइड', 'टेस्टिंग'],
      schedule: 'वीकडे इवनिंग'
    },
    {
      workshop: 'स्ट्रीट फूड बनाना',
      instructor: 'चाट मास्टर राम',
      duration: '2 घंटे',
      fee: '₹1,200',
      includes: ['चाट सामग्री', 'चटनी रेसिपी'],
      schedule: 'डेली शो'
    }
  ];

  const foodFestivals = [
    {
      festival: 'दक्षिण भारतीय फूड फेस्टिवल',
      duration: '15-25 जनवरी',
      highlights: ['ओणम साध्या', 'कर्नाटक बिसिबेले भात', 'तमिल चेटिनाड']
    },
    {
      festival: 'नॉर्थ ईस्ट फूड फेयर',
      duration: '10-20 फरवरी',
      highlights: ['असमिया पिथा', 'मणिपुरी इरोम्बा', 'नागा भुत जोलोकिया']
    },
    {
      festival: 'रजवाड़ी दावत',
      duration: '1-15 मार्च',
      highlights: ['राजस्थानी थाली', 'हैदराबादी दम', 'लखनवी दस्तरखान']
    }
  ];

  useEffect(() => {
    trackPageView('dilli_haat_regional_cuisine');
    loadCuisineData();
  }, []);

  const loadCuisineData = async () => {
    try {
      setLoading(true);
      
      const [itemsResponse, chefsResponse] = await Promise.all([
        apiService.get('/markets/dilli-haat/regional-cuisine/items'),
        apiService.get('/markets/dilli-haat/regional-cuisine/chefs')
      ]);

      if (itemsResponse.success) {
        setCuisineItems(itemsResponse.data);
      }

      if (chefsResponse.success) {
        setChefs(chefsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load cuisine data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('cuisine_category_selected', {
      market: 'dilli_haat',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_regional_cuisine', {
        productId: product.id,
        market: 'dilli_haat',
        chef: product.chef
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_regional_cuisine', {
        productId: product.id,
        market: 'dilli_haat'
      });
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? cuisineItems 
    : cuisineItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{cuisineInfo.name} - भारतशाला | भारतीय क्षेत्रीय व्यंजन</title>
        <meta name="description" content="दिल्ली हाट में भारत के विभिन्न राज्यों के प्रामाणिक व्यंजन। बिरयानी, दोसा, राजस्थानी थाली और अन्य पारंपरिक भारतीय खाना।" />
        <meta name="keywords" content="दिल्ली हाट, भारतीय व्यंजन, क्षेत्रीय खाना, बिरयानी, दोसा, थाली, भारतीय रसोई, पारंपरिक भोजन" />
        <link rel="canonical" href="https://bharatshaala.com/markets/dilli-haat/regional-cuisine" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${cuisineInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🍛</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{cuisineInfo.name}</h1>
                  <p className="text-xl opacity-90">{cuisineInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-orange-200">{cuisineInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-orange-200">{cuisineInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-orange-200">{cuisineInfo.location}</p>
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
              <Link to="/markets/dilli-haat" className="hover:text-emerald-600">दिल्ली हाट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">क्षेत्रीय व्यंजन</span>
            </nav>
          </div>
        </div>

        {/* Featured Dishes */}
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के स्पेशल व्यंजन</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredDishes.map((dish, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h3>
                  <p className="text-gray-600 mb-3">{dish.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-red-600">{dish.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>शेफ:</strong> {dish.chef}</p>
                    <p><strong>क्षेत्र:</strong> {dish.region}</p>
                    <p><strong>पकने का समय:</strong> {dish.cookingTime}</p>
                    <p><strong>मसाला लेवल:</strong> {dish.spiceLevel}</p>
                    <p><strong>विशेषता:</strong> {dish.specialty}</p>
                    <p><strong>मुख्य सामग्री:</strong> {dish.ingredients}</p>
                  </div>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    ऑर्डर करें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">व्यंजन श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {cuisineCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-red-600 text-white'
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

        {/* State Pavilions */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">राज्यवार व्यंजन पवेलियन</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statePavilions.map((pavilion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pavilion.state}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">मुख्य व्यंजन:</p>
                      {pavilion.dishes.map((dish, dishIndex) => (
                        <div key={dishIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {dish}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">विशेषताएं:</p>
                      {pavilion.specialties.map((specialty, specialtyIndex) => (
                        <div key={specialtyIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {specialty}
                        </div>
                      ))}
                    </div>
                    <p className="text-red-600 font-medium text-sm">शेफ: {pavilion.chef}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="व्यंजन लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी व्यंजन' : cuisineCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onAddToCart={() => handleAddToCart(item)}
                    onAddToWishlist={() => handleAddToWishlist(item)}
                    showSpiceLevelBadge={true}
                    showChefBadge={true}
                    showRegionalBadge={true}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍛</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई व्यंजन नहीं मिला</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Regional Chefs */}
        <section className="py-16 bg-gradient-to-r from-red-100 to-orange-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध क्षेत्रीय शेफ</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {regionalChefs.map((chef, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{chef.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {chef.specialty}</p>
                    <p><strong>क्षेत्र:</strong> {chef.region}</p>
                    <p><strong>अनुभव:</strong> {chef.experience}</p>
                    <p><strong>सिग्नेचर:</strong> {chef.signature}</p>
                    <p><strong>पुरस्कार:</strong> {chef.awards}</p>
                    <p><strong>रेस्टोरेंट:</strong> {chef.restaurant}</p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    व्यंजन देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cooking Workshops */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">पाक कला वर्कशॉप्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {cookingWorkshops.map((workshop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{workshop.workshop}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>इंस्ट्रक्टर:</strong> {workshop.instructor}</p>
                    <p><strong>अवधि:</strong> {workshop.duration}</p>
                    <p><strong>फीस:</strong> {workshop.fee}</p>
                    <p><strong>शेड्यूल:</strong> {workshop.schedule}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">शामिल है:</p>
                    {workshop.includes.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                        • {item}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
                    रजिस्टर करें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Food Festivals */}
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आगामी फूड फेस्टिवल्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {foodFestivals.map((festival, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{festival.festival}</h3>
                  <p className="text-red-600 font-medium mb-3">{festival.duration}</p>
                  <div className="space-y-1">
                    {festival.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="bg-red-50 rounded-lg p-2 text-sm text-gray-700">
                        • {highlight}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Culinary Heritage */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">भारतीय पाक विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                30 साल से दिल्ली हाट क्षेत्रीय व्यंजन केंद्र भारत की समृद्ध पाक परंपरा को एक छत के नीचे लाने का काम कर रहा है। 
                यहाँ हर व्यंजन में छुपा है अपने राज्य का प्रेम, मसालों की खुशबू और पारंपरिक तकनीक का जादू। 
                भारत की सांस्कृतिक विविधता का स्वादिष्ट प्रतिनिधित्व है यह केंद्र।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>दिल्ली हाट, INA, नई दिल्ली</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🍛</div>
                  <h3 className="text-xl font-semibold mb-2">राज्य</h3>
                  <p>28 राज्यों के व्यंजन</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <h3 className="text-xl font-semibold mb-2">शेफ</h3>
                  <p>100+ विशेषज्ञ रसोइए</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegionalCuisine;
