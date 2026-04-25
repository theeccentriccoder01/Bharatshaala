// Market Management Component for Bharatshaala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ImageUpload from '../components/ImageUpload';
import apiService from '../apiService';
import { helpers } from '../helpers';

const MarketManagement = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    location: '',
    city: '',
    state: '',
    pincode: '',
    speciality: '',
    image: '',
    bannerImage: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    openingHours: '',
    contactNumber: '',
    email: '',
    website: '',
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadMarkets();
  }, [currentPage, searchTerm, filterStatus]);

  const loadMarkets = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/markets', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: filterStatus,
          limit: 20
        }
      });

      if (response.success) {
        setMarkets(response.data.markets);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      showError('बाज़ार लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: helpers.string.slugify(value)
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'बाज़ार नाम आवश्यक है';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'अंग्रेजी नाम आवश्यक है';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'विवरण आवश्यक है';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'स्थान आवश्यक है';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'शहर आवश्यक है';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'राज्य आवश्यक है';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'पिन कोड आवश्यक है';
    }

    if (!formData.speciality.trim()) {
      newErrors.speciality = 'विशेषता आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const endpoint = editingMarket 
        ? `/admin/markets/${editingMarket.id}`
        : '/admin/markets';
      
      const method = editingMarket ? 'put' : 'post';
      
      const response = await apiService[method](endpoint, formData);

      if (response.success) {
        showSuccess(editingMarket ? 'बाज़ार अपडेट हो गया' : 'बाज़ार बनाया गया');
        setShowModal(false);
        resetForm();
        loadMarkets();
        
        trackEvent(editingMarket ? 'market_updated' : 'market_created', {
          marketId: response.data.id,
          marketName: formData.name
        });
      }
    } catch (error) {
      showError(error.response?.data?.message || 'बाज़ार सेव करने में त्रुटि');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (market) => {
    setEditingMarket(market);
    setFormData({
      name: market.name,
      nameEn: market.nameEn,
      description: market.description,
      location: market.location,
      city: market.city,
      state: market.state,
      pincode: market.pincode,
      speciality: market.speciality,
      image: market.image || '',
      bannerImage: market.bannerImage || '',
      isActive: market.isActive,
      isFeatured: market.isFeatured,
      sortOrder: market.sortOrder,
      openingHours: market.openingHours || '',
      contactNumber: market.contactNumber || '',
      email: market.email || '',
      website: market.website || '',
      metaTitle: market.metaTitle || '',
      metaDescription: market.metaDescription || '',
      slug: market.slug
    });
    setShowModal(true);
  };

  const handleDelete = async (marketId) => {
    if (!window.confirm('क्या आप वाकई इस बाज़ार को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      const response = await apiService.delete(`/admin/markets/${marketId}`);
      
      if (response.success) {
        showSuccess('बाज़ार डिलीट हो गया');
        loadMarkets();
        
        trackEvent('market_deleted', { marketId });
      }
    } catch (error) {
      showError('बाज़ार डिलीट करने में त्रुटि');
    }
  };

  const handleToggleStatus = async (marketId, currentStatus) => {
    try {
      const response = await apiService.patch(`/admin/markets/${marketId}/status`, {
        isActive: !currentStatus
      });

      if (response.success) {
        showSuccess('बाज़ार स्टेटस अपडेट हो गया');
        loadMarkets();
        
        trackEvent('market_status_toggled', {
          marketId,
          newStatus: !currentStatus
        });
      }
    } catch (error) {
      showError('स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const handleToggleFeatured = async (marketId, currentFeatured) => {
    try {
      const response = await apiService.patch(`/admin/markets/${marketId}/featured`, {
        isFeatured: !currentFeatured
      });

      if (response.success) {
        showSuccess('फीचर्ड स्टेटस अपडेट हो गया');
        loadMarkets();
        
        trackEvent('market_featured_toggled', {
          marketId,
          newFeatured: !currentFeatured
        });
      }
    } catch (error) {
      showError('फीचर्ड स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      location: '',
      city: '',
      state: '',
      pincode: '',
      speciality: '',
      image: '',
      bannerImage: '',
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      openingHours: '',
      contactNumber: '',
      email: '',
      website: '',
      metaTitle: '',
      metaDescription: '',
      slug: ''
    });
    setEditingMarket(null);
    setErrors({});
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const getMarketStats = () => {
    const total = markets.length;
    const active = markets.filter(m => m.isActive).length;
    const featured = markets.filter(m => m.isFeatured).length;
    const inactive = total - active;

    return { total, active, featured, inactive };
  };

  const stats = getMarketStats();

  if (loading) {
    return <LoadingSpinner fullScreen text="बाज़ार लोड हो रहे हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">बाज़ार प्रबंधन</h1>
          <p className="text-gray-600 mt-1">विभिन्न बाज़ारों को प्रबंधित करें</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          नया बाज़ार जोड़ें
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🏪</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">कुल बाज़ार</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">सक्रिय बाज़ार</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-lg">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">फीचर्ड बाज़ार</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.featured}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-lg">❌</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">निष्क्रिय बाज़ार</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="बाज़ार खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">सभी स्टेटस</option>
              <option value="active">सक्रिय</option>
              <option value="inactive">निष्क्रिय</option>
              <option value="featured">फीचर्ड</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                loadMarkets();
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              फिल्टर रीसेट करें
            </button>
          </div>
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {markets.map((market) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Market Image */}
              <div className="relative h-48 bg-gray-200">
                {market.image ? (
                  <img
                    src={market.image}
                    alt={market.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">🏪</span>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    market.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {market.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </span>
                  
                  {market.isFeatured && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      फीचर्ड
                    </span>
                  )}
                </div>
              </div>

              {/* Market Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                    <p className="text-sm text-gray-500">{market.nameEn}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {market.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>{market.city}, {market.state}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🎯</span>
                    <span>{market.speciality}</span>
                  </div>
                  {market.contactNumber && (
                    <div className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>{market.contactNumber}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(market.id, market.isActive)}
                      className={`text-xs px-3 py-1 rounded ${
                        market.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {market.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                    </button>
                    
                    <button
                      onClick={() => handleToggleFeatured(market.id, market.isFeatured)}
                      className={`text-xs px-3 py-1 rounded ${
                        market.isFeatured
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {market.isFeatured ? 'अनफीचर करें' : 'फीचर करें'}
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(market)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      संपादित करें
                    </button>
                    <button
                      onClick={() => handleDelete(market.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      डिलीट करें
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50"
          >
            पिछला
          </button>
          
          <span className="px-3 py-2 text-sm">
            पेज {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded disabled:opacity-50"
          >
            अगला
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingMarket ? 'बाज़ार संपादित करें' : 'नया बाज़ार जोड़ें'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name (Hindi) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                बाज़ार नाम (हिंदी) *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="जैसे: चांदनी चौक"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Name (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                बाज़ार नाम (अंग्रेजी) *
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nameEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Chandni Chowk"
              />
              {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                शहर *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="नई दिल्ली"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                राज्य *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="दिल्ली"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                पिन कोड *
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="110001"
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>

            {/* Speciality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                विशेषता *
              </label>
              <input
                type="text"
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.speciality ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="जैसे: हस्तशिल्प, वस्त्र, आभूषण"
              />
              {errors.speciality && <p className="text-red-500 text-sm mt-1">{errors.speciality}</p>}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                संपर्क नंबर
              </label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ईमेल
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="market@example.com"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                वेबसाइट
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                क्रम संख्या
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                min="0"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              पूरा पता *
            </label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              rows={2}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="बाज़ार का पूरा पता..."
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              विवरण *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="बाज़ार का विस्तृत विवरण..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              खुलने का समय
            </label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="सुबह 10:00 - शाम 8:00"
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मुख्य चित्र
              </label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="markets"
                aspectRatio="4:3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                बैनर चित्र
              </label>
              <ImageUpload
                value={formData.bannerImage}
                onChange={(url) => setFormData(prev => ({ ...prev, bannerImage: url }))}
                folder="markets/banners"
                aspectRatio="16:9"
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO सेटिंग्स</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  स्लग
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="chandni-chowk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मेटा टाइटल
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="SEO टाइटल..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  मेटा विवरण
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="SEO विवरण..."
                />
              </div>
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                बाज़ार को सक्रिय करें
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                फीचर्ड बाज़ार बनाएं
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={submitting}
            >
              रद्द करें
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner size="small" color="white" />
              ) : editingMarket ? (
                'अपडेट करें'
              ) : (
                'बनाएं'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MarketManagement;
