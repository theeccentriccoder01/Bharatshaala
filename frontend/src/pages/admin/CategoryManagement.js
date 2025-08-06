// Category Management Component for Bharatshala Admin Panel
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

const CategoryManagement = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    icon: '',
    image: '',
    parentId: '',
    isActive: true,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
    slug: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, [currentPage, searchTerm, filterStatus, sortBy]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/categories', {
        params: {
          page: currentPage,
          search: searchTerm,
          status: filterStatus,
          sortBy,
          limit: 20
        }
      });

      if (response.success) {
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      showError('श्रेणियां लोड करने में त्रुटि');
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
      newErrors.name = 'श्रेणी नाम आवश्यक है';
    }

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'अंग्रेजी नाम आवश्यक है';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'विवरण आवश्यक है';
    }

    if (!formData.icon) {
      newErrors.icon = 'आइकन आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const endpoint = editingCategory 
        ? `/admin/categories/${editingCategory.id}`
        : '/admin/categories';
      
      const method = editingCategory ? 'put' : 'post';
      
      const response = await apiService[method](endpoint, formData);

      if (response.success) {
        showSuccess(editingCategory ? 'श्रेणी अपडेट हो गई' : 'श्रेणी बनाई गई');
        setShowModal(false);
        resetForm();
        loadCategories();
        
        trackEvent(editingCategory ? 'category_updated' : 'category_created', {
          categoryId: response.data.id,
          categoryName: formData.name
        });
      }
    } catch (error) {
      showError(error.response?.data?.message || 'श्रेणी सेव करने में त्रुटि');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn,
      description: category.description,
      icon: category.icon,
      image: category.image,
      parentId: category.parentId || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      slug: category.slug
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('क्या आप वाकई इस श्रेणी को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      const response = await apiService.delete(`/admin/categories/${categoryId}`);
      
      if (response.success) {
        showSuccess('श्रेणी डिलीट हो गई');
        loadCategories();
        
        trackEvent('category_deleted', { categoryId });
      }
    } catch (error) {
      showError('श्रेणी डिलीट करने में त्रुटि');
    }
  };

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      const response = await apiService.patch(`/admin/categories/${categoryId}/status`, {
        isActive: !currentStatus
      });

      if (response.success) {
        showSuccess('श्रेणी स्टेटस अपडेट हो गया');
        loadCategories();
        
        trackEvent('category_status_toggled', {
          categoryId,
          newStatus: !currentStatus
        });
      }
    } catch (error) {
      showError('स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      icon: '',
      image: '',
      parentId: '',
      isActive: true,
      sortOrder: 0,
      metaTitle: '',
      metaDescription: '',
      slug: ''
    });
    setEditingCategory(null);
    setErrors({});
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="श्रेणियां लोड हो रही हैं..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">श्रेणी प्रबंधन</h1>
          <p className="text-gray-600 mt-1">उत्पाद श्रेणियों को प्रबंधित करें</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          नई श्रेणी जोड़ें
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="श्रेणी खोजें..."
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
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="name">नाम से</option>
              <option value="created_at">बनाने की तारीख से</option>
              <option value="sort_order">क्रम से</option>
            </select>
          </div>
          
          <div>
            <button
              onClick={loadCategories}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              फिल्टर रीसेट करें
            </button>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  श्रेणी
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  विवरण
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  स्टेटस
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  क्रम
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  बनाई गई
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  कार्य
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredCategories.map((category) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{category.icon}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {category.nameEn}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category.id, category.isActive)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {category.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.sortOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {helpers.date.formatDate(category.createdAt, 'DD MMM YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          संपादित करें
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          डिलीट करें
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                पेज {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  पिछला
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  अगला
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingCategory ? 'श्रेणी संपादित करें' : 'नई श्रेणी जोड़ें'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name (Hindi) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                श्रेणी नाम (हिंदी) *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="हस्तशिल्प"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Name (English) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                श्रेणी नाम (अंग्रेजी) *
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.nameEn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Handicrafts"
              />
              {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                आइकन *
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.icon ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="🎨"
              />
              {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
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

            {/* Parent Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                मुख्य श्रेणी
              </label>
              <select
                name="parentId"
                value={formData.parentId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">कोई नहीं</option>
                {categories
                  .filter(cat => cat.id !== editingCategory?.id)
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Slug */}
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
                placeholder="handicrafts"
              />
            </div>
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
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="श्रेणी का विवरण..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              श्रेणी चित्र
            </label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
              folder="categories"
              aspectRatio="square"
            />
          </div>

          {/* SEO Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO सेटिंग्स</h3>
            
            <div className="space-y-4">
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

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              श्रेणी को सक्रिय करें
            </label>
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
              ) : editingCategory ? (
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

export default CategoryManagement;