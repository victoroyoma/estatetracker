/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_ENABLE_SECURITY_HEADERS: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_CACHE_VERSION: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string;
  readonly VITE_LAZY_LOADING: string;
  readonly VITE_VIRTUAL_SCROLLING_THRESHOLD: string;
  readonly VITE_ENABLE_WEBSOCKETS: string;
  readonly VITE_COLLABORATION_ENABLED: string;
  readonly VITE_HEARTBEAT_INTERVAL: string;
  readonly VITE_ENABLE_ACCESSIBILITY_FEATURES: string;
  readonly VITE_HIGH_CONTRAST_MODE: string;
  readonly VITE_REDUCED_MOTION: string;
  readonly VITE_DEFAULT_CURRENCY: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_SUPPORTED_LANGUAGES: string;
  readonly VITE_TIMEZONE: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_LOG_LEVEL: string;
  readonly VITE_ENABLE_TEST_IDS: string;
  readonly VITE_TEST_API_DELAY: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_ERROR_REPORTING: string;
  readonly VITE_FEATURE_ADVANCED_ANALYTICS: string;
  readonly VITE_FEATURE_REAL_TIME_COLLABORATION: string;
  readonly VITE_FEATURE_DOCUMENT_SYNC: string;
  readonly VITE_FEATURE_OFFLINE_MODE: string;
  readonly VITE_FEATURE_PUSH_NOTIFICATIONS: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CSP_ENABLED: string;
  readonly VITE_HSTS_MAX_AGE: string;
  readonly VITE_X_FRAME_OPTIONS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
