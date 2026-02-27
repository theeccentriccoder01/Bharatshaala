import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAPI } from '../../hooks/useAPI';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';
import VendorSidebar from '../../components/VendorSidebar';

const Inventory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { get, put, post } = useAPI();
  const { showSuccess, showError, showWarning } = useNotification();

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name_asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState({
    action: '',
    price: '',
    quantity: '',
    status: ''
  });
  const [showStockAlert, setShowStockAlert] = useState(false);
  const [lowStockItems, setLowStockItems] = useState([]);

  const statusOptions = [
    { id: 'all', name: 'सभी स्टेटस', count: 0 },
    { id: 'active', name: 'सक्रिय', count: 0, color: 'green' },
    { id: 'inactive', name: 'निष्क्रिय', count: 0, color: 'gray' },
    { id: 'out_of_stock', name: 'स्टॉक खत्म', count: 0, color: 'red' },
    { id: 'low_stock', name: 'कम स्टॉक', count: 0, color: 'yellow' }
  ];

  const categories = [
    { id: 'all', name: 'सभी श्रेणियां' },
    { id: 'jewelry', name: 'आभूषण' },
    { id: 'clothing', name: 'कपड़े' },
    { id: 'handicrafts', name: 'हस्तशिल्प' },
    { id: 'books', name: 'किताबें' },
    { id: 'accessories', name: 'एक्सेसरीज' },
    { id: 'houseware', name: 'घरेलू सामान' }
  ];

  const sortOptions = [
    { id: 'name_asc', name: 'नाम (अ-ज्ञ)' },
    { id: 'name_desc', name: 'नाम (ज्ञ-अ)' },
    { id: 'price_low', name: 'कम कीमत पहले' },
    { id: 'price_high', name: 'ज्यादा कीमत पहले' },
    { id: 'stock_low', name: 'कम स्टॉक पहले' },
    { id: 'stock_high', name: 'ज्यादा स्टॉक पहले' },
    { id: 'created_desc', name: 'नए पहले' },
    { id: 'updated_desc', name: 'हाल में अपडेट' }
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'vendor') {
      navigate('/vendor/login');
      return;
    }
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterAndSortInventory();
    checkLowStockItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory, searchTerm, filterStatus, filterCategory, sortBy]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const response = await get('/vendor/inventory');
      if (response.success) {
        setInventory(response.inventory);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
      // Mock data for demo
      const mockInventory = [
        {
          id: 1,
          name: 'कुंदन पर्ल नेकलेस सेट',
          nameEn: 'Kundan Pearl Necklace Set',
          sku: 'KPN-001',
          category: 'jewelry',
          price: 15999,
          costPrice: 12000,
          currentStock: 5,
          minStockLevel: 3,
          maxStockLevel: 20,
          status: 'active',
          image: '/images/items/kundan-necklace-1.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2025-08-03T14:20:00Z',
          views: 245,
          orders: 12,
          revenue: 191988,
          rating: 4.6,
          reviewCount: 8,
          vendor: user?.id || 'vendor-1',
          variants: [
            { id: 1, name: 'गोल्ड प्लेटेड', stock: 3, price: 15999 },
            { id: 2, name: 'सिल्वर प्लेटेड', stock: 2, price: 12999 }
          ],
          tags: ['कुंदन', 'पर्ल', 'नेकलेस', 'traditional'],
          description: 'पारंपरिक कुंदन कारीगरी के साथ बना हुआ खूबसूरत हार सेट',
          weight: '45g',
          dimensions: '18 inch',
          material: 'Sterling Silver, Kundan, Pearl'
        },
        {
          id: 2,
          name: 'राजस्थानी चूड़ी सेट',
          nameEn: 'Rajasthani Bangle Set',
          sku: 'RBS-002',
          category: 'jewelry',
          price: 2999,
          costPrice: 2000,
          currentStock: 1,
          minStockLevel: 5,
          maxStockLevel: 25,
          status: 'low_stock',
          image: '/images/items/bangles.jpg',
          createdAt: '2024-01-20T11:45:00Z',
          updatedAt: '2025-08-04T06:00:00Z',
          views: 156,
          orders: 23,
          revenue: 68977,
          rating: 4.3,
          reviewCount: 15,
          vendor: user?.id || 'vendor-1',
          variants: [
            { id: 1, name: 'छोटा साइज़', stock: 0, price: 2999 },
            { id: 2, name: 'मध्यम साइज़', stock: 1, price: 2999 },
            { id: 3, name: 'बड़ा साइज़', stock: 0, price: 2999 }
          ],
          tags: ['चूड़ी', 'राजस्थानी', 'colorful', 'traditional'],
          description: 'रंग-बिरंगी राजस्थानी चूड़ियों का सुंदर सेट',
          weight: '150g',
          dimensions: 'Adjustable',
          material: 'Brass, Lac, Glass'
        },
        {
          id: 3,
          name: 'हस्तनिर्मित पश्मीना शॉल',
          nameEn: 'Handwoven Pashmina Shawl',
          sku: 'HPS-003',
          category: 'clothing',
          price: 8999,
          costPrice: 6500,
          currentStock: 0,
          minStockLevel: 2,
          maxStockLevel: 10,
          status: 'out_of_stock',
          image: '/images/items/shawl.jpg',
          createdAt: '2024-02-01T09:15:00Z',
          updatedAt: '2025-08-02T12:30:00Z',
          views: 89,
          orders: 7,
          revenue: 62993,
          rating: 4.8,
          reviewCount: 6,
          vendor: user?.id || 'vendor-1',
          variants: [
            { id: 1, name: 'बेज रंग', stock: 0, price: 8999 },
            { id: 2, name: 'ब्राउन रंग', stock: 0, price: 8999 }
          ],
          tags: ['पश्मीना', 'handwoven', 'shawl', 'kashmiri'],
          description: 'हाथ से बुना गया असली पश्मीना शॉल',
          weight: '200g',
          dimensions: '200cm x 70cm',
          material: '100% Pashmina Wool'
        },
        {
          id: 4,
          name: 'लकड़ी की हस्तशिल्प मूर्ति',
          nameEn: 'Wooden Handicraft Sculpture',
          sku: 'WHS-004',
          category: 'handicrafts',
          price: 3499,
          costPrice: 2500,
          currentStock: 8,
          minStockLevel: 3,
          maxStockLevel: 15,
          status: 'active',
          image: '/images/items/wooden-sculpture.jpeg',
          createdAt: '2024-01-25T16:20:00Z',
          updatedAt: '2025-08-01T10:45:00Z',
          views: 67,
          orders: 4,
          revenue: 13996,
          rating: 4.5,
          reviewCount: 3,
          vendor: user?.id || 'vendor-1',
          variants: [
            { id: 1, name: 'छोटा साइज़', stock: 3, price: 2999 },
            { id: 2, name: 'मध्यम साइज़', stock: 5, price: 3499 }
          ],
          tags: ['लकड़ी', 'हस्तशिल्प', 'मूर्ति', 'decorative'],
          description: 'पारंपरिक कारीगरी से बनी लकड़ी की मूर्ति',
          weight: '500g',
          dimensions: '15cm x 10cm x 8cm',
          material: 'Teak Wood'
        },
        {
          id: 5,
          name: 'रेशम की साड़ी',
          nameEn: 'Silk Saree',
          sku: 'SS-005',
          category: 'clothing',
          price: 12999,
          costPrice: 9500,
          currentStock: 12,
          minStockLevel: 4,
          maxStockLevel: 20,
          status: 'active',
          image: '/images/markets/devaraja-silk.jpg',
          createdAt: '2024-02-10T13:30:00Z',
          updatedAt: '2025-08-03T18:15:00Z',
          views: 198,
          orders: 9,
          revenue: 116991,
          rating: 4.7,
          reviewCount: 7,
          vendor: user?.id || 'vendor-1',
          variants: [
            { id: 1, name: 'लाल रंग', stock: 4, price: 12999 },
            { id: 2, name: 'नीला रंग', stock: 5, price: 12999 },
            { id: 3, name: 'हरा रंग', stock: 3, price: 12999 }
          ],
          tags: ['साड़ी', 'रेशम', 'silk', 'traditional'],
          description: 'शुद्ध रेशम से बनी पारंपरिक साड़ी',
          weight: '400g',
          dimensions: '6 yards',
          material: 'Pure Silk'
        }
      ];
      setInventory(mockInventory);
    }
    setLoading(false);
  };

  const filterAndSortInventory = () => {
    let filtered = [...inventory];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'stock_low':
          return a.currentStock - b.currentStock;
        case 'stock_high':
          return b.currentStock - a.currentStock;
        case 'created_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updated_desc':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    // Update status counts
    statusOptions[0].count = inventory.length;
    statusOptions[1].count = inventory.filter(i => i.status === 'active').length;
    statusOptions[2].count = inventory.filter(i => i.status === 'inactive').length;
    statusOptions[3].count = inventory.filter(i => i.status === 'out_of_stock').length;
    statusOptions[4].count = inventory.filter(i => i.status === 'low_stock').length;

    setFilteredInventory(filtered);
  };

  const checkLowStockItems = () => {
    const lowStock = inventory.filter(item => 
      item.currentStock <= item.minStockLevel && item.currentStock > 0
    );
    setLowStockItems(lowStock);
    
    if (lowStock.length > 0 && !showStockAlert) {
      setShowStockAlert(true);
      showWarning(`${lowStock.length} उत्पादों में कम स्टॉक है!`);
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedItems.length === 0) {
      showError('कृपया पहले कुछ आइटम चुनें');
      return;
    }

    if (!bulkUpdateData.action) {
      showError('कृपया अपडेट का प्रकार चुनें');
      return;
    }

    try {
      const response = await post('/vendor/inventory/bulk-update', {
        itemIds: selectedItems,
        updates: bulkUpdateData
      });

      if (response.success) {
        showSuccess(`${selectedItems.length} आइटम सफलतापूर्वक अपडेट हुए`);
        setShowBulkUpdate(false);
        setSelectedItems([]);
        setBulkUpdateData({ action: '', price: '', quantity: '', status: '' });
        loadInventory();
      }
    } catch (error) {
      showError('बल्क अपडेट में त्रुटि');
    }
  };

  const handleStockUpdate = async (itemId, newStock) => {
    try {
      const response = await put(`/vendor/inventory/${itemId}/stock`, {
        stock: parseInt(newStock)
      });

      if (response.success) {
        showSuccess('स्टॉक अपडेट हो गया');
        loadInventory();
      }
    } catch (error) {
      showError('स्टॉक अपडेट करने में त्रुटि');
    }
  };

  const handlePriceUpdate = async (itemId, newPrice) => {
    try {
      const response = await put(`/vendor/inventory/${itemId}/price`, {
        price: parseFloat(newPrice)
      });

      if (response.success) {
        showSuccess('कीमत अपडेट हो गई');
        loadInventory();
      }
    } catch (error) {
      showError('कीमत अपडेट करने में त्रुटि');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'सक्रिय' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'निष्क्रिय' },
      out_of_stock: { bg: 'bg-red-100', text: 'text-red-800', label: 'स्टॉक खत्म' },
      low_stock: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'कम स्टॉक' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStockIndicator = (item) => {
    if (item.currentStock === 0) {
      return <span className="text-red-600 font-bold">स्टॉक खत्म</span>;
    } else if (item.currentStock <= item.minStockLevel) {
      return <span className="text-yellow-600 font-bold">कम स्टॉक</span>;
    } else {
      return <span className="text-green-600 font-bold">पर्याप्त स्टॉक</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner message="इन्वेंटरी लोड हो रही है..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            📦 इन्वेंटरी प्रबंधन
          </h1>
          <p className="text-emerald-600 text-lg">
            आपके स्टॉक और उत्पादों का प्रबंधन करें
          </p>
        </div>

        <div className="flex gap-8">
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <VendorSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && showStockAlert && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">
                      ⚠️ कम स्टॉक चेतावनी
                    </h3>
                    <p className="text-yellow-700 mb-3">
                      {lowStockItems.length} उत्पादों में कम स्टॉक है। कृपया जल्दी स्टॉक भरें।
                    </p>
                    <div className="space-y-1">
                      {lowStockItems.slice(0, 3).map(item => (
                        <div key={item.id} className="text-sm">
                          • {item.name} - केवल {item.currentStock} बचे
                        </div>
                      ))}
                      {lowStockItems.length > 3 && (
                        <div className="text-sm">और {lowStockItems.length - 3} अन्य...</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStockAlert(false)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">कुल उत्पाद</p>
                    <p className="text-3xl font-bold text-emerald-800">{inventory.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">कुल स्टॉक वैल्यू</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {formatCurrency(inventory.reduce((sum, item) => sum + (item.price * item.currentStock), 0))}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">कम स्टॉक</p>
                    <p className="text-3xl font-bold text-yellow-600">{lowStockItems.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">⚠️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">स्टॉक आउट</p>
                    <p className="text-3xl font-bold text-red-600">
                      {inventory.filter(i => i.currentStock === 0).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🚫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                
                {/* Search */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">खोजें</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="नाम, SKU या टैग खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">स्टेटस</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {statusOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name} ({option.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">श्रेणी</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-emerald-800 font-semibold mb-2">क्रमबद्ध करें</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm">सभी चुनें ({selectedItems.length})</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() => setShowBulkUpdate(true)}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                    >
                      बल्क अपडेट ({selectedItems.length})
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate('/vendor/add-item')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    + नया उत्पाद जोड़ें
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        उत्पाद
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        कीमत
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        स्टॉक
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        स्टेटस
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        परफॉर्मेंस
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">
                        कार्य
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-emerald-200">
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="hover:bg-emerald-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleItemSelect(item.id)}
                              className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 mr-4"
                            />
                            <div className="flex items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-emerald-900">{item.name}</div>
                                <div className="text-sm text-emerald-500">SKU: {item.sku}</div>
                                <div className="text-xs text-gray-500 capitalize">{item.category}</div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-emerald-900">{formatCurrency(item.price)}</div>
                            <div className="text-emerald-500 text-xs">Cost: {formatCurrency(item.costPrice)}</div>
                            <div className="text-green-600 text-xs">
                              Margin: {(((item.price - item.costPrice) / item.price) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-emerald-900">{item.currentStock} units</div>
                            <div className="text-xs text-gray-500">Min: {item.minStockLevel}</div>
                            <div className="text-xs">{getStockIndicator(item)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div>Views: {item.views}</div>
                          <div>Orders: {item.orders}</div>
                          <div>Revenue: {formatCurrency(item.revenue)}</div>
                          <div className="flex items-center space-x-1">
                            <span>⭐ {item.rating}</span>
                            <span className="text-gray-500">({item.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/vendor/edit-item/${item.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                              title="संपादित करें"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => navigate(`/products/${item.id}`)}
                              className="text-green-600 hover:text-green-900"
                              title="देखें"
                            >
                              👁️
                            </button>
                            <button
                              onClick={() => {
                                const newStock = prompt('नया स्टॉक डालें:', item.currentStock);
                                if (newStock !== null && newStock !== '') {
                                  handleStockUpdate(item.id, newStock);
                                }
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="स्टॉक अपडेट करें"
                            >
                              📦
                            </button>
                            <button
                              onClick={() => {
                                const newPrice = prompt('नई कीमत डालें:', item.price);
                                if (newPrice !== null && newPrice !== '') {
                                  handlePriceUpdate(item.id, newPrice);
                                }
                              }}
                              className="text-purple-600 hover:text-purple-900"
                              title="कीमत अपडेट करें"
                            >
                              💰
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">कोई उत्पाद नहीं मिला</h3>
                  <p className="text-emerald-600 mb-6">फ़िल्टर बदलें या नया उत्पाद जोड़ें</p>
                  <button
                    onClick={() => navigate('/vendor/add-item')}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
                  >
                    नया उत्पाद जोड़ें
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Update Modal */}
            {showBulkUpdate && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                  <h2 className="text-2xl font-bold text-emerald-800 mb-6">
                    बल्क अपडेट ({selectedItems.length} आइटम)
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-emerald-800 font-semibold mb-2">अपडेट का प्रकार</label>
                      <select
                        value={bulkUpdateData.action}
                        onChange={(e) => setBulkUpdateData({...bulkUpdateData, action: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="">चुनें</option>
                        <option value="price">कीमत अपडेट</option>
                        <option value="stock">स्टॉक अपडेट</option>
                        <option value="status">स्टेटस अपडेट</option>
                      </select>
                    </div>

                    {bulkUpdateData.action === 'price' && (
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">नई कीमत</label>
                        <input
                          type="number"
                          value={bulkUpdateData.price}
                          onChange={(e) => setBulkUpdateData({...bulkUpdateData, price: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="कीमत डालें"
                        />
                      </div>
                    )}

                    {bulkUpdateData.action === 'stock' && (
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">स्टॉक अपडेट</label>
                        <input
                          type="number"
                          value={bulkUpdateData.quantity}
                          onChange={(e) => setBulkUpdateData({...bulkUpdateData, quantity: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                          placeholder="स्टॉक मात्रा डालें"
                        />
                      </div>
                    )}

                    {bulkUpdateData.action === 'status' && (
                      <div>
                        <label className="block text-emerald-800 font-semibold mb-2">नया स्टेटस</label>
                        <select
                          value={bulkUpdateData.status}
                          onChange={(e) => setBulkUpdateData({...bulkUpdateData, status: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">चुनें</option>
                          <option value="active">सक्रिय</option>
                          <option value="inactive">निष्क्रिय</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-8">
                    <button
                      onClick={() => setShowBulkUpdate(false)}
                      className="px-6 py-3 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50"
                    >
                      रद्द करें
                    </button>
                    <button
                      onClick={handleBulkUpdate}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600"
                    >
                      अपडेट करें
                    </button>
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

export default Inventory;