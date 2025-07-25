import { useCallback, useEffect, useState } from 'react';
import { AppError } from '../types';

interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  recentErrors: AppError[];
  errorRate: number;
}

interface ErrorMonitorConfig {
  maxRecentErrors: number;
  trackingWindow: number; // in milliseconds
  enableConsoleErrors: boolean;
  enableUnhandledPromiseErrors: boolean;
}

/**
 * Comprehensive error monitoring and reporting system
 */
export function useErrorMonitor(config: Partial<ErrorMonitorConfig> = {}) {
  const defaultConfig: ErrorMonitorConfig = {
    maxRecentErrors: 50,
    trackingWindow: 300000, // 5 minutes
    enableConsoleErrors: true,
    enableUnhandledPromiseErrors: true,
    ...config
  };

  const [errorMetrics, setErrorMetrics] = useState<ErrorMetrics>({
    totalErrors: 0,
    errorsByType: {},
    recentErrors: [],
    errorRate: 0
  });

  // Log error to our system
  const logError = useCallback((error: AppError) => {
    setErrorMetrics(prev => {
      const newRecentErrors = [error, ...prev.recentErrors].slice(0, defaultConfig.maxRecentErrors);
      const now = Date.now();
      
      // Calculate error rate (errors per minute in the tracking window)
      const recentErrorsInWindow = newRecentErrors.filter(
        err => now - err.timestamp.getTime() <= defaultConfig.trackingWindow
      );
      const errorRate = (recentErrorsInWindow.length / (defaultConfig.trackingWindow / 60000));

      return {
        totalErrors: prev.totalErrors + 1,
        errorsByType: {
          ...prev.errorsByType,
          [error.code]: (prev.errorsByType[error.code] || 0) + 1
        },
        recentErrors: newRecentErrors,
        errorRate
      };
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', error);
    }

    // Send to analytics service (implement as needed)
    // analytics.track('error', error);
  }, [defaultConfig]);

  // Global error handlers
  useEffect(() => {
    if (defaultConfig.enableConsoleErrors) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const error: AppError = {
          code: 'CONSOLE_ERROR',
          message: args.join(' '),
          timestamp: new Date(),
          details: { args }
        };
        logError(error);
        originalConsoleError.apply(console, args);
      };

      return () => {
        console.error = originalConsoleError;
      };
    }
  }, [defaultConfig.enableConsoleErrors, logError]);

  useEffect(() => {
    if (defaultConfig.enableUnhandledPromiseErrors) {
      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        const error: AppError = {
          code: 'UNHANDLED_PROMISE_REJECTION',
          message: event.reason?.message || 'Unhandled promise rejection',
          timestamp: new Date(),
          details: { reason: event.reason }
        };
        logError(error);
      };

      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, [defaultConfig.enableUnhandledPromiseErrors, logError]);

  // Clear old errors
  const clearOldErrors = useCallback(() => {
    const now = Date.now();
    setErrorMetrics(prev => ({
      ...prev,
      recentErrors: prev.recentErrors.filter(
        err => now - err.timestamp.getTime() <= defaultConfig.trackingWindow
      )
    }));
  }, [defaultConfig.trackingWindow]);

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(clearOldErrors, 60000); // Clean every minute
    return () => clearInterval(interval);
  }, [clearOldErrors]);

  // Get error summary
  const getErrorSummary = useCallback(() => {
    const topErrors = Object.entries(errorMetrics.errorsByType)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      ...errorMetrics,
      topErrors,
      isHealthy: errorMetrics.errorRate < 1, // Less than 1 error per minute
      status: errorMetrics.errorRate < 1 ? 'healthy' : 
             errorMetrics.errorRate < 5 ? 'warning' : 'critical'
    };
  }, [errorMetrics]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrorMetrics({
      totalErrors: 0,
      errorsByType: {},
      recentErrors: [],
      errorRate: 0
    });
  }, []);

  return {
    errorMetrics,
    logError,
    getErrorSummary,
    clearErrors
  };
}
