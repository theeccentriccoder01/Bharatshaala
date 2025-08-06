// Privacy Policy Component - Bharatshaala Platform
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';

const PrivacyPolicy = () => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('privacy_policy');
  }, []);

  const sections = [
    {
      title: 'जानकारी संग्रह',
      content: [
        'हम आपकी व्यक्तिगत जानकारी तब एकत्र करते हैं जब आप हमारी वेबसाइट पर खाता बनाते हैं, खरीदारी करते हैं, या हमारी सेवाओं का उपयोग करते हैं।',
        'एकत्र की जाने वाली जानकारी में नाम, ईमेल पता, फोन नंबर, पता, और भुगतान की जानकारी शामिल हो सकती है।',
        'हम आपकी वेबसाइट उपयोग की जानकारी भी एकत्र करते हैं जैसे कि IP पता, ब्राउज़र प्रकार, और देखे गए पृष्ठ।'
      ]
    },
    {
      title: 'जानकारी का उपयोग',
      content: [
        'आपकी व्यक्तिगत जानकारी का उपयोग आपके आदेशों को प्रोसेस करने और सेवाएं प्रदान करने के लिए किया जाता है।',
        'हम आपसे संपर्क करने के लिए इस जानकारी का उपयोग कर सकते हैं, जैसे कि आदेश अपडेट या ग्राहक सहायता के लिए।',
        'आपकी अनुमति के साथ, हम आपको मार्केटिंग संदेश भेज सकते हैं।',
        'वेबसाइट के प्रदर्शन को बेहतर बनाने और उपयोगकर्ता अनुभव को बढ़ाने के लिए भी इसका उपयोग किया जाता है।'
      ]
    },
    {
      title: 'जानकारी साझाकरण',
      content: [
        'हम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष को नहीं बेचते या किराए पर नहीं देते।',
        'आपके आदेशों को पूरा करने के लिए हम विश्वसनीय सेवा प्रदाताओं के साथ जानकारी साझा कर सकते हैं।',
        'कानूनी आवश्यकताओं के तहत या न्यायालय के आदेश पर जानकारी साझा की जा सकती है।'
      ]
    },
    {
      title: 'डेटा सुरक्षा',
      content: [
        'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं।',
        'सभी संवेदनशील जानकारी SSL एन्क्रिप्शन के साथ सुरक्षित रूप से ट्रांसमिट की जाती है।',
        'हमारे सिस्टम नियमित रूप से सुरक्षा अपडेट और निगरानी के अधीन हैं।'
      ]
    },
    {
      title: 'कुकीज़',
      content: [
        'हमारी वेबसाइट कुकीज़ का उपयोग करती है ताकि आपका अनुभव बेहतर हो सके।',
        'कुकीज़ छोटी फाइलें हैं जो आपके डिवाइस पर संग्रहीत होती हैं और वेबसाइट की कार्यक्षमता में सुधार करती हैं।',
        'आप अपने ब्राउज़र सेटिंग्स में कुकीज़ को अक्षम कर सकते हैं, लेकिन इससे वेबसाइट की कुछ सुविधाएं प्रभावित हो सकती हैं।'
      ]
    },
    {
      title: 'आपके अधिकार',
      content: [
        'आपको अपनी व्यक्तिगत जानकारी तक पहुंचने, सुधारने या हटाने का अधिकार है।',
        'आप किसी भी समय मार्केटिंग संदेशों से ऑप्ट-आउट कर सकते हैं।',
        'डेटा पोर्टेबिलिटी का अधिकार - आप अपनी जानकारी की प्रति का अनुरोध कर सकते हैं।'
      ]
    },
    {
      title: 'तीसरे पक्ष की लिंक',
      content: [
        'हमारी वेबसाइट में तीसरे पक्ष की वेबसाइटों के लिंक हो सकते हैं।',
        'हम इन तीसरे पक्ष की वेबसाइटों की गोपनीयता प्रथाओं के लिए जिम्मेदार नहीं हैं।',
        'हम सुझाव देते हैं कि आप इन साइटों की गोपनीयता नीतियों को पढ़ें।'
      ]
    },
    {
      title: 'नीति में परिवर्तन',
      content: [
        'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं।',
        'महत्वपूर्ण परिवर्तनों के बारे में हम आपको ईमेल या वेबसाइट नोटिस के माध्यम से सूचित करेंगे।',
        'नीति में परिवर्तनों की तारीख इस पृष्ठ के शीर्ष पर दिखाई गई है।'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>गोपनीयता नीति - भारतशाला | Privacy Policy</title>
        <meta name="description" content="भारतशाला की गोपनीयता नीति। जानें कि हम आपकी व्यक्तिगत जानकारी कैसे एकत्र करते हैं, उपयोग करते हैं और सुरक्षित रखते हैं।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshaala.com/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">गोपनीयता नीति</h1>
              <p className="text-xl opacity-90">
                आपकी गोपनीयता हमारी प्राथमिकता है
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
                  भारतशाला में, हम आपकी गोपनीयता का सम्मान करते हैं और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। 
                  यह गोपनीयता नीति बताती है कि हम आपकी जानकारी कैसे एकत्र करते हैं, उपयोग करते हैं, और सुरक्षित रखते हैं 
                  जब आप हमारी वेबसाइट bharatshaala.com का उपयोग करते हैं।
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Policy Sections */}
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
                className="bg-blue-50 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">संपर्क जानकारी</h2>
                <p className="text-gray-700 mb-4">
                  यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न या चिंता है, तो कृपया हमसे संपर्क करें:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>ईमेल:</strong> privacy@bharatshaala.com</p>
                  <p><strong>फोन:</strong> +91-XXXX-XXXXXX</p>
                  <p><strong>पता:</strong> भारतशाला प्राइवेट लिमिटेड, [पूरा पता]</p>
                </div>
                <p className="text-sm text-gray-600 mt-6">
                  हम आपके प्रश्नों का उत्तर 48 घंटों के भीतर देने का प्रयास करते हैं।
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm text-gray-600">
                यह गोपनीयता नीति भारतीय कानूनों के अनुसार तैयार की गई है और भारत के न्यायालयों के अधिकार क्षेत्र में आती है।
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;