// Return Policy Component - Bharatshala Platform
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../utils/analytics';

const ReturnPolicy = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('return_policy');
  }, []);

  const returnConditions = [
    {
      category: 'वापसी की शर्तें',
      items: [
        'उत्पाद को मूल पैकेजिंग में होना चाहिए',
        'टैग्स और लेबल्स अपनी जगह पर होने चाहिए',
        'उत्पाद का इस्तेमाल नहीं होना चाहिए',
        'खरीदारी की रसीद या इनवॉइस आवश्यक है'
      ]
    },
    {
      category: 'वापसी की समय सीमा',
      items: [
        'डिलीवरी के 7 दिन के भीतर रिटर्न रिक्वेस्ट',
        'फैशन आइटम्स: 15 दिन की अवधि',
        'ज्वेलरी: 3 दिन की अवधि',
        'कस्टमाइज़्ड प्रोडक्ट्स: वापसी नहीं'
      ]
    }
  ];

  const nonReturnableItems = [
    'पर्सनलाइज़्ड या कस्टमाइज़्ड आइटम्स',
    'अंडरगार्मेंट्स और इंटिमेट वियर',
    'फूड आइटम्स और खुशबू वाले प्रोडक्ट्स',
    'डिजिटल डाउनलोड्स और गिफ्ट कार्ड्स',
    'इस्तेमाल किए गए कॉस्मेटिक्स',
    'सेल या क्लियरेंस आइटम्स (जब तक स्पष्ट रूप से न बताया गया हो)'
  ];

  const refundProcess = [
    {
      step: 'रिटर्न रिक्वेस्ट',
      description: 'माई अकाउंट में जाकर रिटर्न रिक्वेस्ट करें',
      time: '2 मिनट'
    },
    {
      step: 'पिकअप शेड्यूल',
      description: 'हम आपके घर से प्रोडक्ट पिकअप करेंगे',
      time: '1-2 दिन'
    },
    {
      step: 'क्वालिटी चेक',
      description: 'हमारी टीम प्रोडक्ट की जांच करेगी',
      time: '2-3 दिन'
    },
    {
      step: 'रिफंड प्रोसेसिंग',
      description: 'अप्रूवल के बाद रिफंड प्रोसेस होगा',
      time: '3-5 दिन'
    }
  ];

  const exchangePolicy = [
    'साइज़ एक्सचेंज: डिलीवरी के 7 दिन के भीतर',
    'कलर एक्सचेंज: स्टॉक की उपलब्धता के अनुसार',
    'एक्सचेंज शिपिंग चार्ज ग्राहक द्वारा वहन किया जाएगा',
    'प्राइस डिफरेंस पे करना होगा अगर नया आइटम महंगा है'
  ];

  return (
    <>
      <Helmet>
        <title>रिटर्न पॉलिसी - भारतशाला | Return & Exchange Policy</title>
        <meta name="description" content="भारतशाला की रिटर्न और एक्सचेंज पॉलिसी। जानें कि आप कैसे अपने ऑर्डर को वापस कर सकते हैं या एक्सचेंज कर सकते हैं।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshala.com/return-policy" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">रिटर्न और एक्सचेंज पॉलिसी</h1>
              <p className="text-xl opacity-90">
                आसान रिटर्न और एक्सचेंज प्रक्रिया
              </p>
              <p className="text-sm opacity-75 mt-4">
                अंतिम अपडेट: 6 अगस्त, 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-lg text-gray-700 leading-relaxed">
                  भारतशाला में हमारा लक्ष्य है कि आप अपनी खरीदारी से पूर्णतः संतुष्ट हों। 
                  यदि किसी कारण से आप अपनी खरीदारी से खुश नहीं हैं, तो हमारी सरल रिटर्न 
                  और एक्सचेंज पॉलिसी आपकी सहायता करेगी।
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">रिटर्न की शर्तें</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {returnConditions.map((condition, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{condition.category}</h3>
                    <ul className="space-y-3">
                      {condition.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <span className="text-orange-600 text-lg">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">रिटर्न प्रक्रिया</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {refundProcess.map((process, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{process.step}</h3>
                    <p className="text-gray-600 text-sm mb-2">{process.description}</p>
                    <p className="text-orange-600 font-medium text-sm">{process.time}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Non-Returnable Items */}
        <section className="py-12 bg-red-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">वापसी योग्य नहीं आइटम्स</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {nonReturnableItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-red-600 text-lg">✗</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Exchange Policy */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-orange-50 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">एक्सचेंज पॉलिसी</h2>
                <ul className="space-y-3">
                  {exchangePolicy.map((policy, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-orange-600 text-lg">↔</span>
                      <span className="text-gray-700">{policy}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">सहायता चाहिए?</h2>
                <p className="text-gray-700 mb-6">
                  रिटर्न या एक्सचेंज के बारे में कोई सवाल है? हमारी टीम आपकी मदद के लिए तैयार है।
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a
                    href="mailto:returns@bharatshala.com"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    ईमेल करें
                  </a>
                  <a
                    href="tel:+91-XXXX-XXXXXX"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    कॉल करें
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ReturnPolicy;