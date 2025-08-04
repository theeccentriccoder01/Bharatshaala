import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes
    ...options
  };

  useEffect(() => {
    setSupported('geolocation' in navigator);
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!supported) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'स्थान प्राप्त करने में त्रुटि';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'स्थान की अनुमति मना कर दी गई';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'स्थान की जानकारी उपलब्ध नहीं है';
            break;
          case error.TIMEOUT:
            errorMessage = 'स्थान प्राप्त करने में समय सीमा समाप्त';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );
  }, [supported, defaultOptions]);

  const watchPosition = useCallback(() => {
    if (!supported) {
      setError('Geolocation is not supported by this browser');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
      },
      (error) => {
        setError(error.message);
      },
      defaultOptions
    );

    return watchId;
  }, [supported, defaultOptions]);

  const clearWatch = useCallback((watchId) => {
    if (watchId && supported) {
      navigator.geolocation.clearWatch(watchId);
    }
  }, [supported]);

  // Get address from coordinates
  const getAddress = useCallback(async (lat, lng) => {
    try {
      // Using a free geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=hi`
      );
      const data = await response.json();
      
      return {
        formatted: data.locality || data.city || data.principalSubdivision,
        city: data.city,
        state: data.principalSubdivision,
        country: data.countryName,
        pincode: data.postcode,
        full: data
      };
    } catch (error) {
      console.error('Address lookup failed:', error);
      return null;
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }, []);

  // Check if location is within a certain radius
  const isWithinRadius = useCallback((centerLat, centerLng, radius, pointLat, pointLng) => {
    const distance = calculateDistance(centerLat, centerLng, pointLat, pointLng);
    return distance <= radius;
  }, [calculateDistance]);

  // Get nearby markets/shops
  const getNearbyPlaces = useCallback(async (type = 'market', radius = 10) => {
    if (!location) return [];

    try {
      // This would typically call your backend API
      const response = await fetch(
        `/api/places/nearby?lat=${location.latitude}&lng=${location.longitude}&type=${type}&radius=${radius}`
      );
      return await response.json();
    } catch (error) {
      console.error('Failed to get nearby places:', error);
      return [];
    }
  }, [location]);

  // Request permission for location
  const requestPermission = useCallback(async () => {
    if (!supported) return false;

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state === 'granted';
    } catch (error) {
      // Fallback for browsers that don't support permissions API
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => resolve(true),
          () => resolve(false),
          { timeout: 1000 }
        );
      });
    }
  }, [supported]);

  return {
    location,
    loading,
    error,
    supported,
    getCurrentPosition,
    watchPosition,
    clearWatch,
    getAddress,
    calculateDistance,
    isWithinRadius,
    getNearbyPlaces,
    requestPermission
  };
};

// Hook specifically for delivery location
export const useDeliveryLocation = () => {
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location, getCurrentPosition, getAddress, loading, error } = useGeolocation();

  const setDeliveryFromCurrentLocation = useCallback(async () => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    if (location) {
      getAddress(location.latitude, location.longitude).then(address => {
        if (address) {
          const deliveryAddr = {
            latitude: location.latitude,
            longitude: location.longitude,
            address: address.formatted,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            type: 'current'
          };
          setDeliveryAddress(deliveryAddr);
          setSelectedLocation(deliveryAddr);
        }
      });
    }
  }, [location, getAddress]);

  const setCustomDeliveryLocation = useCallback((address) => {
    setSelectedLocation(address);
    setDeliveryAddress(address);
  }, []);

  const clearDeliveryLocation = useCallback(() => {
    setSelectedLocation(null);
    setDeliveryAddress(null);
  }, []);

  return {
    deliveryAddress,
    selectedLocation,
    setDeliveryFromCurrentLocation,
    setCustomDeliveryLocation,
    clearDeliveryLocation,
    loading,
    error
  };
};

export default useGeolocation;