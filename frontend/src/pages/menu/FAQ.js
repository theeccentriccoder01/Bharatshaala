// Comprehensive FAQ Page for Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../../utils/analytics';
import { useDebounce } from '../../hooks/useDebounce';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [votedItems, setVotedItems] = useState(new Set());

  useEffect(() => {
    trackPageView('faq');
  }, [trackPageView]);

  const categories = [
    { id: 'general', name: 'सामान्य', icon: '❓' },
    { id: 'orders', name: 'ऑर्डर और शिपिंग', icon: '📦' },
    { id: 'payments', name: 'भुगतान', icon: '💳' },
    { id: 'returns', name: 'रिटर्न और रिफंड', icon: '↩️' },
    { id: 'vendors', name: 'विक्रेता', icon: '🏪' },
    { id: 'account', name: 'खाता और प्रोफाइल', icon: '👤' },
    { id: 'technical', name: 'तकनीकी सहायता', icon: '🔧' },
    { id: 'security', name: 'सुरक्षा और गोपनीयता', icon: '🔒' }
  ];

  const faqData = {
    general: [
      {
        id: 'what-is-bharatshaala',
        question: 'भारतशाला क्या है?',
        answer: 'भारतशाला भारत का सबसे बड़ा हस्तशिल्प मार्केटप्लेस है जो प्रामाणिक हस्तनिर्मित उत्पादों को कारीगरों से सीधे ग्राहकों तक पहुंचाता है।',
        tags: ['about', 'platform', 'handicrafts'],
        helpful: 89,
        notHelpful: 5
      },
      {
        id: 'how-to-start-shopping',
        question: 'मैं खरीदारी कैसे शुरू करूं?',
        answer: 'खरीदारी शुरू करने के लिए: 1) अकाउंट बनाएं या लॉगिन करें 2) उत्पाद ब्राउज़ करें या सर्च करें 3) पसंदीदा आइटम कार्ट में जोड़ें 4) चेकआउट करके ऑर्डर पूरा करें।',
        tags: ['shopping', 'getting-started', 'account'],
        helpful: 156,
        notHelpful: 12
      },
      {
        id: 'product-authenticity',
        question: 'उत्पादों की प्रामाणिकता कैसे सुनिश्चित की जाती है?',
        answer: 'हमारी टीम हर उत्पाद की गुणवत्ता जांचती है। सभी कारीगर वेरिफाइड हैं और उत्पादों की तस्वीरें वास्तविक हैं। हमारी प्रामाणिकता गारंटी के साथ खरीदारी करें।',
        tags: ['authenticity', 'quality', 'verification'],
        helpful: 203,
        notHelpful: 8
      }
    ],
    orders: [
      {
        id: 'track-order',
        question: 'मैं अपना ऑर्डर कैसे ट्रैक करूं?',
        answer: 'ऑर्डर ट्रैक करने के लिए: 1) अपने अकाउंट में लॉगिन करें 2) "मेरे ऑर्डर्स" पर जाएं 3) ऑर्डर नंबर पर क्लिक करें। आपको SMS और ईमेल से भी अपडेट मिलेंगे।',
        tags: ['tracking', 'orders', 'updates'],
        helpful: 245,
        notHelpful: 15
      },
      {
        id: 'delivery-time',
        question: 'डिलीवरी में कितना समय लगता है?',
        answer: 'सामान्यतः 3-7 कार्य दिवस। एक्सप्रेस डिलीवरी 1-2 दिन में। ग्रामीण क्षेत्रों में 7-10 दिन तक लग सकते हैं। वास्तविक समय चेकआउट के समय दिखाया जाता है।',
        tags: ['delivery', 'shipping', 'time'],
        helpful: 189,
        notHelpful: 23
      },
      {
        id: 'modify-order',
        question: 'क्या मैं ऑर्डर को मॉडिफाई कर सकता हूं?',
        answer: 'शिपिंग से पहले ऑर्डर मॉडिफाई कर सकते हैं। "मेरे ऑर्डर्स" में जाकर "ऑर्डर एडिट करें" पर क्लिक करें। शिप होने के बाद केवल कैंसिलेशन संभव है।',
        tags: ['modify', 'edit', 'cancel'],
        helpful: 134,
        notHelpful: 28
      }
    ],
    payments: [
      {
        id: 'payment-methods',
        question: 'कौन से पेमेंट मेथड उपलब्ध हैं?',
        answer: 'UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग, डिजिटल वॉलेट्स (Paytm, PhonePe), और कैश ऑन डिलीवरी। सभी पेमेंट्स SSL एन्क्रिप्टेड और सुरक्षित हैं।',
        tags: ['payment', 'methods', 'security'],
        helpful: 178,
        notHelpful: 9
      },
      {
        id: 'payment-security',
        question: 'पेमेंट कितनी सुरक्षित है?',
        answer: 'हम 256-bit SSL एन्क्रिप्शन और PCI DSS कॉम्प्लायंट गेटवे का उपयोग करते हैं। आपकी कार्ड डिटेल्स हमारे पास स्टोर नहीं होती। सभी ट्रांजैक्शन बैंक ग्रेड सिक्योरिटी के साथ।',
        tags: ['security', 'encryption', 'privacy'],
        helpful: 267,
        notHelpful: 6
      },
      {
        id: 'payment-failure',
        question: 'पेमेंट फेल होने पर क्या करूं?',
        answer: 'पेमेंट फेल होने पर: 1) इंटरनेट कनेक्शन चेक करें 2) अकाउंट बैलेंस वेरिफाई करें 3) दूसरा पेमेंट मेथड ट्राई करें 4) अगर समस्या बनी रहे तो सपोर्ट से संपर्क करें।',
        tags: ['payment-failure', 'troubleshooting', 'support'],
        helpful: 145,
        notHelpful: 31
      }
    ],
    returns: [
      {
        id: 'return-policy',
        question: 'रिटर्न पॉलिसी क्या है?',
        answer: '7 दिन का रिटर्न पॉलिसी। उत्पाद अनुपयोग्य कंडीशन में होना चाहिए। मूल पैकेजिंग और टैग्स के साथ। डैमेज/गलत आइटम के लिए फ्री रिटर्न, अन्यथा ₹50 चार्ज।',
        tags: ['return', 'policy', 'conditions'],
        helpful: 212,
        notHelpful: 18
      },
      {
        id: 'initiate-return',
        question: 'रिटर्न कैसे करूं?',
        answer: 'रिटर्न के लिए: 1) "मेरे ऑर्डर्स" में जाएं 2) "रिटर्न" बटन पर क्लिक करें 3) रीज़न सेलेक्ट करें 4) पिकअप शेड्यूल करें। रिफंड 5-7 कार्य दिवसों में मिलेगा।',
        tags: ['return-process', 'refund', 'pickup'],
        helpful: 156,
        notHelpful: 24
      },
      {
        id: 'refund-time',
        question: 'रिफंड में कितना समय लगता है?',
        answer: 'रिटर्न प्रोसेसिंग के बाद 5-7 कार्य दिवस। UPI/वॉलेट में 1-2 दिन, बैंक अकाउंट में 5-7 दिन। क्रेडिट कार्ड में 7-14 दिन तक का समय लग सकता है।',
        tags: ['refund', 'timeline', 'processing'],
        helpful: 187,
        notHelpful: 22
      }
    ],
    vendors: [
      {
        id: 'become-vendor',
        question: 'मैं विक्रेता कैसे बनूं?',
        answer: 'विक्रेता बनने के लिए: 1) "विक्रेता रजिस्ट्रेशन" पर जाएं 2) बिज़नेस डिटेल्स भरें 3) डॉक्यूमेंट्स अपलोड करें 4) वेरिफिकेशन का इंतज़ार करें। अप्रूवल में 2-3 दिन लगते हैं।',
        tags: ['vendor-registration', 'business', 'approval'],
        helpful: 298,
        notHelpful: 14
      },
      {
        id: 'vendor-commission',
        question: 'विक्रेता कमीशन कितना है?',
        answer: 'कमीशन 5-15% तक, कैटेगरी के अनुसार। हस्तशिल्प में 5-8%, इलेक्ट्रॉनिक्स में 10-15%। कोई जॉइनिंग फीस नहीं। वॉल्यूम डिस्काउंट भी उपलब्ध।',
        tags: ['commission', 'fees', 'pricing'],
        helpful: 234,
        notHelpful: 19
      },
      {
        id: 'vendor-payment',
        question: 'विक्रेता पेमेंट कब मिलता है?',
        answer: 'ऑर्डर डिलीवर होने के 7 दिन बाद। रिटर्न पीरियड खत्म होने पर पेमेंट रिलीज़ होता है। हर गुरुवार को पेमेंट ट्रांसफर की जाती है।',
        tags: ['vendor-payment', 'settlement', 'timeline'],
        helpful: 167,
        notHelpful: 12
      }
    ],
    account: [
      {
        id: 'create-account',
        question: 'अकाउंट कैसे बनाएं?',
        answer: 'अकाउंट बनाने के लिए: 1) "साइन अप" पर क्लिक करें 2) मोबाइल/ईमेल दर्ज करें 3) OTP वेरिफाई करें 4) प्रोफाइल कॉम्प्लीट करें। सोशल लॉगिन भी उपलब्ध है।',
        tags: ['account-creation', 'signup', 'verification'],
        helpful: 189,
        notHelpful: 11
      },
      {
        id: 'forgot-password',
        question: 'पासवर्ड भूल गया हूं, क्या करूं?',
        answer: 'लॉगिन पेज पर "पासवर्ड भूल गए?" पर क्लिक करें। मोबाइल/ईमेल दर्ज करें। OTP के साथ नया पासवर्ड सेट करें।',
        tags: ['forgot-password', 'reset', 'otp'],
        helpful: 145,
        notHelpful: 8
      },
      {
        id: 'update-profile',
        question: 'प्रोफाइल को अपडेट कैसे करूं?',
        answer: 'अकाउंट में लॉगिन करें → "मेरी प्रोफाइल" → "एडिट प्रोफाइल"। नाम, ईमेल, फोन, पता अपडेट कर सकते हैं। कुछ चेंजेस में वेरिफिकेशन की आवश्यकता हो सकती है।',
        tags: ['profile-update', 'edit', 'verification'],
        helpful: 123,
        notHelpful: 16
      }
    ],
    technical: [
      {
        id: 'app-not-working',
        question: 'ऐप काम नहीं कर रहा, क्या करूं?',
        answer: 'ऐप की समस्या के लिए: 1) ऐप को बंद करके दोबारा खोलें 2) इंटरनेट कनेक्शन चेक करें 3) ऐप अपडेट करें 4) फोन रीस्टार्ट करें 5) ऐप रीइंस्टॉल करें।',
        tags: ['app-issues', 'troubleshooting', 'technical'],
        helpful: 167,
        notHelpful: 29
      },
      {
        id: 'website-slow',
        question: 'वेबसाइट स्लो लोड हो रही है',
        answer: 'स्लो लोडिंग के लिए: 1) इंटरनेट स्पीड चेक करें 2) ब्राउज़र कैश क्लियर करें 3) दूसरा ब्राउज़र ट्राई करें 4) एड-ब्लॉकर डिसेबल करें। पीक ऑवर्स में थोड़ी देरी हो सकती है।',
        tags: ['website-speed', 'performance', 'browser'],
        helpful: 134,
        notHelpful: 25
      },
      {
        id: 'compatibility',
        question: 'कौन से डिवाइस सपोर्टेड हैं?',
        answer: 'वेबसाइट सभी मॉडर्न ब्राउज़र में काम करती है। Android 5.0+ और iOS 10+ के लिए मोबाइल ऐप उपलब्ध है। टैबलेट और डेस्कटॉप पर भी फुल सपोर्ट।',
        tags: ['compatibility', 'devices', 'requirements'],
        helpful: 98,
        notHelpful: 7
      }
    ],
    security: [
      {
        id: 'account-security',
        question: 'अकाउंट को सुरक्षित कैसे रखूं?',
        answer: 'अकाउंट सुरक्षा के लिए: 1) मजबूत पासवर्ड रखें 2) किसी के साथ शेयर न करें 3) Two-Factor Authentication चालू करें 4) संदिग्ध एक्टिविटी रिपोर्ट करें।',
        tags: ['security', 'password', '2fa'],
        helpful: 178,
        notHelpful: 9
      },
      {
        id: 'data-privacy',
        question: 'मेरा डेटा कितना सुरक्षित है?',
        answer: 'आपका डेटा पूर्णतः सुरक्षित है। हम ISO 27001 सर्टिफाइड हैं और GDPR कॉम्प्लायंट। व्यक्तिगत जानकारी कभी थर्ड पार्टी के साथ शेयर नहीं की जाती।',
        tags: ['privacy', 'data-protection', 'compliance'],
        helpful: 201,
        notHelpful: 13
      },
      {
        id: 'suspicious-activity',
        question: 'संदिग्ध एक्टिविटी दिख रही है',
        answer: 'तुरंत पासवर्ड बदलें और सपोर्ट टीम को रिपोर्ट करें। लॉगिन हिस्ट्री चेक करें। अगर unauthorized ट्रांजैक्शन दिखे तो तुरंत बैंक और हमसे संपर्क करें।',
        tags: ['suspicious-activity', 'security-breach', 'report'],
        helpful: 156,
        notHelpful: 18
      }
    ]
  };

  const filteredFAQs = React.useMemo(() => {
    if (!debouncedSearch) return faqData[activeCategory] || [];

    const allFAQs = Object.values(faqData).flat();
    return allFAQs.filter(faq =>
      faq.question.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );
  }, [activeCategory, debouncedSearch]);

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
      trackEvent('faq_collapsed', { questionId: id });
    } else {
      newExpanded.add(id);
      trackEvent('faq_expanded', { questionId: id });
    }
    setExpandedItems(newExpanded);
  };

  const handleVote = (id, isHelpful) => {
    if (votedItems.has(id)) return;

    setVotedItems(new Set([...votedItems, id]));
    trackEvent('faq_voted', {
      questionId: id,
      isHelpful,
      category: activeCategory
    });
  };

  const handleContactSupport = () => {
    trackEvent('faq_contact_support_clicked');
    window.location.href = '/contact';
  };

  return (
    <>
      <Helmet>
        <title>अक्सर पूछे जाने वाले सवाल - भारतशाला FAQ</title>
        <meta name="description" content="भारतशाला के बारे में सभी सवालों के जवाब। ऑर्डर, पेमेंट, रिटर्न, विक्रेता और तकनीकी सहायता।" />
        <meta name="keywords" content="FAQ, सवाल, जवाब, सहायता, भारतशाला" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 to-orange-50 dark:to-gray-800">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-orange-500 text-white py-16 pt-32">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                अक्सर पूछे जाने वाले सवाल
              </h1>
              <p className="text-xl opacity-90 mb-8">
                आपके सभी सवालों के जवाब यहाँ मिलेंगे
              </p>
              <div className="text-5xl">❓</div>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="सवाल खोजें... जैसे 'ऑर्डर ट्रैक करना' या 'पेमेंट'"
                  className="w-full px-6 py-4 text-lg border-2 border-emerald-200 dark:border-emerald-700 rounded-2xl focus:border-emerald-500 focus:outline-none pl-14 dark:bg-gray-700 dark:text-gray-100"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</div>
              </div>
              {debouncedSearch && (
                <p className="mt-4 text-emerald-600 dark:text-emerald-400 text-center">
                  "{debouncedSearch}" के लिए {filteredFAQs.length} परिणाम मिले
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">श्रेणियां</h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearchQuery('');
                        trackEvent('faq_category_changed', { category: category.id });
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                        activeCategory === category.id && !debouncedSearch
                          ? 'bg-gradient-to-r from-emerald-500 to-orange-500 text-white'
                          : 'hover:bg-emerald-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">आंकड़े</h3>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 space-y-1">
                    <p>✓ 95% सवालों का तुरंत जवाब</p>
                    <p>⚡ औसत रिस्पांस टाइम: 2 मिनट</p>
                    <p>👥  50,000+ संतुष्ट ग्राहक</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white p-6">
                  <h2 className="text-2xl font-bold">
                    {debouncedSearch ? 'खोज परिणाम' :
                     categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="opacity-90 mt-2">
                    {filteredFAQs.length} सवाल उपलब्ध
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <button
                          onClick={() => toggleExpanded(faq.id)}
                          className="w-full text-left focus:outline-none"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                              {faq.question}
                            </h3>
                            <div className={`transform transition-transform duration-200 ${
                              expandedItems.has(faq.id) ? 'rotate-180' : ''
                            }`}>
                              <span className="text-emerald-500 dark:text-emerald-400 text-xl">▼</span>
                            </div>
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedItems.has(faq.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mt-4">
                                {faq.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="bg-emerald-100 dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              {/* Helpfulness */}
                              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">यह जवाब सहायक था?</span>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleVote(faq.id, true)}
                                      disabled={votedItems.has(faq.id)}
                                      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                      <span>👍</span>
                                      <span className="text-sm">{faq.helpful}</span>
                                    </button>
                                    <button
                                      onClick={() => handleVote(faq.id, false)}
                                      disabled={votedItems.has(faq.id)}
                                      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                      <span>👎</span>
                                      <span className="text-sm">{faq.notHelpful}</span>
                                    </button>
                                  </div>
                                </div>

                                {votedItems.has(faq.id) && (
                                  <span className="text-emerald-600 dark:text-emerald-400 text-sm">✓ धन्यवाद!</span>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* No Results */}
                {filteredFAQs.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">🤔</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      कोई परिणाम नहीं मिला
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      कृपया अलग कीवर्ड से खोजें या किसी अन्य श्रेणी में देखें
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                    >
                      सभी FAQ देखें
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <section className="py-16 bg-gradient-to-r from-emerald-500 to-orange-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold mb-4">अभी भी सवाल है?</h2>
              <p className="text-xl opacity-90 mb-8">
                हमारी सपोर्ट टीम आपकी मदद के लिए तैयार है
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
                <button
                  onClick={handleContactSupport}
                  className="bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  सपोर्ट से संपर्क करें
                </button>
                <button
                  onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
                >
                  व्हाट्सऐप चैट
                </button>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl mb-2">📧</div>
                  <p className="text-sm">ईमेल सपोर्ट</p>
                  <p className="text-xs opacity-75">24 घंटे में जवाब</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm">फोन सपोर्ट</p>
                  <p className="text-xs opacity-75">9 AM - 9 PM</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <p className="text-sm">लाइव चैट</p>
                  <p className="text-xs opacity-75">तुरंत जवाब</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;
