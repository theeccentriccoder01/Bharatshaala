// Art Gallery Component for Colaba Causeway - Bharatshala Platform
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

const ArtGallery = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [artworks, setArtworks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryInfo = {
    name: 'कोलाबा आर्ट गैलरी',
    nameEn: 'Colaba Art Gallery',
    description: 'समकालीन और पारंपरिक भारतीय कला का संगम - मुंबई की प्रसिद्ध कला दीर्घा',
    established: '1980s',
    speciality: 'समकालीन कला, पारंपरिक पेंटिंग्स',
    location: 'आर्ट डिस्ट्रिक्ट, कोलाबा',
    heroImage: '/images/markets/colaba-art-gallery.jpg'
  };

  const artCategories = [
    { id: 'all', name: 'सभी कलाकृतियां', icon: '🎨' },
    { id: 'paintings', name: 'पेंटिंग्स', icon: '🖼️' },
    { id: 'sculptures', name: 'मूर्तिकला', icon: '🗿' },
    { id: 'digital', name: 'डिजिटल आर्ट', icon: '💻' },
    { id: 'photography', name: 'फोटोग्राफी', icon: '📸' },
    { id: 'mixed-media', name: 'मिक्स्ड मीडिया', icon: '🎭' },
    { id: 'installations', name: 'इंस्टॉलेशन', icon: '🏗️' }
  ];

  const featuredArtists = [
    {
      name: 'राज कुमार सिंह',
      specialty: 'समकालीन भारतीय चित्रकला',
      experience: '25+ वर्ष',
      style: 'नव-अभिव्यंजनावाद',
      achievements: 'राष्ट्रीय कला पुरस्कार विजेता',
      artworks: 45
    },
    {
      name: 'प्रिया शर्मा',
      specialty: 'डिजिटल आर्ट और इंस्टॉलेशन',
      experience: '15+ वर्ष',
      style: 'आधुनिक अमूर्त',
      achievements: 'अंतर्राष्ट्रीय प्रदर्शनी में चयनित',
      artworks: 32
    },
    {
      name: 'अमित चौधरी',
      specialty: 'पारंपरिक मुगल शैली',
      experience: '30+ वर्ष',
      style: 'लघु चित्रकला',
      achievements: 'शिल्प गुरु सम्मान',
      artworks: 67
    }
  ];

  const currentExhibitions = [
    {
      title: 'रंगों का त्योहार',
      artist: 'विभिन्न कलाकार',
      theme: 'भारतीय त्योहारों पर आधारित कलाकृतियां',
      duration: '15 फरवरी - 15 मार्च',
      artworks: 25,
      type: 'ग्रुप शो'
    },
    {
      title: 'आधुनिक भारत',
      artist: 'राज कुमार सिंह',
      theme: 'समकालीन भारतीय समाज का चित्रण',
      duration: '1 मार्च - 30 मार्च',
      artworks: 18,
      type: 'सोलो शो'
    }
  ];

  const artStyles = [
    { style: 'मुगल शैली', origin: 'मुगल काल', description: 'लघु चित्रकला और बारीक काम' },
    { style: 'राजस्थानी शैली', origin: 'राजस्थान', description: 'रंगीन और विस्तृत चित्रण' },
    { style: 'बंगाल स्कूल', origin: 'बंगाल', description: 'पुनर्जागरण काल की कला' },
    { style: 'समकालीन', origin: 'आधुनिक काल', description: 'नए माध्यमों और विषयों की खोज' }
  ];

  useEffect(() => {
    trackPageView('colaba_art_gallery');
    loadGalleryData();
  }, []);

  const loadGalleryData = async () => {
    try {
      setLoading(true);
      
      const [artworksResponse, artistsResponse, exhibitionsResponse] = await Promise.all([
        apiService.get('/markets/colaba-causeway/art-gallery/artworks'),
        apiService.get('/markets/colaba-causeway/art-gallery/artists'),
        apiService.get('/markets/colaba-causeway/art-gallery/exhibitions')
      ]);

      if (artworksResponse.success) {
        setArtworks(artworksResponse.data);
      }

      if (artistsResponse.success) {
        setArtists(artistsResponse.data);
      }

      if (exhibitionsResponse.success) {
        setExhibitions(exhibitionsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load gallery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('art_category_selected', {
      market: 'colaba_causeway',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_art_gallery', {
        productId: product.id,
        market: 'colaba_causeway',
        artist: product.artist
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_art_gallery', {
        productId: product.id,
        market: 'colaba_causeway'
      });
    }
  };

  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{galleryInfo.name} - भारतशाला | कोलाबा की समकालीन कला</title>
        <meta name="description" content="कोलाबा आर्ट गैलरी से समकालीन और पारंपरिक भारतीय कलाकृतियां। पेंटिंग्स, मूर्तिकला, डिजिटल आर्ट और फोटोग्राफी।" />
        <meta name="keywords" content="कोलाबा आर्ट गैलरी, समकालीन कला, भारतीय पेंटिंग्स, मुंबई आर्ट, कलाकृति खरीदें" />
        <link rel="canonical" href="https://bharatshala.com/markets/colaba-causeway/art-gallery" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${galleryInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🎨</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{galleryInfo.name}</h1>
                  <p className="text-xl opacity-90">{galleryInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-purple-200">{galleryInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-purple-200">{galleryInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-purple-200">{galleryInfo.location}</p>
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
              <Link to="/markets/colaba-causeway" className="hover:text-emerald-600">कोलाबा कॉज़वे</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">आर्ट गैलरी</span>
            </nav>
          </div>
        </div>

        {/* Current Exhibitions */}
        <section className="py-12 bg-indigo-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">वर्तमान प्रदर्शनी</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {currentExhibitions.map((exhibition, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{exhibition.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {exhibition.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2"><strong>कलाकार:</strong> {exhibition.artist}</p>
                  <p className="text-gray-600 mb-2"><strong>थीम:</strong> {exhibition.theme}</p>
                  <p className="text-gray-600 mb-2"><strong>अवधि:</strong> {exhibition.duration}</p>
                  <p className="text-gray-600 mb-4"><strong>कलाकृतियां:</strong> {exhibition.artworks}</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    प्रदर्शनी देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">कला श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {artCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-indigo-600 text-white'
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

        {/* Featured Artists */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध कलाकार</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArtists.map((artist, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artist.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>विशेषता:</strong> {artist.specialty}</p>
                    <p><strong>शैली:</strong> {artist.style}</p>
                    <p><strong>अनुभव:</strong> {artist.experience}</p>
                    <p><strong>उपलब्धि:</strong> {artist.achievements}</p>
                    <p><strong>कलाकृतियां:</strong> {artist.artworks}</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    कलाकृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Art Styles */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">भारतीय कला शैलियां</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {artStyles.map((style, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{style.style}</h3>
                  <p className="text-indigo-700 font-medium mb-3">{style.origin}</p>
                  <p className="text-gray-600 text-sm">{style.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="कलाकृतियां लोड हो रही हैं..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी कलाकृतियां' : artCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredArtworks.map((artwork) => (
                  <ProductCard
                    key={artwork.id}
                    product={artwork}
                    onAddToCart={() => handleAddToCart(artwork)}
                    onAddToWishlist={() => handleAddToWishlist(artwork)}
                    showArtistBadge={true}
                    showStyleBadge={true}
                    showAuthenticityBadge={true}
                  />
                ))}
              </div>

              {filteredArtworks.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई कलाकृति नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Art Collection Tips */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कला संग्रह की जानकारी</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">👁️</div>
                <h3 className="text-xl