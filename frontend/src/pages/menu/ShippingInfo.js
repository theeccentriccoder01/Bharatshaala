// Shipping Info Component - Bharatshaala Platform
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';

const ShippingInfo = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('shipping_info');
  }, []);

  const shippingOptions = [
    {
      type: 'स्टैंडर्ड शिपिंग',
      time: '5-7 कार्य दिवस',
      cost: '₹99 (₹999+ ऑर्डर पर फ्री)',
      description: 'सभी भारतीय शहरों में उपलब्ध'
    },
    {
      type: 'एक्सप्रेस शिपिंग',
      time: '2-3 कार्य दिवस',
      cost: '₹199',
      description: 'मेट्रो सिटीज में उपलब्ध'
    },
    {
      type: 'सेम डे डिलीवरी',
      time: 'उसी दिन',
      cost: '₹299',
      description: 'चुनिंदा शहरों में, शाम 3 बजे तक का ऑर्डर'
    }
  ];

  const deliveryProcess = [
    {
      step: 'ऑर्डर कन्फर्मेशन',
      description: 'पेमेंट के बाद ऑर्डर प्रोसेसिंग शुरू',
      time: '2-4 घंटे'
    },
    {
      step: 'पैकेजिंग',
      description: 'सुरक्षित पैकेजिंग और क्वालिटी चेक',
      time: '1-2 दिन'
    },
    {
      step: 'शिपमेंट',
      description: 'कूरियर पार्टनर को हैंडओवर',
      time: '1 दिन'
    },
    {
      step: 'ट्रांजिट',
      description: 'आपके एड्रेस तक की यात्रा',
      time: '2-5 दिन'
    },
    {
      step: 'डिलीवरी',
      description: 'आपके दरवाजे तक डिलीवरी',
      time: '-'
    }
  ];

  const courierPartners = [
    { name: 'BlueDart', coverage: 'पैन इंडिया', specialty: 'एक्सप्रेस डिलीवरी' },
    { name: 'DTDC', coverage: 'सभी शहर और गांव', specialty: 'रीच' },
    { name: 'Delhivery', coverage: 'मेट्रो और टियर 2 सिटीज', specialty: 'ट्रैकिंग' },
    { name: 'India Post', coverage: 'दूरदराज के इलाके', specialty: 'सरकारी विश्वसनीयता' }
  ];

  const trackingSteps = [
    'ऑर्डर कन्फर्म - आपका ऑर्डर स्वीकार कर लिया गया',
    'प्रोसेसिंग - आइटम तैयार किया जा रहा है',
    'शिप्ड - पैकेज कूरियर को दे दिया गया',
    'इन ट्रांजिट - आपके शहर की तरफ जा रहा है',
    'आउट फॉर डिलीवरी - डिलीवरी बॉय के पास',
    'डिलीवर्ड - सफलतापूर्वक डिलीवर हो गया'
  ];

  const specialHandling = [
    {
      category: 'फ्रैजाइल आइटम्स',
      handling: 'एक्स्ट्रा बबल रैप और हार्ड पैकेजिंग',
      items: 'ज्वेलरी, ग्लास आइटम्स, सेरामिक्स'
    },
    {
      category: 'हैवी आइटम्स',
      handling: 'स्पेशल लॉजिस्टिक्स और टू-मैन डिलीवरी',
      items: 'फर्नीचर, बड़े डेकोरेटिव पीसेस'
    },
    {
      category: 'प्रीमियम आइटम्स',
      handling: 'सिक्योर पैकेजिंग और इंश्योर्ड शिपिंग',
      items: 'एक्सपेंसिव ज्वेलरी, आर्ट पीसेस'
    }
  ];

  return (
    <>
      <Helmet>
        <title>शिपिंग जानकारी - भारतशाला | Shipping & Delivery Info</title>
        <meta name="description" content="भारतशाला की शिपिंग और डिलीवरी जानकारी। जानें डिलीवरी के विकल्प, समय और शुल्क के बारे में।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshaala.com/shipping-info" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">शिपिंग और डिलीवरी</h1>
              <p className="text-xl opacity-90">
                तेज़ और सुरक्षित डिलीवरी सेवा
              </p>
            </motion.div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">डिलीवरी विकल्प</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {shippingOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-green-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{option.type}</h3>
                    <div className="text-3xl font-bold text-green-600 mb-2">{option.time}</div>
                    <div className="text-lg font-semibold text-gray-700 mb-3">{option.cost}</div>
                    <p className="text-gray-600 text-sm">{option.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Process */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">डिलीवरी प्रक्रिया</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {deliveryProcess.map((process, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{process.step}</h3>
                    <p className="text-gray-600 text-sm mb-2">{process.description}</p>
                    <p className="text-green-600 font-medium text-sm">{process.time}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tracking Info */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-green-50 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">ऑर्डर ट्रैकिंग</h2>
                <p className="text-gray-700 mb-6">
                  ऑर्डर कन्फर्मेशन के बाद आपको ट्रैकिंग नंबर मिलेगा। इन स्टेप्स से आप अपने ऑर्डर को ट्रैक कर सकते हैं:
                </p>
                <div className="space-y-3">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Courier Partners */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">हमारे कूरियर पार्टनर्स</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courierPartners.map((partner, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg p-6 text-center shadow-lg"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{partner.coverage}</p>
                    <p className="text-green-600 font-medium text-sm">{partner.specialty}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Special Handling */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">स्पेशल हैंडलिंग</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {specialHandling.map((handling, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-green-50 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{handling.category}</h3>
                    <p className="text-gray-700 mb-3">{handling.handling}</p>
                    <p className="text-green-600 font-medium text-sm">{handling.items}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-12 bg-green-600 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-4">डिलीवरी में समस्या?</h2>
                <p className="text-xl opacity-90 mb-6">
                  हमारी कस्टमर सपोर्ट टीम आपकी मदद के लिए 24/7 उपलब्ध है
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a
                    href="mailto:shipping@bharatshaala.com"
                    className="bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    ईमेल करें
                  </a>
                  <a
                    href="tel:+91-XXXX-XXXXXX"
                    className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-200"
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

export default ShippingInfo;