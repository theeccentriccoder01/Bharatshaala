// Silver Jewelry Category Page for Bharatshala Platform
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

const SilverJewelry = () => {
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
    priceRange: [0, 50000],
    purity: [],
    styles: [],
    occasions: [],
    gemstones: [],
    gender: [],
    inStock: false
  });

  const [sortBy, setSortBy] = useState('featured');

  const categoryInfo = {
    title: 'चांदी के आभूषण',
    titleEn: 'Silver Jewelry',
    description: 'पारंपरिक और आधुनिक डिजाइन के चांदी के आभूषणों का खूबसूरत संग्रह',
    icon: '💍',
    heroImage: '/images/categories/silver-jewelry-hero.jpg'
  };

  const subcategories = [
    { id: 'rings', name: 'अंगूठियां', nameEn: 'Rings', image: '/images/subcategories/silver-rings.jpg' },
    { id: 'necklaces', name: 'हार', nameEn: 'Necklaces', image: '/images/subcategories/silver-necklaces.jpg' },
    { id: 'earrings', name: 'कान की बाली', nameEn: 'Earrings', image: '/images/subcategories/silver-earrings.jpg' },
    { id: 'bracelets', name: 'कंगन', nameEn: 'Bracelets', image: '/images/subcategories/silver-bracelets.jpg' },
    { id: 'anklets', name: 'पायल', nameEn: 'Anklets', image: '/images/subcategories/silver-anklets.jpg' },
    { id: 'sets', name: 'सेट', nameEn: 'Jewelry Sets', image: '/images/subcategories/silver-sets.jpg' }
  ];

  const filterOptions = {
    purity: [
      { id: '925', name: '925 स्टर्लिंग', nameEn: '925 Sterling' },
      { id: '999', name: '999 शुद्ध चांदी', nameEn: '999 Pure Silver' },
      { id: 'oxidized', name: 'ऑक्सीडाइज्ड', nameEn: 'Oxidized' },
      { id: 'antique', name: 'एंटीक फिनिश', nameEn: 'Antique Finish' }
    ],
    styles: [
      { id: 'traditional', name: 'पारंपरिक', nameEn: 'Traditional' },
      { id: 'contemporary', name: 'आधुनिक', nameEn: 'Contemporary' },
      { id: 'ethnic', name: 'जातीय', nameEn: 'Ethnic' },
      { id: 'minimalist', name: 'न्यूनतम', nameEn: 'Minimalist' },
      { id: 'statement', name: 'स्टेटमेंट', nameEn: 'Statement' },
      { id: 'vintage', name: 'विंटेज', nameEn: 'Vintage' }
    ],
    occasions: [
      { id: 'daily-wear', name: 'दैनिक उपयोग', nameEn: 'Daily Wear' },
      { id: 'wedding', name: 'शादी-विवाह', nameEn: 'Wedding' },
      { id: 'festival', name: 'त्योहार', nameEn: 'Festival' },
      { id: 'party', name: 'पार्टी', nameEn: 'Party' },
      { id: 'office', name: 'ऑफिस', nameEn: 'Office' },
      { id: 'casual', name: 'कैजुअल', nameEn: 'Casual' }
    ],
    gemstones: [
      { id: 'none', name: 'बिना रत्न', nameEn: 'No Gemstone' },
      { id: 'turquoise', name: 'फिरोजा', nameEn: 'Turquoise' },
      { id: 'moonstone', name: 'चंद्रकांत', nameEn: 'Moonstone' },
      { id: 'onyx', name: 'गोमेद', nameEn: 'Onyx' },
      { id: 'pearl', name: 'मोती', nameEn: 'Pearl' },
      { id: 'coral', name: 'मूंगा', nameEn: 'Coral' }
    ],
    gender: [
      { id: 'women', name: 'महिला', nameEn: 'Women' },
      { id: 'men', name: 'पुरुष', nameEn: 'Men' },
      { id: 'unisex', name: 'यूनिसेक्स', nameEn: 'Unisex' },
      { id: 'kids', name: 'बच्चे', nameEn: 'Kids' }
    ]
  };

  const sortOptions = [
    { value: 'featured', label: 'फीचर्ड' },
    { value: 'price_low_high', label: 'कीमत: कम से ज्यादा' },
    { value: 'price_high_low', label: 'कीमत: ज्यादा से कम' },
    { value: 'newest', label: 'नवीनतम' },
    { value: 'rating', label: 'रेटिंग' },
    { value: 'popularity', label: 'लोकप्रियता' }
  ];

  useEffect(() => {
    trackPageView('silver_jewelry_category');
    loadProducts();
  }, [currentPage, filters, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/products', {
        params: {
          category: 'silver-jewelry',
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
      category: 'silver-jewelry',
      filters: newFilters
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    
    trackEvent('category_sort_changed', {
      category: 'silver-jewelry',
      sortBy: newSort
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_category', {
        productId: product.id,
        productName: product.name,
        category: 'silver-jewelry',
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
        category: 'silver-jewelry'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title} - भारतशाला | हस्तनिर्मित चांदी के आभूषण</title>
        <meta name="description" content="पारंपरिक और आधुनिक डिजाइन के हस्तनिर्मित चांदी के आभूषण। 925 स्टर्लिंग सिल्वर के अंगूठियां, हार, कंगन और अन्य आभूषण।" />
        <meta name="keywords" content="चांदी के आभूषण, सिल्वर जूलरी, 925 स्टर्लिंग, हस्तनिर्मित आभूषण, पारंपरिक जूलरी" />
        <link rel="canonical" href="https://bharatshala.com/categories/silver-jewelry" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
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
              
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <span>✨</span>
                  <span>925 स्टर्लिंग गुणवत्ता</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🎨</span>
                  <span>हस्तनिर्मित डिजाइन</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>जीवनभर की गारंटी</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आभूषणों के प्रकार</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => {
                    trackEvent('subcategory_clicked', {
                      category: 'silver-jewelry',
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
                  showPurity: true,
                  showStyles: true,
                  showOccasions: true,
                  showGemstones: true,
                  showGender: true
                }}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Sort and Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">{totalProducts}</span> आभूषण मिले
                </p>
                <SortDropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={handleSortChange}
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" text="आभूषण लोड हो रहे हैं..." />
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
                          showPurityBadge={true}
                          showHandmadeBadge={true}
                          showStyleBadge={true}
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

        {/* Care Instructions Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">चांदी की देखभाल</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🧽</div>
                <h3 className="text-xl font-semibold mb-2">नियमित सफाई</h3>
                <p className="text-gray-600">मुलायम कपड़े से नियमित रूप से साफ करें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💧</div>
                <h3 className="text-xl font-semibold mb-2">पानी से बचाव</h3>
                <p className="text-gray-600">नहाने या तैराकी के समय उतार दें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">सही भंडारण</h3>
                <p className="text-gray-600">अलग-अलग डिब्बों में सुरक्षित रखें</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">चमक बनाए रखें</h3>
                <p className="text-gray-600">विशेष सिल्वर क्लीनर का उपयोग करें</p>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship Section */}
        <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">कारीगरी की कला</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">👨‍🎨</div>
                <h3 className="text-xl font-semibold mb-2">मास्टर कारीगर</h3>
                <p className="opacity-90">पीढ़ियों से चली आ रही पारंपरिक तकनीक</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔨</div>
                <h3 className="text-xl font-semibold mb-2">हस्तनिर्मित</h3>
                <p className="opacity-90">प्रत्येक आभूषण हाथ से बनाया गया</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💎</div>
                <h3 className="text-xl font-semibold mb-2">बेजोड़ डिजाइन</h3>
                <p className="opacity-90">अनूठे और आकर्षक पैटर्न</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SilverJewelry;