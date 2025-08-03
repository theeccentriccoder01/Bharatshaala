import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  shippingCost: 0,
  isLoading: false,
  error: null,
  appliedCoupon: null,
  discount: 0,
  recentlyAdded: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'CART_LOADED':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalAmount: action.payload.totalAmount,
        shippingCost: action.payload.shippingCost || 0,
        isLoading: false,
        error: null
      };

    case 'CART_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'ITEM_ADDED':
      return {
        ...state,
        items: action.payload.items,
        totalItems: state.totalItems + action.payload.quantity,
        totalAmount: state.totalAmount + (action.payload.item.price * action.payload.quantity),
        recentlyAdded: action.payload.item,
        error: null
      };

    case 'ITEM_UPDATED':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, quantity: action.payload.newQuantity }
          : item
      );
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        totalItems: newTotalItems,
        totalAmount: newTotal,
        error: null
      };

    case 'ITEM_REMOVED':
      const filteredItems = state.items.filter(item => item.id !== action.payload.itemId);
      const removedItem = state.items.find(item => item.id === action.payload.itemId);
      const newTotalAfterRemoval = state.totalAmount - (removedItem.price * removedItem.quantity);
      const newTotalItemsAfterRemoval = state.totalItems - removedItem.quantity;

      return {
        ...state,
        items: filteredItems,
        totalItems: newTotalItemsAfterRemoval,
        totalAmount: newTotalAfterRemoval,
        error: null
      };

    case 'COUPON_APPLIED':
      return {
        ...state,
        appliedCoupon: action.payload.coupon,
        discount: action.payload.discount,
        error: null
      };

    case 'COUPON_REMOVED':
      return {
        ...state,
        appliedCoupon: null,
        discount: 0,
        error: null
      };

    case 'CART_CLEARED':
      return {
        ...initialState
      };

    case 'CLEAR_RECENT':
      return {
        ...state,
        recentlyAdded: null
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  // Auto-save cart to localStorage
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('bharatshaala_cart', JSON.stringify({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        appliedCoupon: state.appliedCoupon,
        discount: state.discount
      }));
    }
  }, [state.items, state.totalItems, state.totalAmount, state.appliedCoupon, state.discount]);

  const loadCart = async () => {
    dispatch({ type: 'CART_LOADING' });
    
    try {
      // Try to load from server first
      const response = await axios.get('/cart');
      if (response.data.success) {
        dispatch({
          type: 'CART_LOADED',
          payload: response.data
        });
        return;
      }
    } catch (error) {
      console.log('Server cart load failed, loading from localStorage');
    }

    // Fallback to localStorage
    try {
      const savedCart = localStorage.getItem('bharatshaala_cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: 'CART_LOADED',
          payload: cartData
        });
      } else {
        dispatch({
          type: 'CART_LOADED',
          payload: { items: [], totalItems: 0, totalAmount: 0, shippingCost: 0 }
        });
      }
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'कार्ट लोड करने में त्रुटि' });
    }
  };

  const addToCart = async (item, quantity = 1) => {
    dispatch({ type: 'CART_LOADING' });
    
    try {
      // Check if item already exists in cart
      const existingItem = state.items.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity instead of adding new item
        await updateQuantity(item.id, existingItem.quantity + quantity);
      } else {
        // Add new item
        const newItem = {
          id: item.id,
          name: item.name,
          nameEn: item.nameEn,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.images?.[0]?.url || item.image,
          seller: item.seller || 'भारतशाला विक्रेता',
          category: item.category,
          quantity: quantity,
          maxQuantity: item.quantity || 10
        };

        const updatedItems = [...state.items, newItem];
        
        // Try to sync with server
        try {
          await axios.post('/cart/add', { item: newItem, quantity });
        } catch (error) {
          console.log('Server sync failed, continuing with local storage');
        }

        dispatch({
          type: 'ITEM_ADDED',
          payload: { items: updatedItems, item: newItem, quantity }
        });

        return { success: true, message: 'कार्ट में जोड़ दिया गया' };
      }
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'कार्ट में जोड़ने में त्रुटि' });
      return { success: false, message: 'कार्ट में जोड़ने में त्रुटि' };
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      // Try to sync with server
      try {
        await axios.put('/cart/update', { itemId, quantity: newQuantity });
      } catch (error) {
        console.log('Server sync failed, continuing with local update');
      }

      dispatch({
        type: 'ITEM_UPDATED',
        payload: { itemId, newQuantity }
      });

      return { success: true, message: 'मात्रा अपडेट की गई' };
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'मात्रा अपडेट करने में त्रुटि' });
      return { success: false, message: 'मात्रा अपडेट करने में त्रुटि' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      // Try to sync with server
      try {
        await axios.delete(`/cart/remove/${itemId}`);
      } catch (error) {
        console.log('Server sync failed, continuing with local removal');
      }

      dispatch({
        type: 'ITEM_REMOVED',
        payload: { itemId }
      });

      return { success: true, message: 'कार्ट से हटा दिया गया' };
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'कार्ट से हटाने में त्रुटि' });
      return { success: false, message: 'कार्ट से हटाने में त्रुटि' };
    }
  };

  const applyCoupon = async (couponCode) => {
    dispatch({ type: 'CART_LOADING' });
    
    try {
      const response = await axios.post('/cart/apply-coupon', {
        couponCode,
        totalAmount: state.totalAmount
      });

      if (response.data.success) {
        dispatch({
          type: 'COUPON_APPLIED',
          payload: {
            coupon: response.data.coupon,
            discount: response.data.discount
          }
        });
        return { success: true, message: 'कूपन लागू किया गया' };
      } else {
        dispatch({ type: 'CART_ERROR', payload: response.data.message });
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'कूपन लागू करने में त्रुटि';
      dispatch({ type: 'CART_ERROR', payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'COUPON_REMOVED' });
    return { success: true, message: 'कूपन हटा दिया गया' };
  };

  const clearCart = async () => {
    try {
      // Try to sync with server
      try {
        await axios.delete('/cart/clear');
      } catch (error) {
        console.log('Server sync failed, continuing with local clear');
      }

      localStorage.removeItem('bharatshaala_cart');
      dispatch({ type: 'CART_CLEARED' });
      
      return { success: true, message: 'कार्ट साफ़ कर दिया गया' };
    } catch (error) {
      dispatch({ type: 'CART_ERROR', payload: 'कार्ट साफ़ करने में त्रुटि' });
      return { success: false, message: 'कार्ट साफ़ करने में त्रुटि' };
    }
  };

  const getCartSummary = () => {
    const subtotal = state.totalAmount;
    const shipping = state.shippingCost;
    const discount = state.discount;
    const total = subtotal + shipping - discount;

    return {
      subtotal,
      shipping,
      discount,
      total,
      itemCount: state.totalItems,
      appliedCoupon: state.appliedCoupon
    };
  };

  const isItemInCart = (itemId) => {
    return state.items.some(item => item.id === itemId);
  };

  const getItemQuantity = (itemId) => {
    const item = state.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const clearRecentlyAdded = () => {
    dispatch({ type: 'CLEAR_RECENT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    items: state.items,
    totalItems: state.totalItems,
    totalAmount: state.totalAmount,
    shippingCost: state.shippingCost,
    isLoading: state.isLoading,
    error: state.error,
    appliedCoupon: state.appliedCoupon,
    discount: state.discount,
    recentlyAdded: state.recentlyAdded,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    getCartSummary,
    isItemInCart,
    getItemQuantity,
    clearRecentlyAdded,
    clearError,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;