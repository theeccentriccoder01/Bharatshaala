// Blog Component - Bharatshala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAnalytics } from '../utils/analytics';
import apiService from '../utils/api';

const Blog = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const blogCategories = [
    { id: 'all', name: 'सभी पोस्ट्स', icon: '📝' },
    { id: 'markets', name: 'बाजार गाइड', icon: '🏪' },
    { id: 'crafts', name: 'हस्तशिल्प', icon: '🎨' },
    { id: 'culture', name: 'संस्कृति', icon: '🎭' },
    { id: 'shopping', name: 'शॉपिंग टिप्स', icon: '🛍️' },
    { id: 'festivals', name: 'त्योहार', icon: '🎉' },
    { id: 'recipes', name: 'व्यंजन', icon: '🍛' }
  ];

  const featuredPosts = [
    {
      id: 1,
      title: 'चांदनी चौक में शॉपिंग का सही तरीका',
      excerpt: 'दिल्ली के सबसे पुराने बाजार चांदनी चौक में खरीदारी करने के बेहतरीन टिप्स और ट्रिक्स...',
      category: 'shopping',
      author: 'प्रिया शर्मा',
      date: '2025-08-05',
      readTime: '5 मिनट',
      image: '/images/blog/chandni-chowk-shopping.jpg',
      tags: ['चांदनी चौक', 'दिल्ली', 'शॉपिंग', 'बाजार']
    },
    {
      id: 2,
      title: 'राजस्थानी मीनाकारी कला की विरासत',
      excerpt: 'जयपुर की विश्व प्रसिद्ध मीनाकारी कला का इतिहास और आधुनिक समय में इसकी प्रासंगिकता...',
      category: 'crafts',
      author: 'राज कुमार',
      date: '2025-08-04',
      readTime: '8 मिनट',
      image: '/images/blog/meenakari-art.jpg',
      tags: ['मीनाकारी', 'राजस्थान', 'हस्तशिल्प', 'जयपुर']
    },
    {
      id: 3,
      title: 'दीवाली के लिए पारंपरिक सजावट',
      excerpt: 'इस दीवाली अपने घर को सजाने के लिए भारतीय हस्तशिल्प और पारंपरिक सामग्री का उपयोग कैसे करें...',
      category: 'festivals',
      author: 'अनीता गुप्ता',
      date: '2025-08-03',
      readTime: '6 मिनट',
      image: '/images/blog/diwali-decoration.jpg',
      tags: ['दीवाली', 'सजावट', 'त्योहार', 'हस्तशिल्प']
    }
  ];

  const popularTags = [
    'हस्तशिल्प', 'शॉपिंग', 'बाजार', 'राजस्थान', 'दिल्ली', 'मुंबई', 'बंगलौर', 'त्योहार',
    'व्यंजन', 'संस्कृति', 'ज्वेलरी', 'वस्त्र', 'कला', 'परंपरा', 'गाइड'
  ];

  useEffect(() => {
    trackPageView('blog');
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      const [postsResponse, categoriesResponse] = await Promise.all([
        apiService.get('/blog/posts'),
        apiService.get('/blog/categories')
      ]);

      if (postsResponse.success) {
        setPosts(postsResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('blog_category_selected', { category });
  };

  const handlePostClick = (post) => {
    trackEvent('blog_post_clicked', {
      postId: post.id,
      title: post.title,
      category: post.category
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>ब्लॉग - भारतशाला | भारतीय संस्कृति और हस्तशिल्प की जानकारी</title>
        <meta name="description" content="भारतशाला ब्लॉग में पढ़ें भारतीय बाजारों, हस्तशिल्प, संस्कृति, शॉपिंग गाइड और त्योहारों के बारे में रोचक जानकारी।" />
        <meta name="keywords" content="भारतशाला ब्लॉग, हस्तशिल्प, भारतीय संस्कृति, शॉपिंग गाइड, बाजार, त्योहार, व्यंजन" />
        <link rel="canonical" href="https://bharatshala.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-4">भारतशाला ब्लॉग</h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                भारतीय संस्कृति, हस्तशिल्प, बाजारों और परंपराओं की दुनिया में आपका स्वागत है
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Categories */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="ब्लॉग पोस्ट्स खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {blogCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                      activeCategory === category.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-12 bg-emerald-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फीचर्ड पोस्ट्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                        {blogCategories.find(cat => cat.id === post.category)?.name}
                      </span>
                      <span className="text-gray-500 text-sm">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{post.author}</p>
                        <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('hi-IN')}</p>
                      </div>
                      <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                        पढ़ें →
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="ब्लॉग पोस्ट्स लोड हो रहे हैं..." />
          </div>
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 lg:col-span-3">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {activeCategory === 'all' ? 'सभी पोस्ट्स' : blogCategories.find(cat => cat.id === activeCategory)?.name}
                  </h2>
                  
                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई पोस्ट नहीं मिली</h3>
                      <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें या खोज बदलें</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredPosts.map((post) => (
                        <motion.article
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                          onClick={() => handlePostClick(post)}
                        >
                          <div className="h-40 bg-gray-200 overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                                {blogCategories.find(cat => cat.id === post.category)?.name}
                              </span>
                              <span className="text-gray-500 text-sm">{post.readTime}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-700">{post.author}</p>
                                <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('hi-IN')}</p>
                              </div>
                              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                                पढ़ें →
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  {/* Popular Tags */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">लोकप्रिय टैग्स</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors duration-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">न्यूज़लेटर सब्सक्राइब करें</h3>
                    <p className="text-sm opacity-90 mb-4">
                      नवीनतम ब्लॉग पोस्ट्स और भारतीय संस्कृति की जानकारी सीधे अपने इनबॉक्स में पाएं
                    </p>
                    <div className="space-y-3">
                      <input
                        type="email"
                        placeholder="आपका ईमेल पता"
                        className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <button className="w-full bg-white text-emerald-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                        सब्सक्राइब करें
                      </button>
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">हाल की पोस्ट्स</h3>
                    <div className="space-y-4">
                      {featuredPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex space-x-3 cursor-pointer hover:opacity-80" onClick={() => handlePostClick(post)}>
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</h4>
                            <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('hi-IN')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">अपनी कहानी साझा करें</h2>
            <p className="text-xl opacity-90 mb-8">
              क्या आपके पास भारतीय संस्कृति या हस्तशिल्प से जुड़ी कोई दिलचस्प कहानी है?
            </p>
            <Link
              to="/contact"
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              हमसे संपर्क करें
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;