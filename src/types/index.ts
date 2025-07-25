// Core Types for EstateTracker Application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'developer' | 'client' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Estate {
  id: string;
  name: string;
  location: string;
  totalPlots: number;
  allocatedPlots: number;
  developedPlots: number;
  constructionPlots: number;
  undevelopedPlots: number;
  progress: number;
  clients: number;
  disputes: number;
  image?: string;
  coordinates: [number, number];
  developerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plot {
  id: string;
  number: string;
  estateId: string;
  status: 'developed' | 'undeveloped' | 'construction';
  owner?: string;
  ownerId?: string;
  risk: 'low' | 'medium' | 'high';
  coordinates: [number, number];
  bounds: [[number, number], [number, number]];
  size: number; // in square meters
  price: number;
  allocationDate?: Date;
  constructionStartDate?: Date;
  constructionEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: 'C of O' | 'Survey Plan' | 'Approval' | 'Receipt' | 'Other';
  status: 'verified' | 'pending' | 'rejected';
  date: Date;
  estateId: string;
  plotId?: string;
  verificationScore: number;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  verifiedBy?: string;
  verificationDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConstructionStage {
  id: string;
  plotId: string;
  name: string;
  description: string;
  date: Date;
  complete: boolean;
  progress: number;
  photos: string[];
  modelUrl?: string;
  panoramaUrl?: string;
  estimatedDuration: number; // in days
  actualDuration?: number; // in days
  cost: number;
  contractor?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'premium';
  status: 'active' | 'cancelled' | 'expired';
  estateLimit: number;
  estatesUsed: number;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  dueDate: Date;
  paidDate?: Date;
  paymentReference?: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'developer' | 'client';
  companyName?: string;
}

export interface EstateFormData {
  name: string;
  location: string;
  totalPlots: number;
  coordinates: [number, number];
  description?: string;
  image?: File;
}

export interface PlotFormData {
  number: string;
  size: number;
  price: number;
  coordinates: [number, number];
  description?: string;
}

export interface DocumentUploadData {
  file: File;
  type: Document['type'];
  plotId?: string;
  description?: string;
}

// State Types
export interface AppState {
  user: User | null;
  estates: Estate[];
  selectedEstate: Estate | null;
  plots: Plot[];
  documents: Document[];
  notifications: Notification[];
  subscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

export interface FilterOptions {
  status?: Plot['status'][];
  risk?: Plot['risk'][];
  ownership?: 'allocated' | 'unallocated';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ProgressData {
  month: string;
  progress: number;
  target?: number;
}

export interface PlotStatusData {
  name: string;
  developed: number;
  construction: number;
  undeveloped: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ig' | 'yo' | 'ha'; // English, Igbo, Yoruba, Hausa

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

// Permission Types
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition?: any;
}

export interface Role {
  name: string;
  permissions: Permission[];
}
