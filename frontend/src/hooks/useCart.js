// Comprehensive Shopping Cart Hook for Bharatshaala Platform
import { useState, useEffect, useContext, createContext } from 'react';
import { useAuth } from './useAuth';
import { useNotification } from './useNotification';
import apiService from '../utils/api';
import { useAnalytics } from '../utils/analytics';
import config from '../utils/constants';

// Cart Context
const CartContext = createContext(null);

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [taxes, setTaxes] = useState(null);

  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useNotification();
  const { trackCommerce, trackEvent } = useAnalytics();

  const loadCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Load from server for authenticated users
        const response = await apiService.get('/cart');
        if (response.success && response.data) {
          const { items: serverItems, id, coupon, shipping: serverShipping, taxes: serverTaxes } = response.data;
          setItems(serverItems || []);
          setCartId(id);
          setAppliedCoupon(coupon);
          setShipping(serverShipping);
          setTaxes(serverTaxes);
          setLastSyncTime(Date.now());
        }
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem('cart_items');
        const savedCoupon = localStorage.getItem('cart_coupon');
        
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
        if (savedCoupon) {
          setAppliedCoupon(JSON.parse(savedCoupon));
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart_items');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async () => {
    if (!isAuthenticated || syncing || items.length === 0) return;

    try {
      setSyncing(true);
      
      const response = await apiService.post('/cart/sync', {
        items,
        coupon: appliedCoupon,
        lastSyncTime
      });

      if (response.success && response.data) {
        const { items: syncedItems, conflicts } = response.data;
        
        if (conflicts && conflicts.length > 0) {
          // Handle conflicts (e.g., price changes, out of stock)
          handleSyncConflicts(conflicts);
        }
        
        setItems(syncedItems);
        setLastSyncTime(Date.now());
      }
    } catch (error) {
      console.error('Cart sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Load cart on mount and when user changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated, user]);

  // Auto-sync cart periodically for authenticated users
  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      const interval = setInterval(syncCart, 30000); // Sync every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, items]);

  // Calculate totals whenever items change
  const totals = calculateTotals(items, appliedCoupon, shipping, taxes);

  const handleSyncConflicts = (conflicts) => {
    conflicts.forEach(conflict => {
      switch (conflict.type) {
        case 'price_change':
          showWarning(`${conflict.productName} की कीमत बदल गई है।`);
          break;
        case 'out_of_stock':
          showWarning(`${conflict.productName} स्टॉक में नहीं है।`);
          break;
        case 'quantity_reduced':
          showWarning(`${conflict.productName} की उपलब्ध मात्रा कम है।`);
          break;
        default:
          showWarning(`${conflict.productName} में परिवर्तन हुआ है।`);
      }
    });
  };

  const addToCart = async (product, quantity = 1, variants = {}) => {
    try {
      setLoading(true);

      // Validate product
      if (!product || !product.id) {
        throw new Error('अमान्य उत्पाद');
      }

      // Check stock availability
      if (!product.inStock || (product.stockCount && product.stockCount < quantity)) {
        throw new Error('उत्पाद स्टॉक में नहीं है');
      }

      // Check cart limits
      if (items.length >= config.business.maxCartItems) {
        throw new Error(`कार्ट में अधिकतम ${config.business.maxCartItems} आइटम हो सकते हैं`);
      }

      // Generate cart item
      const cartItem = {
        id: generateCartItemId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity,
        variants,
        vendorId: product.vendorId,
        vendorName: product.vendorName,
        sku: product.sku,
        weight: product.weight || 0,
        dimensions: product.dimensions,
        shippingClass: product.shippingClass || 'standard',
        addedAt: new Date().toISOString(),
        isGift: false,
        giftMessage: ''
      };

      // Check if item already exists
      const existingItemIndex = items.findIndex(item => 
        item.productId === product.id && 
        JSON.stringify(item.variants) === JSON.stringify(variants)
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
        
        // Check stock for updated quantity
        if (product.stockCount && newItems[existingItemIndex].quantity > product.stockCount) {
          newItems[existingItemIndex].quantity = product.stockCount;
          showWarning(`केवल ${product.stockCount} उपलब्ध हैं`);
        }
      } else {
        // Add new item
        newItems = [...items, cartItem];
      }

      // Update state
      setItems(newItems);

      // Save to storage
      await saveCart(newItems);

      // Track analytics
      trackCommerce('add_to_cart', {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
        cartValue: calculateTotals(newItems).total,
        cartItemsCount: newItems.length
      });

      showSuccess(`${product.name} कार्ट में जोड़ दिया गया!`);
      
      return { success: true, cartItem };
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);

      const itemToRemove = items.find(item => item.id === itemId);
      if (!itemToRemove) {
        throw new Error('आइटम नहीं मिला');
      }

      const newItems = items.filter(item => item.id !== itemId);
      setItems(newItems);

      await saveCart(newItems);

      trackCommerce('remove_from_cart', {
        productId: itemToRemove.productId,
        productName: itemToRemove.name,
        quantity: itemToRemove.quantity,
        cartValue: calculateTotals(newItems).total
      });

      showSuccess(`${itemToRemove.name} कार्ट से हटा दिया गया`);
      
      return { success: true };
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setLoading(true);

      if (newQuantity <= 0) {
        return removeFromCart(itemId);
      }

      const itemIndex = items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error('आइटम नहीं मिला');
      }

      const newItems = [...items];
      const oldQuantity = newItems[itemIndex].quantity;
      newItems[itemIndex].quantity = newQuantity;

      setItems(newItems);
      await saveCart(newItems);

      trackEvent('cart_quantity_updated', {
        productId: newItems[itemIndex].productId,
        oldQuantity,
        newQuantity,
        cartValue: calculateTotals(newItems).total
      });

      return { success: true };
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      const oldItemsCount = items.length;
      setItems([]);
      setAppliedCoupon(null);

      await saveCart([]);

      trackEvent('cart_cleared', {
        itemsCount: oldItemsCount
      });

      showSuccess('कार्ट खाली कर दिया गया');
      
      return { success: true };
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);

      if (!couponCode || !couponCode.trim()) {
        throw new Error('कूपन कोड डालें');
      }

      if (items.length === 0) {
        throw new Error('कार्ट खाली है');
      }

      const response = await apiService.post('/cart/apply-coupon', {
        code: couponCode.toUpperCase(),
        cartItems: items,
        cartTotal: totals.subtotal
      });

      if (response.success && response.data) {
        const { coupon, discount } = response.data;
        
        setAppliedCoupon({
          ...coupon,
          discount
        });

        await saveCoupon(coupon);

        trackEvent('coupon_applied', {
          couponCode: coupon.code,
          discountAmount: discount,
          cartValue: totals.subtotal
        });

        showSuccess(`कूपन लागू हो गया! ₹${discount} की छूट मिली।`);
        
        return { success: true, coupon, discount };
      } else {
        throw new Error(response.error || 'कूपन लागू नहीं हो सका');
      }
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = async () => {
    try {
      setAppliedCoupon(null);
      localStorage.removeItem('cart_coupon');

      if (isAuthenticated) {
        await apiService.post('/cart/remove-coupon');
      }

      trackEvent('coupon_removed');
      showSuccess('कूपन हटा दिया गया');
      
      return { success: true };
    } catch (error) {
      showError(error.message);
      return { success: false, error: error.message };
    }
  };

  const validateCart = async () => {
    try {
      setLoading(true);

      const response = await apiService.post('/cart/validate', {
        items,
        coupon: appliedCoupon
      });

      if (response.success && response.data) {
        const { validItems, invalidItems, updatedPrices, stockIssues } = response.data;

        if (invalidItems.length > 0) {
          const invalidNames = invalidItems.map(item => item.name);
          showWarning(`कुछ आइटम अब उपलब्ध नहीं हैं: ${invalidNames.join(', ')}`);
        }

        if (updatedPrices.length > 0) {
          const priceChanges = updatedPrices.map(item => `${item.name}: ₹${item.oldPrice} → ₹${item.newPrice}`);
          showWarning(`कीमत बदलाव: ${priceChanges.join(', ')}`);
        }

        if (stockIssues.length > 0) {
          const stockMessages = stockIssues.map(item => `${item.name}: केवल ${item.availableStock} उपलब्ध`);
          showWarning(`स्टॉक समस्या: ${stockMessages.join(', ')}`);
        }

        setItems(validItems);
        await saveCart(validItems);

        return { 
          success: true, 
          hasIssues: invalidItems.length > 0 || updatedPrices.length > 0 || stockIssues.length > 0,
          issues: { invalidItems, updatedPrices, stockIssues }
        };
      }

      return { success: true, hasIssues: false };
    } catch (error) {
      showError('कार्ट वेरिफिकेशन में त्रुटि');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (cartItems) => {
    // Save to localStorage
    localStorage.setItem('cart_items', JSON.stringify(cartItems));

    // Save to server for authenticated users
    if (isAuthenticated) {
      try {
        await apiService.post('/cart/save', {
          items: cartItems,
          coupon: appliedCoupon
        });
      } catch (error) {
        console.error('Failed to save cart to server:', error);
      }
    }
  };

  const saveCoupon = async (coupon) => {
    localStorage.setItem('cart_coupon', JSON.stringify(coupon));
    
    if (isAuthenticated) {
      try {
        await apiService.post('/cart/save-coupon', { coupon });
      } catch (error) {
        console.error('Failed to save coupon to server:', error);
      }
    }
  };

  const generateCartItemId = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Utility functions
  const getItemCount = () => items.reduce((total, item) => total + item.quantity, 0);
  
  const getUniqueItemCount = () => items.length;
  
  const isInCart = (productId, variants = {}) => {
    return items.some(item => 
      item.productId === productId && 
      JSON.stringify(item.variants) === JSON.stringify(variants)
    );
  };

  const getCartItem = (productId, variants = {}) => {
    return items.find(item => 
      item.productId === productId && 
      JSON.stringify(item.variants) === JSON.stringify(variants)
    );
  };

  const getVendorItems = (vendorId) => {
    return items.filter(item => item.vendorId === vendorId);
  };

  const getShippingEstimate = async (address) => {
    try {
      const response = await apiService.post('/cart/shipping-estimate', {
        items,
        address
      });

      if (response.success && response.data) {
        setShipping(response.data.shipping);
        return response.data;
      }
    } catch (error) {
      console.error('Shipping estimate failed:', error);
    }
    return null;
  };

  const value = {
    // State
    items,
    loading,
    syncing,
    cartId,
    appliedCoupon,
    shipping,
    taxes,
    totals,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    validateCart,
    syncCart,
    loadCart,
    getShippingEstimate,

    // Utilities
    getItemCount,
    getUniqueItemCount,
    isInCart,
    getCartItem,
    getVendorItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Calculate cart totals
function calculateTotals(items, coupon = null, shipping = null, taxes = null) {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = Math.min((subtotal * coupon.value) / 100, coupon.maxDiscount || Infinity);
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, subtotal);
    }
  }

  const afterDiscount = subtotal - discountAmount;
  const shippingCost = shipping?.cost || 0;
  const taxAmount = taxes?.amount || (afterDiscount * (config.business.gstRate / 100));
  const total = afterDiscount + shippingCost + taxAmount;

  return {
    subtotal,
    discountAmount,
    afterDiscount,
    shippingCost,
    taxAmount,
    total,
    savings: items.reduce((total, item) => {
      return total + ((item.originalPrice || item.price) - item.price) * item.quantity;
    }, 0) + discountAmount
  };
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default useCart;