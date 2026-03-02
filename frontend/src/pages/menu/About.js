// About Page for Bharatshaala Platform
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../../utils/analytics';
import { motion } from 'framer-motion';

const About = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  useEffect(() => {
    trackPageView('about');
  }, [trackPageView]);

  const stats = [
    { number: '50,000+', label: 'संतुष्ट ग्राहक', icon: '👥' },
    { number: '5,000+', label: 'कारीगर और विक्रेता', icon: '🛍️' },
    { number: '1,00,000+', label: 'हस्तनिर्मित उत्पाद', icon: '🎨' },
    { number: '28', label: 'राज्यों में सेवा', icon: '🗺️' }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'स्थापना',
      description: 'भारतीय हस्तशिल्प को डिजिटल प्लेटफॉर्म पर लाने का सपना'
    },
    {
      year: '2021',
      title: 'पहले 1000 कारीगर',
      description: 'देश भर के प्रतिभाशाली कारीगरों का जुड़ाव'
    },
    {
      year: '2022',
      title: 'राष्ट्रीय विस्तार',
      description: '15 राज्यों में सेवा का विस्तार'
    },
    {
      year: '2023',
      title: 'अंतर्राष्ट्रीय पहुंच',
      description: 'वैश्विक बाज़ार में भारतीय कला का प्रवेश'
    },
    {
      year: '2024',
      title: 'एक लाख उत्पाद',
      description: 'प्लेटफॉर्म पर एक लाख से अधिक हस्तनिर्मित उत्पाद'
    },
    {
      year: '2025',
      title: 'AI और इनोवेशन',
      description: 'कृत्रिम बुद्धिमत्ता के साथ बेहतर खरीदारी अनुभव'
    }
  ];

  const teamMembers = [
    {
      name: 'साग्निक चक्रवर्ती',
      role: 'संस्थापक और CEO',
      image: '/images/team/me.png',
      bio: 'तकनीकी नेतृत्व और उत्पाद विकास के विशेषज्ञ'
    }
  ];

  const values = [
    {
      title: 'प्रामाणिकता',
      description: 'हर उत्पाद की गुणवत्ता और मूलता की गारंटी',
      icon: '✨'
    },
    {
      title: 'न्यायसंगत व्यापार',
      description: 'कारीगरों को उचित मूल्य और सम्मान',
      icon: '⚖️'
    },
    {
      title: 'सांस्कृतिक संरक्षण',
      description: 'पारंपरिक कलाओं का संरक्षण और प्रोत्साहन',
      icon: '🏛️'
    },
    {
      title: 'नवाचार',
      description: 'तकनीक के साथ परंपरा का संयोजन',
      icon: '🚀'
    }
  ];

  const handleContactClick = () => {
    trackEvent('about_contact_clicked');
  };

  return (
    <>
      <Helmet>
        <title>हमारे बारे में - भारतशाला | भारतीय हस्तशिल्प का डिजिटल घर</title>
        <meta name="description" content="भारतशाला के बारे में जानें - भारत की सबसे बड़ी हस्तशिल्प मार्केटप्लेस जो कारीगरों और ग्राहकों को जोड़ती है।" />
        <meta name="keywords" content="भारतशाला, हस्तशिल्प, कारीगर, भारतीय कला, हैंडमेड" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 to-orange-50 dark:to-gray-800">

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-orange-500 text-white py-20 pt-32">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                भारतशाला की कहानी
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed text-white">
                जहाँ हर हाथ से बना उत्पाद एक कहानी कहता है और हर कारीगर का सपना पूरा होता है
              </p>
              <div className="mt-8 text-6xl">🎨</div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-4xl opacity-30 animate-bounce">🪔</div>
          <div className="absolute bottom-10 right-10 text-4xl opacity-30 animate-pulse">🏺</div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-200 mb-8">
                हमारा लक्ष्य
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
                भारतशाला का लक्ष्य भारत की समृद्ध सांस्कृतिक विरासत को डिजिटल युग में संजोना है।
                हम कारीगरों को सीधे ग्राहकों से जोड़कर उन्हें उचित मूल्य दिलाते हैं और पारंपरिक
                कलाओं को नई पीढ़ी तक पहुंचाते हैं।
              </p>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200 mb-4">विज़न</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    भारतीय हस्तशिल्प को वैश्विक मंच पर स्थापित करना और
                    कारीगरों की आर्थिक स्थिति में सुधार लाना।
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">💫</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">मिशन</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    प्रामाणिक हस्तनिर्मित उत्पादों के माध्यम से ग्राहकों को
                    भारतीय संस्कृति से जोड़ना और कारीगरों को सशक्त बनाना।
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-500 to-orange-500 text-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">हमारी उपलब्धियां</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-16">हमारी यात्रा</h2>
            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>

                  <div className="w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex-shrink-0 z-10">
                  </div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-emerald-50 dark:bg-emerald-900/30">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-16">हमारे मूल्य</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-5xl mb-6">{value.icon}</div>
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-16">हमारी टीम</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-24 h-24 mx-auto mb-6 overflow-hidden rounded-full border-4 border-gradient-to-r from-emerald-400 to-orange-400">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback icon (hidden by default) */}
                    <div
                      className="w-full h-full bg-gradient-to-r from-emerald-400 to-orange-400 rounded-full flex items-center justify-center"
                      style={{ display: 'none' }}
                    >
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">{member.name}</h3>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-gradient-to-r from-orange-400 to-emerald-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">हमारा प्रभाव</h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed mb-12">
                भारतशाला के माध्यम से हजारों कारीगरों की आर्थिक स्थिति में सुधार हुआ है।
                हमने न केवल उन्हें नए बाज़ार तक पहुंच दिलाई है, बल्कि उनकी पारंपरिक कलाओं
                को भी संरक्षित करने में मदद की है।
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">आय में वृद्धि</h3>
                  <p>कारीगरों की औसत आय में 150% तक की वृद्धि</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold mb-2">कौशल विकास</h3>
                  <p>1000+ कारीगरों को डिजिटल मार्केटिंग की ट्रेनिंग</p>
                </div>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="text-3xl mb-4">🌍</div>
                  <h3 className="text-xl font-semibold mb-2">वैश्विक पहुंच</h3>
                  <p>20+ देशों में भारतीय हस्तशिल्प की बिक्री</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-8">
                हमारे साथ जुड़ें
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-12">
                चाहे आप एक कारीगर हों जो अपनी कला को दुनिया के सामने लाना चाहते हैं,
                या एक ग्राहक हों जो प्रामाणिक हस्तनिर्मित उत्पाद खरीदना चाहते हैं -
                भारतशाला आपका स्वागत करता है।
              </p>

              <div className="flex flex-col md:flex-row gap-6 justify-center">
                <button
                  onClick={handleContactClick}
                  className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-emerald-600 transition-colors duration-200 text-lg"
                >
                  विक्रेता बनें
                </button>
                <button
                  onClick={handleContactClick}
                  className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all duration-200 text-lg"
                >
                  संपर्क करें
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-emerald-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-4">नवीनतम अपडेट प्राप्त करें</h3>
            <p className="mb-8">हमारी यात्रा का हिस्सा बनें और नई कलाओं की खोज करें</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="आपका ईमेल पता"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 dark:text-gray-100 dark:bg-gray-700"
              />
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                सब्स्क्राइब करें
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
