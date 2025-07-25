import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Building, MapPin, DollarSign } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { cn, formatCurrency, formatNumber, calculatePercentage } from '../../lib/utils';
import { useEstates, usePlots } from '../../hooks';
import { MockDataService, generateCompleteDataset } from '../../lib/mockData';

interface AnalyticsData {
  totalEstates: number;
  totalPlots: number;
  allocatedPlots: number;
  totalRevenue: number;
  monthlyGrowth: number;
  plotStatusData: Array<{ name: string; value: number; color: string }>;
  revenueData: Array<{ month: string; revenue: number; target: number }>;
  estatePerformance: Array<{ name: string; plots: number; allocated: number; revenue: number }>;
  geographicDistribution: Array<{ state: string; estates: number; value: number }>;
  constructionProgress: Array<{ estate: string; progress: number; target: number }>;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = ''
}) => {
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const changeIcon = {
    increase: <TrendingUp className="h-4 w-4" />,
    decrease: <TrendingDown className="h-4 w-4" />,
    neutral: null
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center mt-1', changeColor[changeType])}>
              {changeIcon[changeType]}
              <span className="text-sm ml-1">
                {Math.abs(change)}% {changeType === 'increase' ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-100 rounded-full">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const AdvancedAnalytics: React.FC = () => {
  const { estates, isLoading: estatesLoading } = useEstates();
  const { plots, isLoading: plotsLoading } = usePlots();
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = MockDataService.subscribe((update) => {
      setRealtimeUpdates(prev => [update, ...prev.slice(0, 9)]); // Keep last 10 updates
      setLastUpdateTime(new Date());
    });

    // Start real-time updates simulation
    MockDataService.startRealTimeUpdates();

    return unsubscribe;
  }, []);

  // Generate comprehensive mock data
  const mockDataset = useMemo(() => generateCompleteDataset(), []);

  // Mock analytics data - enhanced with real data
  const analyticsData: AnalyticsData = useMemo(() => {
    const totalEstates = estates.length || mockDataset.estates.length;
    const totalPlots = plots.length || mockDataset.plots.length;
    const allocatedPlots = plots.filter(plot => plot.ownerId).length || 
                          mockDataset.plots.filter(plot => plot.ownerId).length;
    const totalRevenue = plots.reduce((sum, plot) => sum + (plot.price || 0), 0) ||
                        mockDataset.analytics.revenue.yearly.reduce((sum, year) => sum + year.revenue, 0);

    return {
      totalEstates,
      totalPlots,
      allocatedPlots,
      totalRevenue,
      monthlyGrowth: 12.5,
      plotStatusData: [
        { name: 'Allocated', value: allocatedPlots, color: '#10B981' },
        { name: 'Available', value: totalPlots - allocatedPlots, color: '#6B7280' },
        { name: 'Under Development', value: Math.floor(totalPlots * 0.15), color: '#F59E0B' }
      ],
      revenueData: mockDataset.analytics.revenue.monthly,
      estatePerformance: (estates.length > 0 ? estates : mockDataset.estates).map(estate => ({
        name: estate.name,
        plots: estate.totalPlots,
        allocated: estate.allocatedPlots,
        revenue: estate.totalPlots * 5000000 // Mock calculation
      })),
      geographicDistribution: mockDataset.analytics.geographic.slice(0, 4).map(geo => ({
        state: geo.state,
        estates: geo.properties,
        value: geo.value
      })),
      constructionProgress: [
        { estate: 'Green Valley Estate', progress: 85, target: 100 },
        { estate: 'Sunset Gardens', progress: 65, target: 80 },
        { estate: 'Royal Heights', progress: 40, target: 60 },
        { estate: 'Paradise City', progress: 20, target: 30 }
      ]
    };
  }, [estates, plots, mockDataset]);

  const isLoading = estatesLoading || plotsLoading;

  const occupancyRate = calculatePercentage(analyticsData.allocatedPlots, analyticsData.totalPlots);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Real-time Indicator */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights into your real estate portfolio</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="revenue">Revenue</option>
            <option value="plots">Plots</option>
            <option value="occupancy">Occupancy</option>
            <option value="growth">Growth</option>
          </select>
        </div>
      </div>

      {/* Real-time Updates Panel */}
      {realtimeUpdates.length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
              Real-time Updates
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {realtimeUpdates.slice(0, 3).map((update, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {update.type === 'plot_allocated' && `Plot ${update.data.plotNumber} allocated to ${update.data.ownerName}`}
                    {update.type === 'construction_progress' && `Construction progress: ${update.data.stageName} at ${update.data.progress}%`}
                    {update.type === 'payment_received' && `Payment received: ₦${update.data.amount?.toLocaleString()}`}
                    {update.type === 'document_verified' && `Document verified: ${update.data.documentType}`}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Estates"
          value={analyticsData.totalEstates}
          change={8.2}
          changeType="increase"
          icon={<Building className="h-6 w-6 text-primary-600" />}
        />
        
        <MetricCard
          title="Total Plots"
          value={formatNumber(analyticsData.totalPlots)}
          change={15.3}
          changeType="increase"
          icon={<MapPin className="h-6 w-6 text-primary-600" />}
        />
        
        <MetricCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          change={5.1}
          changeType="increase"
          icon={<Users className="h-6 w-6 text-primary-600" />}
        />
        
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(analyticsData.totalRevenue)}
          change={analyticsData.monthlyGrowth}
          changeType="increase"
          icon={<DollarSign className="h-6 w-6 text-primary-600" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Revenue vs Target</h3>
            <p className="text-sm text-gray-600">Monthly revenue performance against targets</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value).replace('₦', '₦')} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stackId="1" 
                  stroke="#E5E7EB" 
                  fill="#F3F4F6" 
                  name="Target"
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="2" 
                  stroke="#0E6D31" 
                  fill="#10B981" 
                  name="Actual Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plot Status Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Plot Status Distribution</h3>
            <p className="text-sm text-gray-600">Current allocation status of all plots</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.plotStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.plotStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estate Performance */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Estate Performance</h3>
            <p className="text-sm text-gray-600">Allocation rates by estate</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.estatePerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="plots" fill="#E5E7EB" name="Total Plots" />
                <Bar dataKey="allocated" fill="#10B981" name="Allocated Plots" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <p className="text-sm text-gray-600">Estate value by state</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.geographicDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value).replace('₦', '₦')} />
                <YAxis dataKey="state" type="category" />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="value" fill="#0E6D31" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Construction Progress Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Construction Progress</h3>
          <p className="text-sm text-gray-600">Real-time development status across estates</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.constructionProgress.map((item, index) => {
                  const progressPercentage = (item.progress / item.target) * 100;
                  const status = progressPercentage >= 100 ? 'Complete' : progressPercentage >= 80 ? 'On Track' : 'Behind';
                  const statusColor = progressPercentage >= 100 ? 'text-green-600' : progressPercentage >= 80 ? 'text-blue-600' : 'text-red-600';
                  
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.estate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{item.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.target}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('text-sm font-medium', statusColor)}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
