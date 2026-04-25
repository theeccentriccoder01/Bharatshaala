// Electronics Category Page for Bharatshaala Platform
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

const Electronics = () => {
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
    brands: [],
    categories: [],
    features: [],
    warranty: [],
    inStock: false
  });

  const [sortBy, setSortBy] = useState('featured');

  const categoryInfo = {
    title: 'इलेक्ट्रॉनिक्स',
    titleEn: 'Electronics',
    description: 'आधुनिक तकनीक और परंपरा का मेल - भारतीय ब्रांड्स के इलेक्ट्रॉनिक उत्पाद',
    icon: '📱',
    heroImage: '/images/categories/electronics-hero.jpg'
  };

  const subcategories = [
    { id: 'smartphones', name: 'स्मार्टफोन', nameEn: 'Smartphones', image: '/images/subcategories/smartphones.jpg' },
    { id: 'laptops', name: 'लैपटॉप', nameEn: 'Laptops', image: '/images/subcategories/laptops.jpg' },
    { id: 'headphones', name: 'हेडफोन्स', nameEn: 'Headphones', image: '/images/subcategories/headphones.jpg' },
    { id: 'smart-watch', name: 'स्मार्ट वॉच', nameEn: 'Smart Watches', image: '/images/subcategories/smart-watch.jpg' },
    { id: 'speakers', name: 'स्पीकर्स', nameEn: 'Speakers', image: '/images/subcategories/speakers.jpg' },
    { id: 'accessories', name: 'एक्सेसरीज', nameEn: 'Accessories', image: '/images/subcategories/accessories.jpg' }
  ];

  const filterOptions = {
    brands: [
      { id: 'micromax', name: 'माइक्रोमैक्स', nameEn: 'Micromax' },
      { id: 'lava', name: 'लावा', nameEn: 'Lava' },
      { id: 'boat', name: 'बोट', nameEn: 'boAt' },
      { id: 'noise', name: 'नॉइज़', nameEn: 'Noise' },
      { id: 'realme', name: 'रियलमी', nameEn: 'Realme' },
      { id: 'oneplus', name: 'वनप्लस', nameEn: 'OnePlus' }
    ],
    categories: [
      { id: 'mobile', name: 'मोबाइल', nameEn: 'Mobile' },
      { id: 'audio', name: 'ऑडियो', nameEn: 'Audio' },
      { id: 'wearable', name: 'वियरेबल', nameEn: 'Wearable' },
      { id: 'computing', name: 'कंप्यूटिंग', nameEn: 'Computing' },
      { id: 'gaming', name: 'गेमिंग', nameEn: 'Gaming' }
    ],
    features: [
      { id: 'wireless', name: 'वायरलेस', nameEn: 'Wireless' },
      { id: 'bluetooth', name: 'ब्लूटूथ', nameEn: 'Bluetooth' },
      { id: 'fast-charging', name: 'फास्ट चार्जिंग', nameEn: 'Fast Charging' },
      { id: 'waterproof', name: 'वाटरप्रूफ', nameEn: 'Waterproof' },
      { id: 'noise-cancelling', name: 'नॉइज़ कैंसलिंग', nameEn: 'Noise Cancelling' }
    ],
    warranty: [
      { id: '6months', name: '6 महीने', nameEn: '6 Months' },
      { id: '1year', name: '1 साल', nameEn: '1 Year' },
      { id: '2years', name: '2 साल', nameEn: '2 Years' },
      { id: '3years', name: '3 साल', nameEn: '3+ Years' }
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
    trackPageView('electronics_category');
    loadProducts();
  }, [currentPage, filters, sortBy]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/products', {
        params: {
          category: 'electronics',
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
      category: 'electronics',
      filters: newFilters
    });
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
    
    trackEvent('category_sort_changed', {
      category: 'electronics',
      sortBy: newSort
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_category', {
        productId: product.id,
        productName: product.name,
        category: 'electronics',
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
        category: 'electronics'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{categoryInfo.title} - भारतशाला | भारतीय इलेक्ट्रॉनिक्स ब्रांड्स</title>
        <meta name="description" content="भारतीय इलेक्ट्रॉनिक्स ब्रांड्स के स्मार्टफोन, लैपटॉप, हेडफोन्स और अन्य तकनीकी उत्पाद। Micromax, Lava, boAt, Noise और अन्य देसी ब्रांड्स।" />
        <meta name="keywords" content="इलेक्ट्रॉनिक्स, स्मार्टफोन, माइक्रोमैक्स, लावा, बोट, भारतीय ब्रांड, तकनीकी उत्पाद" />
        <link rel="canonical" href="https://bharatshaala.com/categories/electronics" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
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
              
              <div className="flex items-center space-x-6 text-blue-200">
                <div className="flex items-center space-x-2">
                  <span>📦</span>
                  <span>{totalProducts} उत्पाद</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🇮🇳</span>
                  <span>देसी ब्रांड्स</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>तकनीकी सहायता</span>
                </div>
              </div>
            </motion.div>
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
                  showBrands: true,
                  showFeatures: true,
                  showWarranty: true
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
                          showTechSpecs={true}
                          showWarrantyBadge={true}
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

        {/* Made in India Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-green-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">🇮🇳 मेड इन इंडिया</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-xl font-semibold mb-2">स्वदेशी निर्माण</h3>
                <p className="opacity-90">भारत में बने उत्पादों को बढ़ावा देकर आत्मनिर्भर भारत में योगदान</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-2">रोजगार सृजन</h3>
                <p className="opacity-90">भारतीय कंपनियों का समर्थन करके देश में रोजगार के अवसर बढ़ाना</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-semibold mb-2">नवाचार</h3>
                <p className="opacity-90">भारतीय इंजीनियरिंग और तकनीकी नवाचार को प्रोत्साहन</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Electronics;
