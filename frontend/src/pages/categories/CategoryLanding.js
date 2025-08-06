// Category Landing Page Component for Bharatshala Platform
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAnalytics } from '../analytics';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import apiService from '../apiService';
import { PRODUCT_CATEGORIES } from '../constants';

const CategoryLanding = () => {
  const { categorySlug } = useParams();
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [categoryData, setCategoryData] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView(`category_${categorySlug}`);
    loadCategoryData();
  }, [categorySlug]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      const [categoryResponse, productsResponse, subcategoriesResponse] = await Promise.all([
        apiService.get(`/categories/${categorySlug}`),
        apiService.get(`/categories/${categorySlug}/featured-products`),
        apiService.get(`/categories/${categorySlug}/subcategories`)
      ]);

      if (categoryResponse.success) {
        setCategoryData(categoryResponse.data);
      }

      if (productsResponse.success) {
        setFeaturedProducts(productsResponse.data);
      }

      if (subcategoriesResponse.success) {
        setSubcategories(subcategoriesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_category_landing', {
        productId: product.id,
        categorySlug,
        source: 'category_landing'
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_category_landing', {
        productId: product.id,
        categorySlug,
        source: 'category_landing'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="श्रेणी लोड हो रही है..." />;
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">श्रेणी नहीं मिली</h2>
          <p className="text-gray-600 mb-4">यह श्रेणी अभी उपलब्ध नहीं है</p>
          <Link to="/products" className="text-emerald-600 hover:text-emerald-700">
            सभी उत्पाद देखें
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{categoryData.name} - भारतशाला | {categoryData.metaTitle || categoryData.description}</title>
        <meta name="description" content={categoryData.metaDescription || categoryData.description} />
        <meta name="keywords" content={categoryData.keywords || `${categoryData.name}, भारतीय हस्तशिल्प, ऑनलाइन खरीदारी`} />
        <link rel="canonical" href={`https://bharatshala.com/categories/${categorySlug}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-emerald-600 to-orange-500 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          {categoryData.bannerImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${categoryData.bannerImage})` }}
            ></div>
          )}
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="text-6xl mb-6">{categoryData.icon}</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">{categoryData.name}</h1>
              <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
                {categoryData.description}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-emerald-200">
                <div className="flex items-center space-x-2">
                  <span>📦</span>
                  <span>{categoryData.productCount || 0} उत्पाद</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏪</span>
                  <span>{categoryData.vendorCount || 0} विक्रेता</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>⭐</span>
                  <span>4.8 औसत रेटिंग</span>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to={`/products?category=${categorySlug}`}
                  className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
                  onClick={() => trackEvent('category_hero_cta_clicked', { categorySlug })}
                >
                  सभी उत्पाद देखें
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">उप-श्रेणियां</h2>
                <p className="text-xl text-gray-600">विशिष्ट प्रकार के उत्पाद खोजें</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subcategories.map((subcategory, index) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link
                      to={`/products?category=${categorySlug}&subcategory=${subcategory.slug}`}
                      className="block bg-white rounded-xl shadow-lg border hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                      onClick={() => trackEvent('subcategory_clicked', {
                        categorySlug,
                        subcategorySlug: subcategory.slug
                      })}
                    >
                      <div className="aspect-square bg-gray-100 overflow-hidden">
                        {subcategory.image ? (
                          <img
                            src={subcategory.image}
                            alt={subcategory.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            {subcategory.icon || categoryData.icon}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-center">{subcategory.name}</h3>
                        <p className="text-sm text-gray-600 text-center mt-1">
                          {subcategory.productCount || 0} उत्पाद
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">चुनिंदा उत्पाद</h2>
                <p className="text-xl text-gray-600">इस श्रेणी के सबसे लोकप्रिय उत्पाद</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                      onAddToWishlist={() => handleAddToWishlist(product)}
                      showBadges={true}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to={`/products?category=${categorySlug}`}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors duration-200 inline-block"
                  onClick={() => trackEvent('view_all_products_clicked', { categorySlug })}
                >
                  सभी उत्पाद देखें
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Category Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">प्रामाणिक उत्पाद</h3>
                <p className="text-gray-600">सभी उत्पाद वास्तविक कारीगरों द्वारा बनाए गए हैं और गुणवत्ता की जांच के बाद ही बेचे जाते हैं</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">तेज़ डिलीवरी</h3>
                <p className="text-gray-600">सुरक्षित पैकेजिंग के साथ 3-7 दिनों में पूरे भारत में डिलीवरी</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-5xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">खरीदार सुरक्षा</h3>
                <p className="text-gray-600">7 दिन की रिटर्न पॉलिसी और 100% सुरक्षित भुगतान</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-orange-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">
                {categoryData.name} की खरीदारी शुरू करें
              </h2>
              <p className="text-xl opacity-90 mb-8">
                भारत की बेहतरीन {categoryData.name} का संग्रह देखें
              </p>
              <Link
                to={`/products?category=${categorySlug}`}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-block"
                onClick={() => trackEvent('category_cta_clicked', { categorySlug })}
              >
                अभी खरीदारी करें
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryLanding;