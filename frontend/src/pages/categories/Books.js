import React, { useState, useEffect } from 'react';
import '../../App.css';

import img from '../../images/categories/books.png'
import img1 from '../../images/markets/chandni.png';
import img2 from '../../images/markets/jaipur.png';
import img3 from '../../images/markets/laad.png';
import img4 from '../../images/markets/mysore.png';
import img5 from '../../images/markets/colaba.png';
import img6 from '../../images/markets/commercial.png';

const Books = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(timer);
  }, []);

  const bookGenres = [
    { id: 'all', name: 'सभी पुस्तकें', icon: '📚', gradient: 'from-emerald-500 to-green-500' },
    { id: 'literature', name: 'साहित्य', icon: '📖', gradient: 'from-purple-500 to-indigo-500' },
    { id: 'religious', name: 'धार्मिक', icon: '🕉️', gradient: 'from-orange-500 to-red-500' },
    { id: 'history', name: 'इतिहास', icon: '🏛️', gradient: 'from-amber-500 to-yellow-500' },
    { id: 'poetry', name: 'कविता', icon: '🌸', gradient: 'from-pink-500 to-rose-500' },
    { id: 'academic', name: 'शैक्षणिक', icon: '🎓', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'children', name: 'बाल साहित्य', icon: '🧸', gradient: 'from-green-500 to-teal-500' }
  ];

  const markets = [
    {
      id: 1,
      name: 'Chandni Chowk',
      city: 'Delhi',
      description: 'दिल्ली का यह ऐतिहासिक बाजार उर्दू साहित्य और धार्मिक पुस्तकों का केंद्र है। यहाँ पुरानी और दुर्लभ किताबों का अनूठा संग्रह मिलता है।',
      image: img1,
      href: '/markets/chandni_chowk',
      specialty: 'उर्दू साहित्य और धार्मिक ग्रंथ',
      rating: 4.8,
      vendors: 85,
      genres: ['literature', 'religious', 'history'],
      languages: ['हिंदी', 'उर्दू', 'अंग्रेजी'],
      established: '1650',
      specialBooks: 2500
    },
    {
      id: 2,
      name: 'Pink City Bazaars',
      city: 'Jaipur',
      description: 'राजस्थानी इतिहास और संस्कृति की पुस्तकों का खजाना। यहाँ राजपूत काल से लेकर आधुनिक साहित्य तक सब कुछ मिलता है।',
      image: img2,
      href: '/markets/pinkcity_bazaar',
      specialty: 'राजस्थानी इतिहास और लोक साहित्य',
      rating: 4.7,
      vendors: 120,
      genres: ['history', 'literature', 'poetry'],
      languages: ['हिंदी', 'राजस्थानी', 'अंग्रेजी'],
      established: '1727',
      specialBooks: 3200
    },
    {
      id: 3,
      name: 'Laad Bazaar',
      city: 'Hyderabad',
      description: 'निज़ामी संस्कृति का साहित्यिक केंद्र। दक्खिनी उर्दू और हैदराबादी इतिहास की पुस्तकों का विशेष संग्रह यहाँ उपलब्ध है।',
      image: img3,
      href: '/markets/laad_bazaar',
      specialty: 'दक्खिनी उर्दू और निज़ामी इतिहास',
      rating: 4.6,
      vendors: 65,
      genres: ['literature', 'history', 'poetry'],
      languages: ['उर्दू', 'तेलुगु', 'हिंदी'],
      established: '1591',
      specialBooks: 1800
    },
    {
      id: 4,
      name: 'Devaraja Market',
      city: 'Mysore',
      description: 'कन्नड़ साहित्य और दक्षिण भारतीय संस्कृति की पुस्तकों का मुख्य केंद्र। यहाँ शास्त्रीय संगीत और नृत्य की पुस्तकें भी मिलती हैं।',
      image: img4,
      href: '/markets/devaraja_market',
      specialty: 'कन्नड़ साहित्य और शास्त्रीय कलाएं',
      rating: 4.5,
      vendors: 75,
      genres: ['literature', 'academic', 'religious'],
      languages: ['कन्नड़', 'संस्कृत', 'अंग्रेजी'],
      established: '1905',
      specialBooks: 2100
    },
    {
      id: 5,
      name: 'Colaba Causeway',
      city: 'Mumbai',
      description: 'आधुनिक साहित्य और अंतर्राष्ट्रीय पुस्तकों का हब। यहाँ नवीनतम प्रकाशन और बेस्टसेलर पुस्तकें आसानी से मिल जाती हैं।',
      image: img5,
      href: '/markets/colaba_causeway',
      specialty: 'समकालीन साहित्य और अंतर्राष्ट्रीय पुस्तकें',
      rating: 4.4,
      vendors: 95,
      genres: ['literature', 'academic', 'children'],
      languages: ['अंग्रेजी', 'हिंदी', 'मराठी'],
      established: '1838',
      specialBooks: 4500
    },
    {
      id: 6,
      name: 'Commercial Street',
      city: 'Bengaluru',
      description: 'टेक्नोलॉजी और साइंस की पुस्तकों के साथ-साथ बाल साहित्य का बेहतरीन संग्रह। स्टूडेंट्स के लिए यह एक आदर्श स्थान है।',
      image: img6,
      href: '/markets/commercial_street',
      specialty: 'तकनीकी पुस्तकें और बाल साहित्य',
      rating: 4.3,
      vendors: 110,
      genres: ['academic', 'children', 'literature'],
      languages: ['अंग्रेजी', 'कन्नड़', 'हिंदी'],
      established: '1884',
      specialBooks: 3800
    }
  ];

  const filteredMarkets = markets.filter(market => {
    const matchesGenre = selectedGenre === 'all' || market.genres.includes(selectedGenre);
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-emerald-200 dark:border-emerald-700 rounded-full animate-spin border-t-emerald-600 mx-auto"></div>
            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent rounded-full animate-ping border-t-emerald-400 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-3xl animate-bounce">📚</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">पुस्तक संग्रह व्यवस्थित हो रहा है...</h2>
          <p className="text-emerald-600 dark:text-emerald-400">ज्ञान के भंडार का इंतज़ार करें</p>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 via-green-50 dark:via-gray-900 to-emerald-100 dark:to-gray-800 pt-20'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden'>
          {/* Floating Books Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float">📖</div>
            <div className="absolute top-40 right-20 text-3xl opacity-15 animate-float delay-1000">📚</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-float delay-2000">📜</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-25 animate-float delay-3000">✍️</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 dark:from-blue-900/30 to-indigo-100 dark:to-indigo-900/30 rounded-full px-6 py-3 mb-6 shadow-lg border border-blue-200 dark:border-blue-700'>
                <span className='text-2xl'>📚</span>
                <span className='text-blue-800 dark:text-blue-200 font-bold'>ज्ञान का भंडार</span>
              </div>
              
              <h1 className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                पुस्तक संसार
              </h1>
              
              <div className='relative flex justify-center mb-8'>
                <div className='relative group'>
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500'></div>
                  <img 
                    src={img} 
                    className='relative h-64 md:h-80 object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500'
                    alt='पुस्तक संग्रह'
                  />
                </div>
              </div>
              
              <p className='text-xl md:text-2xl text-emerald-700 dark:text-emerald-300 max-w-4xl mx-auto leading-relaxed font-medium'>
                भारत के सबसे प्रसिद्ध स्थानीय बाजारों में घूमें और विभिन्न विषयों की<br/>
                पुस्तकों का अनूठा संग्रह खोजें। हर पन्ना एक नई दुनिया का द्वार है।
              </p>

              {/* Reading Stats */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-12'>
                <div className='text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4'>
                  <div className='text-3xl mb-2'>📖</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{markets.reduce((sum, market) => sum + market.specialBooks, 0).toLocaleString()}</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>दुर्लभ पुस्तकें</div>
                </div>
                <div className='text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4'>
                  <div className='text-3xl mb-2'>🌐</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>12</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>भाषाएं</div>
                </div>
                <div className='text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4'>
                  <div className='text-3xl mb-2'>👨‍🏫</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{markets.reduce((sum, market) => sum + market.vendors, 0)}</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>पुस्तक विक्रेता</div>
                </div>
                <div className='text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4'>
                  <div className='text-3xl mb-2'>⭐</div>
                  <div className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>4.6</div>
                  <div className='text-sm text-emerald-600 dark:text-emerald-400 font-medium'>औसत रेटिंग</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className='max-w-6xl mx-auto px-6 mb-12'>
          <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg'>
            
            {/* Search Bar */}
            <div className='mb-6'>
              <div className='relative max-w-md mx-auto'>
                <input
                  type="text"
                  placeholder="पुस्तक, लेखक या विषय खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 pl-12 pr-12 rounded-full border-2 border-emerald-200 dark:border-emerald-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-colors duration-300 bg-white dark:bg-gray-800"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 dark:text-emerald-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <h3 className='text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-4 text-center'>पुस्तक श्रेणियां</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3'>
                {bookGenres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`group flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? `bg-gradient-to-br ${genre.gradient} text-white shadow-lg scale-105`
                        : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-700 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 hover:border-emerald-300'
                    }`}
                  >
                    <span className='text-xl'>{genre.icon}</span>
                    <span className='font-medium text-xs text-center leading-tight'>{genre.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className='max-w-7xl mx-auto px-6 pb-20'>
          {filteredMarkets.length === 0 ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>📚</div>
              <h3 className='text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2'>कोई पुस्तक नहीं मिली</h3>
              <p className='text-emerald-600 dark:text-emerald-400'>कृपया अपना खोज शब्द या श्रेणी बदलें</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {filteredMarkets.map((market) => (
                <a 
                  key={market.id}
                  href={market.href} 
                  className='group block'
                  onMouseEnter={() => setHoveredCard(market.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    hoveredCard === market.id ? 'scale-[1.02]' : ''
                  }`}>
                    
                    {/* Image Section */}
                    <div className='relative h-64 overflow-hidden'>
                      <img 
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          hoveredCard === market.id ? 'scale-110' : 'scale-100'
                        }`} 
                        src={market.image} 
                        alt={market.name}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
                        hoveredCard === market.id ? 'opacity-70' : 'opacity-50'
                      }`}></div>
                      
                      {/* Rating Badge */}
                      <div className='absolute top-4 left-4'>
                        <div className='bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full px-4 py-2 flex items-center space-x-2'>
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className='text-sm font-bold text-white'>{market.rating}</span>
                        </div>
                      </div>

                      {/* Book Count */}
                      <div className='absolute top-4 right-4'>
                        <div className='bg-emerald-500/90 backdrop-blur-sm rounded-full px-3 py-1'>
                          <span className='text-white text-xs font-medium'>{market.specialBooks.toLocaleString()} पुस्तकें</span>
                        </div>
                      </div>

                      {/* Established Year */}
                      <div className='absolute bottom-4 left-4'>
                        <div className='bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1'>
                          <span className='text-emerald-600 dark:text-emerald-400 text-sm font-medium'>स्थापना {market.established}</span>
                        </div>
                      </div>

                      {/* Vendor Count */}
                      <div className='absolute bottom-4 right-4'>
                        <div className='bg-purple-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1'>
                          <span className='text-white text-xs'>👨‍💼</span>
                          <span className='text-white text-xs font-medium'>{market.vendors}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className='p-8'>
                      <div className='flex items-start justify-between mb-4'>
                        <div>
                          <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors duration-300'>
                            {market.name}
                          </h2>
                          <div className='flex items-center space-x-2 text-emerald-600 dark:text-emerald-400'>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            <span className='font-medium'>{market.city}</span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
                          hoveredCard === market.id ? 'rotate-12 scale-110' : ''
                        }`}>
                          <span className='text-white text-xl'>📚</span>
                        </div>
                      </div>

                      <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-6'>
                        {market.description}
                      </p>

                      {/* Specialty & Languages */}
                      <div className='space-y-3 mb-6'>
                        <div className='inline-flex items-center bg-emerald-50 dark:bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-200 dark:border-emerald-700'>
                          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <span className='text-emerald-700 dark:text-emerald-300 text-sm font-medium'>{market.specialty}</span>
                        </div>
                        
                        {/* Languages */}
                        <div className='flex flex-wrap gap-2'>
                          {market.languages.map((language) => (
                            <span key={language} className='inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200 dark:border-blue-700'>
                              <span className='mr-1'>🌐</span>
                              {language}
                            </span>
                          ))}
                        </div>

                        {/* Genres */}
                        <div className='flex flex-wrap gap-2'>
                          {market.genres.map((genreId) => {
                            const genreInfo = bookGenres.find(g => g.id === genreId);
                            return (
                              <span key={genreId} className={`inline-flex items-center space-x-1 bg-gradient-to-r ${genreInfo?.gradient} text-white px-3 py-1 rounded-full text-xs`}>
                                <span>{genreInfo?.icon}</span>
                                <span>{genreInfo?.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className={`flex items-center justify-between transition-all duration-300 ${
                        hoveredCard === market.id ? 'transform translate-x-2' : ''
                      }`}>
                        <span className='text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:text-emerald-300'>
                          पुस्तकें देखें
                        </span>
                        <div className='flex items-center space-x-1'>
                          <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></div>
                          <div className='w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-75'></div>
                          <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Bottom CTA Section */}
          <div className='mt-20 text-center'>
            <div className='bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden'>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
              <div className="relative z-10">
                <h3 className='text-3xl font-bold mb-4'>अपनी अगली पसंदीदा पुस्तक खोजें</h3>
                <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
                  विशेषज्ञों से सिफारिश लें और अपनी रुचि के अनुसार सही पुस्तक चुनें
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                  <button className='bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 dark:bg-blue-900/20 transition-colors duration-300 transform hover:scale-105 shadow-lg'>
                    बुक रिकमेंडेशन लें
                  </button>
                  <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white dark:bg-gray-800 hover:text-blue-600 dark:text-blue-400 transition-all duration-300 transform hover:scale-105'>
                    रीडिंग क्लब ज्वाइन करें
                  </button>
                </div>
                <div className='mt-8 text-blue-200 text-sm flex items-center justify-center space-x-6'>
                  <span className='flex items-center space-x-2'>
                    <span>📚</span>
                    <span>फ्री होम डिलीवरी</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>🔄</span>
                    <span>15 दिन रिटर्न पॉलिसी</span>
                  </span>
                  <span className='flex items-center space-x-2'>
                    <span>✨</span>
                    <span>ऑथेंटिक एडिशन गारंटी</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(5deg); }
          66% { transform: translateY(5px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Books;