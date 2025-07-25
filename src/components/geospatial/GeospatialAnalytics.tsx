import React, { useState, useEffect } from 'react';
import { 
  Map,
  MapPin,
  BarChart3,
  TrendingUp,
  Download,
  Eye,
  Compass,
  Globe,
  Activity,
  Zap
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface GeospatialData {
  id: string;
  name: string;
  type: 'estate' | 'plot' | 'landmark' | 'infrastructure' | 'commercial';
  coordinates: [number, number];
  properties: {
    area: number;
    value: number;
    population?: number;
    accessibility: number;
    development: number;
    risk: 'low' | 'medium' | 'high';
  };
  analytics: {
    growthRate: number;
    marketTrend: 'rising' | 'stable' | 'declining';
    investmentPotential: number;
    proximityScore: number;
  };
  nearbyFacilities: Array<{
    type: string;
    name: string;
    distance: number;
    impact: number;
  }>;
}

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
  value: number;
}

interface AnalyticsInsights {
  totalArea: number;
  averageValue: number;
  highGrowthAreas: number;
  riskDistribution: Array<{
    risk: string;
    count: number;
    percentage: number;
  }>;
  proximityAnalysis: Array<{
    facility: string;
    averageDistance: number;
    impactScore: number;
  }>;
  marketTrends: Array<{
    area: string;
    trend: string;
    growth: number;
    potential: number;
  }>;
  spatialCorrelations: Array<{
    factor1: string;
    factor2: string;
    correlation: number;
    significance: number;
  }>;
}

