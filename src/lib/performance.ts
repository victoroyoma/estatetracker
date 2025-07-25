import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Performance optimization utilities for EstateTracker
 */

/**
 * Debounce hook for input handling
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for frequent events
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRun = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRun.current >= limit) {
        setThrottledValue(value);
        lastRun.current = Date.now();
      }
    }, limit - (Date.now() - lastRun.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return entry;
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, startIndex, endIndex]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    startIndex,
    handleScroll
  };
}

/**
 * Memoization utility for expensive calculations
 */
export class MemoCache<TArgs extends any[], TReturn> {
  private cache = new Map<string, { value: TReturn; timestamp: number }>();
  private ttl: number;

  constructor(ttl: number = 300000) { // 5 minutes default
    this.ttl = ttl;
  }

  get(key: string, fn: (...args: TArgs) => TReturn, ...args: TArgs): TReturn {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp < this.ttl)) {
      return cached.value;
    }

    const value = fn(...args);
    this.cache.set(key, { value, timestamp: now });

    // Cleanup old entries
    for (const [cacheKey, cacheValue] of this.cache.entries()) {
      if (now - cacheValue.timestamp >= this.ttl) {
        this.cache.delete(cacheKey);
      }
    }

    return value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

/**
 * Image optimization utilities
 */
export class ImageOptimizer {
  static generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ');
  }

  static async compressImage(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async loadImageLazy(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }
}

/**
 * Bundle analyzer for code splitting
 */
export const BundleAnalyzer = {
  trackChunkLoad: (chunkName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      console.log(`Chunk "${chunkName}" loaded in ${end - start}ms`);
    };
  },

  preloadRoute: (routeComponent: () => Promise<any>) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    
    // This would need to be enhanced with actual chunk URLs
    document.head.appendChild(link);
    
    return routeComponent;
  }
};

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static mark(name: string): void {
    this.marks.set(name, performance.now());
    performance.mark(name);
  }

  static measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = performance.now();
    
    if (startTime) {
      const duration = endTime - startTime;
      performance.measure(name, startMark);
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    }
    
    return 0;
  }

  static getMetrics(): PerformanceNavigationTiming | null {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation || null;
  }

  static trackLCP(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
          observer.disconnect();
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } else {
        resolve(0);
      }
    });
  }

  static trackFID(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            resolve(entry.processingStart - entry.startTime);
          });
          observer.disconnect();
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } else {
        resolve(0);
      }
    });
  }

  static trackCLS(): Promise<number> {
    return new Promise((resolve) => {
      let clsValue = 0;
      
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after 5 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(clsValue);
        }, 5000);
      } else {
        resolve(0);
      }
    });
  }
}

/**
 * Service Worker utilities for caching
 */
export class ServiceWorkerManager {
  static async register(): Promise<ServiceWorkerRegistration | null> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  static async update(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.update();
    }
  }

  static async clearCache(cacheName?: string): Promise<void> {
    if ('caches' in window) {
      if (cacheName) {
        await caches.delete(cacheName);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    }
  }
}

export default {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useVirtualScroll,
  MemoCache,
  ImageOptimizer,
  BundleAnalyzer,
  PerformanceMonitor,
  ServiceWorkerManager
};
