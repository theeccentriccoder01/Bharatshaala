import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import ImageUploader from "../../components/ImageUploader";
import "../../App.css";

const AddItem = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    nameHindi: '',
    description: '',
    descriptionHindi: '',
    category: '',
    subcategory: '',
    price: '',
    originalPrice: '',
    quantity: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    materials: [],
    colors: [],
    tags: [],
    images: [],
    isHandmade: false,
    isCertified: false,
    certificationDetails: '',
    shippingInfo: {
      freeShipping: false,
      shippingCost: '',
      processingTime: '',
      shippingFrom: ''
    },
    seoData: {
      metaTitle: '',
      metaDescription: '',
      keywords: []
    }
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'बेसिक जानकारी', icon: '📝', description: 'उत्पाद का नाम, विवरण और श्रेणी' },
    { id: 2, title: 'मूल्य और स्टॉक', icon: '💰', description: 'कीमत, मात्रा और इन्वेंटरी विवरण' },
    { id: 3, title: 'छवियां और मीडिया', icon: '📸', description: 'उत्पाद की तस्वीरें और वीडियो' },
    { id: 4, title: 'विशेषताएं', icon: '✨', description: 'सामग्री, रंग और अन्य विशेषताएं' },
    { id: 5, title: 'शिपिंग और SEO', icon: '🚚', description: 'डिलीवरी जानकारी और खोज अनुकूलन' }
  ];

  const predefinedCategories = [
    { id: 'clothing', name: 'वस्त्र', nameEn: 'Clothing', subcategories: ['साड़ी', 'कुर्ता', 'लहंगा', 'दुपट्टा', 'शॉल'] },
    { id: 'jewelry', name: 'आभूषण', nameEn: 'Jewelry', subcategories: ['हार', 'झुमके', 'चूड़ियां', 'अंगूठियां', 'सेट्स'] },
    { id: 'handicrafts', name: 'हस्तशिल्प', nameEn: 'Handicrafts', subcategories: ['मिट्टी के बर्तन', 'लकड़ी का काम', 'धातु कार्य', 'चित्रकारी'] },
    { id: 'books', name: 'पुस्तकें', nameEn: 'Books', subcategories: ['साहित्य', 'धार्मिक', 'इतिहास', 'कविता', 'बाल साहित्य'] },
    { id: 'accessories', name: 'एक्सेसरीज़', nameEn: 'Accessories', subcategories: ['बैग्स', 'स्कार्फ़', 'बेल्ट्स', 'घड़ियाँ', 'चश्मे'] },
    { id: 'houseware', name: 'घरेलू सामान', nameEn: 'Houseware', subcategories: ['रसोई', 'बैठक', 'शयनकक्ष', 'स्नानघर', 'बागीचा'] }
  ];

  const materialOptions = [
    'सूती', 'रेशम', 'ऊन', 'लिनन', 'चांदी', 'सोना', 'पीतल', 'तांबा', 'लकड़ी', 'बांस', 'मिट्टी', 'चमड़ा', 'जूट', 'हाथी दांत', 'संगमरमर'
  ];

  const colorOptions = [
    'लाल', 'नीला', 'हरा', 'पीला', 'गुलाबी', 'बैंगनी', 'नारंगी', 'काला', 'सफेद', 'भूरा', 'सुनहरा', 'चांदी', 'मल्टीकलर'
  ];

  useEffect(() => {
    loadInitialData();
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (formData.category) {
      const selectedCategory = predefinedCategories.find(cat => cat.id === formData.category);
      setSubcategories(selectedCategory?.subcategories || []);
    }
  }, [formData.category]);

  const loadInitialData = () => {
    setCategories(predefinedCategories);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, value, action = 'add') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'उत्पाद का नाम आवश्यक है';
        if (!formData.description.trim()) newErrors.description = 'उत्पाद का विवरण आवश्यक है';
        if (!formData.category) newErrors.category = 'श्रेणी चुनना आवश्यक है';
        break;
      case 2:
        if (!formData.price || formData.price <= 0) newErrors.price = 'वैध कीमत डालें';
        if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'वैध मात्रा डालें';
        break;
      case 3:
        if (formData.images.length === 0) newErrors.images = 'कम से कम एक छवि आवश्यक है';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const generateSEOData = () => {
    const metaTitle = `${formData.name} - ${formData.category} | भारतशाला`;
    const metaDescription = formData.description.slice(0, 155) + '...';
    const keywords = [
      formData.name,
      formData.category,
      formData.subcategory,
      ...formData.materials,
      ...formData.tags
    ].filter(Boolean);

    setFormData(prev => ({
      ...prev,
      seoData: {
        metaTitle,
        metaDescription,
        keywords
      }
    }));
  };

  const submitForm = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      // Generate SEO data automatically
      generateSEOData();

      const response = await axios.post('/vendor/add-item', formData);
      
      if (response.data.success) {
        navigate('/vendor/items?success=item-added');
      } else {
        setErrors({ general: 'उत्पाद जोड़ने में समस्या हुई' });
      }
    } catch (error) {
      setErrors({ general: 'सर्वर त्रुटि, कृपया पुनः प्रयास करें' });
    }
    setLoading(false);
  };

  if (pageLoading) {
    return <LoadingSpinner message="नया उत्पाद जोड़ने का पेज लोड हो रहा है..." />;
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-emerald-800 mb-2">
              नया उत्पाद जोड़ें
            </h1>
            <p className="text-emerald-600 text-lg">
              अपने स्टोर में एक नया उत्पाद जोड़ने के लिए सभी विवरण भरें
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <VendorSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Progress Steps */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className={`flex flex-col items-center text-center ${
                        currentStep >= step.id ? 'text-emerald-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 mb-2 ${
                          currentStep >= step.id 
                            ? 'bg-emerald-500 text-white border-emerald-500' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {currentStep > step.id ? '✅' : step.icon}
                        </div>
                        <div className="max-w-[120px]">
                          <h4 className="font-semibold text-sm">{step.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-4 rounded transition-all duration-300 ${
                          currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">बेसिक जानकारी</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          उत्पाद का नाम (हिंदी) *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            errors.name ? 'border-red-300' : 'border-emerald-200'
                          } focus:border-emerald-500 focus:outline-none`}
                          placeholder="जैसे: कुंदन हार"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          Product Name (English)
                        </label>
                        <input
                          type="text"
                          value={formData.nameHindi}
                          onChange={(e) => handleInputChange('nameHindi', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          placeholder="e.g.: Kundan Necklace"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-emerald-800 font-semibold mb-2">
                        उत्पाद का विवरण (हिंदी) *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-3 border-2 rounded-xl ${
                          errors.description ? 'border-red-300' : 'border-emerald-200'
                        } focus:border-emerald-500 focus:outline-none`}
                        placeholder="उत्पाद का विस्तृत विवरण लिखें..."
                      />
                      {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                      <label className="block text-emerald-800 font-semibold mb-2">
                        Product Description (English)
                      </label>
                      <textarea
                        value={formData.descriptionHindi}
                        onChange={(e) => handleInputChange('descriptionHindi', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        placeholder="Write detailed product description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          मुख्य श्रेणी *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            errors.category ? 'border-red-300' : 'border-emerald-200'
                          } focus:border-emerald-500 focus:outline-none`}
                        >
                          <option value="">श्रेणी चुनें</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          उप-श्रेणी
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => handleInputChange('subcategory', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          disabled={!formData.category}
                        >
                          <option value="">उप-श्रेणी चुनें</option>
                          {subcategories.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex items-center space-x-3 p-4 border-2 border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-50">
                        <input
                          type="checkbox"
                          checked={formData.isHandmade}
                          onChange={(e) => handleInputChange('isHandmade', e.target.checked)}
                          className="w-5 h-5 text-emerald-600"
                        />
                        <div>
                          <span className="font-semibold text-emerald-800">हस्तनिर्मित</span>
                          <p className="text-emerald-600 text-sm">यह उत्पाद हाथ से बना है</p>
                        </div>
                      </label>

                      <label className="flex items-center space-x-3 p-4 border-2 border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-50">
                        <input
                          type="checkbox"
                          checked={formData.isCertified}
                          onChange={(e) => handleInputChange('isCertified', e.target.checked)}
                          className="w-5 h-5 text-emerald-600"
                        />
                        <div>
                          <span className="font-semibold text-emerald-800">प्रमाणित</span>
                          <p className="text-emerald-600 text-sm">इस उत्पाद के पास प्रमाणन है</p>
                        </div>
                      </label>
                    </div>

                    {formData.isCertified && (
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          प्रमाणन विवरण
                        </label>
                        <input
                          type="text"
                          value={formData.certificationDetails}
                          onChange={(e) => handleInputChange('certificationDetails', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          placeholder="प्रमाणन का प्रकार और जारीकर्ता"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Price and Stock */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">मूल्य और स्टॉक</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          विक्रय मूल्य (₹) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            errors.price ? 'border-red-300' : 'border-emerald-200'
                          } focus:border-emerald-500 focus:outline-none`}
                          placeholder="2500"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          मूल मूल्य (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          placeholder="3000"
                        />
                        {formData.originalPrice && formData.price && (
                          <p className="text-emerald-600 text-sm mt-1">
                            छूट: {Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}%
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          उपलब्ध मात्रा *
                        </label>
                        <input
                          type="number"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                          className={`w-full px-4 py-3 border-2 rounded-xl ${
                            errors.quantity ? 'border-red-300' : 'border-emerald-200'
                          } focus:border-emerald-500 focus:outline-none`}
                          placeholder="10"
                        />
                        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          वजन (ग्राम)
                        </label>
                        <input
                          type="number"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          आयाम (सेमी)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={formData.dimensions.length}
                            onChange={(e) => handleNestedInputChange('dimensions', 'length', e.target.value)}
                            className="px-3 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                            placeholder="लंबाई"
                          />
                          <input
                            type="number"
                            value={formData.dimensions.width}
                            onChange={(e) => handleNestedInputChange('dimensions', 'width', e.target.value)}
                            className="px-3 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                            placeholder="चौड़ाई"
                          />
                          <input
                            type="number"
                            value={formData.dimensions.height}
                            onChange={(e) => handleNestedInputChange('dimensions', 'height', e.target.value)}
                            className="px-3 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                            placeholder="ऊंचाई"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Images and Media */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">छवियां और मीडिया</h3>
                    
                    <div>
                      <label className="block text-emerald-800 font-semibold mb-4">
                        उत्पाद की छवियां * (अधिकतम 8 छवियां)
                      </label>
                      <ImageUploader
                        images={formData.images}
                        onImagesChange={(images) => handleInputChange('images', images)}
                        maxImages={8}
                        error={errors.images}
                      />
                      {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                      <h4 className="font-semibold text-emerald-800 mb-3">छवि दिशानिर्देश:</h4>
                      <ul className="text-emerald-700 space-y-2 text-sm">
                        <li>• उच्च गुणवत्ता वाली छवियां अपलोड करें (न्यूनतम 800x800 पिक्सेल)</li>
                        <li>• पहली छवि मुख्य छवि होगी</li>
                        <li>• विभिन्न कोणों से उत्पाद की तस्वीरें लें</li>
                        <li>• स्वीकृत फॉर्मेट: JPG, PNG, WEBP</li>
                        <li>• अधिकतम फ़ाइल साइज़: 5MB प्रति छवि</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 4: Features */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">विशेषताएं</h3>
                    
                    <div>
                      <label className="block text-emerald-800 font-semibold mb-3">
                        सामग्री
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {materialOptions.map(material => (
                          <label key={material} className="flex items-center space-x-2 p-3 border-2 border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors duration-200">
                            <input
                              type="checkbox"
                              checked={formData.materials.includes(material)}
                              onChange={(e) => handleArrayInputChange('materials', material, e.target.checked ? 'add' : 'remove')}
                              className="w-4 h-4 text-emerald-600"
                            />
                            <span className="text-emerald-700 text-sm">{material}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-emerald-800 font-semibold mb-3">
                        उपलब्ध रंग
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {colorOptions.map(color => (
                          <label key={color} className="flex items-center space-x-2 p-3 border-2 border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors duration-200">
                            <input
                              type="checkbox"
                              checked={formData.colors.includes(color)}
                              onChange={(e) => handleArrayInputChange('colors', color, e.target.checked ? 'add' : 'remove')}
                              className="w-4 h-4 text-emerald-600"
                            />
                            <span className="text-emerald-700 text-sm">{color}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-emerald-800 font-semibold mb-2">
                        टैग्स (खोज के लिए)
                      </label>
                      <input
                        type="text"
                        placeholder="टैग्स को कॉमा से अलग करें (जैसे: हस्तनिर्मित, पारंपरिक, गिफ्ट)"
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            const tag = e.target.value.trim().replace(',', '');
                            if (tag && !formData.tags.includes(tag)) {
                              handleArrayInputChange('tags', tag, 'add');
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {formData.tags.map(tag => (
                            <span key={tag} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                              <span>{tag}</span>
                              <button
                                onClick={() => handleArrayInputChange('tags', tag, 'remove')}
                                className="text-emerald-500 hover:text-emerald-700"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Shipping and SEO */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-6">शिपिंग और SEO</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center space-x-3 p-4 border-2 border-emerald-200 rounded-xl cursor-pointer hover:bg-emerald-50">
                          <input
                            type="checkbox"
                            checked={formData.shippingInfo.freeShipping}
                            onChange={(e) => handleNestedInputChange('shippingInfo', 'freeShipping', e.target.checked)}
                            className="w-5 h-5 text-emerald-600"
                          />
                          <div>
                            <span className="font-semibold text-emerald-800">मुफ्त शिपिंग</span>
                            <p className="text-emerald-600 text-sm">इस उत्पाद की शिपिंग मुफ्त है</p>
                          </div>
                        </label>
                      </div>

                      {!formData.shippingInfo.freeShipping && (
                        <div>
                          <label className="block text-emerald-800 font-semibold mb-2">
                            शिपिंग लागत (₹)
                          </label>
                          <input
                            type="number"
                            value={formData.shippingInfo.shippingCost}
                            onChange={(e) => handleNestedInputChange('shippingInfo', 'shippingCost', e.target.value)}
                            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                            placeholder="50"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          प्रोसेसिंग समय
                        </label>
                        <select
                          value={formData.shippingInfo.processingTime}
                          onChange={(e) => handleNestedInputChange('shippingInfo', 'processingTime', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">समय चुनें</option>
                          <option value="1-2 दिन">1-2 दिन</option>
                          <option value="3-5 दिन">3-5 दिन</option>
                          <option value="1 सप्ताह">1 सप्ताह</option>
                          <option value="2 सप्ताह">2 सप्ताह</option>
                          <option value="कस्टम समय">कस्टम समय</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">
                          शिप करने का स्थान
                        </label>
                        <input
                          type="text"
                          value={formData.shippingInfo.shippingFrom}
                          onChange={(e) => handleNestedInputChange('shippingInfo', 'shippingFrom', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                          placeholder="जयपुर, राजस्थान"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-3">SEO अनुकूलन (स्वचालित)</h4>
                      <p className="text-blue-700 text-sm mb-3">
                        निम्नलिखित SEO डेटा आपके उत्पाद की जानकारी के आधार पर स्वचालित रूप से जेनरेट होगा:
                      </p>
                      <ul className="text-blue-700 space-y-1 text-sm">
                        <li>• मेटा टाइटल: उत्पाद का नाम + श्रेणी + भारतशाला</li>
                        <li>• मेटा विवरण: उत्पाद विवरण का पहला 155 अक्षर</li>
                        <li>• कीवर्ड्स: नाम, श्रेणी, सामग्री और टैग्स</li>
                        <li>• URL स्लग: उत्पाद नाम से बना SEO फ्रेंडली URL</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-emerald-200">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <span>←</span>
                    <span>पिछला</span>
                  </button>

                  <div className="text-emerald-600 font-medium">
                    {currentStep} / {steps.length}
                  </div>

                  {currentStep < steps.length ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <span>अगला</span>
                      <span>→</span>
                    </button>
                  ) : (
                    <button
                      onClick={submitForm}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>जोड़ा जा रहा है...</span>
                        </>
                      ) : (
                        <>
                          <span>✅</span>
                          <span>उत्पाद जोड़ें</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-center">{errors.general}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default AddItem;