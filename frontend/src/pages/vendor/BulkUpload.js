// Bulk Upload Component - Bharatshaala Vendor Platform
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAnalytics } from '../../utils/analytics';
import apiService from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const BulkUpload = () => {
  const { trackEvent, trackPageView } = useAnalytics();
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const supportedFormats = ['.csv', '.xlsx', '.xls'];

  const sampleData = [
    {
      field: 'name',
      description: 'प्रोडक्ट का नाम',
      example: 'हैंडमेड कॉटन कुर्ता',
      required: 'हां'
    },
    {
      field: 'description',
      description: 'प्रोडक्ट का विवरण',
      example: '100% कॉटन, हैंडवूवन...',
      required: 'हां'
    },
    {
      field: 'category',
      description: 'श्रेणी',
      example: 'clothing',
      required: 'हां'
    },
    {
      field: 'subcategory',
      description: 'उप-श्रेणी',
      example: 'ethnic-wear',
      required: 'हां'
    },
    {
      field: 'price',
      description: 'मूल्य (₹ में)',
      example: '1299',
      required: 'हां'
    },
    {
      field: 'original_price',
      description: 'मूल मूल्य (₹ में)',
      example: '1599',
      required: 'नहीं'
    },
    {
      field: 'sku',
      description: 'SKU कोड',
      example: 'KRT-001-M',
      required: 'हां'
    },
    {
      field: 'stock_quantity',
      description: 'स्टॉक मात्रा',
      example: '50',
      required: 'हां'
    },
    {
      field: 'weight',
      description: 'वजन (ग्राम में)',
      example: '300',
      required: 'हां'
    },
    {
      field: 'dimensions',
      description: 'आयाम (L×W×H cm)',
      example: '30×25×2',
      required: 'नहीं'
    },
    {
      field: 'material',
      description: 'सामग्री',
      example: 'Cotton',
      required: 'नहीं'
    },
    {
      field: 'color',
      description: 'रंग',
      example: 'Blue',
      required: 'नहीं'
    },
    {
      field: 'size',
      description: 'साइज़',
      example: 'M',
      required: 'नहीं'
    },
    {
      field: 'brand',
      description: 'ब्रांड',
      example: 'Traditional Crafts',
      required: 'नहीं'
    },
    {
      field: 'tags',
      description: 'टैग्स (कॉमा से अलग)',
      example: 'handmade,cotton,ethnic',
      required: 'नहीं'
    },
    {
      field: 'image_urls',
      description: 'इमेज URLs (कॉमा से अलग)',
      example: 'https://example.com/img1.jpg,https://example.com/img2.jpg',
      required: 'नहीं'
    }
  ];

// Bulk Upload Component - Bharatshaala Vendor Platform (Continued)
// Previous code truncated, continuing from upload steps...

  const uploadSteps = [
    {
      step: 1,
      title: 'टेम्प्लेट डाउनलोड करें',
      description: 'नीचे दिए गए टेम्प्लेट को डाउनलोड करें और अपना डेटा भरें'
    },
    {
      step: 2,
      title: 'फाइल अपलोड करें',
      description: 'भरे गए टेम्प्लेट को यहाँ अपलोड करें (CSV या Excel)'
    },
    {
      step: 3,
      title: 'वेरिफिकेशन',
      description: 'सिस्टम आपके डेटा को वेरिफाई करेगा'
    },
    {
      step: 4,
      title: 'इम्पोर्ट',
      description: 'वेरिफाई होने के बाद प्रोडक्ट्स इम्पोर्ट होंगे'
    }
  ];

  React.useEffect(() => {
    trackPageView('vendor_bulk_upload');
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!supportedFormats.some(format => format.includes(fileExtension))) {
      alert('केवल CSV, XLS, XLSX फाइलें स्वीकार की जाती हैं');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      alert('फाइल साइज़ 10MB से कम होनी चाहिए');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file) => {
    try {
      setUploadStatus('uploading');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      const response = await apiService.upload('/vendor/bulk-upload', file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setUploadStatus('completed');
        setUploadResults(response.data);
        trackEvent('bulk_upload_completed', {
          totalProducts: response.data.totalProcessed,
          successCount: response.data.successCount,
          errorCount: response.data.errorCount
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setUploadResults({ error: error.message });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const headers = sampleData.map(item => item.field).join(',');
    const sampleRow = sampleData.map(item => item.example).join(',');
    const csvContent = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bharatshaala_product_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);

    trackEvent('template_downloaded', { format: 'csv' });
  };

  return (
    <>
      <Helmet>
        <title>बल्क अपलोड - भारतशाला वेंडर | Bulk Upload</title>
        <meta name="description" content="एक साथ कई प्रोडक्ट्स अपलोड करें। CSV या Excel फाइल का उपयोग करके आसानी से अपने प्रोडक्ट्स जोड़ें।" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">बल्क प्रोडक्ट अपलोड</h1>
            <p className="text-gray-600">एक साथ कई प्रोडक्ट्स अपलोड करें और समय बचाएं</p>
          </motion.div>

          {/* Upload Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">अपलोड प्रक्रिया</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {uploadSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Template Download */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">स्टेप 1: टेम्प्लेट डाउनलोड करें</h2>
                <p className="text-gray-600 mb-4">
                  पहले नीचे दिए गए टेम्प्लेट को डाउनलोड करें और अपने प्रोडक्ट्स की जानकारी भरें।
                </p>
                <button
                  onClick={downloadTemplate}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>📥</span>
                  <span>CSV टेम्प्लेट डाउनलोड करें</span>
                </button>
              </motion.div>

              {/* File Upload */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">स्टेप 2: फाइल अपलोड करें</h2>
                
                {uploadStatus === 'idle' && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-4xl mb-4">📁</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      फाइल को यहाँ ड्रैग करें या क्लिक करके चुनें
                    </h3>
                    <p className="text-gray-600 mb-4">
                      समर्थित फॉर्मेट: CSV, XLS, XLSX (अधिकतम 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      फाइल चुनें
                    </button>
                  </div>
                )}

                {uploadStatus === 'uploading' && (
                  <div className="text-center py-8">
                    <LoadingSpinner size="large" />
                    <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">अपलोड हो रहा है...</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600">{uploadProgress}% पूर्ण</p>
                  </div>
                )}

                {uploadStatus === 'completed' && uploadResults && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-green-600 text-2xl mr-3">✅</span>
                      <h3 className="text-lg font-semibold text-green-900">अपलोड सफल!</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{uploadResults.totalProcessed}</div>
                        <div className="text-sm text-gray-600">कुल प्रोसेस्ड</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{uploadResults.successCount}</div>
                        <div className="text-sm text-gray-600">सफल</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{uploadResults.errorCount}</div>
                        <div className="text-sm text-gray-600">एरर</div>
                      </div>
                    </div>
                    {uploadResults.errors && uploadResults.errors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">एरर रिपोर्ट:</h4>
                        <div className="max-h-40 overflow-y-auto">
                          {uploadResults.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-600 mb-1">
                              Row {error.row}: {error.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setUploadStatus('idle');
                        setUploadResults(null);
                        setUploadProgress(0);
                      }}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      नई फाइल अपलोड करें
                    </button>
                  </div>
                )}

                {uploadStatus === 'error' && uploadResults && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-red-600 text-2xl mr-3">❌</span>
                      <h3 className="text-lg font-semibold text-red-900">अपलोड फेल!</h3>
                    </div>
                    <p className="text-red-700 mb-4">{uploadResults.error}</p>
                    <button
                      onClick={() => {
                        setUploadStatus('idle');
                        setUploadResults(null);
                        setUploadProgress(0);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      दोबारा कोशिश करें
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Field Requirements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">फील्ड्स की जानकारी</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sampleData.map((field, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{field.field}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          field.required === 'हां' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {field.required === 'हां' ? 'आवश्यक' : 'वैकल्पिक'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{field.description}</p>
                      <p className="text-xs text-blue-600 font-mono">{field.example}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-blue-900 mb-3">💡 महत्वपूर्ण टिप्स</h3>
                <ul className="text-blue-800 text-sm space-y-2">
                  <li>• सभी आवश्यक फील्ड्स भरना जरूरी है</li>
                  <li>• प्राइस में केवल नंबर डालें (₹ का साइन न लगाएं)</li>
                  <li>• इमेज URLs valid होने चाहिए</li>
                  <li>• SKU कोड unique होना चाहिए</li>
                  <li>• बड़ी फाइलों को छोटे हिस्सों में बांटें</li>
                  <li>• अपलोड से पहले डेटा को एक बार चेक करें</li>
                </ul>
              </motion.div>

              {/* Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-yellow-50 rounded-lg p-6"
              >
                <h3 className="font-semibold text-yellow-900 mb-3">🆘 मदद चाहिए?</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  बल्क अपलोड में समस्या आ रही है? हमारी टीम आपकी मदद करेगी।
                </p>
                <div className="space-y-2">
                  <a 
                    href="mailto:vendor-support@bharatshaala.com"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📧 vendor-support@bharatshaala.com
                  </a>
                  <a 
                    href="tel:+91-XXXX-XXXXXX"
                    className="block text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                  >
                    📞 +91-XXXX-XXXXXX
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
