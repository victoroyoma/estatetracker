import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Star, Target, DollarSign, Calendar, Users } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PredictionData {
  month: string;
  predictedSales: number;
  actualSales: number | null;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionRequired: boolean;
}

interface EstateRecommendation {
  estateId: string;
  estateName: string;
  recommendedPrice: number;
  currentPrice: number;
  priceChange: number;
  reasoning: string;
  marketFactors: string[];
}

const PredictiveAnalytics: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [recommendations, setRecommendations] = useState<EstateRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '1y' | '2y'>('6m');

  // Simulated AI prediction data
  useEffect(() => {
    generatePredictions();
    generateInsights();
    generateRecommendations();
  }, [selectedTimeframe]);

  const generatePredictions = () => {
    const baseData = [
      { month: 'Jan', predictedSales: 12, actualSales: 10, confidence: 85 },
      { month: 'Feb', predictedSales: 15, actualSales: 14, confidence: 88 },
      { month: 'Mar', predictedSales: 18, actualSales: 16, confidence: 82 },
      { month: 'Apr', predictedSales: 22, actualSales: null, confidence: 79 },
      { month: 'May', predictedSales: 25, actualSales: null, confidence: 75 },
      { month: 'Jun', predictedSales: 28, actualSales: null, confidence: 72 },
    ];

    setPredictions(baseData.map(item => ({
      ...item,
      trend: item.predictedSales > 20 ? 'up' : item.predictedSales < 15 ? 'down' : 'stable'
    })));
  };

  const generateInsights = () => {
    const mockInsights: MarketInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Emerging Market in Lekki Phase 2',
        description: 'AI analysis shows 34% increase in demand for plots in Lekki Phase 2. Infrastructure development and government policies favor this area.',
        impact: 'high',
        confidence: 89,
        actionRequired: true
      },
      {
        id: '2',
        type: 'risk',
        title: 'Seasonal Demand Decline Expected',
        description: 'Historical patterns and current economic indicators suggest 15% demand decline during rainy season.',
        impact: 'medium',
        confidence: 76,
        actionRequired: false
      },
      {
        id: '3',
        type: 'trend',
        title: 'Rise in Sustainable Housing Demand',
        description: 'Social media sentiment and search trends show 42% increase in interest for eco-friendly estates.',
        impact: 'high',
        confidence: 83,
        actionRequired: true
      }
    ];

    setInsights(mockInsights);
  };

  const generateRecommendations = () => {
    const mockRecommendations: EstateRecommendation[] = [
      {
        estateId: '1',
        estateName: 'Green Valley Estate',
        recommendedPrice: 4200000,
        currentPrice: 3800000,
        priceChange: 10.53,
        reasoning: 'High demand area with upcoming infrastructure projects',
        marketFactors: ['New road construction', 'Shopping mall development', 'School proximity']
      },
      {
        estateId: '2',
        estateName: 'Sunrise Gardens',
        recommendedPrice: 2800000,
        currentPrice: 3200000,
        priceChange: -12.5,
        reasoning: 'Market oversaturation in this segment',
        marketFactors: ['High competition', 'Economic downturn', 'Transportation challenges']
      }
    ];

    setRecommendations(mockRecommendations);
  };

  const runAIAnalysis = async () => {
    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    generatePredictions();
    generateInsights();
    generateRecommendations();
    
    setLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'risk': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'trend': return <Star className="h-5 w-5 text-blue-500" />;
      default: return <Target className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Predictive Analytics</h2>
            <p className="text-gray-600">AI-powered insights for smarter estate management decisions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="3m">3 Months</option>
            <option value="6m">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="2y">2 Years</option>
          </select>
          
          <Button
            onClick={runAIAnalysis}
            loading={loading}
            icon={<Brain className="h-4 w-4" />}
          >
            {loading ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Prediction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Sales Prediction vs Reality</h3>
            <p className="text-sm text-gray-600">AI predictions compared to actual sales data</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="predictedSales"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="AI Prediction"
                />
                <Line
                  type="monotone"
                  dataKey="actualSales"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Actual Sales"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Confidence Levels</h3>
            <p className="text-sm text-gray-600">AI prediction confidence over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="confidence"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                  name="Confidence %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">AI Market Insights</h3>
          <p className="text-sm text-gray-600">Intelligent market analysis and recommendations</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{insight.title}</h4>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                        {insight.actionRequired && (
                          <Badge className="bg-orange-100 text-orange-800">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{insight.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>Confidence: {insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Recommendations */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">AI Price Recommendations</h3>
          <p className="text-sm text-gray-600">Optimized pricing based on market analysis</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.estateId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{rec.estateName}</h4>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className={`font-semibold ${rec.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rec.priceChange > 0 ? '+' : ''}{rec.priceChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-500">Current Price</span>
                    <p className="font-medium">₦{rec.currentPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Recommended Price</span>
                    <p className="font-medium text-blue-600">₦{rec.recommendedPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>
                
                <div className="flex flex-wrap gap-2">
                  {rec.marketFactors.map((factor, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-gray-600">Prediction Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-gray-600">Model Update Frequency</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">15K+</p>
                <p className="text-gray-600">Data Points Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
