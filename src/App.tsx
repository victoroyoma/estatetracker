import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingOverlay } from './components/ui/Loading';
import OfflineIndicator from './components/ui/OfflineIndicator';
import { useAppStore } from './store';
import { WebSocketProvider } from './providers/WebSocketProvider';
import { PerformanceProvider } from './providers/PerformanceProvider';
import Layout from './components/layout/Layout';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DeveloperDashboard = lazy(() => import('./pages/DeveloperDashboard'));
const ClientPortal = lazy(() => import('./pages/ClientPortal'));
const ProgressTracker = lazy(() => import('./pages/ProgressTracker'));
const EstateMap = lazy(() => import('./pages/EstateMap'));
const DocumentUpload = lazy(() => import('./pages/DocumentUpload'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AIProcessorPage = lazy(() => import('./pages/AIProcessorPage'));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage'));
const VRPlotsPage = lazy(() => import('./pages/VRPlotsPage'));

// Lazy load feature components
const AdvancedAnalytics = lazy(() => import('./components/analytics/AdvancedAnalytics'));
const PredictiveAnalytics = lazy(() => import('./components/ai/PredictiveAnalytics'));
const BlockchainIntegration = lazy(() => import('./components/blockchain/BlockchainIntegration'));
const VoiceAssistant = lazy(() => import('./components/voice/VoiceAssistant'));
const Property3DViewer = lazy(() => import('./components/visualization/Property3DViewer'));
const FeatureShowcase = lazy(() => import('./components/showcase/FeatureShowcase'));
const IoTDashboard = lazy(() => import('./components/iot/IoTDashboard'));
const DroneManagement = lazy(() => import('./components/drone/DroneManagement'));
const SmartReportEngine = lazy(() => import('./components/reporting/SmartReportEngine'));
const GeospatialAnalytics = lazy(() => import('./components/geospatial/GeospatialAnalytics'));
const ProjectDashboard = lazy(() => import('./components/admin/ProjectDashboard'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// App Providers wrapper
const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <PerformanceProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </PerformanceProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

// Loading wrapper component
const AppWithLoading: React.FC = () => {
  const { loading } = useAppStore();

  return (
    <>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div></div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<Layout />}>
              <Route path="/developer" element={<DeveloperDashboard />} />
              <Route path="/client" element={<ClientPortal />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/map" element={<EstateMap />} />
            <Route path="/documents" element={<DocumentUpload />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/analytics" element={<AdvancedAnalytics />} />
            <Route path="/ai-predictions" element={<PredictiveAnalytics />} />
            <Route path="/blockchain" element={<BlockchainIntegration />} />
            <Route path="/voice-assistant" element={<VoiceAssistant />} />
            <Route path="/3d-viewer" element={<Property3DViewer />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ai-processor" element={<AIProcessorPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/vr-plots" element={<VRPlotsPage />} />
            <Route path="/iot-dashboard" element={<IoTDashboard />} />
            <Route path="/drone-management" element={<DroneManagement />} />
            <Route path="/smart-reports" element={<SmartReportEngine />} />
            <Route path="/geospatial-analytics" element={<GeospatialAnalytics />} />
            <Route path="/features" element={<FeatureShowcase />} />
            <Route path="/admin/dashboard" element={<ProjectDashboard />} />
          </Route>
        </Routes>
        </Suspense>
      </Router>
      
      <LoadingOverlay 
        isVisible={loading === 'loading'} 
        message="Processing your request..."
      />
      <OfflineIndicator />
    </>
  );
};

export function App() {
  return (
    <AppProviders>
      <AppWithLoading />
    </AppProviders>
  );
}