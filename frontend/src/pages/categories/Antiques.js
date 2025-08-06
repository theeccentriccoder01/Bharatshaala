// Antiques Category Page for Bharatshala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SortDropdown from '../components/SortDropdown';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAnalytics } from '../analytics';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import apiService from '../apiService';

const Antiques = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    materials: [],
    periods: [],
    origins: [],
    conditions: [],
    inStock: false
  });

  const [sortBy, setSortBy] = useState('featured');

  const categoryInfo = {
    title: 'प्राचीन वस्तुएं',
    titleEn: 'Antiques',
    description: 'भारत की समृद्ध विरासत से जुड़ी दुर्लभ और प्राचीन वस्तुओं का संग्रह',
    icon: '🏺',
    heroImage: '/images/categories/antiques-hero.jpg'
  };

  const subcategories = [
    { id: 'bronze-statues', name: 'कांस्य मूर्तियां', nameEn: 'Bronze Statues', image: '/images/subcategories/bronze-statues.jpg' },
    { id: 'vintage-jewelry', name: 'विंटेज आभूषण', nameEn: 'Vintage Jewelry', image: '/images/subcategories/vintage-jewelry.jpg' },
    { id: 'antique-coins', name: 'प्राचीन सिक्के', nameEn: 'Antique Coins', image: '/images/subcategories/antique-coins.jpg' },
    { id: 'manuscripts', name: 'पांडुलिपियां', nameEn: 'Manuscripts', image: '/images/subcategories/manuscripts.jpg' },
    { id: 'weapons', name: 'प्राचीन हथियार', nameEn: 'Ancient Weapons', image: '/images/subcategories/weapons.jpg' },
    { id: 'pottery', name: 'मिट्टी के बर्तन', nameEn: 'Ancient Pottery', image: '/images/subcategories/pottery.jpg' }
  ];

  const filterOptions = {
    materials: [
      { id: 'bronze', name: 'कांस्य', nameEn: 'Bronze' },
      { id: 'brass', name: 'पीतल', nameEn: 'Brass' },
      { id: 'silver', name: 'चांदी', nameEn: 'Silver' },
      { id: 'gold', name: 'सोना', nameEn: 'Gold' },
      { id: 'wood', name: 'लकड़ी', nameEn: 'Wood' },
      { id: 'stone', name: 'पत्थर', nameEn: 'Stone' },
      { id: 'terracotta', name: 'टेराकोटा', nameEn: 'Terracotta' }
    ],
    periods: [
      { id: 'ancient', name: 'प्राचीन काल (3500 BCE - 550 CE)', nameEn: 'Ancient Period' },
      { id: 'medieval', name: 'मध्यकाल (550 - 1526 CE)', nameEn: 'Medieval Period' },
      { id: 'mughal', name: 'मुगल काल (1526 - 1857)', nameEn: 'Mughal Era' },
      { id: 'colonial', name: 'औपनिवेशिक काल (1857 - 1947)', nameEn: 'Colonial Period' },
      { id: 'modern', name: 'आधुनिक काल (1947+)', nameEn: 'Modern Era' }
    ],
    origins: [
      { id: 'rajasthan', name: 'राजस्थान', nameEn: 'Rajasthan' },
      { id: 'kerala', name: 'केरल', nameEn: 'Kerala' },
      { id: 'tamilnadu', name: 'तमिलनाडु', nameEn: 'Tamil Nadu' },
      { id: 'gujarat', name: 'गुजरात', nameEn: 'Gujarat' },
      { id: 'maharashtra', name: 'महाराष्ट्र', nameEn: 'Maharashtra' },
      { id: 'punjab', name: 'पंजाब', nameEn: 'Punjab' }
    ],
    conditions: [
      { id: 'excellent', name: 'उत्कृष्ट', nameEn: 'Excellent' },
      { id: 'very-good', name: 'बहुत अच्छा', nameEn: 'Very Good' },
      { id: 'good', name: 'अच्छा', nameEn: 'Good' },
      { id: 'fair', name: 'ठीक', nameEn: 'Fair' },
      { id: 'restored', name: 'पुनर्स्थापित', nameEn: 'Restored' }
    ]
  };

  const sortOptions = [
    { value: 'featured', label: 'फीचर्ड' },
    { value: 'price_low_high', label: 'कीमत: कम से ज्यादा' },
    { value: 'price_high_low', label: 'कीमत: ज्यादा से कम' },
    { value: 'age_old_new', label: 'पुराना से नया' },
    { value: 'age_new_old', label: 'नया से पुराना' },
    { value: 'rating', label: 'रेटिंग' },
    { value: 'popularity', label: 'लोकप्रियता' }
  ];

  useEffect(() => {
    trackPageView(`antiques_category`);
    loadProducts();
  }, [currentPage, filters, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/products', {
        params: {
          category: 'antiques',
          page: currentPage,
          limit: 20,
          sort: sortBy,
          ...filters
        }
      });

      if (response.success) {
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    trackEvent('category_filter_applied', {
      category: 'antiques',
      filters: newFilters
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    
    trackEvent('category_sort_changed', {
      category: 'antiques',
      sortBy: newSort
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_category', {
        productId: product.id,
        productName: product.name,
        category: 'antiques',
        price: product.price
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_category', {
        productId: product.id,
        productName: product.name,
        category: 'antiques'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title} - भारतशाला | प्राचीन और दुर्लभ वस्तुओं का संग्रह</title>
        <meta name="description" content="भारत की समृद्ध सांस्कृतिक विरासत से जुड़ी प्राचीन वस्तुएं। कांस्य मूर्तियां, विंटेज आभूषण, प्राचीन सिक्के और अन्य दुर्लभ संग्रहणीय वस्तुएं।" />
        <meta name="keywords" content="प्राचीन वस्तुएं, antiques, कांस्य मूर्ति, विंटेज आभूषण, प्राचीन सिक्के, भारतीय कलाकृति" />
        <link rel="canonical" href="https://bharatshala.com/categories/antiques" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-900 to-orange-800 text-white py-16">
          <div className="absolute inset-0 bg-black/30"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${categoryInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">{categoryInfo.icon}</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{categoryInfo.title}</h1>
                  <p className="text-xl opacity-90">{categoryInfo.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-amber-200">
                <div className="flex items-center space-x-2">
                  <span>📦</span>
                  <span>{totalProducts} उत्पाद</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>प्रामाणिक और सत्यापित</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <span>सुरक्षित पैकेजिंग</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">उप-श्रेणियां</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => {
                    // Add subcategory filter logic
                    trackEvent('subcategory_clicked', {
                      category: 'antiques',
                      subcategory: subcategory.id
                    });
                  }}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={subcategory.image}
                      alt={subcategory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 text-center text-sm">{subcategory.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                categorySpecific={{
                  showMaterials: true,
                  showPeriods: true,
                  showOrigins: true,
                  showConditions: true
                }}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Sort and Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">{totalProducts}</span> उत्पाद मिले
                </p>
                <SortDropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={handleSortChange}
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" text="उत्पाद लोड हो रहे हैं..." />
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={() => handleAddToCart(product)}
                          onAddToWishlist={() => handleAddToWishlist(product)}
                          showAuthenticityBadge={true}
                          showAgeBadge={true}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                      >
                        पिछला
                      </button>
                      
                      <span className="px-4 py-2 text-gray-600">
                        पेज {currentPage} of {totalPages}
                      </span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                      >
                        अगला
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Authenticity Guarantee Section */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">प्रामाणिकता की गारंटी</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">विशेषज्ञ सत्यापन</h3>
                <p className="text-gray-600">हमारे विशेषज्ञ प्रत्येक प्राचीन वस्तु की प्रामाणिकता और आयु का सत्यापन करते हैं</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📜</div>
                <h3 className="text-xl font-semibold mb-2">प्रमाणपत्र</h3>
                <p className="text-gray-600">प्रत्येक वस्तु के साथ प्रामाणिकता का प्रमाणपत्र और इतिहास की जानकारी</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold mb-2">वापसी गारंटी</h3>
                <p className="text-gray-600">यदि वस्तु प्रामाणिक नहीं है तो 30 दिन में पूरा पैसा वापस</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Antiques;