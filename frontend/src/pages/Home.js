import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import CategoryCard from '../components/CategoryCard';
import MarketCard from '../components/MarketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

import car1 from '../images/carousel/1.png';
import car2 from '../images/carousel/2.png';
import car3 from '../images/carousel/3.png';
import car4 from '../images/carousel/4.png';
import car5 from '../images/carousel/5.png';

const images = [car1, car2, car3, car4, car5];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [popularMarkets, setPopularMarkets] = useState([]);

  useEffect(() => {
    // Simulate loading time for premium experience
    const timer = setTimeout(() => {
      setLoading(false);
      loadFeaturedData();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const loadFeaturedData = () => {
    // Mock data - replace with API calls
    setFeaturedCategories([
      { id: 'clothing', name: 'वस्त्र', nameEn: 'Clothing', icon: '👗', gradient: 'from-pink-500 to-rose-500', count: '2500+ आइटम्स' },
      { id: 'jewellery', name: 'आभूषण', nameEn: 'Jewellery', icon: '💎', gradient: 'from-yellow-400 to-orange-500', count: '1800+ आइटम्स' },
      { id: 'handicrafts', name: 'हस्तशिल्प', nameEn: 'Handicrafts', icon: '🎨', gradient: 'from-purple-500 to-indigo-500', count: '3200+ आइटम्स' },
      { id: 'books', name: 'पुस्तकें', nameEn: 'Books', icon: '📚', gradient: 'from-blue-500 to-cyan-500', count: '5000+ आइटम्स' },
      { id: 'accessories', name: 'एक्सेसरीज़', nameEn: 'Accessories', icon: '👜', gradient: 'from-emerald-500 to-green-500', count: '1200+ आइटम्स' },
      { id: 'houseware', name: 'घरेलू सामान', nameEn: 'Houseware', icon: '🏠', gradient: 'from-amber-500 to-red-500', count: '2800+ आइटम्स' }
    ]);

    setPopularMarkets([
      { id: 'pinkcity', name: 'Pink City Bazaars', city: 'Jaipur', rating: 4.9, vendors: 220 },
      { id: 'chandni', name: 'Chandni Chowk', city: 'Delhi', rating: 4.8, vendors: 180 },
      { id: 'laad', name: 'Laad Bazaar', city: 'Hyderabad', rating: 4.7, vendors: 150 }
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="भारतशाला लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100'>
        
        {/* Hero Section */}
        <div className='relative overflow-hidden pt-20'>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🏺</div>
            <div className="absolute top-40 right-20 text-5xl opacity-15 animate-float delay-1000">📿</div>
            <div className="absolute bottom-40 left-20 text-7xl opacity-10 animate-float delay-2000">🎨</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-20 animate-float delay-3000">📚</div>
          </div>

          <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
            <div className='text-center mb-16'>
              {/* Welcome Badge */}
              <div className='inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full px-8 py-4 mb-8 shadow-lg border border-emerald-200'>
                <span className='text-3xl'>🙏</span>
                <span className='text-emerald-800 font-bold text-lg'>स्वागत है</span>
              </div>
              
              {/* Main Heading */}
              <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 bg-clip-text text-transparent mb-6 leading-tight'>
                भारतशाला में आपका स्वागत है
              </h1>
              
              {/* Subtitle */}
              <p className='text-xl md:text-2xl text-emerald-700 max-w-4xl mx-auto leading-relaxed font-medium mb-12'>
                भारत के जीवंत और विविधतापूर्ण स्थानीय बाजारों की खोज और अनुभव करने का<br/>
                आपका डिजिटल द्वार। परंपरा से आधुनिकता तक का सफर।
              </p>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
                <a 
                  href='/markets' 
                  className='bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2'
                >
                  <span>बाजार देखें</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a 
                  href='/categories' 
                  className='border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full font-semibold hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105'
                >
                  श्रेणियां खोजें
                </a>
              </div>

              {/* Trust Indicators */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto'>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>500+</div>
                  <div className='text-emerald-600 text-sm'>विश्वसनीय विक्रेता</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>15000+</div>
                  <div className='text-emerald-600 text-sm'>प्रामाणिक उत्पाद</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>50+</div>
                  <div className='text-emerald-600 text-sm'>पारंपरिक बाजार</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl font-bold text-emerald-600'>4.8⭐</div>
                  <div className='text-emerald-600 text-sm'>ग्राहक रेटिंग</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Section */}
        <div className='max-w-7xl mx-auto px-6 mb-20'>
          <Carousel images={images} />
        </div>

        {/* Categories Section */}
        <div className='max-w-7xl mx-auto px-6 mb-20'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-emerald-800 mb-4'>लोकप्रिय श्रेणियां</h2>
            <p className='text-xl text-emerald-600 max-w-2xl mx-auto'>
              भारत की समृद्ध विरासत से प्रेरित विभिन्न उत्पाद श्रेणियों की खोज करें
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Featured Markets Section */}
        <div className='bg-white/50 backdrop-blur-sm py-20'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='text-center mb-12'>
              <h2 className='text-4xl md:text-5xl font-bold text-emerald-800 mb-4'>प्रसिद्ध बाजार</h2>
              <p className='text-xl text-emerald-600 max-w-2xl mx-auto'>
                भारत के सबसे प्रतिष्ठित और ऐतिहासिक बाजारों का दौरा करें
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {popularMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>

            <div className='text-center mt-12'>
              <a 
                href='/markets' 
                className='inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-semibold text-lg'
              >
                <span>सभी बाजार देखें</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className='bg-gradient-to-r from-emerald-600 to-green-600 py-16'>
          <div className='max-w-4xl mx-auto text-center px-6'>
            <h3 className='text-3xl font-bold text-white mb-4'>नवीनतम अपडेट प्राप्त करें</h3>
            <p className='text-xl text-emerald-100 mb-8'>
              नए उत्पादों, विशेष छूट और बाजार की खबरों के लिए सब्सक्राइब करें
            </p>
            <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
              <input 
                type="email" 
                placeholder="आपका ईमेल पता" 
                className="flex-1 px-6 py-3 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className='bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300'>
                सब्सक्राइब करें
              </button>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='py-20'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl'>🌿</span>
                </div>
                <h4 className='text-xl font-bold text-emerald-800 mb-2'>प्रामाणिक उत्पाद</h4>
                <p className='text-emerald-600'>हमारे सभी उत्पाद 100% प्रामाणिक और सत्यापित हैं</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl'>🚚</span>
                </div>
                <h4 className='text-xl font-bold text-emerald-800 mb-2'>तेज़ डिलीवरी</h4>
                <p className='text-emerald-600'>पूरे भारत में सुरक्षित और तेज़ डिलीवरी सेवा</p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl'>💯</span>
                </div>
                <h4 className='text-xl font-bold text-emerald-800 mb-2'>संतुष्टि गारंटी</h4>
                <p className='text-emerald-600'>30 दिन की मनी-बैक गारंटी के साथ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Home;