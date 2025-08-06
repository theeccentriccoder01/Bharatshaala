// Content Management System for Bharatshala Admin Panel
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { useAnalytics } from '../analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import apiService from '../apiService';
import { helpers } from '../helpers';

const ContentManagement = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { trackEvent } = useAnalytics();

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [activeTab, setActiveTab] = useState('pages');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    type: 'page',
    status: 'draft',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    tags: [],
    publishedAt: '',
    author: user?.id || ''
  });

  const [errors, setErrors] = useState({});

  const contentTypes = [
    { key: 'page', label: 'पेज', icon: '📄' },
    { key: 'blog', label: 'ब्लॉग', icon: '📝' },
    { key: 'faq', label: 'FAQ', icon: '❓' },
    { key: 'policy', label: 'नीति', icon: '📋' },
    { key: 'banner', label: 'बैनर', icon: '🎨' }
  ];

  useEffect(() => {
    loadContents();
  }, [activeTab, searchTerm, filterStatus]);

  const loadContents = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/contents', {
        params: {
          type: activeTab,
          search: searchTerm,
          status: filterStatus
        }
      });

      if (response.success) {
        setContents(response.data);
      }
    } catch (error) {
      showError('कंटेंट लोड करने में त्रुटि');
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

    // Auto-generate slug from title
    if (name === 'title') {
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

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleTagsChange = (tags) => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'शीर्षक आवश्यक है';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'स्लग आवश्यक है';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'कंटेंट आवश्यक है';
    }

    if (formData.type === 'blog' && !formData.excerpt.trim()) {
      newErrors.excerpt = 'सारांश आवश्यक है';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const submitData = {
        ...formData,
        type: activeTab,
        author: user.id,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null
      };

      const endpoint = editingContent 
        ? `/admin/contents/${editingContent.id}`
        : '/admin/contents';
      
      const method = editingContent ? 'put' : 'post';
      
      const response = await apiService[method](endpoint, submitData);

      if (response.success) {
        showSuccess(editingContent ? 'कंटेंट अपडेट हो गया' : 'कंटेंट बनाया गया');
        setShowModal(false);
        resetForm();
        loadContents();
        
        trackEvent(editingContent ? 'content_updated' : 'content_created', {
          contentId: response.data.id,
          contentType: activeTab,
          title: formData.title
        });
      }
    } catch (error) {
      showError(error.response?.data?.message || 'कंटेंट सेव करने में त्रुटि');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      slug: content.slug,
      content: content.content,
      excerpt: content.excerpt || '',
      type: content.type,
      status: content.status,
      featuredImage: content.featuredImage || '',
      metaTitle: content.metaTitle || '',
      metaDescription: content.metaDescription || '',
      tags: content.tags || [],
      publishedAt: content.publishedAt || '',
      author: content.author
    });
    setShowModal(true);
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm('क्या आप वाकई इस कंटेंट को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      const response = await apiService.delete(`/admin/contents/${contentId}`);
      
      if (response.success) {
        showSuccess('कंटेंट डिलीट हो गया');
        loadContents();
        
        trackEvent('content_deleted', { contentId });
      }
    } catch (error) {
      showError('कंटेंट डिलीट करने में त्रुटि');
    }
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      const response = await apiService.patch(`/admin/contents/${contentId}/status`, {
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : null
      });

      if (response.success) {
        showSuccess('स्टेटस अपडेट हो गया');
        loadContents();
        
        trackEvent('content_status_changed', {
          contentId,
          newStatus
        });
      }
    } catch (error) {
      showError('स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      type: 'page',
      status: 'draft',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      tags: [],
      publishedAt: '',
      author: user?.id || ''
    });
    setEditingContent(null);
    setErrors({});
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published': return 'प्रकाशित';
      case 'draft': return 'मसौदा';
      case 'archived': return 'संग्रहीत';
      default: return status;
    }
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="कंटेंट लोड हो रहा है..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">कंटेंट प्रबंधन</h1>
          <p className="text-gray-600 mt-1">वेबसाइट कंटेंट को प्रबंधित करें</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
        >
          नया कंटेंट बनाएं
        </button>
      </div>

      {/* Content Type Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {contentTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setActiveTab(type.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === type.key
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="कंटेंट खोजें..."
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
                <option value="published">प्रकाशित</option>
                <option value="draft">मसौदा</option>
                <option value="archived">संग्रहीत</option>
              </select>
            </div>
            
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                फिल्टर रीसेट करें
              </button>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredContents.map((content) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {content.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}>
                        {getStatusLabel(content.status)}
                      </span>
                    </div>
                    
                    {content.excerpt && (
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {content.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>लेखक: {content.authorName}</span>
                      <span>•</span>
                      <span>बनाया गया: {helpers.date.formatDate(content.createdAt, 'DD MMM YYYY')}</span>
                      {content.publishedAt && (
                        <>
                          <span>•</span>
                          <span>प्रकाशित: {helpers.date.formatDate(content.publishedAt, 'DD MMM YYYY')}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Status Change Dropdown */}
                    <select
                      value={content.status}
                      onChange={(e) => handleStatusChange(content.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="draft">मसौदा</option>
                      <option value="published">प्रकाशित</option>
                      <option value="archived">संग्रहीत</option>
                    </select>
                    
                    <button
                      onClick={() => handleEdit(content)}
                      className="text-emerald-600 hover:text-emerald-900 px-3 py-1 text-sm"
                    >
                      संपादित करें
                    </button>
                    
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 text-sm"
                    >
                      डिलीट करें
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredContents.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📝</div>
              <p>कोई कंटेंट नहीं मिला</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingContent ? 'कंटेंट संपादित करें' : 'नया कंटेंट बनाएं'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                शीर्षक *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="कंटेंट का शीर्षक..."
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                स्लग *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="content-slug"
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                स्टेटस
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="draft">मसौदा</option>
                <option value="published">प्रकाशित</option>
                <option value="archived">संग्रहीत</option>
              </select>
            </div>
          </div>

          {/* Excerpt (for blog posts) */}
          {activeTab === 'blog' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                सारांश *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.excerpt ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="कंटेंट का संक्षिप्त विवरण..."
              />
              {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कंटेंट *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="यहाँ अपना कंटेंट लिखें..."
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              मुख्य चित्र
            </label>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(url) => setFormData(prev => ({ ...prev, featuredImage: url }))}
              folder="content"
              aspectRatio="16:9"
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
              ) : editingContent ? (
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

export default ContentManagement;