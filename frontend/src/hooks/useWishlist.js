import { useState, useEffect, useCallback, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationContext from '../context/NotificationContext';
import useLocalStorage from './useLocalStorage';

const useWishlist = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  
  // Use localStorage for guest users, API for authenticated users
  const [localWishlist, setLocalWishlist] = useLocalStorage('bharatshaala_wishlist', []);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - adjust according to your backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch wishlist from API for authenticated users
  const fetchWishlistFromAPI = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/wishlist/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data.items || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError(err.message);
      showNotification('विशलिस्ट लोड नहीं हो सकी', 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, API_BASE_URL, showNotification]);

  // Initialize wishlist on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistFromAPI();
    } else {
      setWishlistItems(localWishlist);
    }
  }, [isAuthenticated, localWishlist, fetchWishlistFromAPI]);

  // Sync local wishlist with API when user logs in
  useEffect(() => {
    const syncWishlist = async () => {
      if (isAuthenticated && localWishlist.length > 0) {
        try {
          // Merge local wishlist with server wishlist
          for (const item of localWishlist) {
            await addToWishlist(item, false); // Don't show notification for each item
          }
          // Clear local storage after sync
          setLocalWishlist([]);
          showNotification('विशलिस्ट सिंक हो गई!', 'success');
        } catch (err) {
          console.error('Error syncing wishlist:', err);
        }
      }
    };

    syncWishlist();
  }, [isAuthenticated]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (product, showNotif = true) => {
    // Validate product object
    if (!product || !product.id) {
      setError('Invalid product data');
      return false;
    }

    // Check if item already exists
    const existingItem = wishlistItems.find(item => item.id === product.id);
    if (existingItem) {
      if (showNotif) {
        showNotification('यह आइटम पहले से विशलिस्ट में है', 'info');
      }
      return false;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.images?.[0],
      category: product.category,
      vendor: product.vendor,
      market: product.market,
      inStock: product.inStock !== false,
      addedAt: new Date().toISOString(),
    };

    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            product: wishlistItem,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add to wishlist');
        }

        const data = await response.json();
        setWishlistItems(prev => [...prev, wishlistItem]);
        
        if (showNotif) {
          showNotification('विशलिस्ट में जोड़ा गया!', 'success');
        }
        return true;
      } catch (err) {
        console.error('Error adding to wishlist:', err);
        setError(err.message);
        if (showNotif) {
          showNotification('विशलिस्ट में जोड़ने में त्रुटि', 'error');
        }
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // For guest users, use localStorage
      const updatedWishlist = [...localWishlist, wishlistItem];
      setLocalWishlist(updatedWishlist);
      setWishlistItems(updatedWishlist);
      
      if (showNotif) {
        showNotification('विशलिस्ट में जोड़ा गया!', 'success');
      }
      return true;
    }
  }, [wishlistItems, isAuthenticated, user, localWishlist, setLocalWishlist, API_BASE_URL, showNotification]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId, showNotif = true) => {
    if (!productId) return false;

    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/remove`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            userId: user.id,
            productId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove from wishlist');
        }

        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        
        if (showNotif) {
          showNotification('विशलिस्ट से हटाया गया', 'success');
        }
        return true;
      } catch (err) {
        console.error('Error removing from wishlist:', err);
        setError(err.message);
        if (showNotif) {
          showNotification('विशलिस्ट से हटाने में त्रुटि', 'error');
        }
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      // For guest users, use localStorage
      const updatedWishlist = localWishlist.filter(item => item.id !== productId);
      setLocalWishlist(updatedWishlist);
      setWishlistItems(updatedWishlist);
      
      if (showNotif) {
        showNotification('विशलिस्ट से हटाया गया', 'success');
      }
      return true;
    }
  }, [isAuthenticated, user, localWishlist, setLocalWishlist, API_BASE_URL, showNotification]);

  // Toggle item in wishlist
  const toggleWishlist = useCallback(async (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  // Clear entire wishlist
  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/wishlist/clear`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to clear wishlist');
        }

        setWishlistItems([]);
        showNotification('विशलिस्ट साफ़ की गई', 'success');
        return true;
      } catch (err) {
        console.error('Error clearing wishlist:', err);
        setError(err.message);
        showNotification('विशलिस्ट साफ़ करने में त्रुटि', 'error');
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      setLocalWishlist([]);
      setWishlistItems([]);
      showNotification('विशलिस्ट साफ़ की गई', 'success');
      return true;
    }
  }, [isAuthenticated, user, setLocalWishlist, API_BASE_URL, showNotification]);

  // Check if item is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  // Get items by category
  const getItemsByCategory = useCallback((category) => {
    return wishlistItems.filter(item => 
      item.category?.toLowerCase() === category?.toLowerCase()
    );
  }, [wishlistItems]);

  // Get items by market
  const getItemsByMarket = useCallback((market) => {
    return wishlistItems.filter(item => 
      item.market?.toLowerCase() === market?.toLowerCase()
    );
  }, [wishlistItems]);

  // Move items to cart (bulk operation)
  const moveAllToCart = useCallback(async () => {
    // This would integrate with your cart hook
    // For now, just a placeholder
    console.log('Moving all wishlist items to cart:', wishlistItems);
    showNotification('सभी आइटम कार्ट में जोड़े गए', 'success');
    return true;
  }, [wishlistItems, showNotification]);

  // Refresh wishlist
  const refreshWishlist = useCallback(() => {
    if (isAuthenticated) {
      fetchWishlistFromAPI();
    }
  }, [isAuthenticated, fetchWishlistFromAPI]);

  return {
    // State
    wishlistItems,
    loading,
    error,
    
    // Actions
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveAllToCart,
    refreshWishlist,
    
    // Getters
    isInWishlist,
    getWishlistCount,
    getItemsByCategory,
    getItemsByMarket,
    
    // Utils
    isEmpty: wishlistItems.length === 0,
    count: wishlistItems.length,
  };
};

export default useWishlist;