// Terms of Service Component - Bharatshala Platform
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../utils/analytics';

const TermsOfService = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('terms_of_service');
  }, []);

  const sections = [
    {
      title: 'परिचय',
      content: [
        'भारतशाला ("हम", "हमारा", या "कंपनी") bharatshala.com वेबसाइट और संबंधित सेवाओं का संचालन करती है।',
        'इन नियमों और शर्तों ("शर्तें") में हमारी सेवा के उपयोग के नियम निर्धारित हैं।',
        'हमारी सेवा का उपयोग करके, आप इन शर्तों से सहमत होते हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवा का उपयोग न करें।'
      ]
    },
    {
      title: 'सेवा का उपयोग',
      content: [
        'आप केवल वैध उद्देश्यों के लिए हमारी सेवा का उपयोग कर सकते हैं।',
        'आप सेवा का उपयोग किसी भी अवैध गतिविधि या इन शर्तों के उल्लंघन के लिए नहीं कर सकते।',
        'हमारी सेवा का उपयोग करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए या आपके माता-पिता/अभिभावक की सहमति होनी चाहिए।',
        'आप अपने खाते की सुरक्षा के लिए जिम्मेदार हैं और अपने लॉगिन क्रेडेंशियल्स को गुप्त रखना होगा।'
      ]
    },
    {
      title: 'उत्पाद और मूल्य निर्धारण',
      content: [
        'वेबसाइट पर दिखाए गए सभी उत्पाद उपलब्धता के आधार पर हैं।',
        'हम बिना किसी पूर्व सूचना के उत्पादों की कीमतों में बदलाव का अधिकार रखते हैं।',
        'सभी कीमतें भारतीय रुपए में हैं और इसमें लागू कर शामिल हैं।',
        'हम उत्पादों की गुणवत्ता और वर्णन की सटीकता सुनिश्चित करने का प्रयास करते हैं, लेकिन कोई भी गारंटी नहीं देते।'
      ]
    },
    {
      title: 'ऑर्डर और भुगतान',
      content: [
        'ऑर्डर देकर आप उत्पाद खरीदने के लिए एक बाध्यकारी प्रस्ताव दे रहे हैं।',
        'हम किसी भी ऑर्डर को स्वीकार या अस्वीकार करने का अधिकार रखते हैं।',
        'भुगतान ऑर्डर के समय या डिलीवरी के समय (COD के लिए) किया जाना चाहिए।',
        'सभी भुगतान सुरक्षित गेटवे के माध्यम से प्रोसेस किए जाते हैं।'
      ]
    },
    {
      title: 'शिपिंग और डिलीवरी',
      content: [
        'हम केवल भारत के भीतर डिलीवरी करते हैं।',
        'डिलीवरी का समय स्थान और उत्पाद के आधार पर अलग-अलग हो सकता है।',
        'शिपिंग चार्ज ऑर्डर वैल्यू और डिलीवरी लोकेशन के आधार पर लागू होते हैं।',
        'हम डिलीवरी में देरी के लिए जिम्मेदार नहीं हैं यदि यह हमारे नियंत्रण से बाहर के कारकों से हो।'
      ]
    },
    {
      title: 'रिटर्न और रिफंड',
      content: [
        'हमारी रिटर्न पॉलिसी के अनुसार, आप निर्दिष्ट समय सीमा के भीतर उत्पाद वापस कर सकते हैं।',
        'रिटर्न के लिए उत्पाद मूल स्थिति में होना चाहिए।',
        'रिफंड मूल भुगतान विधि में 3-5 कार्य दिवसों में प्रोसेस किया जाएगा।',
        'कुछ उत्पाद रिटर्न के लिए योग्य नहीं हो सकते हैं।'
      ]
    },
    {
      title: 'बौद्धिक संपदा',
      content: [
        'वेबसाइट पर सभी सामग्री, लोगो, ट्रेडमार्क भारतशाला की संपत्ति हैं।',
        'आप बिना अनुमति के हमारी बौद्धिक संपदा का उपयोग नहीं कर सकते।',
        'उपयोगकर्ता द्वारा प्रदान की गई सामग्री के लिए उपयोगकर्ता जिम्मेदार है।',
        'हम तीसरे पक्ष के बौद्धिक संपदा अधिकारों का सम्मान करते हैं।'
      ]
    },
    {
      title: 'जिम्मेदारी की सीमा',
      content: [
        'हम सेवा में किसी भी रुकावट या त्रुटि के लिए जिम्मेदार नहीं हैं।',
        'हमारी जिम्मेदारी आपके द्वारा भुगतान की गई राशि तक सीमित है।',
        'हम अप्रत्यक्ष, आकस्मिक या परिणामी नुकसान के लिए जिम्मेदार नहीं हैं।',
        'यह सीमा कानून द्वारा अनुमतित अधिकतम सीमा तक लागू होती है।'
      ]
    },
    {
      title: 'शर्तों में संशोधन',
      content: [
        'हम किसी भी समय इन शर्तों को संशोधित करने का अधिकार रखते हैं।',
        'महत्वपूर्ण परिवर्तनों के बारे में हम आपको सूचित करेंगे।',
        'संशोधित शर्तों के प्रकाशन के बाद सेवा का निरंतर उपयोग स्वीकृति माना जाएगा।',
        'हम सुझाव देते हैं कि आप नियमित रूप से इन शर्तों की समीक्षा करें।'
      ]
    },
    {
      title: 'कानूनी क्षेत्राधिकार',
      content: [
        'ये शर्तें भारतीय कानून के अनुसार नियंत्रित होती हैं।',
        'कोई भी विवाद भारत के न्यायालयों के अधिकार क्षेत्र में आएगा।',
        'यदि इन शर्तों का कोई हिस्सा अमान्य है, तो बाकी शर्तें प्रभावी रहेंगी।',
        'ये शर्तें हमारे और आपके बीच संपूर्ण समझौते का प्रतिनिधित्व करती हैं।'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>नियम और शर्तें - भारतशाला | Terms of Service</title>
        <meta name="description" content="भारतशाला की नियम और शर्तें। हमारी सेवाओं के उपयोग के नियम और शर्तों को समझें।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshala.com/terms-of-service" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">नियम और शर्तें</h1>
              <p className="text-xl opacity-90">
                सेवा उपयोग के नियम और शर्तें
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
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  भारतशाला वेबसाइट में आपका स्वागत है। कृपया इन नियमों और शर्तों को ध्यान से पढ़ें 
                  क्योंकि ये आपके और भारतशाला के बीच कानूनी समझौते का निर्माण करती हैं। हमारी 
                  सेवाओं का उपयोग करके आप इन शर्तों से सहमत होते हैं।
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-8 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-50 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">संपर्क जानकारी</h2>
                <p className="text-gray-700 mb-4">
                  यदि आपके पास इन नियमों और शर्तों के बारे में कोई प्रश्न है, तो कृपया हमसे संपर्क करें:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>कंपनी:</strong> भारतशाला प्राइवेट लिमिटेड</p>
                  <p><strong>ईमेल:</strong> legal@bharatshala.com</p>
                  <p><strong>फोन:</strong> +91-XXXX-XXXXXX</p>
                  <p><strong>पता:</strong> [कंपनी का पूरा पता]</p>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  हम आपके कानूनी प्रश्नों का उत्तर 5-7 कार्य दिवसों में देने का प्रयास करते हैं।
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Agreement Acceptance */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-gray-600">
                इस वेबसाइट का उपयोग करके, आप पुष्टि करते हैं कि आपने इन नियमों और शर्तों को पढ़ा, समझा और स्वीकार किया है।
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TermsOfService;