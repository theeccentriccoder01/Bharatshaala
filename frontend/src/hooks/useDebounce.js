// Advanced Debounce and Throttle Hooks for Bharatshaala Platform
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import analytics from '.../utils/analytics';

// Main debounce hook
export const useDebounce = (value, delay = 300, options = {}) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef(null);
  const previousValueRef = useRef(value);
  const mountedRef = useRef(true);

  const {
    leading = false,
    trailing = true,
    maxWait = null,
    immediate = false,
    trackAnalytics = false,
    analyticsEvent = 'debounce_triggered'
  } = options;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Skip if value hasn't changed
    if (value === previousValueRef.current) return;
    
    previousValueRef.current = value;
    setIsDebouncing(true);

    // Leading edge execution
    if (leading && !timeoutRef.current) {
      setDebouncedValue(value);
      setIsDebouncing(false);
      
      if (trackAnalytics) {
        analytics.track(analyticsEvent, {
          trigger: 'leading',
          delay,
          valueType: typeof value
        });
      }
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      if (trailing) {
        setDebouncedValue(value);
        
        if (trackAnalytics) {
          analytics.track(analyticsEvent, {
            trigger: 'trailing',
            delay,
            valueType: typeof value
          });
        }
      }

      setIsDebouncing(false);
      timeoutRef.current = null;
    }, delay);

    // MaxWait functionality
    if (maxWait && !timeoutRef.maxWaitTimeout) {
      timeoutRef.maxWaitTimeout = setTimeout(() => {
        if (!mountedRef.current) return;
        
        setDebouncedValue(value);
        setIsDebouncing(false);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        timeoutRef.maxWaitTimeout = null;
        
        if (trackAnalytics) {
          analytics.track(analyticsEvent, {
            trigger: 'maxWait',
            delay: maxWait,
            valueType: typeof value
          });
        }
      }, maxWait);
    }

    // Immediate execution option
    if (immediate && !timeoutRef.current) {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }

  }, [value, delay, leading, trailing, maxWait, immediate, trackAnalytics, analyticsEvent]);

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (timeoutRef.maxWaitTimeout) {
      clearTimeout(timeoutRef.maxWaitTimeout);
      timeoutRef.maxWaitTimeout = null;
    }
    setIsDebouncing(false);
  }, []);

  // Flush function - immediately execute pending debounced call
  const flush = useCallback(() => {
    if (timeoutRef.current && mountedRef.current) {
      clearTimeout(timeoutRef.current);
      setDebouncedValue(value);
      setIsDebouncing(false);
      timeoutRef.current = null;
    }
  }, [value]);

  return [debouncedValue, { isDebouncing, cancel, flush }];
};

// Throttle hook
export const useThrottle = (value, limit = 100, options = {}) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const [isThrottling, setIsThrottling] = useState(false);
  const lastExecuted = useRef(Date.now());
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const {
    leading = true,
    trailing = true,
    trackAnalytics = false,
    analyticsEvent = 'throttle_triggered'
  } = options;

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= limit) {
      // Execute immediately
      if (leading) {
        setThrottledValue(value);
        lastExecuted.current = now;
        setIsThrottling(false);

        if (trackAnalytics) {
          analytics.track(analyticsEvent, {
            trigger: 'leading',
            limit,
            timeSinceLast: timeSinceLastExecution
          });
        }
      }
    } else {
      // Schedule execution
      setIsThrottling(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          
          setThrottledValue(value);
          lastExecuted.current = Date.now();
          setIsThrottling(false);
          timeoutRef.current = null;

          if (trackAnalytics) {
            analytics.track(analyticsEvent, {
              trigger: 'trailing',
              limit,
              delayed: true
            });
          }
        }, limit - timeSinceLastExecution);
      }
    }
  }, [value, limit, leading, trailing, trackAnalytics, analyticsEvent]);

  return [throttledValue, { isThrottling }];
};

