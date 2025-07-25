import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Estate, 
  Plot, 
  Document, 
  Notification,
  Subscription,
  LoginFormData,
  RegisterFormData 
} from '../types';

import { env } from './env';

// API Configuration
const API_BASE_URL = env.API_URL;

// API Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Add network status check
const isOnline = () => typeof navigator !== 'undefined' ? navigator.onLine : true;

// Add timeout utility
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

// Request interceptor type
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private abortController: AbortController | null = null;

  constructor(private baseURL: string) {}

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Create abort controller for cancelling requests
  createAbortController() {
    this.abortController = new AbortController();
    return this.abortController;
  }

  // Cancel all pending requests
  cancelRequests() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Apply request interceptors
    let config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: this.abortController?.signal,
      ...options,
    };

    // Remove Content-Type for FormData requests
    if (options.body instanceof FormData) {
      const { 'Content-Type': contentType, ...restHeaders } = config.headers as Record<string, string>;
      config.headers = restHeaders;
    }

    for (const interceptor of this.requestInterceptors) {
      const interceptedConfig = await interceptor(config);
      config = { 
        ...config, 
        ...interceptedConfig,
        headers: {
          ...config.headers,
          ...interceptedConfig.headers,
        }
      };
    }

    try {
      let response = await withTimeout(fetch(url, config));

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
          } else {
            errorData = { message: response.statusText };
          }
        } catch {
          errorData = { message: response.statusText || 'An error occurred' };
        }
        
        throw new ApiError(
          errorData.message || 'An error occurred',
          response.status,
          errorData.code || 'UNKNOWN_ERROR',
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response as unknown as T;
    } catch (error) {
      // Check if offline
      if (!isOnline()) {
        throw new ApiError('No internet connection', 0, 'OFFLINE_ERROR');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request was cancelled', 0, 'REQUEST_CANCELLED');
        }
        if (error.message === 'Request timeout') {
          throw new ApiError('Request timed out', 0, 'TIMEOUT_ERROR');
        }
        throw new ApiError(error.message, 0, 'NETWORK_ERROR');
      }

      throw new ApiError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let finalEndpoint = endpoint;
    
    if (params) {
      const url = new URL(endpoint, this.baseURL);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => url.searchParams.append(key, String(item)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
      finalEndpoint = url.pathname + url.search;
    }

    return this.request<T>(finalEndpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Add authentication interceptor
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Add response interceptor for token refresh
apiClient.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // Clear invalid token
    localStorage.removeItem('auth_token');
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
  return response;
});

// API Service Classes
export class AuthService {
  static async login(data: LoginFormData): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post('/auth/login', data);
  }

  static async register(data: RegisterFormData): Promise<ApiResponse<{ user: User; token: string }>> {
    return apiClient.post('/auth/register', data);
  }

  static async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
    localStorage.removeItem('auth_token');
    return response;
  }

  static async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/reset-password', { token, password });
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/auth/refresh');
  }

  static async verifyEmail(token: string): Promise<ApiResponse<null>> {
    return apiClient.post('/auth/verify-email', { token });
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  }
}

export class UserService {
  static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put('/users/profile', data);
  }

  static async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.upload('/users/avatar', formData);
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return apiClient.post('/users/change-password', { currentPassword, newPassword });
  }

  static async deleteAccount(): Promise<ApiResponse<null>> {
    return apiClient.delete('/users/account');
  }
}

export class EstateService {
  static async getEstates(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Estate>> {
    return apiClient.get('/estates', params);
  }

  static async getEstate(id: string): Promise<ApiResponse<Estate>> {
    return apiClient.get(`/estates/${id}`);
  }

  static async createEstate(data: Partial<Estate>): Promise<ApiResponse<Estate>> {
    return apiClient.post('/estates', data);
  }

  static async updateEstate(id: string, data: Partial<Estate>): Promise<ApiResponse<Estate>> {
    return apiClient.put(`/estates/${id}`, data);
  }

  static async deleteEstate(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/estates/${id}`);
  }

  static async uploadEstateImage(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.upload(`/estates/${id}/image`, formData);
  }
}

export class PlotService {
  static async getPlots(params?: {
    estateId?: string;
    page?: number;
    limit?: number;
    status?: string[];
    risk?: string[];
  }): Promise<PaginatedResponse<Plot>> {
    return apiClient.get('/plots', params);
  }

  static async getPlot(id: string): Promise<ApiResponse<Plot>> {
    return apiClient.get(`/plots/${id}`);
  }

  static async createPlot(data: Partial<Plot>): Promise<ApiResponse<Plot>> {
    return apiClient.post('/plots', data);
  }

  static async updatePlot(id: string, data: Partial<Plot>): Promise<ApiResponse<Plot>> {
    return apiClient.put(`/plots/${id}`, data);
  }

  static async deletePlot(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/plots/${id}`);
  }

