import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { 
  ServiceWorkerManager, 
  PerformanceMonitor,
  ImageOptimizer
} from '../lib/performance';

interface PerformanceContextType {
  performanceMonitor: PerformanceMonitor;
  imageOptimizer: ImageOptimizer;
  serviceWorkerReady: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serviceWorkerReady, setServiceWorkerReady] = React.useState(false);
  
  const performanceMonitor = React.useMemo(() => PerformanceMonitor, []);
  const imageOptimizer = React.useMemo(() => new ImageOptimizer(), []);

  useEffect(() => {
    // Initialize service worker
    ServiceWorkerManager.register().then(() => {
      setServiceWorkerReady(true);
    }).catch((error: any) => {
      console.warn('Service worker registration failed:', error);
    });

    // Start performance tracking
    performanceMonitor.mark('app-start');

  }, [performanceMonitor]);

  const contextValue: PerformanceContextType = {
    performanceMonitor,
    imageOptimizer,
    serviceWorkerReady,
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};
