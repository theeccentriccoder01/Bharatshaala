import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import VendorSidebar from "../../components/VendorSidebar";
import ProductCard from "../../components/ProductCard";
import "../../App.css";

const VendorItems = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'सभी श्रेणियां', icon: '📦' },
    { id: 'jewelry', name: 'आभूषण', icon: '💎' },
    { id: 'clothing', name: 'वस्त्र', icon: '👗' },
    { id: 'handicrafts', name: 'हस्तशिल्प', icon: '🎨' },
    { id: 'books', name: 'पुस्तकें', icon: '📚' },
    { id: 'accessories', name: 'एक्सेसरीज़', icon: '👜' },
    { id: 'houseware', name: 'घरेलू सामान', icon: '🏠' }
  ];

  const statusOptions = [
    { id: 'all', name: 'सभी स्थिति', color: 'gray' },
    { id: 'active', name: 'सक्रिय', color: 'green' },
    { id: 'inactive', name: 'निष्क्रिय', color: 'red' },
    { id: 'low-stock', name: 'कम स्टॉक', color: 'yellow' },
    { id: 'out-of-stock', name: 'स्टॉक खत्म', color: 'red' }
  ];

  const sortOptions = [
    { id: 'recent', name: 'नवीनतम पहले' },
    { id: 'oldest', name: 'पुराने पहले' },
    { id: 'name-asc', name: 'नाम (अ-ज्ञ)' },
    { id: 'name-desc', name: 'नाम (ज्ञ-अ)' },
    { id: 'price-high', name: 'अधिक कीमत पहले' },
    { id: 'price-low', name: 'कम कीमत पहले' },
    { id: 'stock-high', name: 'अधिक स्टॉक पहले' },
    { id: 'stock-low', name: 'कम स्टॉक पहले' }
  ];

  useEffect(() => {
    loadItems();
    checkUrlParams();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const checkUrlParams = () => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success) {
      let message = '';
      switch (success) {
        case 'item-added': message = 'उत्पाद सफलतापूर्वक जोड़ा गया!'; break;
        case 'item-updated': message = 'उत्पाद सफलतापूर्वक अपडेट किया गया!'; break;
        case 'item-deleted': message = 'उत्पाद सफलतापूर्वक हटाया गया!'; break;
        default: message = 'कार्य सफलतापूर्वक पूरा हुआ!';
      }
      showNotification(message, 'success');
    }
    
    if (error) {
      showNotification('कुछ गलत हुआ, कृपया पुनः प्रयास करें', 'error');
    }
  };

  const showNotification = (message, type) => {
    // You can implement a toast notification system here
    console.log(`${type}: ${message}`);
  };

  const loadItems = async () => {
    try {
      const response = await axios.get('/vendor/items');
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error("Error loading items:", error);
      // Mock data for demo
      setItems([
        {
          id: 1,
          name: 'कुंदन हार',
          nameEn: 'Kundan Necklace',
          description: 'पारंपरिक कुंदन और मीनाकारी से सजा हुआ खूबसूरत हार',
          category: 'jewelry',
          subcategory: 'हार',
          price: 15000,
          originalPrice: 18000,
          quantity: 5,
          images: ['/images/items/kundan-necklace.jpg'],
          isActive: true,
          isHandmade: true,
          createdAt: '2024-01-15',
          sales: 25,
          views: 340,
          rating: 4.8,
          reviewCount: 12
        },
        {
          id: 2,
          name: 'राजस्थानी चूड़ी सेट',
          nameEn: 'Rajasthani Bangle Set',
          description: 'लाख और मीनाकारी से सजी हुई चूड़ियों का सेट',
          category: 'jewelry',
          subcategory: 'चूड़ियां',
          price: 2800,
          originalPrice: 2800,
          quantity: 0,
          images: ['/images/items/bangles.jpg'],
          isActive: true,
          isHandmade: true,
          createdAt: '2024-01-10',
          sales: 18,
          views: 280,
          rating: 4.6,
          reviewCount: 8
        },
        {
          id: 3,
          name: 'मीनाकारी झुमके',
          nameEn: 'Meenakari Earrings',
          description: 'हाथ से बने चांदी के झुमके, मीनाकारी के साथ',
          category: 'jewelry',
          subcategory: 'झुमके',
          price: 3500,
          originalPrice: 4000,
          quantity: 12,
          images: ['/images/items/earrings.jpg'],
          isActive: false,
          isHandmade: true,
          createdAt: '2024-01-05',
          sales: 15,
          views: 200,
          rating: 4.9,
          reviewCount: 6
        }
      ]);
    }
  };

  const filterAndSortItems = () => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      
      let matchesStatus = true;
      switch (selectedStatus) {
        case 'active':
          matchesStatus = item.isActive;
          break;
        case 'inactive':
          matchesStatus = !item.isActive;
          break;
        case 'low-stock':
          matchesStatus = item.quantity > 0 && item.quantity <= 5;
          break;
        case 'out-of-stock':
          matchesStatus = item.quantity === 0;
          break;
      }
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'stock-high':
          return b.quantity - a.quantity;
        case 'stock-low':
          return a.quantity - b.quantity;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;

    try {
      switch (action) {
        case 'activate':
          await axios.patch('/vendor/items/bulk-status', {
            itemIds: selectedItems,
            isActive: true
          });
          break;
        case 'deactivate':
          await axios.patch('/vendor/items/bulk-status', {
            itemIds: selectedItems,
            isActive: false
          });
          break;
        case 'delete':
          if (window.confirm(`क्या आप वाकई ${selectedItems.length} उत्पाद हटाना चाहते हैं?`)) {
            await axios.delete('/vendor/items/bulk-delete', {
              data: { itemIds: selectedItems }
            });
          }
          break;
      }
      
      loadItems();
      setSelectedItems([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'स्टॉक खत्म', color: 'red' };
    if (quantity <= 5) return { text: 'कम स्टॉक', color: 'yellow' };
    return { text: 'उपलब्ध', color: 'green' };
  };

  const getItemStats = () => {
    const total = items.length;
    const active = items.filter(item => item.isActive).length;
    const lowStock = items.filter(item => item.quantity <= 5 && item.quantity > 0).length;
    const outOfStock = items.filter(item => item.quantity === 0).length;
    
    return { total, active, lowStock, outOfStock };
  };

  const stats = getItemStats();

  if (loading) {
    return <LoadingSpinner message="आपके उत्पाद लोड हो रहे हैं..." />;
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
                  उत्पाद प्रबंधन
                </h1>
                <p className="text-emerald-600 text-lg">
                  अपने सभी उत्पादों को यहाँ देखें और प्रबंधित करें
                </p>
              </div>
              
              <a
                href="/vendor/add-item"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span>➕</span>
                <span>नया उत्पाद जोड़ें</span>
              </a>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <VendorSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-8">
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">कुल उत्पाद</p>
                      <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-100 text-sm font-medium">सक्रिय</p>
                      <p className="text-3xl font-bold">{stats.active}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">✅</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">कम स्टॉक</p>
                      <p className="text-3xl font-bold">{stats.lowStock}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚠️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-red-100 text-sm font-medium">स्टॉक खत्म</p>
                      <p className="text-3xl font-bold">{stats.outOfStock}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">❌</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder="उत्पाद खोजें..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  
                  {/* Category Filter */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">श्रेणी</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">स्थिति</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      {statusOptions.map(status => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">क्रमबद्ध करें</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                    >
                      {sortOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div>
                    <label className="block text-emerald-800 font-semibold mb-2 text-sm">व्यू मोड</label>
                    <div className="flex bg-emerald-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === 'grid' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        ⊞ ग्रिड
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          viewMode === 'list' 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-emerald-600 hover:bg-emerald-200'
                        }`}
                      >
                        ☰ लिस्ट
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {showBulkActions && (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-emerald-800 font-medium">
                        {selectedItems.length} उत्पाद चयनित
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItems([]);
                          setShowBulkActions(false);
                        }}
                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        चयन हटाएं
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkAction('activate')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                      >
                        सक्रिय करें
                      </button>
                      <button
                        onClick={() => handleBulkAction('deactivate')}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm"
                      >
                        निष्क्रिय करें
                      </button>
                      <button
                        onClick={() => handleBulkAction('delete')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                )}

                {/* Select All */}
                <div className="flex items-center justify-between">
                  <div className="text-emerald-600 font-medium">
                    {filteredItems.length} उत्पाद मिले
                  </div>
                  {filteredItems.length > 0 && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredItems.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-emerald-600"
                      />
                      <span className="text-emerald-700 text-sm">सभी चुनें</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Items Grid/List */}
              {filteredItems.length > 0 ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      viewMode={viewMode}
                      isSelected={selectedItems.includes(item.id)}
                      onSelect={() => handleSelectItem(item.id)}
                      onEdit={() => navigate(`/vendor/edit-item/${item.id}`)}
                      stockStatus={getStockStatus(item.quantity)}
                      isVendorView={true}
                    />
                  ))}
                </div>
              ) : (
                /* No Items */
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-2">कोई उत्पाद नहीं मिला</h3>
                  <p className="text-emerald-600 mb-6">
                    {items.length === 0 
                      ? 'अभी तक कोई उत्पाद नहीं जोड़ा गया है।' 
                      : 'आपके फ़िल्टर के अनुसार कोई उत्पाद नहीं मिला।'
                    }
                  </p>
                  <div className="flex justify-center space-x-4">
                    {items.length === 0 ? (
                      <a
                        href="/vendor/add-item"
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        पहला उत्पाद जोड़ें
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setSelectedStatus('all');
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        सभी फ़िल्टर साफ़ करें
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default VendorItems;