  static async allocatePlot(plotId: string, clientId: string): Promise<ApiResponse<Plot>> {
    return apiClient.post(`/plots/${plotId}/allocate`, { clientId });
  }

  static async deallocatePlot(plotId: string): Promise<ApiResponse<Plot>> {
    return apiClient.post(`/plots/${plotId}/deallocate`);
  }
}

export class DocumentService {
  static async getDocuments(params?: {
    estateId?: string;
    plotId?: string;
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Document>> {
    return apiClient.get('/documents', params);
  }

  static async getDocument(id: string): Promise<ApiResponse<Document>> {
    return apiClient.get(`/documents/${id}`);
  }

  static async uploadDocument(data: {
    file: File;
    type: string;
    estateId: string;
    plotId?: string;
    description?: string;
  }): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('type', data.type);
    formData.append('estateId', data.estateId);
    if (data.plotId) formData.append('plotId', data.plotId);
    if (data.description) formData.append('description', data.description);
    
    return apiClient.upload('/documents', formData);
  }

  static async verifyDocument(id: string, data: {
    status: 'verified' | 'rejected';
    score: number;
    notes?: string;
  }): Promise<ApiResponse<Document>> {
    return apiClient.post(`/documents/${id}/verify`, data);
  }

  static async deleteDocument(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/documents/${id}`);
  }

  static async downloadDocument(id: string): Promise<Blob> {
    return apiClient.get(`/documents/${id}/download`);
  }
}

export class NotificationService {
  static async getNotifications(params?: {
    page?: number;
    limit?: number;
    unread?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    return apiClient.get('/notifications', params);
  }

  static async markAsRead(id: string): Promise<ApiResponse<null>> {
    return apiClient.patch(`/notifications/${id}/read`);
  }

  static async markAllAsRead(): Promise<ApiResponse<null>> {
    return apiClient.patch('/notifications/mark-all-read');
  }

  static async deleteNotification(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/notifications/${id}`);
  }

  static async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get('/notifications/unread-count');
  }
}

export class SubscriptionService {
  static async getCurrentSubscription(): Promise<ApiResponse<Subscription>> {
    return apiClient.get('/subscription');
  }

  static async updateSubscription(data: {
    plan: 'basic' | 'premium';
    billingCycle: 'monthly' | 'yearly';
  }): Promise<ApiResponse<Subscription>> {
    return apiClient.put('/subscription', data);
  }

  static async cancelSubscription(): Promise<ApiResponse<null>> {
    return apiClient.post('/subscription/cancel');
  }

  static async resumeSubscription(): Promise<ApiResponse<Subscription>> {
    return apiClient.post('/subscription/resume');
  }

  static async getInvoices(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get('/subscription/invoices', params);
  }
}

export class PaymentService {
  static async initializePayment(data: {
    amount: number;
    email: string;
    reference?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<{ authorization_url: string; reference: string }>> {
    return apiClient.post('/payments/initialize', data);
  }

  static async verifyPayment(reference: string): Promise<ApiResponse<{
    status: 'success' | 'failed';
    amount: number;
    reference: string;
  }>> {
    return apiClient.get(`/payments/verify/${reference}`);
  }

  static async getPaymentHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get('/payments/history', params);
  }
}

export class AnalyticsService {
  static async getDashboardStats(): Promise<ApiResponse<{
    totalEstates: number;
    totalPlots: number;
    totalClients: number;
    totalRevenue: number;
    growthMetrics: any;
  }>> {
    return apiClient.get('/analytics/dashboard');
  }

  static async getEstateAnalytics(id: string): Promise<ApiResponse<{
    plotDistribution: any;
    constructionProgress: any;
    revenueMetrics: any;
  }>> {
    return apiClient.get(`/analytics/estates/${id}`);
  }

  static async getPerformanceMetrics(params?: {
    period: 'week' | 'month' | 'quarter' | 'year';
  }): Promise<ApiResponse<any>> {
    return apiClient.get('/analytics/performance', params);
  }
}

// Export the API client for custom requests
export { apiClient };

// Utility functions
export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
