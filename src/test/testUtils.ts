/**
 * Advanced testing utilities for EstateTracker
 */

import { render, RenderOptions, RenderResult } from '@testing-library/react';
import React, { ReactElement, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Test data factories
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: 'test-user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'client' as const,
  phone: '+2348123456789',
  isVerified: true,
  avatar: null,
  preferences: {
    theme: 'light' as const,
    language: 'en' as const,
    notifications: true,
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockEstate = (overrides: Partial<any> = {}) => ({
  id: 'test-estate-1',
  name: 'Test Estate',
  description: 'A test estate for development',
  location: 'Lagos, Nigeria',
  developerId: 'dev-1',
  totalPlots: 100,
  soldPlots: 45,
  availablePlots: 55,
  priceRange: {
    min: 5000000,
    max: 15000000,
  },
  amenities: ['Swimming Pool', 'Gym', 'Security'],
  coordinates: {
    latitude: 6.5244,
    longitude: 3.3792,
  },
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  status: 'active' as const,
  completionDate: new Date('2025-12-31'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockPlot = (overrides: Partial<any> = {}) => ({
  id: 'test-plot-1',
  plotNumber: 'A001',
  estateId: 'test-estate-1',
  size: 500, // square meters
  price: 10000000,
  status: 'available' as const,
  type: 'residential' as const,
  coordinates: {
    latitude: 6.5244,
    longitude: 3.3792,
  },
  boundaries: [
    [6.5244, 3.3792],
    [6.5245, 3.3792],
    [6.5245, 3.3793],
    [6.5244, 3.3793],
  ],
  amenities: ['Water', 'Electricity'],
  constructionStage: null,
  purchaseDate: null,
  ownerId: null,
  documents: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockDocument = (overrides: Partial<any> = {}) => ({
  id: 'test-doc-1',
  name: 'Test Document.pdf',
  type: 'pdf',
  size: 1024000, // 1MB
  url: '/test-document.pdf',
  category: 'legal' as const,
  description: 'Test document for development',
  uploadedBy: 'test-user-1',
  uploadedAt: new Date('2024-01-01'),
  estateId: 'test-estate-1',
  plotId: null,
  isVerified: false,
  tags: ['test', 'development'],
  ...overrides,
});

export const createMockNotification = (overrides: Partial<any> = {}) => ({
  id: 'test-notification-1',
  title: 'Test Notification',
  message: 'This is a test notification',
  type: 'info' as const,
  priority: 'medium' as const,
  read: false,
  userId: 'test-user-1',
  metadata: {},
  createdAt: new Date('2024-01-01'),
  expiresAt: null,
  actionUrl: null,
  ...overrides,
});

// Mock API responses
export const createMockApiResponse = <T>(data: T, overrides: Partial<any> = {}) => ({
  success: true,
  data,
  message: 'Success',
  timestamp: new Date().toISOString(),
  ...overrides,
});

export const createMockPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
  total?: number
) => ({
  items,
  pagination: {
    page,
    limit,
    total: total ?? items.length,
    totalPages: Math.ceil((total ?? items.length) / limit),
    hasNext: page * limit < (total ?? items.length),
    hasPrev: page > 1,
  },
});

// Test providers wrapper
interface AllTheProvidersProps {
  children: ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(BrowserRouter, null, children)
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Test utilities for async operations
export const waitForLoadingToFinish = async () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

export const flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
};

// Mock localStorage
export const createMockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

// Mock fetch
export const createMockFetch = (responses: Record<string, any> = {}) => {
  return jest.fn((url: string, _options?: RequestInit) => {
    const response = responses[url];
    
    if (!response) {
      return Promise.reject(new Error(`No mock response for ${url}`));
    }

    const mockResponse = {
      ok: response.status >= 200 && response.status < 300,
      status: response.status || 200,
      statusText: response.statusText || 'OK',
      json: () => Promise.resolve(response.data),
      text: () => Promise.resolve(JSON.stringify(response.data)),
      blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
      headers: new Headers(response.headers || {}),
    };

    return Promise.resolve(mockResponse as Response);
  });
};

// Test assertion helpers
export const expectToBeInDOM = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
};

export const expectToHaveClass = (element: HTMLElement, className: string) => {
  expect(element).toHaveClass(className);
};

export const expectToBeVisible = (element: HTMLElement) => {
  expect(element).toBeVisible();
};

export const expectToBeDisabled = (element: HTMLElement) => {
  expect(element).toBeDisabled();
};

export const expectToHaveValue = (element: HTMLElement, value: string | number) => {
  expect(element).toHaveValue(value);
};

export const expectToHaveTextContent = (element: HTMLElement, text: string) => {
  expect(element).toHaveTextContent(text);
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void): Promise<number> => {
  const start = performance.now();
  renderFn();
  await waitForLoadingToFinish();
  const end = performance.now();
  return end - start;
};

// Accessibility testing helpers
export const testAccessibility = async (container: HTMLElement) => {
  // Check for basic accessibility issues
  const issues: string[] = [];

  // Check for images without alt text
  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });

  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    if (id) {
      const label = container.querySelector(`label[for="${id}"]`);
      if (!label && !input.getAttribute('aria-label')) {
        issues.push(`Form input ${index + 1} missing label`);
      }
    }
  });

  // Check for buttons without accessible names
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute('aria-label');
    if (!hasText && !hasAriaLabel) {
      issues.push(`Button ${index + 1} missing accessible name`);
    }
  });

  return issues;
};

// Mock intersection observer
export const createMockIntersectionObserver = () => {
  const observe = jest.fn();
  const disconnect = jest.fn();
  const unobserve = jest.fn();

  // Mock IntersectionObserver
  window.IntersectionObserver = jest.fn(() => ({
    observe,
    disconnect,
    unobserve,
    root: null,
    rootMargin: '',
    thresholds: [],
  })) as any;

  return {
    observe,
    disconnect,
    unobserve,
    triggerIntersection: (entries: Partial<IntersectionObserverEntry>[]) => {
      const mockEntries = entries.map(entry => ({
        isIntersecting: false,
        intersectionRatio: 0,
        target: document.createElement('div'),
        ...entry,
      }));
      
      // Call the callback that was passed to IntersectionObserver
      const [callback] = (window.IntersectionObserver as jest.Mock).mock.calls[0];
      if (callback) {
        callback(mockEntries);
      }
    },
  };
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };

export default {
  createMockUser,
  createMockEstate,
  createMockPlot,
  createMockDocument,
  createMockNotification,
  createMockApiResponse,
  createMockPaginatedResponse,
  createMockLocalStorage,
  createMockFetch,
  createMockIntersectionObserver,
  waitForLoadingToFinish,
  flushPromises,
  measureRenderTime,
  testAccessibility,
  expectToBeInDOM,
  expectToHaveClass,
  expectToBeVisible,
  expectToBeDisabled,
  expectToHaveValue,
  expectToHaveTextContent,
};
