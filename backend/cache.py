"""
Caching module for database query results.
Provides in-memory caching with TTL support for frequently accessed data.
"""
import time
import threading
from typing import Any, Optional, Callable
from functools import wraps


class CacheEntry:
    """Represents a single cache entry with TTL support"""
    
    def __init__(self, value: Any, ttl: int):
        self.value = value
        self.expires_at = time.time() + ttl if ttl > 0 else float('inf')
    
    def is_expired(self) -> bool:
        return time.time() > self.expires_at


class InMemoryCache:
    """
    Thread-safe in-memory cache implementation with TTL support.
    """
    
    def __init__(self):
        self._cache: dict[str, CacheEntry] = {}
        self._lock = threading.RLock()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        with self._lock:
            entry = self._cache.get(key)
            if entry is None:
                return None
            if entry.is_expired():
                del self._cache[key]
                return None
            return entry.value
    
    def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """Set value in cache with TTL (default 5 minutes)"""
        with self._lock:
            self._cache[key] = CacheEntry(value, ttl)
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False
    
    def clear(self) -> None:
        """Clear all cache entries"""
        with self._lock:
            self._cache.clear()
    
    def cleanup_expired(self) -> int:
        """Remove expired entries and return count of removed entries"""
        with self._lock:
            expired_keys = [
                key for key, entry in self._cache.items()
                if entry.is_expired()
            ]
            for key in expired_keys:
                del self._cache[key]
            return len(expired_keys)
    
    def get_or_set(self, key: str, factory: Callable[[], Any], ttl: int = 300) -> Any:
        """
        Get value from cache or compute and store it if not present.
        This is an atomic operation to prevent cache stampede.
        """
        with self._lock:
            # Double-check pattern within lock
            entry = self._cache.get(key)
            if entry is None or entry.is_expired():
                value = factory()
                self._cache[key] = CacheEntry(value, ttl)
                return value
            return entry.value


# Global cache instance
cache = InMemoryCache()


def cached(ttl: int = 300, key_prefix: str = ''):
    """
    Decorator to cache function results.
    
    Args:
        ttl: Time to live in seconds (default 5 minutes)
        key_prefix: Prefix for cache key
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Build cache key from function name and arguments
            cache_key = f"{key_prefix}{func.__name__}"
            if args:
                cache_key += f":{':'.join(str(arg) for arg in args)}"
            if kwargs:
                cache_key += f":{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}"
            
            # Try to get from cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value
            
            # Compute and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        # Add cache invalidation method
        wrapper.invalidate = lambda *args, **kwargs: cache.delete(
            f"{key_prefix}{func.__name__}" + 
            (f":{':'.join(str(arg) for arg in args)}" if args else '') +
            (f":{':'.join(f'{k}={v}' for k, v in sorted(kwargs.items()))}" if kwargs else '')
        )
        
        return wrapper
    return decorator


def invalidate_cache(key_pattern: str = None):
    """
    Invalidate cache entries.
    If key_pattern is provided, only matching keys are invalidated.
    Otherwise, entire cache is cleared.
    """
    if key_pattern is None:
        cache.clear()
    else:
        # Note: This is a simple implementation; for production, 
        # consider using a more sophisticated pattern matching
        with cache._lock:
            keys_to_delete = [
                key for key in cache._cache.keys()
                if key_pattern in key
            ]
            for key in keys_to_delete:
                cache.delete(key)


# Cache cleanup scheduler (runs in background)
def start_cache_cleanup(interval: int = 60):
    """Start background cache cleanup thread"""
    def cleanup_loop():
        while True:
            time.sleep(interval)
            try:
                removed = cache.cleanup_expired()
                if removed > 0:
                    import logging
                    logging.getLogger(__name__).debug(f"Cleaned up {removed} expired cache entries")
            except Exception:
                pass
    
    thread = threading.Thread(target=cleanup_loop, daemon=True)
    thread.start()
    return thread


# Default cache instances for common data
categories_cache = InMemoryCache()
products_cache = InMemoryCache()
user_cache = InMemoryCache()
