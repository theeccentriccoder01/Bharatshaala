import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook for managing user preferences
export const useUserPreferences = () => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('bharatshaala_preferences', {
    language: 'hi',
    currency: 'INR',
    theme: 'light',
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderUpdates: true,
      promotions: false
    },
    display: {
      itemsPerPage: 20,
      viewMode: 'grid',
      sortBy: 'popular'
    }
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedPreference = (parentKey, childKey, value) => {
    setPreferences(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  return {
    preferences,
    setPreferences,
    updatePreference,
    updateNestedPreference,
    removePreferences
  };
};

// Hook for managing search history
export const useSearchHistory = (maxItems = 10) => {
  const [searchHistory, setSearchHistory] = useLocalStorage('bharatshaala_search_history', []);

  const addSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.term !== searchTerm);
      const newHistory = [
        { term: searchTerm, timestamp: new Date().toISOString() },
        ...filtered
      ].slice(0, maxItems);
      return newHistory;
    });
  };

  const removeSearch = (searchTerm) => {
    setSearchHistory(prev => prev.filter(item => item.term !== searchTerm));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const getRecentSearches = (count = 5) => {
    return searchHistory.slice(0, count);
  };

  return {
    searchHistory,
    addSearch,
    removeSearch,
    clearHistory,
    getRecentSearches
  };
};

// Hook for managing recently viewed items
export const useRecentlyViewed = (maxItems = 20) => {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('bharatshaala_recently_viewed', []);

  const addItem = (item) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(viewedItem => viewedItem.id !== item.id);
      const newViewed = [
        {
          id: item.id,
          name: item.name,
          image: item.image || item.images?.[0]?.url,
          price: item.price,
          category: item.category,
          viewedAt: new Date().toISOString()
        },
        ...filtered
      ].slice(0, maxItems);
      return newViewed;
    });
  };

  const removeItem = (itemId) => {
    setRecentlyViewed(prev => prev.filter(item => item.id !== itemId));
  };

  const clearItems = () => {
    setRecentlyViewed([]);
  };

  const getRecentItems = (count = 10) => {
    return recentlyViewed.slice(0, count);
  };

  return {
    recentlyViewed,
    addItem,
    removeItem,
    clearItems,
    getRecentItems
  };
};

export default useLocalStorage;