const GeospatialAnalytics: React.FC = () => {
  const [geospatialData, setGeospatialData] = useState<GeospatialData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsights | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<'value' | 'growth' | 'risk' | 'accessibility'>('value');
  const [analysisType, setAnalysisType] = useState<'proximity' | 'clustering' | 'hotspots' | 'trends'>('proximity');
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'roads'>('satellite');
  const [loading, setLoading] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(1000);

  useEffect(() => {
    loadGeospatialData();
  }, [selectedLayer, analysisType]);

  const loadGeospatialData = async () => {
    setLoading(true);
    
    // Simulate loading geospatial data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: GeospatialData[] = [
      {
        id: 'geo-001',
        name: 'Green Valley Estate',
        type: 'estate',
        coordinates: [6.5244, 3.3792],
        properties: {
          area: 50000,
          value: 4500000,
          population: 850,
          accessibility: 85,
          development: 92,
          risk: 'low'
        },
        analytics: {
          growthRate: 15.2,
          marketTrend: 'rising',
          investmentPotential: 88,
          proximityScore: 94
        },
        nearbyFacilities: [
          { type: 'School', name: 'Lagos International School', distance: 450, impact: 9.2 },
          { type: 'Hospital', name: 'Victoria Island Medical Centre', distance: 1200, impact: 8.7 },
          { type: 'Shopping', name: 'Palms Shopping Mall', distance: 800, impact: 8.5 },
          { type: 'Transport', name: 'Lekki Toll Gate', distance: 600, impact: 9.0 }
        ]
      },
      {
        id: 'geo-002',
        name: 'Sunset Gardens',
        type: 'estate',
        coordinates: [6.5250, 3.3796],
        properties: {
          area: 35000,
          value: 3200000,
          population: 620,
          accessibility: 78,
          development: 75,
          risk: 'medium'
        },
        analytics: {
          growthRate: 8.7,
          marketTrend: 'stable',
          investmentPotential: 72,
          proximityScore: 81
        },
        nearbyFacilities: [
          { type: 'School', name: 'Corona Schools', distance: 650, impact: 8.5 },
          { type: 'Hospital', name: 'Reddington Hospital', distance: 900, impact: 8.9 },
          { type: 'Shopping', name: 'Mega Plaza', distance: 1100, impact: 7.8 },
          { type: 'Transport', name: 'Admiralty Way Bus Stop', distance: 400, impact: 8.2 }
        ]
      },
      {
        id: 'geo-003',
        name: 'Royal Heights',
        type: 'estate',
        coordinates: [6.5252, 3.3798],
        properties: {
          area: 42000,
          value: 3800000,
          population: 720,
          accessibility: 82,
          development: 88,
          risk: 'low'
        },
        analytics: {
          growthRate: 12.3,
          marketTrend: 'rising',
          investmentPotential: 85,
          proximityScore: 87
        },
        nearbyFacilities: [
          { type: 'School', name: 'British International School', distance: 520, impact: 9.1 },
          { type: 'Hospital', name: 'Lagos University Teaching Hospital', distance: 1400, impact: 8.6 },
          { type: 'Shopping', name: 'Civic Centre Mall', distance: 950, impact: 8.0 },
          { type: 'Transport', name: 'Lekki Phase 1 Gate', distance: 350, impact: 9.3 }
        ]
      },
      {
        id: 'geo-004',
        name: 'Paradise City',
        type: 'estate',
        coordinates: [6.5248, 3.3800],
        properties: {
          area: 28000,
          value: 2900000,
          population: 480,
          accessibility: 65,
          development: 60,
          risk: 'high'
        },
        analytics: {
          growthRate: 5.1,
          marketTrend: 'declining',
          investmentPotential: 58,
          proximityScore: 67
        },
        nearbyFacilities: [
          { type: 'School', name: 'Greensprings School', distance: 850, impact: 7.8 },
          { type: 'Hospital', name: 'Lakeshore Cancer Centre', distance: 1800, impact: 7.5 },
          { type: 'Shopping', name: 'Circle Mall', distance: 1300, impact: 7.2 },
          { type: 'Transport', name: 'Ajah Bus Terminal', distance: 1200, impact: 6.9 }
        ]
      }
    ];

    const mockHeatmap: HeatmapData[] = [
      { lat: 6.5244, lng: 3.3792, intensity: 0.9, category: 'high_value', value: 4500000 },
      { lat: 6.5250, lng: 3.3796, intensity: 0.7, category: 'medium_value', value: 3200000 },
      { lat: 6.5252, lng: 3.3798, intensity: 0.8, category: 'high_value', value: 3800000 },
      { lat: 6.5248, lng: 3.3800, intensity: 0.5, category: 'low_value', value: 2900000 },
      { lat: 6.5246, lng: 3.3794, intensity: 0.6, category: 'medium_value', value: 3100000 },
      { lat: 6.5254, lng: 3.3800, intensity: 0.8, category: 'high_value', value: 4200000 }
    ];

    const mockInsights: AnalyticsInsights = {
      totalArea: 155000,
      averageValue: 3600000,
      highGrowthAreas: 3,
      riskDistribution: [
        { risk: 'Low', count: 2, percentage: 50 },
        { risk: 'Medium', count: 1, percentage: 25 },
        { risk: 'High', count: 1, percentage: 25 }
      ],
      proximityAnalysis: [
        { facility: 'Schools', averageDistance: 618, impactScore: 8.65 },
        { facility: 'Hospitals', averageDistance: 1325, impactScore: 8.43 },
        { facility: 'Shopping', averageDistance: 1038, impactScore: 7.88 },
        { facility: 'Transport', averageDistance: 638, impactScore: 8.35 }
      ],
      marketTrends: [
        { area: 'Green Valley Estate', trend: 'Rising', growth: 15.2, potential: 88 },
        { area: 'Royal Heights', trend: 'Rising', growth: 12.3, potential: 85 },
        { area: 'Sunset Gardens', trend: 'Stable', growth: 8.7, potential: 72 },
        { area: 'Paradise City', trend: 'Declining', growth: 5.1, potential: 58 }
      ],
      spatialCorrelations: [
        { factor1: 'Accessibility', factor2: 'Property Value', correlation: 0.87, significance: 95 },
        { factor1: 'School Proximity', factor2: 'Growth Rate', correlation: 0.73, significance: 89 },
        { factor1: 'Development Level', factor2: 'Investment Potential', correlation: 0.92, significance: 98 },
        { factor1: 'Transport Access', factor2: 'Market Trend', correlation: 0.68, significance: 82 }
      ]
    };

    setGeospatialData(mockData);
    setHeatmapData(mockHeatmap);
    setInsights(mockInsights);
    setLoading(false);
  };

  const runSpatialAnalysis = async () => {
    setLoading(true);
    
    // Simulate spatial analysis processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Running spatial analysis:', {
      type: analysisType,
      layer: selectedLayer,
      radius: selectedRadius
    });
    
    // Refresh data with new analysis
    await loadGeospatialData();
  };



  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'declining': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!insights) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Geospatial Analytics</h1>
          <p className="text-gray-600 mt-1">Advanced location intelligence and spatial analysis</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={mapView}
            onChange={(e) => setMapView(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="satellite">Satellite View</option>
            <option value="terrain">Terrain View</option>
            <option value="roads">Road View</option>
          </select>
          
          <Button
            onClick={runSpatialAnalysis}
            loading={loading}
            icon={<Zap className="h-4 w-4" />}
          >
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Map className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{(insights.totalArea / 1000).toFixed(1)}k</p>
                <p className="text-gray-600">Total Area (sqm)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">₦{(insights.averageValue / 1000000).toFixed(1)}M</p>
                <p className="text-gray-600">Avg Property Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{insights.highGrowthAreas}</p>
                <p className="text-gray-600">High Growth Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{geospatialData.length}</p>
                <p className="text-gray-600">Analyzed Locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Analysis Controls</h3>
          <p className="text-sm text-gray-600">Configure spatial analysis parameters</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Layer</label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="value">Property Value</option>
                <option value="growth">Growth Rate</option>
                <option value="risk">Risk Assessment</option>
                <option value="accessibility">Accessibility</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="proximity">Proximity Analysis</option>
                <option value="clustering">Spatial Clustering</option>
                <option value="hotspots">Hotspot Detection</option>
                <option value="trends">Trend Analysis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Radius</label>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={500}>500m</option>
                <option value={1000}>1km</option>
                <option value={2000}>2km</option>
                <option value={5000}>5km</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Options</label>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" icon={<Download className="h-3 w-3" />}>
                  Export
                </Button>
                <Button size="sm" variant="ghost" icon={<Eye className="h-3 w-3" />}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Risk Distribution</h3>
            <p className="text-sm text-gray-600">Geographic risk assessment breakdown</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.riskDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${
                      item.risk === 'Low' ? 'bg-green-500' :
                      item.risk === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.risk} Risk</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{item.count} areas</span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Proximity Analysis */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Facility Proximity Impact</h3>
            <p className="text-sm text-gray-600">Average distance and impact scores</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={insights.proximityAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="averageDistance" fill="#3b82f6" name="Avg Distance (m)" />
                <Bar yAxisId="right" dataKey="impactScore" fill="#10b981" name="Impact Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Spatial Correlations */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Spatial Correlations</h3>
          <p className="text-sm text-gray-600">Relationships between geographic factors</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {insights.spatialCorrelations.map((corr, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {corr.factor1} vs {corr.factor2}
                    </h4>
                    <Badge className={
                      corr.correlation > 0.8 ? 'bg-green-100 text-green-800' :
                      corr.correlation > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {corr.correlation > 0.8 ? 'Strong' : corr.correlation > 0.6 ? 'Moderate' : 'Weak'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Correlation: {corr.correlation.toFixed(2)}</span>
                    <span className="text-gray-600">Significance: {corr.significance}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={insights.proximityAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="facility" />
                  <PolarRadiusAxis />
                  <Radar name="Impact Score" dataKey="impactScore" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estate Performance Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Geographic Estate Analysis</h3>
          <p className="text-sm text-gray-600">Detailed location-based performance metrics</p>
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
                    Coordinates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investment Potential
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {geospatialData.map((location) => (
                  <tr key={location.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.properties.area.toLocaleString()} sqm</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Compass className="h-4 w-4 text-gray-400" />
                        <span>{location.coordinates[0].toFixed(4)}, {location.coordinates[1].toFixed(4)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(location.analytics.marketTrend)}
                        <span className="text-sm text-gray-900 capitalize">{location.analytics.marketTrend}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          location.analytics.growthRate > 10 ? 'text-green-600' :
                          location.analytics.growthRate > 5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {location.analytics.growthRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRiskColor(location.properties.risk)}>
                        {location.properties.risk}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              location.analytics.investmentPotential > 80 ? 'bg-green-500' :
                              location.analytics.investmentPotential > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${location.analytics.investmentPotential}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{location.analytics.investmentPotential}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Eye className="h-3 w-3" />}
                        >
                          View Map
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<BarChart3 className="h-3 w-3" />}
                        >
                          Analyze
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Visualization */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Spatial Heatmap Data</h3>
          <p className="text-sm text-gray-600">Intensity visualization of selected metrics</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heatmapData.map((point, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: `rgba(59, 130, 246, ${point.intensity})`,
                        border: '1px solid #3b82f6'
                      }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Point {idx + 1}
                    </span>
                  </div>
                  <Badge className={
                    point.category === 'high_value' ? 'bg-green-100 text-green-800' :
                    point.category === 'medium_value' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {point.category.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coordinates:</span>
                    <span className="text-gray-900">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intensity:</span>
                    <span className="text-gray-900">{(point.intensity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value:</span>
                    <span className="text-gray-900">₦{(point.value / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeospatialAnalytics;
