// Contact Page for Bharatshaala Platform
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAnalytics } from '../../utils/analytics';
import { useNotification } from '../../context/NotificationContext';
import { useValidation } from '../../utils/validation';
import { motion } from 'framer-motion';
import useAPI from '../../hooks/useAPI';

const Contact = () => {
  const { trackPageView, trackEvent } = useAnalytics();
  const { showSuccess, showError } = useNotification();
  const { validateForm } = useValidation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    isVendor: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView('contact');
  }, [trackPageView]);

  const contactMethods = [
    {
      title: 'ईमेल करें',
      description: 'support@bharatshaala.com',
      icon: '📧',
      color: 'emerald',
      action: () => window.open('mailto:support@bharatshaala.com')
    },
    {
      title: 'फोन करें',
      description: '+91 1800-123-4567',
      icon: '📞',
      color: 'blue',
      action: () => window.open('tel:+911800123456')
    },
    {
      title: 'व्हाट्सऐप',
      description: '+91 98765-43210',
      icon: '💬',
      color: 'green',
      action: () => window.open('https://wa.me/919876543210')
    },
    {
      title: 'लाइव चैट',
      description: 'तुरंत सहायता',
      icon: '💭',
      color: 'orange',
      action: () => {
        trackEvent('live_chat_opened');
        // Open live chat widget
      }
    }
  ];

  const officeLocations = [
    {
      city: 'नई दिल्ली',
      address: 'भारतशाला हाउस, कनॉट प्लेस, नई दिल्ली - 110001',
      phone: '+91 11-4567-8901',
      email: 'delhi@bharatshaala.com',
      hours: 'सोमवार - शनिवार: 9:00 AM - 6:00 PM'
    },
    {
      city: 'मुंबई',
      address: 'कला केंद्र, बांद्रा कुर्ला कॉम्प्लेक्स, मुंबई - 400051',
      phone: '+91 22-4567-8902',
      email: 'mumbai@bharatshaala.com',
      hours: 'सोमवार - शनिवार: 9:00 AM - 6:00 PM'
    },
    {
      city: 'बेंगलुरु',
      address: 'टेक पार्क, कोरमंगला, बेंगलुरु - 560034',
      phone: '+91 80-4567-8903',
      email: 'bangalore@bharatshaala.com',
      hours: 'सोमवार - शनिवार: 9:00 AM - 6:00 PM'
    }
  ];

  const faqCategories = [
    {
      title: 'खरीदारी संबंधी',
      questions: [
        'मैं ऑर्डर कैसे ट्रैक करूं?',
        'रिटर्न पॉलिसी क्या है?',
        'पेमेंट के तरीके कौन से हैं?'
      ]
    },
    {
      title: 'विक्रेता संबंधी',
      questions: [
        'विक्रेता कैसे बनें?',
        'कमीशन कितना है?',
        'पेमेंट कब मिलता है?'
      ]
    },
    {
      title: 'तकनीकी सहायता',
      questions: [
        'अकाउंट में लॉगिन नहीं हो पा रहा',
        'ऐप क्रैश हो रहा है',
        'पासवर्ड रीसेट करना है'
      ]
    }
  ];

  const validationRules = {
    name: ['required', { min: 2 }, { max: 50 }],
    email: ['required', 'email'],
    phone: ['required', 'phone'],
    subject: ['required', { min: 5 }, { max: 100 }],
    category: ['required'],
    message: ['required', { min: 10 }, { max: 1000 }]
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, validationRules);

    if (!validation.isValid) {
      setErrors(validation.errors);
      showError('कृपया सभी आवश्यक फील्ड सही तरीके से भरें');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await useAPI.post('/contact/submit', {
        ...formData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });

      if (response.success) {
        trackEvent('contact_form_submitted', {
          category: formData.category,
          isVendor: formData.isVendor
        });

        showSuccess('आपका संदेश सफलतापूर्वक भेजा गया! हम 24 घंटे में जवाब देंगे।');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          category: '',
          message: '',
          isVendor: false
        });
        setErrors({});
      } else {
        throw new Error(response.error || 'संदेश भेजने में त्रुटि');
      }
    } catch (error) {
      showError(error.message || 'संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>संपर्क करें - भारतशाला | हमसे जुड़ें</title>
        <meta name="description" content="भारतशाला से संपर्क करें। हमारी टीम आपकी सहायता के लिए 24/7 उपलब्ध है।" />
        <meta name="keywords" content="संपर्क, सहायता, भारतशाला, ग्राहक सेवा" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 dark:from-gray-900 to-orange-50 dark:to-gray-800">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-600 to-orange-500 text-white py-20 pt-32">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">हमसे संपर्क करें</h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
                आपके सवाल हमारे लिए महत्वपूर्ण हैं। हमारी टीम आपकी सहायता के लिए तैयार है।
              </p>
              <div className="mt-8 text-6xl">🤝</div>
            </motion.div>
          </div>
        </section>

        {/* Quick Contact Methods */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-12">तुरंत संपर्क करें</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-gradient-to-br from-${method.color}-500 to-${method.color}-600 text-white rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg`}
                  onClick={method.action}
                >
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm opacity-90">{method.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
              >
                <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-8">संदेश भेजें</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      पूरा नाम *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 ${
                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="आपका पूरा नाम"
                    />
                    {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name[0]}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ईमेल पता *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 ${
                        errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="आपका ईमेल पता"
                    />
                    {errors.email && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email[0]}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      फोन नंबर *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.phone[0]}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      विषय श्रेणी *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 ${
                        errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">श्रेणी चुनें</option>
                      <option value="general">सामान्य प्रश्न</option>
                      <option value="order">ऑर्डर संबंधी</option>
                      <option value="vendor">विक्रेता बनना</option>
                      <option value="technical">तकनीकी सहायता</option>
                      <option value="complaint">शिकायत</option>
                      <option value="suggestion">सुझाव</option>
                    </select>
                    {errors.category && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category[0]}</p>}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      विषय *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 ${
                        errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="संदेश का विषय"
                    />
                    {errors.subject && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.subject[0]}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      संदेश *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="अपना संदेश विस्तार से लिखें..."
                    />
                    {errors.message && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.message[0]}</p>}
                  </div>

                  {/* Vendor Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVendor"
                      checked={formData.isVendor}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-gray-300 dark:border-gray-600 rounded focus:ring-emerald-500"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      मैं एक विक्रेता बनना चाहता हूं
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 text-white py-4 rounded-lg font-semibold hover:from-emerald-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'भेजा जा रहा है...' : 'संदेश भेजें'}
                  </button>
                </form>
              </motion.div>

              {/* Contact Info and FAQ */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >

                {/* Office Locations */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">हमारे कार्यालय</h3>
                  <div className="space-y-6">
                    {officeLocations.map((office, index) => (
                      <div key={index} className="border-l-4 border-emerald-500 pl-4">
                        <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{office.city}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{office.address}</p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p><span className="font-medium">📞</span> {office.phone}</p>
                          <p><span className="font-medium">📧</span> {office.email}</p>
                          <p><span className="font-medium">🕒</span> {office.hours}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick FAQ */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-6">जल्दी मदद</h3>
                  <div className="space-y-4">
                    {faqCategories.map((category, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">{category.title}</h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                          {category.questions.map((question, qIndex) => (
                            <li key={qIndex} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                              • {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <button className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                      सभी FAQ देखें →
                    </button>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-2xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">तुरंत जवाब</h3>
                  <p className="text-sm opacity-90">हम 2 घंटे के अंदर जवाब देते हैं</p>
                  <div className="mt-4 text-3xl">⚡</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section (Placeholder) */}
        <section className="py-16 bg-emerald-50 dark:bg-emerald-900/30">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-emerald-800 dark:text-emerald-200 mb-12">हमारा स्थान</h2>
            <div className="bg-gray-300 dark:bg-gray-600 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600 dark:text-gray-300">
                <div className="text-4xl mb-4">🗺️</div>
                <p>Interactive Map Coming Soon</p>
                <p className="text-sm">Google Maps Integration</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
