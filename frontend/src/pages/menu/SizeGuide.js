// Size Guide Component - Bharatshaala Platform
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../utils/analytics';

const SizeGuide = () => {
  const { trackPageView } = useAnalytics();
  const [activeCategory, setActiveCategory] = useState('clothing');

  useEffect(() => {
    trackPageView('size_guide');
  }, []);

  const categories = [
    { id: 'clothing', name: 'कपड़े', icon: '👕' },
    { id: 'footwear', name: 'जूते', icon: '👠' },
    { id: 'jewelry', name: 'ज्वेलरी', icon: '💍' },
    { id: 'accessories', name: 'एक्सेसरीज', icon: '👜' }
  ];

  const clothingSizes = {
    men: {
      title: 'पुरुष कपड़े साइज़ चार्ट',
      headers: ['साइज़', 'चेस्ट (इंच)', 'वेस्ट (इंच)', 'हिप (इंच)', 'शोल्डर (इंच)'],
      rows: [
        ['XS', '34-36', '28-30', '34-36', '16-17'],
        ['S', '36-38', '30-32', '36-38', '17-18'],
        ['M', '38-40', '32-34', '38-40', '18-19'],
        ['L', '40-42', '34-36', '40-42', '19-20'],
        ['XL', '42-44', '36-38', '42-44', '20-21'],
        ['XXL', '44-46', '38-40', '44-46', '21-22']
      ]
    },
    women: {
      title: 'महिला कपड़े साइज़ चार्ट',
      headers: ['साइज़', 'बस्ट (इंच)', 'वेस्ट (इंच)', 'हिप (इंच)', 'शोल्डर (इंच)'],
      rows: [
        ['XS', '30-32', '24-26', '34-36', '13-14'],
        ['S', '32-34', '26-28', '36-38', '14-15'],
        ['M', '34-36', '28-30', '38-40', '15-16'],
        ['L', '36-38', '30-32', '40-42', '16-17'],
        ['XL', '38-40', '32-34', '42-44', '17-18'],
        ['XXL', '40-42', '34-36', '44-46', '18-19']
      ]
    }
  };

  const footwearSizes = {
    title: 'जूते साइज़ चार्ट',
    headers: ['भारतीय साइज़', 'UK साइज़', 'US साइज़', 'EU साइज़', 'फुट लेंथ (cm)'],
    rows: [
      ['3', '3', '4', '36', '22.0'],
      ['4', '4', '5', '37', '22.5'],
      ['5', '5', '6', '38', '23.5'],
      ['6', '6', '7', '39', '24.0'],
      ['7', '7', '8', '40', '25.0'],
      ['8', '8', '9', '41', '25.5'],
      ['9', '9', '10', '42', '26.5'],
      ['10', '10', '11', '43', '27.0'],
      ['11', '11', '12', '44', '28.0'],
      ['12', '12', '13', '45', '28.5']
    ]
  };

  const jewelrySizes = {
    rings: {
      title: 'अंगूठी साइज़ चार्ट',
      headers: ['भारतीय साइज़', 'US साइज़', 'UK साइज़', 'व्यास (mm)', 'परिधि (mm)'],
      rows: [
        ['10', '5', 'J', '15.7', '49.3'],
        ['12', '6', 'L', '16.5', '51.9'],
        ['14', '7', 'N', '17.3', '54.4'],
        ['16', '8', 'P', '18.1', '57.0'],
        ['18', '9', 'R', '18.9', '59.5'],
        ['20', '10', 'T', '19.8', '62.1'],
        ['22', '11', 'V', '20.6', '64.6']
      ]
    },
    bangles: {
      title: 'चूड़ी साइज़ चार्ट',
      headers: ['साइज़', 'व्यास (इंच)', 'परिधि (इंच)', 'हाथ का माप'],
      rows: [
        ['2.2', '2.2', '6.9', 'बहुत छोटा'],
        ['2.4', '2.4', '7.5', 'छोटा'],
        ['2.6', '2.6', '8.2', 'मीडियम'],
        ['2.8', '2.8', '8.8', 'लार्ज'],
        ['2.10', '2.10', '9.4', 'एक्स्ट्रा लार्ज']
      ]
    }
  };

  const measurementTips = [
    {
      category: 'कपड़े मापना',
      tips: [
        'हमेशा अच्छे फिटिंग वाले कपड़े पहनकर माप लें',
        'टेप मेज़र को टाइट न करें, आराम से रखें',
        'चेस्ट को सबसे चौड़े हिस्से से मापें',
        'वेस्ट को सबसे पतले हिस्से से मापें'
      ]
    },
    {
      category: 'जूते मापना',
      tips: [
        'शाम के समय पैर मापें जब वे थोड़े सूजे हों',
        'दोनों पैर मापें और बड़े साइज़ को चुनें',
        'मोज़े पहनकर मापें अगर जूते के साथ पहनने वाले हैं',
        'खड़े होकर माप लें, बैठकर नहीं'
      ]
    },
    {
      category: 'ज्वेलरी मापना',
      tips: [
        'अंगूठी के लिए दिन के अलग-अलग समय मापें',
        'चूड़ी के लिए अंगूठे को हथेली से मिलाकर मापें',
        'गर्दन के गहने के लिए वांछित लंबाई देखें',
        'पुराने गहने को रेफरेंस के रूप में इस्तेमाल करें'
      ]
    }
  ];

  const renderSizeChart = (data) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-50">
            {data.headers.map((header, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border border-gray-300 px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>साइज़ गाइड - भारतशाला | Size Guide & Measurement Chart</title>
        <meta name="description" content="भारतशाला साइज़ गाइड। कपड़े, जूते, ज्वेलरी और एक्सेसरीज के लिए सही साइज़ चुनने में मदद करने वाला चार्ट।" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bharatshaala.com/size-guide" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold mb-4">साइज़ गाइड</h1>
              <p className="text-xl opacity-90">
                सही साइज़ चुनने के लिए आपका पूर्ण गाइड
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Size Charts */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {activeCategory === 'clothing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{clothingSizes.men.title}</h2>
                    {renderSizeChart(clothingSizes.men)}
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{clothingSizes.women.title}</h2>
                    {renderSizeChart(clothingSizes.women)}
                  </div>
                </motion.div>
              )}

              {activeCategory === 'footwear' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{footwearSizes.title}</h2>
                  {renderSizeChart(footwearSizes)}
                </motion.div>
              )}

              {activeCategory === 'jewelry' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{jewelrySizes.rings.title}</h2>
                    {renderSizeChart(jewelrySizes.rings)}
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{jewelrySizes.bangles.title}</h2>
                    {renderSizeChart(jewelrySizes.bangles)}
                  </div>
                </motion.div>
              )}

              {activeCategory === 'accessories' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">एक्सेसरीज साइज़ गाइड</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">बैग साइज़</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li><strong>छोटा:</strong> 20-25 cm (हैंडबैग)</li>
                        <li><strong>मीडियम:</strong> 25-35 cm (शोल्डर बैग)</li>
                        <li><strong>बड़ा:</strong> 35-45 cm (टोट बैग)</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">स्कार्फ साइज़</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li><strong>स्क्वेयर:</strong> 90x90 cm</li>
                        <li><strong>रेक्टैंगल:</strong> 180x70 cm</li>
                        <li><strong>लॉन्ग:</strong> 200x35 cm</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Measurement Tips */}
        <section className="py-12 bg-purple-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">मापने के टिप्स</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {measurementTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{tip.category}</h3>
                    <ul className="space-y-3">
                      {tip.tips.map((tipText, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <span className="text-purple-600 text-lg">•</span>
                          <span className="text-gray-700 text-sm">{tipText}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">अभी भी कन्फ्यूज़्ड हैं?</h2>
                <p className="text-gray-700 mb-6">
                  हमारी कस्टमर सपोर्ट टीम साइज़ चुनने में आपकी मदद करेगी
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a
                    href="mailto:size-help@bharatshaala.com"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
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

export default SizeGuide;
