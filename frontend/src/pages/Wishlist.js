import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useAPI } from '../hooks/useAPI';
import { useNotification } from '../hooks/useNotification';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { get, post, delete: deleteItem } = useAPI();
  const { showSuccess, showError, showInfo } = useNotification();
  const { getItem, setItem } = useLocalStorage();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showShareModal, setShowShareModal] = useState(false);

  const sortOptions = [
    { id: 'recent', name: 'हाल ही में जोड़े गए' },
    { id: 'oldest', name: 'पुराने पहले' },
    { id: 'price-low', name: 'कम कीमत पहले' },
    { id: 'price-high', name: 'ज्यादा कीमत पहले' },
    { id: 'name', name: 'नाम के अनुसार' },
    { id: 'rating', name: 'रेटिंग के अनुसार' }
  ];

  const filterOptions = [
    { id: 'all', name: 'सभी आइटम', count: 0 },
    { id: 'available', name: 'उपलब्ध', count: 0 },
    { id: 'price_dropped', name: 'कीमत घटी', count: 0 },
    { id: 'out_of_stock', name: 'स्टॉक में नहीं', count: 0 }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/wishlist');
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortItems();
  }, [wishlistItems, sortBy, filterBy]);

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const response = await get('/wishlist');
      if (response.success) {
        setWishlistItems(response.items);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Mock data for demo
      const mockWishlist = [
        {
          id: 1,
          productId: 123,
          name: 'कुंदन पर्ल नेकलेस सेट',
          nameEn: 'Kundan Pearl Necklace Set',
          image: '/images/items/kundan-necklace-1.jpg',
          price: 15999,
          originalPrice: 19999,
          discount: 20,
          rating: 4.6,
          reviewCount: 89,
          inStock: true,
          seller: 'राजस्थानी जेम्स',
          category: 'jewelry',
          addedDate: '2024-01-20T10:30:00Z',
          priceHistory: [
            { date: '2024-01-15', price: 19999 },
            { date: '2024-01-20', price: 15999 }
          ],
          notifications: {
            priceAlert: true,
            stockAlert: true
          }
        },
        {
          id: 2,
          productId: 124,
          name: 'राजस्थानी चूड़ी सेट',
          nameEn: 'Rajasthani Bangle Set',
          image: '/images/items/bangles.jpg',
          price: 2999,
          originalPrice: 3499,
          discount: 14,
          rating: 4.3,
          reviewCount: 156,
          inStock: false,
          seller: 'जयपुर हैंडीक्राफ्ट्स',
          category: 'jewelry',
          addedDate: '2024-01-18T15:45:00Z',
          priceHistory: [
            { date: '2024-01-18', price: 3499 },
            { date: '2024-01-22', price: 2999 }
          ],
          notifications: {
            priceAlert: true,
            stockAlert: true
          }
        },
        {
          id: 3,
          productId: 125,
          name: 'हस्तनिर्मित पश्मीना शॉल',
          nameEn: 'Handwoven Pashmina Shawl',
          image: '/images/items/shawl.jpg',
          price: 8999,
          originalPrice: 8999,
          discount: 0,
          rating: 4.8,
          reviewCount: 67,
          inStock: true,
          seller: 'कश्मीर आर्ट्स',
          category: 'textiles',
          addedDate: '2024-01-16T12:20:00Z',
          priceHistory: [
            { date: '2024-01-16', price: 8999 }
          ],
          notifications: {
            priceAlert: false,
            stockAlert: true
          }
        }
      ];
      setWishlistItems(mockWishlist);
    }
    setLoading(false);
  };

  const filterAndSortItems = () => {
    let filtered = [...wishlistItems];

    // Apply filters
    switch (filterBy) {
      case 'available':
        filtered = filtered.filter(item => item.inStock);
        break;
      case 'price_dropped':
        filtered = filtered.filter(item => item.discount > 0);
        break;
      case 'out_of_stock':
        filtered = filtered.filter(item => !item.inStock);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.addedDate) - new Date(a.addedDate);
        case 'oldest':
          return new Date(a.addedDate) - new Date(b.addedDate);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    // Update filter counts
    filterOptions[0].count = wishlistItems.length;
    filterOptions[1].count = wishlistItems.filter(item => item.inStock).length;
    filterOptions[2].count = wishlistItems.filter(item => item.discount > 0).length;
    filterOptions[3].count = wishlistItems.filter(item => !item.inStock).length;

    return filtered;
  };

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await deleteItem(`/wishlist/${itemId}`);
      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        setSelectedItems(prev => prev.filter(id => id !== itemId));
        showSuccess('विशलिस्ट से हटा दिया गया');
      }
    } catch (error) {
      showError('विशलिस्ट से हटाने में त्रुटि');
    }
  };

  const handleAddToCart = async (item) => {
    if (!item.inStock) {
      showError('यह आइटम स्टॉक में नहीं है');
      return;
    }

    const result = await addToCart(item, 1);
    if (result.success) {
      showSuccess('कार्ट में जोड़ दिया गया!');
    }
  };

  const handleMoveToCart = async (item) => {
    await handleAddToCart(item);
    if (item.inStock) {
      await handleRemoveFromWishlist(item.id);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      showInfo('कृपया पहले कुछ आइटम चुनें');
      return;
    }

    switch (action) {
      case 'remove':
        if (window.confirm(`क्या आप ${selectedItems.length} आइटम हटाना चाहते हैं?`)) {
          for (const itemId of selectedItems) {
            await handleRemoveFromWishlist(itemId);
          }
        }
        break;
      case 'move_to_cart':
        for (const itemId of selectedItems) {
          const item = wishlistItems.find(i => i.id === itemId);
          if (item?.inStock) {
            await handleMoveToCart(item);
          }
        }
        break;
      default:
        showError(`अज्ञात कार्य: ${action}`);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const filteredItems = filterAndSortItems();
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const shareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/shared-wishlist/${user.id}`;
    if (navigator.share) {
      navigator.share({
        title: 'मेरी विशलिस्ट',
        text: 'भारतशाला पर मेरी पसंदीदा चीजें देखें!',
        url: wishlistUrl
      });
    } else {
      navigator.clipboard.writeText(wishlistUrl);
      showSuccess('विशलिस्ट लिंक कॉपी हो गया!');
    }
  };

  const toggleNotifications = async (itemId, type) => {
    try {
      const response = await post(`/wishlist/${itemId}/notifications`, { type });
      if (response.success) {
        setWishlistItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, notifications: { ...item.notifications, [type]: !item.notifications[type] } }
            : item
        ));
        showSuccess('नोटिफिकेशन सेटिंग अपडेट हो गई');
      }
    } catch (error) {
      showError('नोटिफिकेशन सेटिंग अपडेट करने में त्रुटि');
    }
  };

  const filteredItems = filterAndSortItems();

  if (loading) {
    return <LoadingSpinner message="विशलिस्ट लोड हो रही है..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                मेरी विशलिस्ट ❤️
              </h1>
              <p className="text-emerald-600 dark:text-emerald-400 text-lg">
                आपकी पसंदीदा चीजों का संग्रह ({wishlistItems.length} आइटम)
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <button
                onClick={shareWishlist}
                className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>📤</span>
                <span>शेयर करें</span>
              </button>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 mb-4">
              आपकी विशलिस्ट खाली है
            </h2>
            <p className="text-emerald-600 dark:text-emerald-400 text-lg mb-8">
              अपनी पसंदीदा चीजों को सेव करना शुरू करें!
            </p>
            <button
              onClick={() => navigate('/markets')}
              className="bg-emerald-500 text-white px-8 py-4 rounded-xl hover:bg-emerald-600 transition-colors duration-200 text-lg font-semibold"
            >
              खरीदारी शुरू करें
            </button>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Filter */}
                <div>
                  <label className="block text-emerald-800 dark:text-emerald-200 font-semibold mb-2">फ़िल्टर</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
                  >
                    {filterOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.name} ({option.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-emerald-800 dark:text-emerald-200 font-semibold mb-2">क्रमबद्ध करें</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg focus:border-emerald-500 focus:outline-none"
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
                  <label className="block text-emerald-800 dark:text-emerald-200 font-semibold mb-2">व्यू मोड</label>
                  <div className="flex bg-emerald-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      ⊞ ग्रिड
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      ☰ लिस्ट
                    </button>
                  </div>
                </div>

                {/* Select All */}
                <div>
                  <label className="block text-emerald-800 dark:text-emerald-200 font-semibold mb-2">बल्क एक्शन</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm">सभी चुनें ({selectedItems.length})</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-emerald-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                      {selectedItems.length} आइटम चुने गए:
                    </span>
                    <button
                      onClick={() => handleBulkAction('move_to_cart')}
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200 text-sm"
                    >
                      कार्ट में जोड़ें
                    </button>
                    <button
                      onClick={() => handleBulkAction('remove')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                    >
                      हटाएं
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Items Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''
                  } ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-5 h-5 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 rounded border-2 border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Wishlist Heart */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-50 transition-colors duration-200"
                    >
                      ❤️
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-64'} overflow-hidden`}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Stock Status */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          स्टॉक में नहीं
                        </span>
                      </div>
                    )}

                    {/* Price Drop Badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {item.discount}% छूट
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      विक्रेता: {item.seller}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">({item.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                        ₹{item.price.toLocaleString()}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      जोड़ा गया: {new Date(item.addedDate).toLocaleDateString('hi-IN')}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.inStock}
                        className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                      >
                        {item.inStock ? 'कार्ट में जोड़ें' : 'स्टॉक में नहीं'}
                      </button>
                      
                      <button
                        onClick={() => navigate(`/products/${item.productId}`)}
                        className="w-full border border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                      >
                        विवरण देखें
                      </button>
                    </div>

                    {/* Notification Settings */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.notifications.priceAlert}
                            onChange={() => toggleNotifications(item.id, 'priceAlert')}
                            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                          />
                          <span>कीमत अलर्ट</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.notifications.stockAlert}
                            onChange={() => toggleNotifications(item.id, 'stockAlert')}
                            className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                          />
                          <span>स्टॉक अलर्ट</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;