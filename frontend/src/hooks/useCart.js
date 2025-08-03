import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

// Advanced cart hooks for specific use cases
export const useCartActions = () => {
  const { addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  const addMultipleItems = async (items) => {
    const results = [];
    for (const { item, quantity } of items) {
      const result = await addToCart(item, quantity);
      results.push(result);
    }
    return results;
  };

  const moveToWishlist = async (itemId) => {
    // Implementation for moving item from cart to wishlist
    const result = await removeFromCart(itemId);
    if (result.success) {
      // Add to wishlist logic here
      return { success: true, message: 'पसंदीदा में जोड़ दिया गया' };
    }
    return result;
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addMultipleItems,
    moveToWishlist
  };
};

export const useCartSummary = () => {
  const { getCartSummary, items, totalItems } = useCart();
  
  const summary = getCartSummary();
  
  const getItemsByCategory = () => {
    return items.reduce((acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

  const getItemsBySeller = () => {
    return items.reduce((acc, item) => {
      const seller = item.seller || 'Unknown';
      if (!acc[seller]) {
        acc[seller] = [];
      }
      acc[seller].push(item);
      return acc;
    }, {});
  };

  const getEstimatedDelivery = () => {
    // Calculate estimated delivery based on items
    const maxDeliveryDays = Math.max(...items.map(item => item.deliveryDays || 7));
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + maxDeliveryDays);
    return estimatedDate;
  };

  return {
    ...summary,
    itemsByCategory: getItemsByCategory(),
    itemsBySeller: getItemsBySeller(),
    estimatedDelivery: getEstimatedDelivery(),
    isEmpty: totalItems === 0
  };
};

export const useCartPersistence = () => {
  const { loadCart, clearCart } = useCart();
  
  const saveCartToServer = async () => {
    try {
      // Implementation for syncing cart with server
      return { success: true, message: 'कार्ट सेव हो गया' };
    } catch (error) {
      return { success: false, message: 'कार्ट सेव करने में त्रुटि' };
    }
  };

  const mergeGuestCart = async (guestCartItems) => {
    // Implementation for merging guest cart with user cart after login
    try {
      for (const item of guestCartItems) {
        await addToCart(item, item.quantity);
      }
      return { success: true, message: 'गेस्ट कार्ट मर्ज हो गया' };
    } catch (error) {
      return { success: false, message: 'कार्ट मर्ज करने में त्रुटि' };
    }
  };

  return {
    loadCart,
    clearCart,
    saveCartToServer,
    mergeGuestCart
  };
};

export default useCart;