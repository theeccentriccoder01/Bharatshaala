// Spices Category Page for Bharatshaala Platform
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

const Spices = () => {
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
    priceRange: [0, 5000],
    origins: [],
    types: [],
    forms: [],
    certifications: [],
    inStock: false
  });

  const [sortBy, setSortBy] = useState('featured');

  const categoryInfo = {
    title: 'मसाले',
    titleEn: 'Spices',
    description: 'भारत के सभी कोनों से प्रामाणिक और शुद्ध मसालों का संग्रह',
    icon: '🌶️',
    heroImage: '/images/categories/spices-hero.jpg'
  };

  const subcategories = [
    { id: 'whole-spices', name: 'साबुत मसाले', nameEn: 'Whole Spices', image: '/images/subcategories/whole-spices.jpg' },
    { id: 'ground-spices', name: 'पिसे हुए मसाले', nameEn: 'Ground Spices', image: '/images/subcategories/ground-spices.jpg' },
    { id: 'spice-blends', name: 'मसाला मिश्रण', nameEn: 'Spice Blends', image: '/images/subcategories/spice-blends.jpg' },
    { id: 'regional-spices', name: 'क्षेत्रीय मसाले', nameEn: 'Regional Spices', image: '/images/subcategories/regional-spices.jpg' },
    { id: 'medicinal-spices', name: 'औषधीय मसाले', nameEn: 'Medicinal Spices', image: '/images/subcategories/medicinal-spices.jpg' },
    { id: 'exotic-spices', name: 'दुर्लभ मसाले', nameEn: 'Exotic Spices', image: '/images/subcategories/exotic-spices.jpg' }
  ];

  const filterOptions = {
    origins: [
      { id: 'kerala', name: 'केरल', nameEn: 'Kerala' },
      { id: 'karnataka', name: 'कर्नाटक', nameEn: 'Karnataka' },
      { id: 'rajasthan', name: 'राजस्थान', nameEn: 'Rajasthan' },
      { id: 'gujarat', name: 'गुजरात', nameEn: 'Gujarat' },
      { id: 'kashmir', name: 'कश्मीर', nameEn: 'Kashmir' },
      { id: 'assam', name: 'असम', nameEn: 'Assam' },
      { id: 'meghalaya', name: 'मेघालय', nameEn: 'Meghalaya' }
    ],
    types: [
      { id: 'hot-spices', name: 'तीखे मसाले', nameEn: 'Hot Spices' },
      { id: 'aromatic', name: 'सुगंधित मसाले', nameEn: 'Aromatic Spices' },
      { id: 'sweet-spices', name: 'मीठे मसाले', nameEn: 'Sweet Spices' },
      { id: 'cooling', name: 'ठंडक देने वाले', nameEn: 'Cooling Spices' },
      { id: 'digestive', name: 'पाचक मसाले', nameEn: 'Digestive Spices' }
    ],
    forms: [
      { id: 'whole', name: 'साबुत', nameEn: 'Whole' },
      { id: 'ground', name: 'पाउडर', nameEn: 'Ground' },
      { id: 'crushed', name: 'कुटा हुआ', nameEn: 'Crushed' },
      { id: 'paste', name: 'पेस्ट', nameEn: 'Paste' },
      { id: 'oil', name: 'तेल', nameEn: 'Oil' }
    ],
    certifications: [
      { id: 'organic', name: 'जैविक', nameEn: 'Organic' },
      { id: 'ayush', name: 'आयुष प्रमाणित', nameEn: 'AYUSH Certified' },
      { id: 'spices-board', name: 'स्पाइसेस बोर्ड', nameEn: 'Spices Board' },
      { id: 'iso', name: 'ISO प्रमाणित', nameEn: 'ISO Certified' },
      { id: 'haccp', name: 'HACCP', nameEn: 'HACCP' }
    ]
  };

  const sortOptions = [
    { value: 'featured', label: 'फीचर्ड' },
    { value: 'price_low_high', label: 'कीमत: कम से ज्यादा' },
    { value: 'price_high_low', label: 'कीमत: ज्यादा से कम' },
    { value: 'freshness', label: 'ताजगी' },
    { value: 'rating', label: 'रेटिंग' },
    { value: 'popularity', label: 'लोकप्रियता' }
  ];

  useEffect(() => {
    trackPageView('spices_category');
    loadProducts();
  }, [currentPage, filters, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/products', {
        params: {
          category: 'spices',
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
      category: 'spices',
      filters: newFilters
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    
    trackEvent('category_sort_changed', {
      category: 'spices',
      sortBy: newSort
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_category', {
        productId: product.id,
        productName: product.name,
        category: 'spices',
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
        category: 'spices'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title} - भारतशाला | प्रामाणिक भारतीय मसाले</title>
        <meta name="description" content="भारत के विभिन्न राज्यों से प्रामाणिक और शुद्ध मसाले। केरल के इलायची से लेकर कश्मीर के केसर तक, सभी मसालों का बेहतरीन संग्रह।" />
        <meta name="keywords" content="मसाले, भारतीय मसाले, इलायची, केसर, हल्दी, लाल मिर्च, गरम मसाला, जैविक मसाले" />
        <link rel="canonical" href="https://bharatshaala.com/categories/spices" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-red-600 to-yellow-500 text-white py-16">
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
              
              <div className="flex items-center space-x-6 text-yellow-200">
                <div className="flex items-center space-x-2">
                  <span>🌿</span>
                  <span>100% प्राकृतिक</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏆</span>
                  <span>प्रमाणित गुणवत्ता</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚚</span>
                  <span>ताजगी की गारंटी</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मसालों की किस्में</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {subcategories.map((subcategory) => (
                <motion.div
                  key={subcategory.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => {
                    trackEvent('subcategory_clicked', {
                      category: 'spices',
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
                  showOrigins: true,
                  showTypes: true,
                  showForms: true,
                  showCertifications: true
                }}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Sort and Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">{totalProducts}</span> मसाले मिले
                </p>
                <SortDropdown
                  value={sortBy}
                  options={sortOptions}
                  onChange={handleSortChange}
                />
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" text="मसाले लोड हो रहे हैं..." />
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
                          showOriginBadge={true}
                          showFreshnessBadge={true}
                          showCertificationBadge={true}
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

        {/* Spice Knowledge Section */}
        <section className="py-16 bg-yellow-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मसालों की जानकारी</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold mb-2">स्वास्थ्य लाभ</h3>
                <p className="text-gray-600">प्रत्येक मसाले के औषधीय गुण और स्वास्थ्य लाभ की जानकारी</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">👩‍🍳</div>
                <h3 className="text-xl font-semibold mb-2">उपयोग की विधि</h3>
                <p className="text-gray-600">मसालों का सही उपयोग और पकाने की तकनीक</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">संग्रहण</h3>
                <p className="text-gray-600">मसालों की ताजगी बनाए रखने के तरीके</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-xl font-semibold mb-2">मूल स्थान</h3>
                <p className="text-gray-600">मसालों का इतिहास और भौगोलिक मूल</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quality Assurance */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">गुणवत्ता की गारंटी</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold mb-2">प्रयोगशाला परीक्षण</h3>
                <p className="opacity-90">प्रत्येक बैच की शुद्धता और गुणवत्ता की जांच</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">प्रमाणीकरण</h3>
                <p className="opacity-90">जैविक और अन्य गुणवत्ता प्रमाणपत्र</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-xl font-semibold mb-2">ट्रेसेबिलिटी</h3>
                <p className="opacity-90">खेत से घर तक पूरी यात्रा की जानकारी</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Spices;