// Debounced callback hook
export const useDebouncedCallback = (callback, delay = 300, dependencies = [], options = {}) => {
  const {
    leading = false,
    trailing = true,
    maxWait = null
  } = options;

  const timeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const lastInvokeTimeRef = useRef(0);
  const callbackRef = useRef(callback);

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  const debouncedCallback = useCallback((...args) => {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCallTimeRef.current;
    const timeSinceLastInvoke = currentTime - lastInvokeTimeRef.current;

    lastCallTimeRef.current = currentTime;

    const shouldInvokeLeading = leading && (!timeoutRef.current || timeSinceLastCall >= delay);
    const shouldInvokeMaxWait = maxWait && timeSinceLastInvoke >= maxWait;

    if (shouldInvokeLeading || shouldInvokeMaxWait) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      lastInvokeTimeRef.current = currentTime;
      return callbackRef.current(...args);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        lastInvokeTimeRef.current = Date.now();
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, delay);
    }
  }, [delay, leading, trailing, maxWait]);

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Flush function
  const flush = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      lastInvokeTimeRef.current = Date.now();
      return callbackRef.current(...args);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(() => ({
    callback: debouncedCallback,
    cancel,
    flush
  }), [debouncedCallback, cancel, flush]);
};

// Throttled callback hook
export const useThrottledCallback = (callback, limit = 100, dependencies = [], options = {}) => {
  const {
    leading = true,
    trailing = true
  } = options;

  const lastExecuted = useRef(0);
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...dependencies]);

  const throttledCallback = useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= limit) {
      if (leading) {
        lastExecuted.current = now;
        return callbackRef.current(...args);
      }
    }

    if (trailing && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        lastExecuted.current = Date.now();
        timeoutRef.current = null;
        callbackRef.current(...args);
      }, limit - timeSinceLastExecution);
    }
  }, [limit, leading, trailing]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

// Search-specific debounce hook
export const useSearchDebounce = (searchTerm, delay = 500, minLength = 2) => {
  const [debouncedTerm, { isDebouncing }] = useDebounce(searchTerm, delay, {
    trackAnalytics: true,
    analyticsEvent: 'search_debounced'
  });

  const shouldSearch = useMemo(() => {
    return debouncedTerm.length >= minLength;
  }, [debouncedTerm, minLength]);

  return [shouldSearch ? debouncedTerm : '', { isDebouncing, shouldSearch }];
};

// Form validation debounce
export const useValidationDebounce = (formData, validationFn, delay = 300) => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  
  const [debouncedData, { isDebouncing }] = useDebounce(formData, delay);

  useEffect(() => {
    if (!debouncedData || Object.keys(debouncedData).length === 0) return;

    setIsValidating(true);
    
    const validateAsync = async () => {
      try {
        const validationErrors = await validationFn(debouncedData);
        setErrors(validationErrors || {});
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setIsValidating(false);
      }
    };

    validateAsync();
  }, [debouncedData, validationFn]);

  return [errors, { isValidating: isValidating || isDebouncing }];
};

// Auto-save hook with debounce
export const useAutoSave = (data, saveFn, delay = 2000, options = {}) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  const { enabled = true, trackChanges = true } = options;
  
  const debouncedSave = useDebouncedCallback(async (dataToSave) => {
    if (!enabled) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await saveFn(dataToSave);
      setLastSaved(Date.now());
      
      if (trackChanges) {
        analytics.track('auto_save_success', {
          dataSize: JSON.stringify(dataToSave).length,
          delay
        });
      }
    } catch (error) {
      setSaveError(error.message);
      analytics.track('auto_save_failed', {
        error: error.message
      });
    } finally {
      setIsSaving(false);
    }
  }, delay, [saveFn, enabled]);

  useEffect(() => {
    if (data && enabled) {
      debouncedSave.callback(data);
    }
  }, [data, enabled, debouncedSave]);

  const forceSave = useCallback(() => {
    if (data) {
      debouncedSave.flush(data);
    }
  }, [data, debouncedSave]);

  return {
    lastSaved,
    isSaving,
    saveError,
    forceSave
  };
};

// Resize debounce hook
export const useResizeDebounce = (delay = 100) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const updateSize = useDebouncedCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, delay, []);

  useEffect(() => {
    window.addEventListener('resize', updateSize.callback);
    return () => window.removeEventListener('resize', updateSize.callback);
  }, [updateSize]);

  return windowSize;
};

export default useDebounce;