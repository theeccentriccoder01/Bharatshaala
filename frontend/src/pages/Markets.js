import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import MarketCard from '../components/MarketCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import '../App.css';

// Import actual market images based on your directory structure
import chandniChowkImg from '../images/markets/chandni.png';
import jaipurImg from '../images/markets/jaipur.png';
import laadBazaarImg from '../images/markets/laad.png';
import mysoreImg from '../images/markets/mysore.png';
import colabaImg from '../images/markets/colaba.png';
import commercialStreetImg from '../images/markets/commercial.png';
import dilliHaatImg from '../images/markets/dilli_haat.png';

// Import a fallback placeholder image (create this if it doesn't exist)
import placeholderImg from '../images/placeholder.png';

const Markets = () => {
  const [loading, setLoading] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  // ... rest of your state and filter arrays remain the same ...

  const states = [
    { id: 'all', name: 'सभी राज्य', nameEn: 'All States' },
    { id: 'delhi', name: 'दिल्ली', nameEn: 'Delhi' },
    { id: 'rajasthan', name: 'राजस्थान', nameEn: 'Rajasthan' },
    { id: 'telangana', name: 'तेलंगाना', nameEn: 'Telangana' },
    { id: 'karnataka', name: 'कर्नाटक', nameEn: 'Karnataka' },
    { id: 'maharashtra', name: 'महाराष्ट्र', nameEn: 'Maharashtra' }
  ];

  const categories = [
    { id: 'all', name: 'सभी श्रेणियां', icon: '🏪' },
    { id: 'traditional', name: 'पारंपरिक', icon: '🏛️' },
    { id: 'heritage', name: 'विरासत', icon: '👑' },
    { id: 'modern', name: 'आधुनिक', icon: '🏢' },
    { id: 'handicrafts', name: 'हस्तशिल्प', icon: '🎨' },
    { id: 'textiles', name: 'वस्त्र', icon: '🧵' },
    { id: 'jewelry', name: 'आभूषण', icon: '💎' }
  ];

  useEffect(() => {
    loadMarketsData();
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterAndSortMarkets();
  }, [markets, searchTerm, selectedState, selectedCategory, sortBy]);

  const loadMarketsData = () => {
    const marketData = [
      {
        id: 'chandni_chowk',
        name: 'Chandni Chowk',
        nameHindi: 'चांदनी चौक',
        city: 'Delhi',
        cityHindi: 'दिल्ली',
        state: 'delhi',
        description: 'भारत के सबसे पुराने और व्यस्त बाजारों में से एक, इसकी संकरी गलियों और भीड़भाड़ के माहौल की खोज करें।',
        descriptionEn: 'One of the oldest and busiest markets in India, explore its narrow lanes and bustling atmosphere.',
        image: chandniChowkImg,
        href: '/markets/chandni_chowk',
        rating: 4.8,
        reviews: 2847,
        vendors: 350,
        established: '1650',
        specialties: ['मसाले', 'चांदी के आभूषण', 'कपड़े', 'मिठाइयां'],
        categories: ['traditional', 'heritage', 'handicrafts', 'textiles'],
        openingHours: '10:00 - 21:00',
        popularItems: ['चांदी के गहने', 'पारंपरिक कपड़े', 'मसाले', 'स्ट्रीट फूड'],
        avgPrice: '₹500-₹5000',
        bestTime: 'नवंबर-फरवरी',
        nearbyAttractions: ['लाल किला', 'जामा मस्जिद', 'राज घाट'],
        languages: ['हिंदी', 'अंग्रेजी', 'उर्दू', 'पंजाबी'],
        facilities: ['पार्किंग', 'ATM', 'फूड कोर्ट', 'टूरिस्ट गाइड']
      },
      {
        id: 'pinkcity_bazaar',
        name: 'Pink City Bazaars',
        nameHindi: 'गुलाबी शहर बाजार',
        city: 'Jaipur',
        cityHindi: 'जयपुर',
        state: 'rajasthan',
        description: 'ये जीवंत बाजार गहने, कपड़े और हस्तशिल्प की विविधता का घर हैं।',
        descriptionEn: 'These vibrant bazaars are host to a variety of jewelry, textiles and handicrafts.',
        image: jaipurImg, // ✅ Fixed: Using imported image
        href: '/markets/pinkcity_bazaar',
        rating: 4.9,
        reviews: 3245,
        vendors: 220,
        established: '1727',
        specialties: ['जयपुरी आभूषण', 'ब्लॉक प्रिंट', 'नीली मिट्टी के बर्तन', 'राजस्थानी कठपुतली'],
        categories: ['traditional', 'heritage', 'handicrafts', 'jewelry'],
        openingHours: '10:00 - 20:00',
        popularItems: ['कुंदन ज्वेलरी', 'बंधेज साड़ी', 'जोधपुरी जूते', 'मीनाकारी'],
        avgPrice: '₹300-₹25000',
        bestTime: 'अक्टूबर-मार्च',
        nearbyAttractions: ['हवा महल', 'सिटी पैलेस', 'अंबर किला'],
        languages: ['हिंदी', 'अंग्रेजी', 'राजस्थानी'],
        facilities: ['पार्किंग', 'गाइडेड टूर', 'कैफे', 'रेस्ट रूम']
      },
      {
        id: 'laad_bazaar',
        name: 'Laad Bazaar',
        nameHindi: 'लाड़ बाजार',
        city: 'Hyderabad',
        cityHindi: 'हैदराबाद',
        state: 'telangana',
        description: 'प्रतिष्ठित चार मीनार के सामने स्थित, यह बाजार चूड़ियों, मोतियों और पारंपरिक हैदराबादी आभूषण डिजाइन का शानदार संग्रह प्रस्तुत करता है।',
        descriptionEn: 'Facing the iconic Char Minar, this market offers a stunning array of bangles, pearls and traditional Hyderabadi jewelry designs.',
        image: laadBazaarImg, // ✅ Fixed: Using imported image
        href: '/markets/laad_bazaar',
        rating: 4.7,
        reviews: 1876,
        vendors: 150,
        established: '1591',
        specialties: ['मोती', 'लाख की चूड़ियां', 'निज़ामी आभूषण', 'अत्तर'],
        categories: ['traditional', 'heritage', 'jewelry'],
        openingHours: '11:00 - 21:30',
        popularItems: ['हैदराबादी पर्ल्स', 'लाख बैंगल्स', 'दक्खिनी कपड़े'],
        avgPrice: '₹200-₹50000',
        bestTime: 'नवंबर-फरवरी',
        nearbyAttractions: ['चार मीनार', 'मक्का मस्जिद', 'चौमहल्ला पैलेस'],
        languages: ['हिंदी', 'उर्दू', 'तेलुगु', 'अंग्रेजी'],
        facilities: ['पार्किंग', 'सिक्यूरिटी', 'फूड स्टॉल्स']
      },
      {
        id: 'devaraja_market',
        name: 'Devaraja Market',
        nameHindi: 'देवराज मार्केट',
        city: 'Mysore',
        cityHindi: 'मैसूर',
        state: 'karnataka',
        description: 'यह रंग-बिरंगा बाजार एक पर्यटक आकर्षण भी है, जहाँ फूलों के गुच्छे, फल और विभिन्न रंगों का कुमकुम पाउडर मिलता है।',
        descriptionEn: 'This colorful market also doubles as a tourist attraction, with bundles of flowers, fruits and various colored Kumkum powder.',
        image: mysoreImg, // ✅ Fixed: Using imported image
        href: '/markets/devaraja_market',
        rating: 4.6,
        reviews: 1456,
        vendors: 95,
        established: '1905',
        specialties: ['चंदन', 'रेशम', 'मैसूर पाक', 'कुमकुम'],
        categories: ['traditional', 'handicrafts'],
        openingHours: '06:00 - 20:00',
        popularItems: ['चंदन की लकड़ी', 'मैसूर सिल्क', 'फूल माला'],
        avgPrice: '₹100-₹15000',
        bestTime: 'अक्टूबर-मार्च',
        nearbyAttractions: ['मैसूर पैलेस', 'चामुंडी हिल्स', 'सेंट फिलोमिना चर्च'],
        languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी'],
        facilities: ['पार्किंग', 'टूरिस्ट हेल्प डेस्क', 'रेस्ट रूम']
      },
      {
        id: 'colaba_causeway',
        name: 'Colaba Causeway',
        nameHindi: 'कोलाबा कॉजवे',
        city: 'Mumbai',
        cityHindi: 'मुंबई',
        state: 'maharashtra',
        description: 'यह लोकप्रिय शॉपिंग गंतव्य अपने ट्रेंडी फैशन बुटीक और प्राचीन वस्तुओं के लिए जाना जाता है।',
        descriptionEn: 'This popular shopping destination is known for its trendy fashion boutiques and antiques.',
        image: colabaImg, // ✅ Fixed: Using imported image
        href: '/markets/colaba_causeway',
        rating: 4.5,
        reviews: 2134,
        vendors: 300,
        established: '1838',
        specialties: ['एंटीक्स', 'फैशन', 'हैंडीक्राफ्ट्स', 'कैफे'],
        categories: ['modern', 'handicrafts'],
        openingHours: '10:00 - 23:00',
        popularItems: ['विंटेज कलेक्टिबल्स', 'डिज़ाइनर वियर', 'हैंडमेड ज्वेलरी'],
        avgPrice: '₹500-₹25000',
        bestTime: 'नवंबर-फरवरी',
        nearbyAttractions: ['गेटवे ऑफ इंडिया', 'ताज होटल', 'प्रिंस ऑफ वेल्स म्यूजियम'],
        languages: ['हिंदी', 'अंग्रेजी', 'मराठी'],
        facilities: ['वैलेट पार्किंग', 'कैफे', 'बुक स्टोर', 'आर्ट गैलरी']
      },
      {
        id: 'commercial_street',
        name: 'Commercial Street',
        nameHindi: 'कॉमर्शियल स्ट्रीट',
        city: 'Bengaluru',
        cityHindi: 'बेंगलुरु',
        state: 'karnataka',
        description: 'बैंगलोर के दिल में स्थित इस बाजार में दुकानों की विविध श्रृंखला देखने लायक है।',
        descriptionEn: 'The diverse range of shops in this market in the heart of Bangalore is a sight to behold.',
        image: commercialStreetImg, // ✅ Fixed: Using imported image
        href: '/markets/commercial_street',
        rating: 4.4,
        reviews: 1987,
        vendors: 250,
        established: '1884',
        specialties: ['इलेक्ट्रॉनिक्स', 'बुक्स', 'कपड़े', 'टेक गैजेट्स'],
        categories: ['modern', 'textiles'],
        openingHours: '10:00 - 21:00',
        popularItems: ['टेक एक्सेसरीज', 'कर्नाटक हैंडलूम', 'कॉफी'],
        avgPrice: '₹200-₹15000',
        bestTime: 'पूरे साल',
        nearbyAttractions: ['विधान सौध', 'कब्बन पार्क', 'यूबी सिटी मॉल'],
        languages: ['कन्नड़', 'हिंदी', 'अंग्रेजी'],
        facilities: ['मेट्रो कनेक्टिविटी', 'फूड कोर्ट', 'ATM', 'पार्किंग']
      },
      {
        id: 'dilli_haat',
        name: 'Dilli Haat',
        nameHindi: 'दिल्ली हाट',
        city: 'Delhi',
        cityHindi: 'दिल्ली',
        state: 'delhi',
        description: 'एक खुला बाजार जो पूरे भारत की हस्तशिल्प और भोजन परंपराओं को एक स्थान पर प्रस्तुत करता है।',
        descriptionEn: 'An open-air market showcasing handicrafts and food traditions from across India in one place.',
        image: dilliHaatImg, // ✅ Fixed: Using imported image
        href: '/markets/dilli_haat',
        rating: 4.7,
        reviews: 3421,
        vendors: 200,
        established: '1994',
        specialties: ['राज्यवार हैंडीक्राफ्ट्स', 'क्षेत्रीय भोजन', 'लाइव परफॉर्मेंस', 'कल्चरल इवेंट्स'],
        categories: ['traditional', 'handicrafts', 'heritage'],
        openingHours: '10:30 - 22:00',
        popularItems: ['हैंडलूम', 'पॉटरी', 'ऑर्गेनिक फूड', 'जनजातीय आर्ट'],
        avgPrice: '₹100-₹5000',
        bestTime: 'अक्टूबर-मार्च',
        nearbyAttractions: ['INA मार्केट', 'लोधी गार्डन', 'इंडिया गेट'],
        languages: ['हिंदी', 'अंग्रेजी', 'सभी भारतीय भाषाएं'],
        facilities: ['एंट्री फी', 'फूड कोर्ट', 'कल्चरल स्टेज', 'पार्किंग']
      }
    ];

    setMarkets(marketData);
  };

  // ... rest of your component remains the same ...
  const filterAndSortMarkets = () => {
    let filtered = markets.filter(market => {
      const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           market.nameHindi.includes(searchTerm) ||
                           market.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           market.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesState = selectedState === 'all' || market.state === selectedState;
      const matchesCategory = selectedCategory === 'all' || market.categories.includes(selectedCategory);
      
      return matchesSearch && matchesState && matchesCategory;
    });

    // Sort markets
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviews - a.reviews;
        case 'alphabetical': return a.name.localeCompare(b.name);
        case 'established': return parseInt(a.established) - parseInt(b.established);
        case 'popular':
        default: return (b.rating * b.reviews) - (a.rating * a.reviews);
      }
    });

    setFilteredMarkets(filtered);
  };

  if (loading) {
    return <LoadingSpinner message="भारत के प्रसिद्ध बाजार लोड हो रहे हैं..." />;
  }

  return (
    // ... rest of your JSX remains exactly the same ...
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20'>

        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          <div className='max-w-7xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 dark:from-gray-800 to-green-100 dark:to-gray-800 rounded-full px-6 py-3 mb-6 shadow-lg border border-emerald-200 dark:border-emerald-700'>
                <span className='text-2xl'>🏪</span>
                <span className='text-emerald-800 dark:text-emerald-200 font-bold'>भारतीय बाजार</span>
              </div>
              
              <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 pt-6 leading-tight'>
                भारत के प्रसिद्ध बाजार
              </h1>
              
              <p className='text-xl md:text-2xl text-emerald-700 dark:text-emerald-300 max-w-4xl mx-auto leading-relaxed font-medium mb-12'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें,<br/>
                प्रत्येक अपने अनूठे आइटम और अनुभव प्रदान करता है
              </p>

              {/* Quick Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto'>
                <div className='text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-700'>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{markets.length}</div>
                  <div className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>प्रसिद्ध बाजार</div>
                </div>
                <div className='text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-700'>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{markets.reduce((sum, market) => sum + market.vendors, 0)}</div>
                  <div className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>कुल विक्रेता</div>
                </div>
                <div className='text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-700'>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>6</div>
                  <div className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>राज्य</div>
                </div>
                <div className='text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200 dark:border-emerald-700'>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>4.7⭐</div>
                  <div className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>औसत रेटिंग</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className='max-w-7xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            
            {/* Search Bar */}
            <div className='mb-6'>
              <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="बाजार, शहर या उत्पाद खोजें..."
              />
            </div>

            {/* Filters */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
              
              {/* State Filter */}
              <div>
                <label className='block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2'>राज्य के अनुसार</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className='w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none bg-white dark:bg-gray-800'
                >
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className='block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2'>श्रेणी के अनुसार</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none bg-white dark:bg-gray-800'
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className='block text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2'>क्रमबद्ध करें</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='w-full px-4 py-3 border border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none bg-white dark:bg-gray-800'
                >
                  <option value="popular">लोकप्रियता</option>
                  <option value="rating">रेटिंग</option>
                  <option value="reviews">समीक्षाएं</option>
                  <option value="alphabetical">नाम (अ-ज्ञ)</option>
                  <option value="established">स्थापना वर्ष</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className='flex justify-between items-center'>
              <div className='text-emerald-600 dark:text-emerald-400 font-medium'>
                {filteredMarkets.length} बाजार मिले
              </div>
              <div className='flex bg-emerald-100 dark:bg-gray-800 rounded-lg p-1'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-gray-700'
                  }`}
                >
                  ⊞ ग्रिड
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-500 text-white' 
                      : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-gray-700'
                  }`}
                >
                  ☰ लिस्ट
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Markets Grid/List */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          {filteredMarkets.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' 
              : 'space-y-6'
            }>
              {filteredMarkets.map((market) => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  viewMode={viewMode}
                  onClick={() => navigate(market.href)}
                />
              ))}
            </div>
          ) : (
            /* No Results */
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2'>कोई बाजार नहीं मिला</h3>
              <p className='text-emerald-600 dark:text-emerald-400 mb-6'>कृपया अपना खोज शब्द या फ़िल्टर बदलें</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedState('all');
                  setSelectedCategory('all');
                }}
                className='bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300'
              >
                सभी फ़िल्टर साफ़ करें
              </button>
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div className='bg-gradient-to-r from-emerald-600 to-green-600 py-16'>
          <div className='max-w-7xl mx-auto px-6 text-center text-white'>
            <h3 className='text-3xl font-bold mb-4'>अपना पसंदीदा बाजार नहीं मिला?</h3>
            <p className='text-xl text-emerald-100 mb-8'>
              हमें बताएं और हम इसे जल्द ही जोड़ देंगे
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 dark:hover:bg-gray-700 dark:bg-emerald-900/30 transition-colors duration-300'>
                बाजार सुझाएं
              </button>
              <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white dark:bg-gray-800 hover:text-emerald-600 dark:text-emerald-400 transition-all duration-300'>
                संपर्क करें
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default Markets;