// Folk Art Center Component for Dilli Haat - Bharatshaala Platform
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

const FolkArtCenter = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [artworks, setArtworks] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const centerInfo = {
    name: 'दिल्ली हाट लोक कला केंद्र',
    nameEn: 'Dilli Haat Folk Art Center',
    description: 'भारतीय लोक कला की धरोहर का संरक्षण - पारंपरिक शिल्प और कलाकारों का घर',
    established: '1994',
    speciality: 'हस्तशिल्प, लोक चित्रकला, पारंपरिक कलाएं',
    location: 'दिल्ली हाट, INA, नई दिल्ली',
    heroImage: '/images/markets/dilli-haat-folk-art.jpg'
  };

  const artCategories = [
    { id: 'all', name: 'सभी लोक कलाएं', icon: '🎨' },
    { id: 'paintings', name: 'लोक चित्रकला', icon: '🖼️' },
    { id: 'sculptures', name: 'मूर्तिकला', icon: '🗿' },
    { id: 'textiles', name: 'वस्त्र कला', icon: '🧵' },
    { id: 'pottery', name: 'मिट्टी की कला', icon: '🏺' },
    { id: 'woodwork', name: 'काष्ठ कला', icon: '🪵' },
    { id: 'metalwork', name: 'धातु शिल्प', icon: '⚒️' }
  ];

  const featuredArtworks = [
    {
      name: 'मधुबनी पेंटिंग',
      description: 'बिहार की पारंपरिक मधुबनी कला',
      artist: 'सीता देवी',
      region: 'मिथिला, बिहार',
      price: '₹2,500',
      medium: 'हैंडमेड पेपर पर प्राकृतिक रंग',
      size: '16x12 इंच',
      theme: 'गणेश चतुर्थी',
      technique: 'पारंपरिक ब्रश वर्क'
    },
    {
      name: 'वारली आर्ट',
      description: 'महाराष्ट्र की आदिवासी वारली पेंटिंग',
      artist: 'जीवा सोम मासे',
      region: 'ठाणे, महाराष्ट्र',
      price: '₹1,800',
      medium: 'कैनवास पर एक्रिलिक',
      size: '14x10 इंच',
      theme: 'ग्राम जीवन',
      technique: 'डॉट और लाइन आर्ट'
    },
    {
      name: 'पट्टचित्र पेंटिंग',
      description: 'ओडिशा की प्रसिद्ध पट्टचित्र कला',
      artist: 'रघुनाथ महापात्र',
      region: 'पुरी, ओडिशा',
      price: '₹3,200',
      medium: 'कैनवास पर नेचुरल कलर्स',
      size: '18x14 इंच',
      theme: 'जगन्नाथ लीला',
      technique: 'फाइन ब्रश वर्क'
    }
  ];

  const masterArtisans = [
    {
      name: 'कमला देवी',
      art: 'मधुबनी पेंटिंग',
      state: 'बिहार',
      experience: '45+ वर्ष',
      awards: 'राष्ट्रीय पुरस्कार 2019',
      specialty: 'कोहबर और गोदना आर्ट',
      students: 25
    },
    {
      name: 'भूरी बाई',
      art: 'भील आर्ट',
      state: 'मध्य प्रदेश',
      experience: '40+ वर्ष',
      awards: 'पद्म श्री 2021',
      specialty: 'जनजातीय जीवन चित्रण',
      students: 30
    },
    {
      name: 'सुभाष चंद्र महापात्र',
      art: 'पट्टचित्र',
      state: 'ओडिशा',
      experience: '35+ वर्ष',
      awards: 'शिल्प गुरु सम्मान',
      specialty: 'जगन्नाथ चित्रण',
      students: 20
    }
  ];

  const folkArtForms = [
    {
      art: 'मधुबनी',
      origin: 'बिहार',
      characteristics: 'ज्यामितीय पैटर्न, प्राकृतिक रंग',
      themes: 'देवी-देवता, प्रकृति, त्योहार',
      medium: 'कागज, कैनवास, दीवारें'
    },
    {
      art: 'वारली',
      origin: 'महाराष्ट्र',
      characteristics: 'सफेद रंग, सर्कल्स और त्रिकोण',
      themes: 'आदिवासी जीवन, प्रकृति पूजा',
      medium: 'मिट्टी की दीवारें, कैनवास'
    },
    {
      art: 'पट्टचित्र',
      origin: 'ओडिशा',
      characteristics: 'बोल्ड लाइन्स, चमकीले रंग',
      themes: 'जगन्नाथ, कृष्ण लीला',
      medium: 'कपड़ा, पाम लीव्स'
    },
    {
      art: 'गोंड आर्ट',
      origin: 'मध्य प्रदेश',
      characteristics: 'डॉट्स और पैटर्न्स',
      themes: 'जंगली जानवर, प्रकृति',
      medium: 'कैनवास, कागज'
    },
    {
      art: 'फाड़',
      origin: 'राजस्थान',
      characteristics: 'स्क्रॉल पेंटिंग, कहानी कहना',
      themes: 'वीर गाथाएं, देवी कथाएं',
      medium: 'कपड़ा स्क्रॉल्स'
    },
    {
      art: 'कलमकारी',
      origin: 'आंध्र प्रदेश',
      characteristics: 'हाथ से पेंटेड टेक्सटाइल',
      themes: 'मिथोलॉजी, फ्लोरल मोटिफ्स',
      medium: 'कॉटन फैब्रिक'
    }
  ];

  const workshops = [
    {
      workshop: 'मधुबनी पेंटिंग वर्कशॉप',
      instructor: 'सीता देवी',
      duration: '3 दिन',
      fee: '₹2,000',
      includes: ['मटेरियल', 'सर्टिफिकेट', 'लंच'],
      schedule: 'सप्ताहांत बैच'
    },
    {
      workshop: 'वारली आर्ट क्लास',
      instructor: 'जीवा सोम मासे',
      duration: '2 दिन',
      fee: '₹1,500',
      includes: ['कैनवास', 'पेंट्स', 'गाइड बुक'],
      schedule: 'वीकडे इवनिंग'
    },
    {
      workshop: 'पॉटरी वर्कशॉप',
      instructor: 'राम प्रसाद',
      duration: '4 दिन',
      fee: '₹2,500',
      includes: ['क्ले', 'टूल्स', 'फायरिंग'],
      schedule: 'मॉर्निंग बैच'
    }
  ];

  useEffect(() => {
    trackPageView('dilli_haat_folk_art_center');
    loadCenterData();
  }, []);

  const loadCenterData = async () => {
    try {
      setLoading(true);
      
      const [artworksResponse, artisansResponse] = await Promise.all([
        apiService.get('/markets/dilli-haat/folk-art-center/artworks'),
        apiService.get('/markets/dilli-haat/folk-art-center/artisans')
      ]);

      if (artworksResponse.success) {
        setArtworks(artworksResponse.data);
      }

      if (artisansResponse.success) {
        setArtisans(artisansResponse.data);
      }
    } catch (error) {
      console.error('Failed to load center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    trackEvent('folk_art_category_selected', {
      market: 'dilli_haat',
      category
    });
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product, 1);
    if (result.success) {
      trackEvent('add_to_cart_folk_art_center', {
        productId: product.id,
        market: 'dilli_haat',
        artist: product.artist
      });
    }
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      trackEvent('add_to_wishlist_folk_art_center', {
        productId: product.id,
        market: 'dilli_haat'
      });
    }
  };

  const filteredArtworks = activeCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>{centerInfo.name} - भारतशाला | भारतीय लोक कला केंद्र</title>
        <meta name="description" content="दिल्ली हाट लोक कला केंद्र में भारतीय पारंपरिक लोक कलाओं का संग्रह। मधुबनी, वारली, पट्टचित्र और अन्य हस्तशिल्प कलाकृतियां।" />
        <meta name="keywords" content="दिल्ली हाट, लोक कला, मधुबनी पेंटिंग, वारली आर्ट, पट्टचित्र, भारतीय हस्तशिल्प, पारंपरिक कला" />
        <link rel="canonical" href="https://bharatshaala.com/markets/dilli-haat/folk-art-center" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${centerInfo.heroImage})` }}
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
                  <h1 className="text-5xl font-bold mb-2">{centerInfo.name}</h1>
                  <p className="text-xl opacity-90">{centerInfo.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थापना</h3>
                  <p className="text-red-200">{centerInfo.established}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">विशेषता</h3>
                  <p className="text-red-200">{centerInfo.speciality}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">स्थान</h3>
                  <p className="text-red-200">{centerInfo.location}</p>
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
              <span className="text-gray-900">लोक कला केंद्र</span>
            </nav>
          </div>
        </div>

        {/* Featured Artworks */}
        <section className="py-12 bg-orange-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">प्रमुख लोक कलाकृतियां</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artwork.name}</h3>
                  <p className="text-gray-600 mb-3">{artwork.description}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-bold text-orange-600">{artwork.price}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कलाकार:</strong> {artwork.artist}</p>
                    <p><strong>क्षेत्र:</strong> {artwork.region}</p>
                    <p><strong>माध्यम:</strong> {artwork.medium}</p>
                    <p><strong>साइज:</strong> {artwork.size}</p>
                    <p><strong>थीम:</strong> {artwork.theme}</p>
                    <p><strong>तकनीक:</strong> {artwork.technique}</p>
                  </div>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    कार्ट में जोड़ें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">लोक कला श्रेणियां</h2>
            <div className="flex flex-wrap gap-4">
              {artCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-orange-600 text-white'
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

        {/* Folk Art Forms */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">भारतीय लोक कला परंपराएं</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {folkArtForms.map((form, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{form.art}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>मूल:</strong> {form.origin}</p>
                    <p><strong>विशेषताएं:</strong> {form.characteristics}</p>
                    <p><strong>विषय:</strong> {form.themes}</p>
                    <p><strong>माध्यम:</strong> {form.medium}</p>
                  </div>
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
                {activeCategory === 'all' ? 'सभी लोक कलाएं' : artCategories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredArtworks.map((artwork) => (
                  <ProductCard
                    key={artwork.id}
                    product={artwork}
                    onAddToCart={() => handleAddToCart(artwork)}
                    onAddToWishlist={() => handleAddToWishlist(artwork)}
                    showArtistBadge={true}
                    showHandmadeBadge={true}
                    showTraditionalBadge={true}
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

        {/* Master Artisans */}
        <section className="py-16 bg-gradient-to-r from-orange-100 to-red-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मास्टर कलाकार</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {masterArtisans.map((artisan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{artisan.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>कला:</strong> {artisan.art}</p>
                    <p><strong>राज्य:</strong> {artisan.state}</p>
                    <p><strong>अनुभव:</strong> {artisan.experience}</p>
                    <p><strong>विशेषता:</strong> {artisan.specialty}</p>
                    <p><strong>पुरस्कार:</strong> {artisan.awards}</p>
                    <p><strong>शिष्य:</strong> {artisan.students}</p>
                  </div>
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    कलाकृतियां देखें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workshops */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">कला वर्कशॉप्स</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {workshops.map((workshop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{workshop.workshop}</h3>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>इंस्ट्रक्टर:</strong> {workshop.instructor}</p>
                    <p><strong>अवधि:</strong> {workshop.duration}</p>
                    <p><strong>फीस:</strong> {workshop.fee}</p>
                    <p><strong>शेड्यूल:</strong> {workshop.schedule}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">शामिल है:</p>
                    {workshop.includes.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-lg p-2 text-sm text-gray-700 mb-1">
                        • {item}
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200">
                    रजिस्टर करें
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Folk Art Heritage */}
        <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">भारतीय लोक कला की विरासत</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-8">
                30 साल से दिल्ली हाट लोक कला केंद्र भारत की अमूल्य लोक कला परंपराओं को जीवित रखने का काम कर रहा है। 
                यहाँ हर कलाकृति में छुपी है सदियों पुरानी तकनीक और कलाकार के जज्बे की कहानी। 
                भारत की सांस्कृतिक विविधता और कलात्मक समृद्धि का यह अनूठा खजाना है।
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <div className="text-4xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold mb-2">स्थान</h3>
                  <p>दिल्ली हाट, INA, नई दिल्ली</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">कला रूप</h3>
                  <p>50+ पारंपरिक लोक कलाएं</p>
                </div>
                <div>
                  <div className="text-4xl mb-4">👨‍🎨</div>
                  <h3 className="text-xl font-semibold mb-2">कलाकार</h3>
                  <p>200+ पारंपरिक कलाकार</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FolkArtCenter;
