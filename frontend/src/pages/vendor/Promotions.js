import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import VendorSidebar from '../components/VendorSidebar';

const Promotions = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get, post, put, delete: deletePromotion } = useAPI();
  const { showSuccess, showError, showInfo } = useNotification();

  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [promotionForm, setPromotionForm] = useState({
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    code: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    usageLimitPerUser: '',
    startDate: '',
    endDate: '',
    applicableProducts: [],
    applicableCategories: [],
    isActive: true,
    isAutomatic: false,
    conditions: {
      firstTimeUser: false,
      minimumPurchase: false,
      specificProducts: false,
      specificCategories: false
    }
  });
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    { id: 'jewelry', name: 'आभूषण' },
    { id: 'clothing', name: 'कपड़े' },
    { id: 'handicrafts', name: 'हस्तशिल्प' },
    { id: 'books', name: 'किताबें' },
    { id: 'accessories', name: 'एक्सेसरीज' },
    { id: 'houseware', name: 'घरेलू सामान' }
  ]);

  const promotionTypes = [
    { id: 'percentage', name: 'प्रतिशत छूट (%)', icon: '%' },
    { id: 'fixed', name: 'निश्चित राशि छूट (₹)', icon: '₹' },
    { id: 'buy_x_get_y', name: 'Buy X Get Y', icon: '🎁' },
    { id: 'free_shipping', name: 'मुफ्त डिलीवरी', icon: '🚚' },
    { id: 'bundle', name: 'बंडल डील', icon: '📦' }
  ];

  const tabs = [
    { id: 'active', name: 'सक्रिय प्रमोशन', icon: '✅', count: 0 },
    { id: 'scheduled', name: 'शेड्यूल्ड', icon: '⏰', count: 0 },
    { id: 'expired', name: 'समाप्त', icon: '❌', count: 0 },
    { id: 'draft', name: 'ड्राफ्ट', icon: '📝', count: 0 }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }
    loadPromotions();
    loadProducts();
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterPromotions();
  }, [promotions, activeTab]);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const response = await get('/vendor/promotions');
      if (response.success) {
        setPromotions(response.promotions);
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      // Mock data for demo
      const mockPromotions = [
        {
          id: 1,
          name: 'दिवाली महोत्सव',
          description: 'दिवाली के त्योहार पर सभी आभूषणों पर विशेष छूट',
          type: 'percentage',
          value: 25,
          code: 'DIWALI25',
          minOrderAmount: 2000,
          maxDiscount: 5000,
          usageLimit: 100,
          usageLimitPerUser: 2,
          startDate: '2025-10-15T00:00:00Z',
          endDate: '2025-11-15T23:59:59Z',
          applicableProducts: [1, 2],
          applicableCategories: ['jewelry'],
          isActive: true,
          isAutomatic: false,
          status: 'scheduled',
          totalUsage: 0,
          totalRevenue: 0,
          createdAt: '2025-08-01T10:30:00Z',
          conditions: {
            firstTimeUser: false,
            minimumPurchase: true,
            specificProducts: true,
            specificCategories: true
          }
        },
        {
          id: 2,
          name: 'पहली खरीदारी छूट',
          description: 'नए ग्राहकों के लिए पहली खरीदारी पर छूट',
          type: 'percentage',
          value: 15,
          code: 'FIRST15',
          minOrderAmount: 1000,
          maxDiscount: 2000,
          usageLimit: 500,
          usageLimitPerUser: 1,
          startDate: '2025-08-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
          applicableProducts: [],
          applicableCategories: [],
          isActive: true,
          isAutomatic: true,
          status: 'active',
          totalUsage: 45,
          totalRevenue: 67500,
          createdAt: '2025-08-01T10:30:00Z',
          conditions: {
            firstTimeUser: true,
            minimumPurchase: true,
            specificProducts: false,
            specificCategories: false
          }
        },
        {
          id: 3,
          name: 'मुफ्त डिलीवरी',
          description: '₹3000 से अधिक की खरीदारी पर मुफ्त डिलीवरी',
          type: 'free_shipping',
          value: 0,
          code: 'FREESHIP',
          minOrderAmount: 3000,
          maxDiscount: 200,
          usageLimit: 1000,
          usageLimitPerUser: 5,
          startDate: '2025-08-01T00:00:00Z',
          endDate: '2025-09-30T23:59:59Z',
          applicableProducts: [],
          applicableCategories: [],
          isActive: true,
          isAutomatic: true,
          status: 'active',
          totalUsage: 123,
          totalRevenue: 0,
          createdAt: '2025-08-01T10:30:00Z',
          conditions: {
            firstTimeUser: false,
            minimumPurchase: true,
            specificProducts: false,
            specificCategories: false
          }
        },
        {
          id: 4,
          name: 'गर्मी की छुट्टियां',
          description: 'समर कलेक्शन पर विशेष छूट',
          type: 'percentage',
          value: 20,
          code: 'SUMMER20',
          minOrderAmount: 1500,
          maxDiscount: 3000,
          usageLimit: 200,
          usageLimitPerUser: 3,
          startDate: '2025-06-01T00:00:00Z',
          endDate: '2025-06-30T23:59:59Z',
          applicableProducts: [3, 4, 5],
          applicableCategories: ['clothing'],
          isActive: false,
          isAutomatic: false,
          status: 'expired',
          totalUsage: 87,
          totalRevenue: 174000,
          createdAt: '2025-05-15T10:30:00Z',
          conditions: {
            firstTimeUser: false,
            minimumPurchase: true,
            specificProducts: true,
            specificCategories: true
          }
        },
        {
          id: 5,
          name: 'विंटर कलेक्शन लॉन्च',
          description: 'नए विंटर कलेक्शन पर प्री-ऑर्डर छूट',
          type: 'fixed',
          value: 500,
          code: 'WINTER500',
          minOrderAmount: 2500,
          maxDiscount: 500,
          usageLimit: 50,
          usageLimitPerUser: 1,
          startDate: '',
          endDate: '',
          applicableProducts: [],
          applicableCategories: ['clothing'],
          isActive: false,
          isAutomatic: false,
          status: 'draft',
          totalUsage: 0,
          totalRevenue: 0,
          createdAt: '2025-08-04T06:00:00Z',
          conditions: {
            firstTimeUser: false,
            minimumPurchase: true,
            specificProducts: false,
            specificCategories: true
          }
        }
      ];
      setPromotions(mockPromotions);
    }
    setLoading(false);
  };

  const loadProducts = async () => {
    try {
      const response = await get('/vendor/products');
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      // Mock products
      setProducts([
        { id: 1, name: 'कुंदन पर्ल नेकलेस सेट', category: 'jewelry' },
        { id: 2, name: 'राजस्थानी चूड़ी सेट', category: 'jewelry' },
        { id: 3, name: 'हस्तनिर्मित पश्मीना शॉल', category: 'clothing' },
        { id: 4, name: 'लकड़ी की मूर्ति', category: 'handicrafts' },
        { id: 5, name: 'रेशम की साड़ी', category: 'clothing' }
      ]);
    }
  };

  const filterPromotions = () => {
    const now = new Date();
    let filtered = [];

    switch (activeTab) {
      case 'active':
        filtered = promotions.filter(promo => 
          promo.isActive && 
          new Date(promo.startDate) <= now && 
          new Date(promo.endDate) >= now
        );
        break;
      case 'scheduled':
        filtered = promotions.filter(promo => 
          promo.isActive && new Date(promo.startDate) > now
        );
        break;
      case 'expired':
        filtered = promotions.filter(promo => 
          new Date(promo.endDate) < now || promo.status === 'expired'
        );
        break;
      case 'draft':
        filtered = promotions.filter(promo => 
          promo.status === 'draft' || !promo.startDate || !promo.endDate
        );
        break;
      default:
        filtered = promotions;
    }

    // Update tab counts
    tabs[0].count = promotions.filter(promo => 
      promo.isActive && 
      new Date(promo.startDate) <= now && 
      new Date(promo.endDate) >= now
    ).length;
    tabs[1].count = promotions.filter(promo => 
      promo.isActive && new Date(promo.startDate) > now
    ).length;
    tabs[2].count = promotions.filter(promo => 
      new Date(promo.endDate) < now || promo.status === 'expired'
    ).length;
    tabs[3].count = promotions.filter(promo => 
      promo.status === 'draft' || !promo.startDate || !promo.endDate
    ).length;

    setFilteredPromotions(filtered);
  };

  const handleCreatePromotion = async () => {
    if (!promotionForm.name || !promotionForm.type || !promotionForm.value) {
      showError('कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    if (promotionForm.type !== 'free_shipping' && !promotionForm.code) {
      showError('कृपया प्रमोशन कोड डालें');
      return;
    }

    try {
      const response = await post('/vendor/promotions', promotionForm);
      if (response.success) {
        showSuccess('प्रमोशन सफलतापूर्वक बनाया गया!');
        setShowCreateModal(false);
        resetForm();
        loadPromotions();
      }
    } catch (error) {
      showError('प्रमोशन बनाने में त्रुटि');
    }
  };

  const handleUpdatePromotion = async () => {
    try {
      const response = await put(`/vendor/promotions/${selectedPromotion.id}`, promotionForm);
      if (response.success) {
        showSuccess('प्रमोशन अपडेट हो गया!');
        setShowEditModal(false);
        setSelectedPromotion(null);
        resetForm();
        loadPromotions();
      }
    } catch (error) {
      showError('प्रमोशन अपडेट करने में त्रुटि');
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!window.confirm('क्या आप वाकई इस प्रमोशन को डिलीट करना चाहते हैं?')) {
      return;
    }

    try {
      const response = await deletePromotion(`/vendor/promotions/${promotionId}`);
      if (response.success) {
        showSuccess('प्रमोशन डिलीट हो गया!');
        loadPromotions();
      }
    } catch (error) {
      showError('प्रमोशन डिलीट करने में त्रुटि');
    }
  };

  const handleTogglePromotion = async (promotionId, isActive) => {
    try {
      const response = await put(`/vendor/promotions/${promotionId}/toggle`, { isActive: !isActive });
      if (response.success) {
        showSuccess(`प्रमोशन ${!isActive ? 'सक्रिय' : 'निष्क्रिय'} हो गया!`);
        loadPromotions();
      }
    } catch (error) {
      showError('प्रमोशन टॉगल करने में त्रुटि');
    }
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setPromotionForm({
      name: promotion.name,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value.toString(),
      code: promotion.code,
      minOrderAmount: promotion.minOrderAmount.toString(),
      maxDiscount: promotion.maxDiscount.toString(),
      usageLimit: promotion.usageLimit.toString(),
      usageLimitPerUser: promotion.usageLimitPerUser.toString(),
      startDate: promotion.startDate ? promotion.startDate.slice(0, 16) : '',
      endDate: promotion.endDate ? promotion.endDate.slice(0, 16) : '',
      applicableProducts: promotion.applicableProducts || [],
      applicableCategories: promotion.applicableCategories || [],
      isActive: promotion.isActive,
      isAutomatic: promotion.isAutomatic,
      conditions: promotion.conditions || {
        firstTimeUser: false,
        minimumPurchase: false,
        specificProducts: false,
        specificCategories: false
      }
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setPromotionForm({
      name: '',
      description: '',
      type: 'percentage',
      value: '',
      code: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      usageLimitPerUser: '',
      startDate: '',
      endDate: '',
      applicableProducts: [],
      applicableCategories: [],
      isActive: true,
      isAutomatic: false,
      conditions: {
        firstTimeUser: false,
        minimumPurchase: false,
        specificProducts: false,
        specificCategories: false
      }
    });
  };

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPromotionForm({...promotionForm, code: result});
  };

  const getPromotionStatus = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.startDate || !promotion.endDate) {
      return { status: 'draft', label: 'ड्राफ्ट', color: 'gray' };
    }

    if (!promotion.isActive) {
      return { status: 'inactive', label: 'निष्क्रिय', color: 'gray' };
    }

    if (now < startDate) {
      return { status: 'scheduled', label: 'शेड्यूल्ड', color: 'blue' };
    }

    if (now > endDate) {
      return { status: 'expired', label: 'समाप्त', color: 'red' };
    }

    return { status: 'active', label: 'सक्रिय', color: 'green' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'अनिर्धारित';
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner message="प्रमोशन्स लोड हो रहे हैं..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🎯 प्रमोशन प्रबंधन
          </h1>
          <p className="text-emerald-600 text-lg">
            अपने उत्पादों के लिए आकर्षक ऑफर और छूट बनाएं
          </p>
        </div>

        <div className="flex gap-8">
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <VendorSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">सक्रिय प्रमोशन्स</p>
                    <p className="text-3xl font-bold">{tabs[0].count}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">कुल उपयोग</p>
                    <p className="text-3xl font-bold">
                      {promotions.reduce((sum, promo) => sum + (promo.totalUsage || 0), 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">कुल रेवेन्यू</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(promotions.reduce((sum, promo) => sum + (promo.totalRevenue || 0), 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">शेड्यूल्ड</p>
                    <p className="text-3xl font-bold">{tabs[1].count}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⏰</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs and Create Button */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-1 bg-emerald-100 rounded-xl p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-emerald-800 shadow-sm'
                          : 'text-emerald-600 hover:text-emerald-800'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        activeTab === tab.id ? 'bg-emerald-100' : 'bg-emerald-200'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>➕</span>
                  <span>नया प्रमोशन बनाएं</span>
                </button>
              </div>
            </div>

            {/* Promotions Grid */}
            {filteredPromotions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPromotions.map((promotion) => {
                  const statusInfo = getPromotionStatus(promotion);
                  return (
                    <div key={promotion.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-emerald-800">{promotion.name}</h3>
                          <p className="text-emerald-600 text-sm">{promotion.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                            statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Promotion Details */}
                      <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-emerald-600 text-sm">प्रकार:</span>
                            <p className="font-semibold">
                              {promotionTypes.find(t => t.id === promotion.type)?.name}
                            </p>
                          </div>
                          <div>
                            <span className="text-emerald-600 text-sm">छूट:</span>
                            <p className="font-semibold">
                              {promotion.type === 'percentage' ? `${promotion.value}%` :
                               promotion.type === 'fixed' ? formatCurrency(promotion.value) :
                               promotion.type === 'free_shipping' ? 'मुफ्त शिपिंग' :
                               `${promotion.value}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-emerald-600 text-sm">कोड:</span>
                            <p className="font-semibold font-mono">{promotion.code || 'स्वचालित'}</p>
                          </div>
                          <div>
                            <span className="text-emerald-600 text-sm">न्यूनतम ऑर्डर:</span>
                            <p className="font-semibold">{formatCurrency(promotion.minOrderAmount)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Usage Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-800">{promotion.totalUsage || 0}</p>
                          <p className="text-emerald-600 text-xs">उपयोग</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-800">{promotion.usageLimit - (promotion.totalUsage || 0)}</p>
                          <p className="text-emerald-600 text-xs">बचे हुए</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-800">{formatCurrency(promotion.totalRevenue || 0)}</p>
                          <p className="text-emerald-600 text-xs">रेवेन्यू</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-emerald-600">
                          <span>शुरुआत: {formatDate(promotion.startDate)}</span>
                          <span>समाप्ति: {formatDate(promotion.endDate)}</span>
                        </div>
                        {promotion.startDate && promotion.endDate && (
                          <div className="w-full bg-emerald-100 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full ${
                                statusInfo.color === 'green' ? 'bg-emerald-500' :
                                statusInfo.color === 'blue' ? 'bg-blue-500' :
                                statusInfo.color === 'red' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}
                              style={{
                                width: statusInfo.status === 'active' ? 
                                  `${Math.min(100, ((new Date() - new Date(promotion.startDate)) / (new Date(promotion.endDate) - new Date(promotion.startDate))) * 100)}%` :
                                  statusInfo.status === 'expired' ? '100%' : '0%'
                              }}
                            ></div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPromotion(promotion)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                            title="संपादित करें"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleTogglePromotion(promotion.id, promotion.isActive)}
                            className={`p-2 rounded-lg ${
                              promotion.isActive 
                                ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title={promotion.isActive ? 'निष्क्रिय करें' : 'सक्रिय करें'}
                          >
                            {promotion.isActive ? '⏸️' : '▶️'}
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promotion.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                            title="डिलीट करें"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        {promotion.code && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(promotion.code);
                              showSuccess('कोड कॉपी हो गया!');
                            }}
                            className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg hover:bg-emerald-200 text-sm font-mono"
                          >
                            {promotion.code} 📋
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🎯</div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">
                  {activeTab === 'active' ? 'कोई सक्रिय प्रमोशन नहीं' :
                   activeTab === 'scheduled' ? 'कोई शेड्यूल्ड प्रमोशन नहीं' :
                   activeTab === 'expired' ? 'कोई समाप्त प्रमोशन नहीं' :
                   'कोई ड्राफ्ट प्रमोशन नहीं'}
                </h2>
                <p className="text-emerald-600 mb-8">
                  अपने उत्पादों की बिक्री बढ़ाने के लिए आकर्षक प्रमोशन बनाएं
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors duration-200"
                >
                  पहला प्रमोशन बनाएं
                </button>
              </div>
            )}

            {/* Create/Edit Promotion Modal */}
            {(showCreateModal || showEditModal) && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-emerald-800">
                      {showCreateModal ? 'नया प्रमोशन बनाएं' : 'प्रमोशन एडिट करें'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedPromotion(null);
                        resetForm();
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">प्रमोशन नाम *</label>
                        <input
                          type="text"
                          value={promotionForm.name}
                          onChange={(e) => setPromotionForm({...promotionForm, name: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="जैसे: दिवाली महोत्सव"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">प्रमोशन प्रकार *</label>
                        <select
                          value={promotionForm.type}
                          onChange={(e) => setPromotionForm({...promotionForm, type: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          {promotionTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.icon} {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-emerald-800 font-semibold mb-2">विवरण</label>
                      <textarea
                        value={promotionForm.description}
                        onChange={(e) => setPromotionForm({...promotionForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
                        placeholder="प्रमोशन का विस्तृत विवरण..."
                      ></textarea>
                    </div>

                    {/* Value and Code */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {promotionForm.type !== 'free_shipping' && (
                        <div>
                          <label className="block text-emerald-800 font-semibold mb-2">
                            छूट {promotionForm.type === 'percentage' ? '(%)' : '(₹)'} *
                          </label>
                          <input
                            type="number"
                            value={promotionForm.value}
                            onChange={(e) => setPromotionForm({...promotionForm, value: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                            placeholder={promotionForm.type === 'percentage' ? '25' : '500'}
                          />
                        </div>
                      )}

                      {promotionForm.type !== 'free_shipping' && (
                        <div>
                          <label className="block text-emerald-800 font-semibold mb-2">प्रमोशन कोड *</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={promotionForm.code}
                              onChange={(e) => setPromotionForm({...promotionForm, code: e.target.value.toUpperCase()})}
                              className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none font-mono"
                              placeholder="PROMO25"
                            />
                            <button
                              onClick={generatePromoCode}
                              className="bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600"
                              title="कोड जेनरेट करें"
                            >
                              🎲
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Limits and Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">न्यूनतम ऑर्डर राशि (₹)</label>
                        <input
                          type="number"
                          value={promotionForm.minOrderAmount}
                          onChange={(e) => setPromotionForm({...promotionForm, minOrderAmount: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="1000"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">अधिकतम छूट (₹)</label>
                        <input
                          type="number"
                          value={promotionForm.maxDiscount}
                          onChange={(e) => setPromotionForm({...promotionForm, maxDiscount: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="2000"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">कुल उपयोग सीमा</label>
                        <input
                          type="number"
                          value={promotionForm.usageLimit}
                          onChange={(e) => setPromotionForm({...promotionForm, usageLimit: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="100"
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">शुरुआती तारीख</label>
                        <input
                          type="datetime-local"
                          value={promotionForm.startDate}
                          onChange={(e) => setPromotionForm({...promotionForm, startDate: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">समाप्ति तारीख</label>
                        <input
                          type="datetime-local"
                          value={promotionForm.endDate}
                          onChange={(e) => setPromotionForm({...promotionForm, endDate: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={promotionForm.isActive}
                            onChange={(e) => setPromotionForm({...promotionForm, isActive: e.target.checked})}
                            className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                          />
                          <span>प्रमोशन सक्रिय करें</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={promotionForm.isAutomatic}
                            onChange={(e) => setPromotionForm({...promotionForm, isAutomatic: e.target.checked})}
                            className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                          />
                          <span>स्वचालित लागू करें (कोड की जरूरत नहीं)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">प्रति यूज़र सीमा</label>
                        <input
                          type="number"
                          value={promotionForm.usageLimitPerUser}
                          onChange={(e) => setPromotionForm({...promotionForm, usageLimitPerUser: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="2"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-emerald-200">
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          setShowEditModal(false);
                          setSelectedPromotion(null);
                          resetForm();
                        }}
                        className="px-6 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50"
                      >
                        रद्द करें
                      </button>
                      <button
                        onClick={showCreateModal ? handleCreatePromotion : handleUpdatePromotion}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
                      >
                        {showCreateModal ? 'प्रमोशन बनाएं' : 'अपडेट करें'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions;