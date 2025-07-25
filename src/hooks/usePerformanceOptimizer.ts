import { useCallback, useMemo, useRef, useEffect } from 'react';
import { debounce, throttle } from '../lib/utils';

/**
 * Custom hook for performance optimization
 */
export function usePerformanceOptimizer() {
  const renderCountRef = useRef(0);
  const performanceMetricsRef = useRef<{
    renderTimes: number[];
    averageRenderTime: number;
  }>({ renderTimes: [], averageRenderTime: 0 });

  // Track component renders
  useEffect(() => {
    const startTime = performance.now();
    renderCountRef.current += 1;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      performanceMetricsRef.current.renderTimes.push(renderTime);
      
      // Keep only last 50 render times
      if (performanceMetricsRef.current.renderTimes.length > 50) {
        performanceMetricsRef.current.renderTimes.shift();
      }
      
      // Calculate average
      const times = performanceMetricsRef.current.renderTimes;
      performanceMetricsRef.current.averageRenderTime = 
        times.reduce((sum, time) => sum + time, 0) / times.length;
    };
  });

  // Optimized debounce hook
  const useOptimizedDebounce = useCallback(<T extends (...args: any[]) => any>(callback: T, delay: number) => {
    return useMemo(() => debounce(callback, delay), [callback, delay]);
  }, []);

  // Optimized throttle hook
  const useOptimizedThrottle = useCallback(<T extends (...args: any[]) => any>(callback: T, limit: number) => {
    return useMemo(() => throttle(callback, limit), [callback, limit]);
  }, []);

  // Memory usage monitoring
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }, []);

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => ({
    renderCount: renderCountRef.current,
    averageRenderTime: performanceMetricsRef.current.averageRenderTime,
    memoryUsage: getMemoryUsage()
  }), [getMemoryUsage]);

  return {
    useOptimizedDebounce,
    useOptimizedThrottle,
    getPerformanceMetrics,
    getMemoryUsage
  };
}
