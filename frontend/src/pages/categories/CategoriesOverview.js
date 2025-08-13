import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';

const CategoriesOverview = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static categories data (you can also fetch from API)
  const staticCategories = [
    {
      id: 'clothing',
      name: 'वस्त्र',
      nameEn: 'Clothing',
      slug: 'clothing',
      icon: '👗',
      description: 'पारंपरिक और आधुनिक वस्त्रों का संग्रह',
      gradient: 'from-pink-500 via-rose-400 to-pink-600',
      productCount: '2500+'
    },
    {
      id: 'jewellery',
      name: 'आभूषण',
      nameEn: 'Jewellery',
      slug: 'jewellery',
      icon: '💎',
      description: 'हस्तनिर्मित और पारंपरिक आभूषण',
      gradient: 'from-yellow-400 via-amber-400 to-orange-500',
      productCount: '1800+'
    },
    {
      id: 'handicrafts',
      name: 'हस्तशिल्प',
      nameEn: 'Handicrafts',
      slug: 'handicrafts',
      icon: '🎨',
      description: 'कलाकारों द्वारा तैयार हस्तशिल्प',
      gradient: 'from-purple-500 via-violet-400 to-indigo-500',
      productCount: '3200+'
    },
    {
      id: 'books',
      name: 'पुस्तकें',
      nameEn: 'Books',
      slug: 'books',
      icon: '📚',
      description: 'ज्ञान और मनोरंजन की पुस्तकें',
      gradient: 'from-blue-500 via-cyan-400 to-teal-500',
      productCount: '5000+'
    },
    {
      id: 'accessories',
      name: 'एक्सेसरीज़',
      nameEn: 'Accessories',
      slug: 'accessories',
      icon: '👜',
      description: 'फैशन और उपयोगी एक्सेसरीज़',
      gradient: 'from-emerald-500 via-green-400 to-teal-500',
      productCount: '1200+'
    },
    {
      id: 'houseware',
      name: 'घरेलू सामान',
      nameEn: 'Houseware',
      slug: 'houseware',
      icon: '🏠',
      description: 'घर की सजावट और उपयोगी वस्तुएं',
      gradient: 'from-amber-500 via-orange-400 to-red-500',
      productCount: '2800+'
    }
  ];

  useEffect(() => {
    // Simulate loading or fetch from API
    setTimeout(() => {
      setCategories(staticCategories);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen text="श्रेणियां लोड हो रही हैं..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-18">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-orange-500 text-white py-20 pt-32">
        <div className="container mx-auto px-6 text-center mt-18">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-18">उत्पाद श्रेणियां</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 text-white">
              भारत की समृद्ध विरासत से प्रेरित विभिन्न उत्पाद श्रेणियों की खोज करें
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/categories/${category.slug}`}
                  className={`group relative bg-gradient-to-br ${category.gradient} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden block`}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-125 transition-transform duration-700"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-white/90 text-sm mb-3 group-hover:text-yellow-100 transition-colors duration-300">
                      {category.description}
                    </p>
                    <div className="text-white/80 font-semibold text-lg mb-4">
                      {category.productCount} आइटम्स
                    </div>
                    <div className="flex items-center text-white/70 group-hover:text-white transition-colors duration-300">
                      <span className="mr-2">एक्सप्लोर करें</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesOverview;