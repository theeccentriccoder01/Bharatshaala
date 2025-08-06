// Cultural Exhibit Component for Dilli Haat - Bharatshala Platform
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

const CulturalExhibit = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [exhibits, setExhibits] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const exhibitInfo = {
    name: 'दिल्ली हाट सांस्कृतिक प्रदर्शनी',
    nameEn: 'Dilli Haat Cultural Exhibit',
    description: 'भारत की समृद्ध सांस्कृतिक विरासत का जीवंत प्रदर्शन - कला, संस्कृति और परंपरा का संगम',
    established: '1994',
    speciality: 'राज्यवार सांस्कृतिक प्रदर्शन',
    location: 'दिल्ली हाट, INA, नई दिल्ली',
    heroImage: '/images/markets/dilli-haat-cultural.jpg'
  };

  const exhibitCategories = [
    { id: 'all', name: 'सभी प्रदर्शनी', icon: '🎭' },
    { id: 'traditional-art', name: 'पारंपरिक कला', icon: '🎨' },
    { id: 'folk-dance', name: 'लोक नृत्य', icon: '💃' },
    { id: 'music', name: 'संगीत', icon: '🎵' },
    { id: 'theater', name: 'रंगमंच', icon: '🎪' },
    { id: 'crafts-demo', name: 'शिल्प प्रदर्शन', icon: '🏺' },
    { id: 'storytelling', name: 'कहानी सुनाना', icon: '📚' }
  ];

  const currentExhibits = [
    {
      title: 'राजस्थान की कठपुतली कला',
      description: 'पारंपरिक राजस्थानी कठपुतली का जीवंत प्रदर्शन',
      artist: 'रामकुमार भाट परिवार',
      state: 'राजस्थान',
      duration: '30 मिनट',
      shows: ['11:00 AM', '3:00 PM', '6:00 PM'],
      venue: 'मुख्य मंच',
      type: 'पारंपरिक कलाकारी',
      audience: 'सभी आयु वर्ग'
    },
    {
      title: 'केरल की मोहिनीअट्टम',
      description: 'केरल के शास्त्रीय नृत्य का मनमोहक प्रदर्शन',
      artist: 'डॉ. प्रीति वारियर',
      state: 'केरल',
      duration: '45 मिनट',
      shows: ['4:00 PM', '7:00 PM'],
      venue: 'सांस्कृतिक मंडप',
      type: 'शास्त्रीय नृत्य',
      audience: 'कला प्रेमी'
    },
    {
      title: 'पंजाब का भांगड़ा',
      description: 'ऊर्जावान पंजाबी लोक नृत्य',
      artist: 'अमृतसर भांगड़ा ग्रुप',
      state: 'पंजाब',
      duration: '25 मिनट',
      shows: ['12:00 PM', '5:00 PM'],
      venue: 'ओपन एरिया',
      type: 'लोक नृत्य',
      audience: 'सभी लोग'
    }
  ];

  const participatingStates = [
    {
      state: 'राजस्थान',
      attractions: ['कठपुतली शो', 'घूमर नृत्य', 'मांड गायन'],
      specialties: ['ब्लू पॉटरी', 'बंधनी', 'मीनाकारी'],
      pavilion: 'A-1 से A-10'
    },
    {
      state: 'केरल',
      attractions: ['मोहिनीअट्टम', 'कथकली', 'थेय्यम'],
      specialties: ['कॉयर प्रोडक्ट्स', 'स्पाइसेस', 'हैंडलूम'],
      pavilion: 'B-1 से B-8'
    },
    {
      state: 'पश्चिम बंगाल',
      attractions: ['रवींद्र संगीत', 'दुर्गा पूजा प्रदर्शन', 'बाउल गान'],
      specialties: ['टेराकोटा', 'शोला क्राफ्ट', 'कांथा स्टिच'],
      pavilion: 'C-1 से C-12'
    },
    {
      state: 'गुजरात',
      attractions: ['गरबा', 'डांडिया', 'भजन'],
      specialties: ['पटोला सिल्क', 'बंधनी', 'मिरर वर्क'],
      pavilion: 'D-1 से D-15'
    }
  ];

  const culturalEvents = [
    {
      event: 'नवरात्रि महोत्सव',
      date: '15-24 अक्टूबर',
      description: 'गुजराती गरबा और डांडिया रास',
      highlights: ['पारंपरिक पोशाक', 'लाइव संगीत', 'डांस कॉम्पिटिशन']
    },
    {
      event: 'दीपावली मेला',
      date: '10-15 नवंबर',
      description: 'भारत भर की दीपावली परंपराएं',
      highlights: ['रंगोली प्रतियोगिता', 'दीप प्रज्वलन', 'मिठाई स्टॉल']
    },
    {
      event: 'होली उत्सव',
      date: '10-15 मार्च',
      description: 'रंगों का त्योहार मनाना',
      highlights: ['हर्बल गुलाल', 'होली गीत', 'फागुनी रंग']
    }
  ];

  const artistProfiles = [
    {
      name: 'उस्ताद अकबर खान',
      art: 'सरोद वादन',
      state: 'राजस्थान',
      experience: '40+ वर्ष',
      awards: 'पद्म भूषण',
      specialty: 'हिंदुस्तानी शास्त्रीय संगीत'
    },
    {
      name: 'सोनल मानसिंह',
      art: 'भरतनाट्यम',
      state: 'तमिलनाडु',
      experience: '50+ वर्ष',
      awards: 'पद्म विभूषण',
      specialty: 'शास्त्रीय नृत्य'
    },
    {
      name: 'हरिहरन जी',
      art: 'कर्नाटक संगीत',
      state: 'तमिलनाडु',
      experience: '35+ वर्ष',
      awards: 'पद्म श्री',
      specialty: 'भजन और फिल्मी संगीत'
    }
  ];

  useEffect(() => {
    trackPageView('dilli_haat_cultural_exhibit');
    loadExhibitData();
  }, []);

  const loadExhibitData = async () => {
    try {
      setLoading(true);
      
      const [exhibitsResponse, artistsResponse] = await Promise.all([
        apiService.get('/markets/dilli-haat/cultural-exhibit/exhibits'),
        apiService.get('/markets/dilli-haat/cultural-exhibit/artists')
      ]);

      if (exhibitsResponse.success) {
        setExhibits(exhibitsResponse.data);
      }

      if (artistsResponse.success) {
        setArtists(artistsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load exhibit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('cultural_exhibit_category_selected', {
      market: 'dilli_haat',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_cultural_exhibit', {
        productId: product.id,
        market: 'dilli_haat',
        artist: product.artist
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_cultural_exhibit', {
        productId: product.id,
        market: 'dilli_haat'
      });
    }
  };

  const filteredExhibits = activeCategory === 'all' 
    ? exhibits 
    : exhibits.filter(exhibit => exhibit.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{exhibitInfo.name} - भारतशाला | भारतीय सांस्कृतिक प्रदर्शनी</title>
        <meta name="description" content="दिल्ली हाट में भारतीय सांस्कृतिक प्रदर्शनी। पारंपरिक नृत्य, संगीत, कला और विभिन्न राज्यों की सांस्कृतिक परंपराओं का जीवंत प्रदर्शन।" />
        <meta name="keywords" content="दिल्ली हाट, सांस्कृतिक प्रदर्शनी, भारतीय कला, लोक नृत्य, पारंपरिक संगीत, सांस्कृतिक कार्यक्रम" />
        <link rel="canonical" href="https://bharatshala.com/markets/dilli-haat/cultural-exhibit" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${exhibitInfo.heroImage})` }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-6xl">🎭</span>
                <div>
                  <h1 className="text-5xl font-bold mb-2">{exhibitInfo.name}</h1>
                  <p className="text-xl opacity-90">{exhibitInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-purple-200">{exhibitInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-purple-200">{exhibitInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-purple-200">{exhibitInfo.location}</p>
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
              <span className="text-gray-900">सांस्कृतिक प्रदर्शनी</span>
            </nav>
          </div>
        </div>

        {/* Current Exhibits */}
        <section className="py-12 bg-indigo-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आज के सांस्कृतिक कार्यक्रम</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {currentExhibits.map((exhibit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exhibit.title}</h3>
                  <p className="text-gray-600 mb-3">{exhibit.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कलाकार:</strong> {exhibit.artist}</p>
                    <p><strong>राज्य:</strong> {exhibit.state}</p>
                    <p><strong>अवधि:</strong> {exhibit.duration}</p>
                    <p><strong>स्थान:</strong> {exhibit.venue}</p>
                    <p><strong>प्रकार:</strong> {exhibit.type}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">शो टाइमिंग:</p>
                    <div className="flex flex-wrap gap-2">
                      {exhibit.shows.map((time, timeIndex) => (
                        <span key={timeIndex} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    टिकट बुक करें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">प्रदर्शनी श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {exhibitCategories.map((category) => (
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

        {/* Participating States */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">भाग लेने वाले राज्य</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {participatingStates.map((state, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{state.state}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">आकर्षण:</p>
                      {state.attractions.map((attraction, attractionIndex) => (
                        <div key={attractionIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {attraction}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">विशेषताएं:</p>
                      {state.specialties.map((specialty, specialtyIndex) => (
                        <div key={specialtyIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                          • {specialty}
                        </div>
                      ))}
                    </div>
                    <p className="text-indigo-600 font-medium text-sm">पवेलियन: {state.pavilion}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cultural Events */}
        <section className="py-16 bg-indigo-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आगामी सांस्कृतिक उत्सव</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {culturalEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.event}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{event.date}</p>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-1">
                    {event.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="bg-indigo-50 rounded-lg p-2 text-sm text-gray-700">
                        • {highlight}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="प्रदर्शनी लोड हो रही है..." />
          </div>
        ) : (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {activeCategory === 'all' ? 'सभी प्रदर्शनी' : exhibitCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredExhibits.map((exhibit) => (
                  <ProductCard
                    key={exhibit.id}
                    product={exhibit}
                    onAddToCart={() => handleAddToCart(exhibit)}
                    onAddToWishlist={() => handleAddToWishlist(exhibit)}
                    showCulturalBadge={true}
                    showStateBadge={true}
                    showArtistBadge={true}
                  />
                ))}
              </div>

              {filteredExhibits.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">इस श्रेणी में कोई प्रदर्शनी नहीं मिली</h3>
                  <p className="text-gray-600">कृपया दूसरी श्रेणी का चयन करें</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Artist Profiles */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रसिद्ध कलाकार</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {artistProfiles.map((artist, index) => (
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
                    <p><strong>कला:</strong> {artist.art}</p>
                    <p><strong>राज्य:</strong> {artist.state}</p>
                    <p><strong>अनुभव:</strong> {artist.experience}</p>
                    <p><strong>विशेषता:</strong> {artist.specialty}</p>
                    <p><strong>पुरस्कार:</strong> {artist.awards}</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                    प्रोफाइल देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Visitor Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">आगंतुक जानकारी</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🎫</div>
                <h3 className="text-xl font-semibold mb-2">प्रवेश शुल्क</h3>
                <p className="text-gray-600">₹30 प्रति व्यक्ति (बच्चे फ्री)</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🕒</div>
                <h3 className="text-xl font-semibold mb-2">समय</h3>
                <p className="text-gray-600">सुबह 10:30 - रात 10:00 (रोज़ाना)</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">बुकिंग</h3>
                <p className="text-gray-600">ऑनलाइन और काउंटर पर उपलब्ध</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold mb-2">पार्किंग</h3>
                <p className="text-gray-600">भुगतान पार्किंग उपलब्ध</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Heritage */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">भारतीय सांस्कृतिक विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                30 साल से दिल्ली हाट भारत की समृद्ध सांस्कृतिक विविधता को एक मंच पर लाने का काम कर रहा है। 
                यहाँ आपको मिलेगा हर राज्य की अपनी अनूठी कला, संस्कृति और परंपरा का जीवंत अनुभव। 
                भारत की एकता में अनेकता का यह सबसे सुंदर उदाहरण है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>दिल्ली हाट, INA, नई दिल्ली</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">राज्य</h3>
                  <p>28 राज्यों का प्रतिनिधित्व</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="text-xl font-semibold mb-2">कलाकार</h3>
                  <p>500+ पारंपरिक कलाकार</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CulturalExhibit;