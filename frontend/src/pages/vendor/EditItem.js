import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import ImageUploader from "../../components/ImageUploader";
import "../../App.css";

const EditItem = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [itemData, setItemData] = useState(null);
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
    isActive: true,
    shippingInfo: {
      freeShipping: false,
      shippingCost: '',
      processingTime: '',
      shippingFrom: ''
    }
  });
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadItemData();
  }, [itemId]);

  const loadItemData = async () => {
    try {
      const response = await axios.get(`/vendor/items/${itemId}`);
      if (response.data.success) {
        const item = response.data.item;
        setItemData(item);
        setFormData(item);
      } else {
        navigate('/vendor/items?error=item-not-found');
      }
    } catch (error) {
      console.error("Error loading item:", error);
      // Mock data for demo
      const mockItem = {
        id: itemId,
        name: 'कुंदन हार',
        nameHindi: 'Kundan Necklace',
        description: 'पारंपरिक कुंदन और मीनाकारी से सजा हुआ खूबसूरत हार',
        descriptionHindi: 'Beautiful necklace adorned with traditional Kundan and Meenakari work',
        category: 'jewelry',
        subcategory: 'हार',
        price: '15000',
        originalPrice: '18000',
        quantity: '5',
        weight: '85',
        dimensions: { length: '45', width: '25', height: '2' },
        materials: ['सोना', 'कुंदन', 'मीनाकारी'],
        colors: ['सुनहरा', 'लाल', 'हरा'],
        tags: ['हस्तनिर्मित', 'पारंपरिक', 'शादी', 'त्योहार'],
        images: [
          { id: 1, url: '/images/items/kundan-necklace-1.jpg', name: 'main.jpg' },
          { id: 2, url: '/images/items/kundan-necklace-2.jpg', name: 'side.jpg' }
        ],
        isHandmade: true,
        isCertified: true,
        certificationDetails: 'BIS हॉलमार्क प्रमाणित',
        isActive: true,
        shippingInfo: {
          freeShipping: true,
          shippingCost: '',
          processingTime: '3-5 दिन',
          shippingFrom: 'जयपुर, राजस्थान'
        }
      };
      setItemData(mockItem);
      setFormData(mockItem);
    }
    setPageLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
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
    setHasChanges(true);
  };

  const handleArrayInputChange = (field, value, action = 'add') => {
    setFormData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
    setHasChanges(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'उत्पाद का नाम आवश्यक है';
    if (!formData.description.trim()) newErrors.description = 'उत्पाद का विवरण आवश्यक है';
    if (!formData.category) newErrors.category = 'श्रेणी चुनना आवश्यक है';
    if (!formData.price || formData.price <= 0) newErrors.price = 'वैध कीमत डालें';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'वैध मात्रा डालें';
    if (formData.images.length === 0) newErrors.images = 'कम से कम एक छवि आवश्यक है';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveChanges = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.put(`/vendor/items/${itemId}`, formData);
      
      if (response.data.success) {
        setHasChanges(false);
        navigate('/vendor/items?success=item-updated');
      } else {
        setErrors({ general: 'उत्पाद अपडेट करने में समस्या हुई' });
      }
    } catch (error) {
      setErrors({ general: 'सर्वर त्रुटि, कृपया पुनः प्रयास करें' });
    }
    setLoading(false);
  };

  const toggleActiveStatus = async () => {
    const newStatus = !formData.isActive;
    try {
      const response = await axios.patch(`/vendor/items/${itemId}/status`, {
        isActive: newStatus
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, isActive: newStatus }));
      }
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const deleteItem = async () => {
    if (window.confirm('क्या आप वाकई इस उत्पाद को हटाना चाहते हैं? यह क्रिया वापस नहीं की जा सकती।')) {
      try {
        const response = await axios.delete(`/vendor/items/${itemId}`);
        
        if (response.data.success) {
          navigate('/vendor/items?success=item-deleted');
        }
      } catch (error) {
        setErrors({ general: 'उत्पाद हटाने में समस्या हुई' });
      }
    }
  };

  if (pageLoading) {
    return <LoadingSpinner message="उत्पाद की जानकारी लोड हो रही है..." />;
  }

  if (!itemData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-2">उत्पाद नहीं मिला</h2>
          <p className="text-emerald-600 mb-6">यह उत्पाद उपलब्ध नहीं है या हटा दिया गया है</p>
          <a href="/vendor/items" className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors">
            वापस जाएं
          </a>
        </div>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-emerald-800 mb-2">
                  उत्पाद संपादित करें
                </h1>
                <p className="text-emerald-600 text-lg">
                  {itemData.name} की जानकारी अपडेट करें
                </p>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleActiveStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    formData.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <span>{formData.isActive ? '✅' : '❌'}</span>
                  <span>{formData.isActive ? 'सक्रिय' : 'निष्क्रिय'}</span>
                </button>
                
                <button
                  onClick={deleteItem}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  <span>🗑️</span>
                  <span>हटाएं</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <VendorSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              
              {/* Unsaved Changes Warning */}
              {hasChanges && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-600 text-xl">⚠️</span>
                      <div>
                        <h4 className="font-semibold text-yellow-800">असहेजे गए परिवर्तन</h4>
                        <p className="text-yellow-700 text-sm">आपके द्वारा किए गए परिवर्तन अभी तक सहेजे नहीं गए हैं।</p>
                      </div>
                    </div>
                    <button
                      onClick={saveChanges}
                      disabled={loading}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      {loading ? 'सहेजा जा रहा है...' : 'सहेजें'}
                    </button>
                  </div>
                </div>
              )}

              {/* Form Content */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8">
                
                {/* Basic Information */}
                <div>
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

                  <div className="mt-6">
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
                </div>

                {/* Price and Stock */}
                <div>
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
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6">छवियां</h3>
                  <ImageUploader
                    images={formData.images}
                    onImagesChange={(images) => handleInputChange('images', images)}
                    maxImages={8}
                    error={errors.images}
                  />
                  {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                </div>

                {/* Materials and Colors */}
                <div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-6">विशेषताएं</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-emerald-800 font-semibold mb-3">
                        चयनित सामग्री
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.materials.map(material => (
                          <span key={material} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                            <span>{material}</span>
                            <button
                              onClick={() => handleArrayInputChange('materials', material, 'remove')}
                              className="text-emerald-500 hover:text-emerald-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="नई सामग्री जोड़ें (Enter दबाएं)"
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none mt-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const material = e.target.value.trim();
                            if (material && !formData.materials.includes(material)) {
                              handleArrayInputChange('materials', material, 'add');
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-emerald-800 font-semibold mb-3">
                        उपलब्ध रंग
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map(color => (
                          <span key={color} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                            <span>{color}</span>
                            <button
                              onClick={() => handleArrayInputChange('colors', color, 'remove')}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="नया रंग जोड़ें (Enter दबाएं)"
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none mt-3"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const color = e.target.value.trim();
                            if (color && !formData.colors.includes(color)) {
                              handleArrayInputChange('colors', color, 'add');
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-emerald-200 gap-4">
                  <div className="flex items-center space-x-4">
                    <a
                      href="/vendor/items"
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all duration-300"
                    >
                      <span>←</span>
                      <span>वापस जाएं</span>
                    </a>
                    
                    <button
                      onClick={() => window.open(`/products/${itemId}`, '_blank')}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors duration-300"
                    >
                      <span>👁️</span>
                      <span>पूर्वावलोकन</span>
                    </button>
                  </div>

                  <button
                    onClick={saveChanges}
                    disabled={loading || !hasChanges}
                    className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>सहेजा जा रहा है...</span>
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        <span>परिवर्तन सहेजें</span>
                      </>
                    )}
                  </button>
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

export default EditItem;