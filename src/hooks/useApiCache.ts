import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface ApiCacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxEntries?: number;
  enableStaleWhileRevalidate?: boolean;
  onError?: (error: Error) => void;
  onCacheHit?: (key: string) => void;
  onCacheMiss?: (key: string) => void;
}

/**
 * Smart API response caching hook with stale-while-revalidate strategy
 */
export function useApiCache<T>(options: ApiCacheOptions = {}) {
  const {
    ttl = 300000, // 5 minutes default
    maxEntries = 100,
    enableStaleWhileRevalidate = true,
    onError,
    onCacheHit,
    onCacheMiss
  } = options;

  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0
  });

  // Cache cleanup
  const cleanup = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of cache.current.entries()) {
      if (now > entry.expiry) {
        cache.current.delete(key);
      }
    }

    // Enforce max entries limit
    if (cache.current.size > maxEntries) {
      const entries = Array.from(cache.current.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      
      for (let i = maxEntries; i < entries.length; i++) {
        cache.current.delete(entries[i][0]);
      }
    }

    setCacheStats(prev => ({
      ...prev,
      size: cache.current.size
    }));
  }, [maxEntries]);

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    return () => clearInterval(interval);
  }, [cleanup]);

  // Get from cache
  const get = useCallback((key: string): T | null => {
    const entry = cache.current.get(key);
    const now = Date.now();

    if (!entry) {
      onCacheMiss?.(key);
      setCacheStats(prev => ({
        ...prev,
        misses: prev.misses + 1,
        hitRate: prev.hits / (prev.hits + prev.misses + 1)
      }));
      return null;
    }

    if (now > entry.expiry) {
      cache.current.delete(key);
      onCacheMiss?.(key);
      setCacheStats(prev => ({
        ...prev,
        misses: prev.misses + 1,
        hitRate: prev.hits / (prev.hits + prev.misses + 1)
      }));
      return null;
    }

    onCacheHit?.(key);
    setCacheStats(prev => ({
      ...prev,
      hits: prev.hits + 1,
      hitRate: (prev.hits + 1) / (prev.hits + prev.misses + 1)
    }));

    return entry.data;
  }, [onCacheHit, onCacheMiss]);

  // Set cache entry
  const set = useCallback((key: string, data: T, customTtl?: number): void => {
    const now = Date.now();
    const entryTtl = customTtl || ttl;
    
    cache.current.set(key, {
      data,
      timestamp: now,
      expiry: now + entryTtl
    });

    setCacheStats(prev => ({
      ...prev,
      size: cache.current.size
    }));
  }, [ttl]);

  // Check if entry is stale but usable
  const isStale = useCallback((key: string): boolean => {
    const entry = cache.current.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    const staleTreshold = entry.expiry - (ttl * 0.3); // Last 30% of TTL is considered stale
    
    return now > staleTreshold && now < entry.expiry;
  }, [ttl]);

  // Fetch with cache
  const fetchWithCache = useCallback(async (
    key: string,
    fetcher: () => Promise<T>,
    customOptions?: Partial<ApiCacheOptions>
  ): Promise<T> => {
    const mergedOptions = { ...options, ...customOptions };
    
    // Check cache first
    const cached = get(key);
    
    if (cached) {
      // If data is stale and SWR is enabled, return cached data but fetch in background
      if (enableStaleWhileRevalidate && isStale(key)) {
        // Return cached data immediately
        setTimeout(async () => {
          try {
            const fresh = await fetcher();
            set(key, fresh, mergedOptions.ttl);
          } catch (error) {
            onError?.(error as Error);
          }
        }, 0);
      }
      
      return cached;
    }

    // Cache miss - fetch fresh data
    try {
      const data = await fetcher();
      set(key, data, mergedOptions.ttl);
      return data;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }, [get, set, isStale, enableStaleWhileRevalidate, options, onError]);

  // Clear specific entry
  const invalidate = useCallback((key: string): void => {
    cache.current.delete(key);
    setCacheStats(prev => ({
      ...prev,
      size: cache.current.size
    }));
  }, []);

  // Clear all cache
  const clear = useCallback((): void => {
    cache.current.clear();
    setCacheStats({
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0
    });
  }, []);

  // Get cache keys
  const getKeys = useCallback((): string[] => {
    return Array.from(cache.current.keys());
  }, []);

  // Preload data
  const preload = useCallback(async (
    key: string,
    fetcher: () => Promise<T>,
    customTtl?: number
  ): Promise<void> => {
    try {
      const data = await fetcher();
      set(key, data, customTtl);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [set, onError]);

  return {
    get,
    set,
    fetchWithCache,
    invalidate,
    clear,
    getKeys,
    preload,
    isStale,
    cacheStats,
    cleanup
  };
}

export default useApiCache;
