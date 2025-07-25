import '@testing-library/jest-dom';

// Jest types are already available through @testing-library/jest-dom

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(public callback: IntersectionObserverCallback, public options?: IntersectionObserverInit) {}
  root = null;
  rootMargin = '';
  thresholds: readonly number[] = [];
  disconnect = () => {};
  observe = () => {};
  unobserve = () => {};
  takeRecords = (): IntersectionObserverEntry[] => [];
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(public callback: ResizeObserverCallback) {}
  disconnect = () => {};
  observe = () => {};
  unobserve = () => {};
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock localStorage
const localStorageMock = {
  length: 0,
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
} as Storage;
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = (() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })) as any;

// Suppress console errors during tests if available
if (typeof beforeAll !== 'undefined') {
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is no longer supported')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  if (typeof afterAll !== 'undefined') {
    afterAll(() => {
      console.error = originalError;
    });
  }
}
