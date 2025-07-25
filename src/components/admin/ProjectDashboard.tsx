import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Globe, 
  Monitor, 
  Users,
  Zap,
  Shield,
  Eye,
  TrendingUp
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { useErrorMonitor } from '../../hooks/useErrorMonitor';
import { usePerformanceOptimizer } from '../../hooks/usePerformanceOptimizer';
import AccessibilityAuditor from '../ui/AccessibilityAuditor';

interface SystemMetrics {
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    cacheHitRate: number;
  };
  features: {
    name: string;
    status: 'active' | 'inactive' | 'error';
    lastUsed: Date;
    usage: number;
  }[];
  security: {
    level: 'low' | 'medium' | 'high';
    lastScan: Date;
    vulnerabilities: number;
  };
  accessibility: {
    score: number;
    issues: number;
    lastAudit: Date;
  };
}

/**
 * Comprehensive project health and status dashboard
 */
export const ProjectDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getErrorSummary } = useErrorMonitor();
  const { getPerformanceMetrics } = usePerformanceOptimizer();

  useEffect(() => {
    loadSystemMetrics();
  }, []);

  const loadSystemMetrics = async () => {
    setIsLoading(true);
    
    try {
      // Simulate loading metrics (in real app, this would come from monitoring service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const performanceMetrics = getPerformanceMetrics();
      
      const mockMetrics: SystemMetrics = {
        performance: {
          loadTime: Math.random() * 3000 + 500, // 500-3500ms
          renderTime: performanceMetrics.averageRenderTime || Math.random() * 16 + 4, // 4-20ms
          memoryUsage: performanceMetrics.memoryUsage?.used || Math.random() * 100 + 20, // 20-120MB
          cacheHitRate: Math.random() * 40 + 60 // 60-100%
        },
        features: [
          { name: 'AI Analytics', status: 'active', lastUsed: new Date(), usage: 85 },
          { name: 'Voice Assistant', status: 'active', lastUsed: new Date(Date.now() - 3600000), usage: 45 },
          { name: 'Blockchain', status: 'active', lastUsed: new Date(Date.now() - 7200000), usage: 78 },
          { name: 'IoT Dashboard', status: 'active', lastUsed: new Date(), usage: 92 },
          { name: 'Drone Management', status: 'active', lastUsed: new Date(Date.now() - 1800000), usage: 67 },
          { name: '3D Visualization', status: 'active', lastUsed: new Date(Date.now() - 900000), usage: 73 },
          { name: 'Smart Reports', status: 'active', lastUsed: new Date(), usage: 89 },
          { name: 'Geospatial Analytics', status: 'active', lastUsed: new Date(Date.now() - 5400000), usage: 56 }
        ],
        security: {
          level: 'high',
          lastScan: new Date(Date.now() - 86400000), // 1 day ago
          vulnerabilities: 0
        },
        accessibility: {
          score: 92,
          issues: 3,
          lastAudit: new Date(Date.now() - 3600000) // 1 hour ago
        }
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load system metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPerformanceStatus = (value: number, thresholds: { good: number; fair: number }) => {
    if (value <= thresholds.good) return { color: 'text-green-600', label: 'Good' };
    if (value <= thresholds.fair) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <h2 className="text-2xl font-bold text-gray-900">Loading Project Dashboard...</h2>
        </div>
      </div>
    );
  }

  const errorSummary = getErrorSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Monitor className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Dashboard</h2>
            <p className="text-gray-600">Real-time monitoring of EstateTracker systems</p>
          </div>
        </div>
        <button
          onClick={loadSystemMetrics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
        >
          <Activity className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Status</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              All systems operational
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Error Rate</p>
                <p className={`text-2xl font-bold ${errorSummary.isHealthy ? 'text-green-600' : 'text-red-600'}`}>
                  {errorSummary.errorRate.toFixed(1)}/min
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${errorSummary.isHealthy ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              {errorSummary.totalErrors} total errors
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-green-600">99.8%</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Performance Metrics
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrics.performance.loadTime.toFixed(0)}ms
                </div>
                <div className="text-sm text-gray-600 mb-2">Load Time</div>
                <div className={`text-sm font-medium ${
                  getPerformanceStatus(metrics.performance.loadTime, { good: 1000, fair: 2000 }).color
                }`}>
                  {getPerformanceStatus(metrics.performance.loadTime, { good: 1000, fair: 2000 }).label}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrics.performance.renderTime.toFixed(1)}ms
                </div>
                <div className="text-sm text-gray-600 mb-2">Render Time</div>
                <div className={`text-sm font-medium ${
                  getPerformanceStatus(metrics.performance.renderTime, { good: 10, fair: 16 }).color
                }`}>
                  {getPerformanceStatus(metrics.performance.renderTime, { good: 10, fair: 16 }).label}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrics.performance.memoryUsage.toFixed(0)}MB
                </div>
                <div className="text-sm text-gray-600 mb-2">Memory Usage</div>
                <div className={`text-sm font-medium ${
                  getPerformanceStatus(metrics.performance.memoryUsage, { good: 50, fair: 100 }).color
                }`}>
                  {getPerformanceStatus(metrics.performance.memoryUsage, { good: 50, fair: 100 }).label}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metrics.performance.cacheHitRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mb-2">Cache Hit Rate</div>
                <div className={`text-sm font-medium ${
                  metrics.performance.cacheHitRate > 80 ? 'text-green-600' : 
                  metrics.performance.cacheHitRate > 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metrics.performance.cacheHitRate > 80 ? 'Excellent' : 
                   metrics.performance.cacheHitRate > 60 ? 'Good' : 'Poor'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Usage */}
      {metrics && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Feature Usage
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.status === 'active' ? 'bg-green-500' :
                      feature.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">{feature.name}</span>
                    <span className={`text-sm font-medium ${getStatusColor(feature.status)}`}>
                      {feature.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Last used {feature.lastUsed.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${feature.usage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature.usage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security & Accessibility */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metrics && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Status
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Security Level</span>
                  <span className={`font-medium capitalize ${
                    metrics.security.level === 'high' ? 'text-green-600' :
                    metrics.security.level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metrics.security.level}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vulnerabilities</span>
                  <span className={`font-medium ${
                    metrics.security.vulnerabilities === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metrics.security.vulnerabilities}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Scan</span>
                  <span className="text-sm text-gray-500">
                    {metrics.security.lastScan.toLocaleDateString()}
                  </span>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Run Security Scan
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <AccessibilityAuditor />
        </div>
      </div>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Real-time Status
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Database className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">Database</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
            <div className="text-center">
              <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">API Services</div>
              <div className="text-sm text-green-600">Operational</div>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">Monitoring</div>
              <div className="text-sm text-green-600">Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;
