import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Carousel from '../components/Carousel';
import CategoryCard from '../components/CategoryCard';
import MarketCard from '../components/MarketCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

import car1 from '../images/markets/commercial';
import car2 from '../images/markets/jaipur.png';
import car3 from '../images/markets/laad.png';
import car4 from '../images/markets/mysore.png';
import car5 from '../images/markets/dilli_haat.png';

// Import market images for home page
import jaipurImg from '../images/markets/jaipur.png';
import chandniChowkImg from '../images/markets/chandni.png';
import laadBazaarImg from '../images/markets/laad.png';

import customer1 from "../images/avatars/customer1.jpg";
import customer2 from "../images/avatars/customer2.jpg";
import customer5 from "../images/avatars/customer5.jpg";

const images = [car1, car2, car3, car4, car5];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [popularMarkets, setPopularMarkets] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  
  // Intersection Observer for animations
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: categoriesRef, inView: categoriesInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: marketsRef, inView: marketsInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: statsRef, inView: statsInView } = useInView({ threshold: 0.1, triggerOnce: true });

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Simulate loading time for premium experience
    const timer = setTimeout(() => {
      setLoading(false);
      loadFeaturedData();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadFeaturedData = () => {
    // Enhanced category data with more interactivity
    setFeaturedCategories([
      { 
        id: 'clothing', 
        name: 'वस्त्र', 
        nameEn: 'Clothing', 
        icon: '👗', 
        gradient: 'from-pink-500 via-rose-400 to-pink-600', 
        count: '2500+ आइटम्स',
        description: 'पारंपरिक और आधुनिक वस्त्रों का संग्रह',
        hoverColor: 'hover:shadow-pink-500/50'
      },
      { 
        id: 'jewellery', 
        name: 'आभूषण', 
        nameEn: 'Jewellery', 
        icon: '💎', 
        gradient: 'from-yellow-400 via-amber-400 to-orange-500', 
        count: '1800+ आइटम्स',
        description: 'हस्तनिर्मित और पारंपरिक आभूषण',
        hoverColor: 'hover:shadow-yellow-500/50'
      },
      { 
        id: 'handicrafts', 
        name: 'हस्तशिल्प', 
        nameEn: 'Handicrafts', 
        icon: '🎨', 
        gradient: 'from-purple-500 via-violet-400 to-indigo-500', 
        count: '3200+ आइटम्स',
        description: 'कलाकारों द्वारा तैयार हस्तशिल्प',
        hoverColor: 'hover:shadow-purple-500/50'
      },
      { 
        id: 'books', 
        name: 'पुस्तकें', 
        nameEn: 'Books', 
        icon: '📚', 
        gradient: 'from-blue-500 via-cyan-400 to-teal-500', 
        count: '5000+ आइटम्स',
        description: 'ज्ञान और मनोरंजन की पुस्तकें',
        hoverColor: 'hover:shadow-blue-500/50'
      },
      { 
        id: 'accessories', 
        name: 'एक्सेसरीज़', 
        nameEn: 'Accessories', 
        icon: '👜', 
        gradient: 'from-emerald-500 via-green-400 to-teal-500', 
        count: '1200+ आइटम्स',
        description: 'फैशन और उपयोगी एक्सेसरीज़',
        hoverColor: 'hover:shadow-emerald-500/50'
      },
      { 
        id: 'houseware', 
        name: 'घरेलू सामान', 
        nameEn: 'Houseware', 
        icon: '🏠', 
        gradient: 'from-amber-500 via-orange-400 to-red-500', 
        count: '2800+ आइटम्स',
        description: 'घर की सजावट और उपयोगी वस्तुएं',
        hoverColor: 'hover:shadow-amber-500/50'
      }
    ]);

    // Enhanced market data
    setPopularMarkets([
      {
        id: 'pinkcity_bazaar',
        name: 'Pink City Bazaars',
        nameHindi: 'गुलाबी शहर बाजार',
        city: 'Jaipur',
        cityHindi: 'जयपुर',
        state: 'rajasthan',
        description: 'ये जीवंत बाजार गहने, कपड़े और हस्तशिल्प की विविधता का घर हैं।',
        image: jaipurImg,
        href: '/markets/pinkcity_bazaar',
        rating: 4.9,
        reviews: 3245,
        vendors: 220,
        established: '1727',
        specialties: ['जयपुरी आभूषण', 'ब्लॉक प्रिंट', 'नीली मिट्टी के बर्तन'],
        categories: ['traditional', 'heritage', 'handicrafts', 'jewelry'],
        openingHours: '10:00 - 20:00',
        avgPrice: '₹300-₹25000',
        bestTime: 'अक्टूबर-मार्च'
      },
      {
        id: 'chandni_chowk',
        name: 'Chandni Chowk',
        nameHindi: 'चांदनी चौक',
        city: 'Delhi',
        cityHindi: 'दिल्ली',
        state: 'delhi',
        description: 'भारत के सबसे पुराने और व्यस्त बाजारों में से एक, इसकी संकरी गलियों और भीड़भाड़ के माहौल की खोज करें।',
        image: chandniChowkImg,
        href: '/markets/chandni_chowk',
        rating: 4.8,
        reviews: 2847,
        vendors: 350,
        established: '1650',
        specialties: ['मसाले', 'चांदी के आभूषण', 'कपड़े'],
        categories: ['traditional', 'heritage', 'handicrafts', 'textiles'],
        openingHours: '10:00 - 21:00',
        avgPrice: '₹500-₹5000',
        bestTime: 'नवंबर-फरवरी'
      },
      {
        id: 'laad_bazaar',
        name: 'Laad Bazaar',
        nameHindi: 'लाड़ बाजार',
        city: 'Hyderabad',
        cityHindi: 'हैदराबाद',
        state: 'telangana',
        description: 'प्रतिष्ठित चार मीनार के सामने स्थित, यह बाजार चूड़ियों, मोतियों और पारंपरिक हैदराबादी आभूषण डिजाइन का शानदार संग्रह प्रस्तुत करता है।',
        image: laadBazaarImg,
        href: '/markets/laad_bazaar',
        rating: 4.7,
        reviews: 1876,
        vendors: 150,
        established: '1591',
        specialties: ['मोती', 'लाख की चूड़ियां', 'निज़ामी आभूषण'],
        categories: ['traditional', 'heritage', 'jewelry'],
        openingHours: '11:00 - 21:30',
        avgPrice: '₹200-₹50000',
        bestTime: 'नवंबर-फरवरी'
      }
    ]);
  };

  // Testimonials data - Note: avatar is now the image source
  const testimonials = [
    {
      name: "प्रिया शर्मा",
      location: "मुंबई",
      text: "भारतशाला से मुझे वास्तविक जयपुरी आभूषण मिले। गुणवत्ता अद्भुत है!",
      rating: 5,
      avatar: customer1
    },
    {
      name: "राहुल गुप्ता",
      location: "दिल्ली",
      text: "चांदनी चौक के मसाले घर बैठे मिल गए। बहुत खुश हूं!",
      rating: 5,
      avatar: customer5
    },
    {
      name: "सुमित्रा देवी",
      location: "कोलकाता",
      text: "हस्तशिल्प का संग्रह देखकर मन खुश हो गया। शानदार सेवा!",
      rating: 5,
      avatar: customer2
    }
  ];

  // Interactive stats with counter animation
  const stats = [
    { number: 500, suffix: '+', label: 'विश्वसनीय विक्रेता', icon: '🏪' },
    { number: 15000, suffix: '+', label: 'प्रामाणिक उत्पाद', icon: '✨' },
    { number: 50, suffix: '+', label: 'पारंपरिक बाजार', icon: '🏛️' },
    { number: 4.8, suffix: '⭐', label: 'ग्राहक रेटिंग', icon: '💝' }
  ];

  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));

  useEffect(() => {
    if (statsInView) {
      stats.forEach((stat, index) => {
        let current = 0;
        const increment = stat.number / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.number) {
            current = stat.number;
            clearInterval(timer);
          }
          setAnimatedStats(prev => {
            const newStats = [...prev];
            newStats[index] = current;
            return newStats;
          });
        }, 20);
      });
    }
  }, [statsInView]);

  if (loading) {
    return <LoadingSpinner message="भारतशाला लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className='min-h-screen overflow-x-hidden relative'>
        
        {/* Dynamic Multi-Layer Background */}
        <div className="fixed inset-0 z-0">
          {/* Primary animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 animate-gradient-shift"></div>
          
          {/* Secondary overlay with pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300/40 via-transparent to-green-400/40 animate-gradient-shift-reverse"></div>
          
          {/* Animated geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-green-400/40 to-emerald-600/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-gradient-to-tr from-emerald-500/35 to-green-400/35 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-tl from-green-300/30 to-emerald-500/30 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
          </div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50m-10 0a10 10 0 1 1 20 0a10 10 0 1 1-20 0'/%3E%3Cpath d='M25 25m-5 0a5 5 0 1 1 10 0a5 5 0 1 1-10 0'/%3E%3Cpath d='M75 75m-5 0a5 5 0 1 1 10 0a5 5 0 1 1-10 0'/%3E%3Cpath d='M25 75m-3 0a3 3 0 1 1 6 0a3 3 0 1 1-6 0'/%3E%3Cpath d='M75 25m-3 0a3 3 0 1 1 6 0a3 3 0 1 1-6 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Light rays effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white via-transparent to-transparent transform rotate-12 animate-pulse"></div>
            <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-white via-transparent to-transparent transform -rotate-12 animate-pulse animation-delay-1000"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-white via-transparent to-transparent transform rotate-6 animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        {/* Floating particles with better visibility */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            >
              <div className="w-3 h-3 bg-white/40 rounded-full blur-sm shadow-lg"></div>
            </div>
          ))}
        </div>

        {/* Hero Section */}
        <div ref={heroRef} className='relative overflow-hidden pt-20 min-h-screen flex items-center z-20'>
          {/* Dynamic Background with Parallax */}
          <div 
            className="absolute inset-0 opacity-15 transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
            }}
          >
            <div className="absolute top-10 left-10 text-8xl animate-bounce-slow">🏺</div>
            <div className="absolute top-20 right-20 text-6xl animate-bounce-slow delay-1000">📿</div>
            <div className="absolute bottom-20 left-20 text-9xl animate-bounce-slow delay-2000">🎨</div>
            <div className="absolute bottom-10 right-10 text-7xl animate-bounce-slow delay-3000">📚</div>
            <div className="absolute top-1/2 left-1/4 text-5xl animate-bounce-slow delay-4000">💎</div>
            <div className="absolute top-1/3 right-1/3 text-6xl animate-bounce-slow delay-5000">🛍️</div>
          </div>

          <div className={`max-w-7xl mx-auto px-6 py-20 relative z-10 transition-all duration-1000 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className='text-center mb-16'>
              {/* Animated Welcome Badge */}
              <div className='inline-flex items-center space-x-4 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 mb-8 shadow-2xl border-2 border-white/30 hover:shadow-white/20 transition-all duration-500 transform hover:scale-105'>
                <span className='text-4xl animate-pulse'>🙏</span>
                <span className='text-white font-bold text-xl drop-shadow-lg'>
                  स्वागत है भारतशाला में
                </span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  <div className="w-2 h-2 bg-white/80 rounded-full animate-ping delay-75"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-ping delay-150"></div>
                </div>
              </div>
              
              {/* Interactive Main Heading */}
              <h1 className='text-6xl md:text-8xl font-bold mb-8 leading-tight'>
                <span className='text-white drop-shadow-2xl bg-size-200 animate-text-glow'>
                  भारत की समृद्ध
                </span>
                <br />
                <span className='text-yellow-200 drop-shadow-2xl bg-size-200 animate-text-glow delay-500'>
                  विरासत का द्वार
                </span>
              </h1>
              
              {/* Animated Subtitle with Typewriter Effect */}
              <div className='text-2xl md:text-3xl text-white/90 max-w-5xl mx-auto leading-relaxed font-medium mb-12 h-20 drop-shadow-lg'>
                <div className="typewriter-container pt-6 pb-20">
                  <span className="typewriter-text">
                    भारत के जीवंत और विविधतापूर्ण स्थानीय बाजारों की खोज करें
                  </span>
                </div>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-6 justify-center items-center mb-20'>
                <a 
                  href='/markets' 
                  className='group relative bg-white/20 backdrop-blur-md text-white border-2 border-white/50 px-10 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-emerald-600 hover:shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-500 flex items-center space-x-3 overflow-hidden'
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">🏪 बाजार की यात्रा शुरू करें</span>
                  <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a 
                  href='/categories' 
                  className='group border-3 border-white/70 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-md transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 flex items-center space-x-3'
                >
                  <span>🎨 श्रेणियां देखें</span>
                  <div className="w-2 h-2 bg-white rounded-full group-hover:bg-yellow-200 transition-colors duration-300"></div>
                </a>
              </div>

              {/* Enhanced Trust Indicators with Animation */}
              <div ref={statsRef} className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto'>
                {stats.map((stat, index) => (
                  <div key={index} className={`text-center bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-white/20 transition-all duration-500 transform hover:scale-105 ${statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className='text-3xl font-bold text-white drop-shadow-lg'>
                      {Math.floor(animatedStats[index])}{stat.suffix}
                    </div>
                    <div className='text-white/80 text-sm font-medium'>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Action Elements */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-2xl border border-white/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel Section */}
        <div className='max-w-7xl mx-auto px-6 mb-20 relative z-20'>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
              विशेष प्रस्तुति
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
              भारत की रंगबिरंगी संस्कृति की झलक
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <Carousel images={images} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-3xl"></div>
          </div>
        </div>

        {/* Enhanced Categories Section */}
        <div ref={categoriesRef} className='max-w-7xl mx-auto px-6 mb-20 relative z-20'>
          <div className={`text-center mb-16 transition-all duration-1000 ${categoriesInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30">
              <span className="text-2xl">🛍️</span>
              <span className="text-white font-bold">लोकप्रिय श्रेणियां</span>
            </div>
            <h2 className='text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-6'>
              अनंत विविधता
            </h2>
            <p className='text-xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-md'>
              भारत की समृद्ध विरासत से प्रेरित विभिन्न उत्पाद श्रेणियों की खोज करें। 
              हर श्रेणी में छुपी है अनगिनत कहानियां और परंपराएं।
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredCategories.map((category, index) => (
              <div
                key={category.id}
                className={`group relative bg-gradient-to-br ${category.gradient} rounded-3xl p-8 shadow-2xl ${category.hoverColor} transform hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden ${categoriesInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
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
                    {category.count}
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
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Featured Markets Section */}
        <div ref={marketsRef} className='relative py-20 overflow-hidden z-20'>
          {/* Background with Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>

          <div className='max-w-7xl mx-auto px-6 relative z-10'>
            <div className={`text-center mb-16 transition-all duration-1000 ${marketsInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-6 border border-white/30">
                <span className="text-2xl">🏛️</span>
                <span className="text-white font-bold">प्रसिद्ध बाजार</span>
              </div>
              <h2 className='text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-6'>
                ऐतिहासिक बाजारों की यात्रा
              </h2>
              <p className='text-xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-md'>
                सदियों पुरानी परंपराओं से भरपूर भारत के सबसे प्रतिष्ठित बाजारों का दौरा करें। 
                हर बाजार में छुपी है अनगिनत कहानियां।
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
              {popularMarkets.map((market, index) => (
                <div
                  key={market.id}
                  className={`transform transition-all duration-1000 ${marketsInView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <MarketCard 
                    market={market} 
                    viewMode="grid"
                    onClick={() => window.location.href = market.href}
                  />
                </div>
              ))}
            </div>

            <div className='text-center mt-16'>
              <a 
                href='/markets' 
                className='group inline-flex items-center space-x-3 bg-white/20 backdrop-blur-md border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-emerald-600 hover:shadow-2xl hover:shadow-white/50 transform hover:scale-105 transition-all duration-500'
              >
                <span>सभी बाजार की खोज करें</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className='py-20 bg-white/10 backdrop-blur-md relative z-20'>
          <div className='max-w-6xl mx-auto px-6'>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
                ग्राहकों के अनुभव
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
                हमारे खुश ग्राहकों की कहानियां सुनें
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-white/20 backdrop-blur-lg shadow-2xl p-8 md:p-12 border border-white/30">
                <div className="flex items-center justify-center space-x-4 mb-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    />
                  ))}
                </div>

                <div className="text-center">
                  {/* Fixed avatar display */}
                  <div className="mb-6 flex justify-center">
                    <img 
                      src={testimonials[currentTestimonial].avatar} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-2xl"
                    />
                  </div>
                  <p className="text-2xl text-white mb-6 italic leading-relaxed drop-shadow-md">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl drop-shadow-md">⭐</span>
                    ))}
                  </div>
                  <h4 className="text-xl font-bold text-white drop-shadow-md">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-white/70">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Newsletter Section */}
        <div className='relative py-20 overflow-hidden z-20'>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/30 via-green-700/30 to-emerald-800/30"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>          
          <div className='max-w-5xl mx-auto text-center px-6 relative z-10'>
            <div className="mb-8">
              <div className="text-6xl mb-4">📬</div>
              <h3 className='text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg'>
                अपडेट्स का खजाना पाएं
              </h3>
              <p className='text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md'>
                नए उत्पादों, विशेष छूट, त्योहारी ऑफर्स और बाजार की ताजा खबरों के लिए 
                हमारे विशेष न्यूज़लेटर की सदस्यता लें
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8'>
              <input 
                type="email" 
                placeholder="आपका ईमेल पता डालें" 
                className="flex-1 px-6 py-4 rounded-full border-none focus:outline-none focus:ring-4 focus:ring-white/50 text-lg shadow-2xl bg-white/90 backdrop-blur-md"
              />
              <button className='bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2'>
                <span>सब्सक्राइब करें</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            <p className="text-white/80 text-sm drop-shadow-md">
              🔒 आपकी गोपनीयता हमारी प्राथमिकता है। स्पैम बिल्कुल नहीं!
            </p>
          </div>
        </div>

        {/* Enhanced Values Section */}
        <div className='py-20 bg-white/10 backdrop-blur-md relative z-20'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg pb-6 pt-6">
                हमारे मूल्य
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto drop-shadow-md">
                भारतशाला सिर्फ एक प्लेटफॉर्म नहीं, बल्कि भारतीय संस्कृति और परंपरा का संरक्षक है
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[
                {
                  icon: '🌿',
                  title: 'प्रामाणिकता की गारंटी',
                  description: 'हमारे सभी उत्पाद 100% प्रामाणिक हैं और कुशल कारीगरों द्वारा तैयार किए गए हैं',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: '🚚',
                  title: 'तेज़ और सुरक्षित डिलीवरी',
                  description: 'पूरे भारत में 48 घंटे के अंदर सुरक्षित पैकेजिंग के साथ डिलीवरी',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: '💯',
                  title: 'पूर्ण संतुष्टि गारंटी',
                  description: '30 दिन की मनी-बैक गारंटी और 24/7 कस्टमर सपोर्ट सेवा',
                  gradient: 'from-purple-500 to-pink-500'
                }
              ].map((value, index) => (
                <div key={index} className='group text-center bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30 overflow-hidden relative'>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className={`relative z-10 w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    <span className='text-white text-3xl'>{value.icon}</span>
                  </div>
                  
                  <h4 className='text-2xl font-bold text-white mb-4 group-hover:text-yellow-200 transition-colors duration-300 drop-shadow-md'>
                    {value.title}
                  </h4>
                  
                  <p className='text-white/80 leading-relaxed group-hover:text-white transition-colors duration-300'>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(10px) rotate(-3deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes gradient-shift-reverse {
          0% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1); }
          50% { text-shadow: 0 0 30px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5), 0 0 50px rgba(255,255,255,0.3); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-gradient-shift {
          background-size: 400% 400%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-gradient-shift-reverse {
          background-size: 400% 400%;
          animation: gradient-shift-reverse 20s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .bg-size-200 {
          background-size: 200% 200%;
        }
        
        .typewriter-container {
          height: 80px;
          overflow: hidden;
        }
        
        .typewriter-text {
          display: inline-block;
          animation: typewriter 4s steps(60) infinite;
        }
        
        @keyframes typewriter {
          0% { width: 0; }
          50% { width: 100%; }
          100% { width: 0; }
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </React.StrictMode>
  );
};

export default Home;