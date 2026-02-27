// Support Component - Bharatshaala Platform
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';

const Support = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    trackPageView('support');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const supportTabs = [
    { id: 'faq', name: 'सामान्य प्रश्न', icon: '❓' },
    { id: 'contact', name: 'संपर्क करें', icon: '📞' },
    { id: 'ticket', name: 'टिकट बनाएं', icon: '🎫' },
    { id: 'live-chat', name: 'लाइव चैट', icon: '💬' }
  ];

  const faqCategories = [
    {
      category: 'ऑर्डर और पेमेंट',
      questions: [
        {
          q: 'मैं अपना ऑर्डर कैसे ट्रैक कर सकता हूं?',
          a: 'आप अपने अकाउंट में लॉगिन करके "माई ऑर्डर्स" सेक्शन से अपना ऑर्डर ट्रैक कर सकते हैं। आपको ट्रैकिंग नंबर भी SMS और ईमेल से मिलेगा।'
        },
        {
          q: 'कौन से पेमेंट ऑप्शन उपलब्ध हैं?',
          a: 'हम डेबिट/क्रेडिट कार्ड, नेट बैंकिंग, UPI, वॉलेट्स और कैश ऑन डिलीवरी स्वीकार करते हैं।'
        },
        {
          q: 'क्या मैं अपना ऑर्डर कैंसल कर सकता हूं?',
          a: 'जी हां, आप डिस्पैच से पहले अपना ऑर्डर कैंसल कर सकते हैं। माई अकाउंट से कैंसल करें या कस्टमर सपोर्ट से संपर्क करें।'
        }
      ]
    },
    {
      category: 'शिपिंग और डिलीवरी',
      questions: [
        {
          q: 'डिलीवरी में कितना समय लगता है?',
          a: 'स्टैंडर्ड डिलीवरी में 5-7 दिन, एक्सप्रेस डिलीवरी में 2-3 दिन लगते हैं। मेट्रो सिटीज में सेम डे डिलीवरी भी उपलब्ध है।'
        },
        {
          q: 'क्या फ्री शिपिंग उपलब्ध है?',
          a: 'जी हां, ₹999 और उससे अधिक के ऑर्डर पर फ्री शिपिंग मिलती है।'
        },
        {
          q: 'क्या मैं अपना डिलीवरी एड्रेस बदल सकता हूं?',
          a: 'डिस्पैच से पहले आप एड्रेस बदल सकते हैं। कस्टमर सपोर्ट से तुरंत संपर्क करें।'
        }
      ]
    },
    {
      category: 'रिटर्न और रिफंड',
      questions: [
        {
          q: 'रिटर्न पॉलिसी क्या है?',
          a: 'डिलीवरी के 7 दिन के अंदर आप प्रोडक्ट रिटर्न कर सकते हैं। प्रोडक्ट ओरिजिनल कंडीशन में होना चाहिए।'
        },
        {
          q: 'रिफंड कब तक मिलेगा?',
          a: 'रिटर्न प्रोसेस के बाद 3-5 बिज़नेस डेज में रिफंड आपके अकाउंट में आ जाएगा।'
        },
        {
          q: 'एक्सचेंज कैसे करें?',
          a: 'माई अकाउंट से एक्सचेंज रिक्वेस्ट करें या कस्टमर सपोर्ट से संपर्क करें। स्टॉक की उपलब्धता के अनुसार एक्सचेंज होगा।'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      method: 'फोन सपोर्ट',
      details: '+91-XXXX-XXXXXX',
      timing: 'सुबह 9:00 - रात 9:00',
      icon: '📞'
    },
    {
      method: 'ईमेल सपोर्ट',
      details: 'support@bharatshaala.com',
      timing: '24 घंटे में जवाब',
      icon: '📧'
    },
    {
      method: 'लाइव चैट',
      details: 'तुरंत जवाब',
      timing: 'सुबह 8:00 - रात 10:00',
      icon: '💬'
    },
    {
      method: 'व्हाट्सऐप',
      details: '+91-XXXXX-XXXXX',
      timing: 'सुबह 9:00 - शाम 6:00',
      icon: '📱'
    }
  ];

  const [ticketForm, setTicketForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const ticketCategories = [
    'ऑर्डर संबंधी समस्या',
    'पेमेंट इश्यू',
    'डिलीवरी की समस्या',
    'प्रोडक्ट क्वालिटी',
    'रिटर्न/रिफंड',
    'अकाउंट इश्यू',
    'तकनीकी समस्या',
    'अन्य'
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    trackEvent('support_ticket_submitted', {
      category: ticketForm.category,
      priority: ticketForm.priority
    });
    // Handle ticket submission logic here
    alert('आपका टिकट सफलतापूर्वक सबमिट हो गया है। हम जल्दी ही आपसे संपर्क करेंगे।');
    setTicketForm({
      name: '',
      email: '',
      category: '',
      subject: '',
      description: '',
      priority: 'medium'
    });
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <Helmet>
        <title>सहायता और सपोर्ट - भारतशाला | Customer Support</title>
        <meta name="description" content="भारतशाला कस्टमर सपोर्ट। आपके सवालों का जवाब, टिकट सबमिशन और लाइव चैट सपोर्ट उपलब्ध है।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshaala.com/support" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16 pt-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">सहायता केंद्र</h1>
              <p className="text-xl opacity-90">
                हम आपकी मदद के लिए यहाँ हैं
              </p>
            </motion.div>
          </div>
        </section>

        {/* Support Tabs */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {supportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">सामान्य प्रश्न</h2>
                    <input
                      type="text"
                      placeholder="प्रश्न खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-6">
                    {filteredFAQs.map((category, categoryIndex) => (
                      <div key={categoryIndex} className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                        <div className="space-y-4">
                          {category.questions.map((faq, index) => (
                            <details key={index} className="border-b border-gray-200 pb-4">
                              <summary className="cursor-pointer font-semibold text-gray-900 hover:text-blue-600">
                                {faq.q}
                              </summary>
                              <p className="mt-2 text-gray-700 leading-relaxed">{faq.a}</p>
                            </details>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">संपर्क विकल्प</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {contactMethods.map((method, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="text-4xl mb-4">{method.icon}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{method.method}</h3>
                        <p className="text-blue-600 font-semibold mb-2">{method.details}</p>
                        <p className="text-gray-600 text-sm">{method.timing}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Ticket Tab */}
              {activeTab === 'ticket' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">सपोर्ट टिकट बनाएं</h2>
                    <form onSubmit={handleTicketSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            नाम *
                          </label>
                          <input
                            type="text"
                            required
                            value={ticketForm.name}
                            onChange={(e) => setTicketForm({...ticketForm, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ईमेल *
                          </label>
                          <input
                            type="email"
                            required
                            value={ticketForm.email}
                            onChange={(e) => setTicketForm({...ticketForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            श्रेणी *
                          </label>
                          <select
                            required
                            value={ticketForm.category}
                            onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">श्रेणी चुनें</option>
                            {ticketCategories.map((category, index) => (
                              <option key={index} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            प्राथमिकता
                          </label>
                          <select
                            value={ticketForm.priority}
                            onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="low">कम</option>
                            <option value="medium">मध्यम</option>
                            <option value="high">उच्च</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          विषय *
                        </label>
                        <input
                          type="text"
                          required
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          विवरण *
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={ticketForm.description}
                          onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="अपनी समस्या का विस्तृत विवरण दें..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                      >
                        टिकट सबमिट करें
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Live Chat Tab */}
              {activeTab === 'live-chat' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-lg p-8 text-center"
                >
                  <div className="text-6xl mb-6">💬</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">लाइव चैट सपोर्ट</h2>
                  <p className="text-gray-700 mb-6">
                    हमारे कस्टमर सपोर्ट एजेंट्स से तुरंत बात करें। 
                    सुबह 8:00 से रात 10:00 तक उपलब्ध।
                  </p>
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold">
                    चैट शुरू करें
                  </button>
                  <div className="mt-6 text-sm text-gray-600">
                    <p>औसत प्रतीक्षा समय: 2-3 मिनट</p>
                    <p>उपलब्ध एजेंट्स: 5</p>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </section>

        {/* Quick Help Section */}
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">त्वरित सहायता</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold mb-2">ऑर्डर ट्रैकिंग</h3>
                  <p className="text-gray-600 mb-4">अपने ऑर्डर की स्थिति देखें</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    ट्रैक करें
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl mb-4">↩️</div>
                  <h3 className="text-lg font-semibold mb-2">रिटर्न/एक्सचेंज</h3>
                  <p className="text-gray-600 mb-4">प्रोडक्ट वापस करें या बदलें</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    रिटर्न करें
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2">साइज़ गाइड</h3>
                  <p className="text-gray-600 mb-4">सही साइज़ चुनने में मदद</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    गाइड देखें
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Support;