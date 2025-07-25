/**
 * Environment configuration utility for Vite
 * Provides type-safe access to environment variables
 */

// Mock environment for testing
const mockEnv = {
  VITE_API_URL: 'http://localhost:3001/api',
  VITE_WS_URL: 'ws://localhost:8080',
  MODE: 'development',
  VITE_ENVIRONMENT: 'development',
  VITE_ENABLE_SECURITY_HEADERS: 'false',
  VITE_SESSION_TIMEOUT: '3600000',
  VITE_MAX_FILE_SIZE: '10485760'
};

// Helper function to safely access environment variables
const getEnv = (key: string, fallback?: string): string => {
  // For testing environment
  if (typeof jest !== 'undefined' || process?.env?.NODE_ENV === 'test') {
    return mockEnv[key as keyof typeof mockEnv] || fallback || '';
  }
  
  // For development/production with Vite
  try {
    const metaEnv = (globalThis as any)?.import?.meta?.env;
    if (metaEnv) {
      return metaEnv[key] || fallback || '';
    }
  } catch {
    // Silent fallback
  }
  
  return fallback || '';
};

export const env = {
  // API Configuration
  API_URL: getEnv('VITE_API_URL', 'http://localhost:3001/api'),
  WS_URL: getEnv('VITE_WS_URL', 'ws://localhost:8080'),
  
  // Environment
  NODE_ENV: getEnv('MODE', 'development'),
  ENVIRONMENT: getEnv('VITE_ENVIRONMENT', 'development'),
  
  // Security
  ENABLE_SECURITY_HEADERS: getEnv('VITE_ENABLE_SECURITY_HEADERS') === 'true',
  SESSION_TIMEOUT: parseInt(getEnv('VITE_SESSION_TIMEOUT', '3600000')),
  MAX_FILE_SIZE: parseInt(getEnv('VITE_MAX_FILE_SIZE', '10485760')),
  
  // PWA
  ENABLE_PWA: getEnv('VITE_ENABLE_PWA') === 'true',
  CACHE_VERSION: getEnv('VITE_CACHE_VERSION', 'v1.0.0'),
  ENABLE_NOTIFICATIONS: getEnv('VITE_ENABLE_NOTIFICATIONS') === 'true',
  
  // Analytics
  ANALYTICS_ID: getEnv('VITE_ANALYTICS_ID', ''),
  ENABLE_ANALYTICS: getEnv('VITE_ENABLE_ANALYTICS') === 'true',
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: getEnv('VITE_ENABLE_PERFORMANCE_MONITORING') === 'true',
  LAZY_LOADING: getEnv('VITE_LAZY_LOADING') === 'true',
  VIRTUAL_SCROLLING_THRESHOLD: parseInt(getEnv('VITE_VIRTUAL_SCROLLING_THRESHOLD', '100')),
  
  // Real-time Features
  ENABLE_WEBSOCKETS: getEnv('VITE_ENABLE_WEBSOCKETS') === 'true',
  COLLABORATION_ENABLED: getEnv('VITE_COLLABORATION_ENABLED') === 'true',
  HEARTBEAT_INTERVAL: parseInt(getEnv('VITE_HEARTBEAT_INTERVAL', '30000')),
  
  // Accessibility
  ENABLE_ACCESSIBILITY_FEATURES: getEnv('VITE_ENABLE_ACCESSIBILITY_FEATURES') === 'true',
  HIGH_CONTRAST_MODE: getEnv('VITE_HIGH_CONTRAST_MODE', 'auto'),
  REDUCED_MOTION: getEnv('VITE_REDUCED_MOTION', 'auto'),
  
  // Nigerian Localization
  DEFAULT_CURRENCY: getEnv('VITE_DEFAULT_CURRENCY', 'NGN'),
  DEFAULT_LANGUAGE: getEnv('VITE_DEFAULT_LANGUAGE', 'en'),
  SUPPORTED_LANGUAGES: getEnv('VITE_SUPPORTED_LANGUAGES', 'en,ig,yo,ha').split(','),
  TIMEZONE: getEnv('VITE_TIMEZONE', 'Africa/Lagos'),
  
  // Development
  DEBUG_MODE: getEnv('VITE_DEBUG_MODE') === 'true',
  LOG_LEVEL: getEnv('VITE_LOG_LEVEL', 'info'),
  
  // Testing
  ENABLE_TEST_IDS: getEnv('VITE_ENABLE_TEST_IDS') === 'true',
  TEST_API_DELAY: parseInt(getEnv('VITE_TEST_API_DELAY', '0')),
  
  // Error Tracking
  SENTRY_DSN: getEnv('VITE_SENTRY_DSN', ''),
  ERROR_REPORTING: getEnv('VITE_ERROR_REPORTING') === 'true',
  
  // Feature Flags
  FEATURE_ADVANCED_ANALYTICS: getEnv('VITE_FEATURE_ADVANCED_ANALYTICS') === 'true',
  FEATURE_REAL_TIME_COLLABORATION: getEnv('VITE_FEATURE_REAL_TIME_COLLABORATION') === 'true',
  FEATURE_DOCUMENT_SYNC: getEnv('VITE_FEATURE_DOCUMENT_SYNC') === 'true',
  FEATURE_OFFLINE_MODE: getEnv('VITE_FEATURE_OFFLINE_MODE') === 'true',
  FEATURE_PUSH_NOTIFICATIONS: getEnv('VITE_FEATURE_PUSH_NOTIFICATIONS') === 'true',
  
  // Third-party Services
  PAYSTACK_PUBLIC_KEY: getEnv('VITE_PAYSTACK_PUBLIC_KEY', ''),
  MAPS_API_KEY: getEnv('VITE_MAPS_API_KEY', ''),
  CLOUDINARY_CLOUD_NAME: getEnv('VITE_CLOUDINARY_CLOUD_NAME', ''),
  
  // Security Headers
  CSP_ENABLED: getEnv('VITE_CSP_ENABLED') === 'true',
  HSTS_MAX_AGE: parseInt(getEnv('VITE_HSTS_MAX_AGE', '31536000')),
  X_FRAME_OPTIONS: getEnv('VITE_X_FRAME_OPTIONS', 'DENY'),
};

// Environment checks
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTesting = () => env.NODE_ENV === 'test';

// Debug helper
export const getEnvInfo = () => {
  if (isDevelopment()) {
    console.log('Environment Configuration:', env);
  }
  return env;
};

export default env;
