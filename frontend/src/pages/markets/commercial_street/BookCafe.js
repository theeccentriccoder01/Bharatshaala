// Book Cafe Component for Commercial Street - Bharatshala Platform
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

const BookCafe = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [books, setBooks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const cafeInfo = {
    name: 'कमर्शियल स्ट्रीट बुक कैफे',
    nameEn: 'Commercial Street Book Cafe',
    description: 'बेंगलुरु का प्रसिद्ध बुक कैफे - किताबों और कॉफी का अनूठा संगम',
    established: '2010s',
    speciality: 'बुक्स, कॉफी और लिटरेरी इवेंट्स',
    location: 'कमर्शियल स्ट्रीट, बेंगलुरु',
    heroImage: '/images/markets/commercial-street-book-cafe.jpg'
  };

  const bookCategories = [
    { id: 'all', name: 'सभी किताबें', icon: '📚' },
    { id: 'fiction', name: 'फिक्शन', icon: '📖' },
    { id: 'non-fiction', name: 'नॉन-फिक्शन', icon: '📋' },
    { id: 'poetry', name: 'कविता', icon: '🎭' },
    { id: 'regional', name: 'क्षेत्रीय साहित्य', icon: '🌍' },
    { id: 'tech', name: 'टेक्नोलॉजी', icon: '💻' },
    { id: 'art', name: 'कला और डिज़ाइन', icon: '🎨' }
  ];

  const featuredBooks = [
    {
      title: 'गीता रहस्य',
      author: 'लोकमान्य तिलक',
      genre: 'आध्यात्म',
      price: '₹350',
      language: 'हिंदी',
      pages: 456,
      rating: 4.8
    },
    {
      title: 'Shantaram',
      author: 'Gregory David Roberts',
      genre: 'Fiction',
      price: '₹599',
      language: 'English',
      pages: 936,
      rating: 4.7
    },
    {
      title: 'कर्नाटक का इतिहास',
      author: 'डॉ. सुरयनाथ कामथ',
      genre: 'History',
      price: '₹450',
      language: 'हिंदी/कन्नड़',
      pages: 368,
      rating: 4.6
    }
  ];

  const upcomingEvents = [
    {
      title: 'कविता सभा',
      date: '15 फरवरी 2024',
      time: 'शाम 6:00 - 8:00',
      speaker: 'डॉ. अशोक चक्रधर',
      topic: 'समकालीन हिंदी कविता',
      entry: 'फ्री'
    },
    {
      title: 'Book Reading Session',
      date: '20 फरवरी 2024',
      time: 'सुबह 11:00 - 12:30',
      speaker: 'Ruskin Bond',
      topic: 'Stories from the Hills',
      entry: '₹200'
    },
    {
      title: 'लेखक चर्चा',
      date: '25 फरवरी 2024',
      time: 'शाम 7:00 - 9:00',
      speaker: 'चेतन भगत',
      topic: 'युवाओं के लिए लेखन',
      entry: '₹150'
    }
  ];

  const cafeMenu = [
    { item: 'फिल्टर कॉफी', price: '₹80', description: 'साउथ इंडियन स्टाइल' },
    { item: 'मसाला चाय', price: '₹60', description: 'घर जैसा स्वाद' },
    { item: 'बुक लवर\'स कैप्पुचीनो', price: '₹120', description: 'स्पेशल ब्लेंड' },
    { item: 'पोएट्री पैनकेक्स', price: '₹180', description: 'शहद के साथ' },
    { item: 'लिटरेरी लैट्टे', price: '₹150', description: 'आर्ट लैट्टे' },
    { item: 'रीडिंग रूम सैंडविच', price: '₹250', description: 'ग्रिल्ड वेजी' }
  ];

  const readingSpaces = [
    { name: 'क्वाइट कॉर्नर', capacity: '1-2 लोग', ambiance: 'शांत माहौल' },
    { name: 'डिस्कशन टेबल', capacity: '4-6 लोग', ambiance: 'ग्रुप स्टडी' },
    { name: 'विंडो सीट', capacity: '1-2 लोग', ambiance: 'नेचुरल लाइट' },
    { name: 'कॉजी कॉर्नर', capacity: '2-3 लोग', ambiance: 'आरामदायक' }
  ];

  useEffect(() => {
    trackPageView('commercial_street_book_cafe');
    loadCafeData();
  }, []);

  const loadCafeData = async () => {
    try {
      setLoading(true);
      
      const [booksResponse, eventsResponse] = await Promise.all([
        apiService.get('/markets/commercial-street/book-cafe/books'),
        apiService.get('/markets/commercial-street/book-cafe/events')
      ]);

      if (booksResponse.success) {
        setBooks(booksResponse.data);
      }

      if (eventsResponse.success) {
        setEvents(eventsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load cafe data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('book_category_selected', {
      market: 'commercial_street',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_book_cafe', {
        productId: product.id,
        market: 'commercial_street',
        type: 'book'
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_book_cafe', {
        productId: product.id,
        market: 'commercial_street'
      });
    }
  };

  const filteredBooks = activeCategory === 'all' 
    ? books 
    : books.filter(book => book.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{cafeInfo.name} - भारतशाला | बेंगलुरु की प्रसिद्ध बुक कैफे</title>
        <meta name="description" content="कमर्शियल स्ट्रीट बुक कैफे से किताबें खरीदें और कॉफी का आनंद लें। लिटरेरी इवेंट्स, बुक रीडिंग और लेखक चर्चा।" />
        <meta name="keywords" content="बुक कैफे, कमर्शियल स्ट्रीट, बेंगलुरु बुक्स, लिटरेरी इवेंट्स, कॉफी और किताबें" />
        <link rel="canonical" href="https://bharatshala.com/markets/commercial-street/book-cafe" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${cafeInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">📚</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{cafeInfo.name}</h1>
                  <p className="text-xl opacity-90">{cafeInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-orange-200">{cafeInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-orange-200">{cafeInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-orange-200">{cafeInfo.location}</p>
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
              <Link to="/markets/commercial-street" className="hover:text-emerald-600">कमर्शियल स्ट्रीट</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">बुक कैफे</span>
            </nav>
          </div>
        </div>

        {/* Featured Books */}
        <section className="py-12 bg-amber-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">फीचर्ड बुक्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBooks.map((book, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2"><strong>लेखक:</strong> {book.author}</p>
                  <p className="text-gray-600 mb-2"><strong>विधा:</strong> {book.genre}</p>
                  <p className="text-gray-600 mb-2"><strong>भाषा:</strong> {book.language}</p>
                  <p className="text-gray-600 mb-3"><strong>पेज:</strong> {book.pages}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl font-bold text-amber-600">{book.price}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
                    </div>
                  </div>
                  <button className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    कार्ट में जोड़ें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आने वाले इवेंट्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>तारीख:</strong> {event.date}</p>
                    <p><strong>समय:</strong> {event.time}</p>
                    <p><strong>स्पीकर:</strong> {event.speaker}</p>
                    <p><strong>विषय:</strong> {event.topic}</p>
                    <p><strong>एंट्री:</strong> {event.entry}</p>
                  </div>
                  <button className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors duration-200">
                    रजिस्टर करें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">बुक श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {bookCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Books Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="किताबें लोड हो रही हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी किताबें' : bookCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <ProductCard
                    key={book.id}
                    product={book}
                    onAddToCart={() => handleAddToCart(book)}
                    onAddToWishlist={() => handleAddToWishlist(book)}
                    showLanguageBadge={true}
                    showGenreBadge={true}
                    showRatingBadge={true}
                  />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई किताब नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Cafe Menu */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कैफे मेन्यू</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cafeMenu.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.item}</h3>
                    <span className="text-lg font-bold text-amber-600">{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Reading Spaces */}
        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">रीडिंग स्पेसेस</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {readingSpaces.map((space, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
                  <p className="text-gray-600 mb-1">{space.capacity}</p>
                  <p className="text-gray-600">{space.ambiance}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book Cafe Experience */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">बुक कैफे का अनुभव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                15 साल से कमर्शियल स्ट्रीट बुक कैफे बेंगलुरु के बुक लवर्स का घर है। 
                यहाँ किताबों की खुशबू और कॉफी की महक के साथ मिलता है ज्ञान और मनोरंजन का संगम। 
                लिटरेरी इवेंट्स से लेकर क्वाइट रीडिंग तक, यहाँ है हर बुक लवर के लिए कुछ खास।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>कमर्शियल स्ट्रीट, बेंगलुरु</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🕒</div>
                  <h3 className="text-xl font-semibold mb-2">समय</h3>
                  <p>सुबह 9:00 - रात 10:00 (रोज़ाना)</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">☕</div>
                  <h3 className="text-xl font-semibold mb-2">विशेषता</h3>
                  <p>किताबें, कॉफी और लिटरेरी इवेंट्स</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BookCafe;