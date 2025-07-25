import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Link as LinkIcon, 
  Mic, 
  Box, 
  BarChart3, 
  Shield, 
  Zap, 
  Star,
  TrendingUp,
  Eye,
  Palette,
  Globe,
  Clock,
  Users,
  ArrowRight,
  Wifi,
  Plane,
  FileText,
  MapPin
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  category: 'AI' | 'Blockchain' | 'Visualization' | 'Analytics' | 'Interaction' | 'IoT' | 'Management' | 'Reporting';
  status: 'available' | 'beta' | 'coming-soon';
  highlights: string[];
  demoAvailable: boolean;
}

const FeatureShowcase: React.FC = () => {
  const features: FeatureCard[] = [
    {
      id: 'ai-predictions',
      title: 'AI Predictive Analytics',
      description: 'Harness the power of artificial intelligence to predict market trends, optimize pricing, and make data-driven decisions for your estate projects.',
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      route: '/ai-predictions',
      category: 'AI',
      status: 'available',
      highlights: ['Market trend prediction', 'Intelligent pricing', 'Risk assessment', 'Performance forecasting'],
      demoAvailable: true
    },
    {
      id: 'blockchain',
      title: 'Blockchain Property Records',
      description: 'Immutable property ownership records, smart contracts, and transparent transactions using blockchain technology.',
      icon: <LinkIcon className="h-8 w-8 text-blue-600" />,
      route: '/blockchain',
      category: 'Blockchain',
      status: 'available',
      highlights: ['Immutable records', 'Smart contracts', 'Transparent transactions', 'Ownership verification'],
      demoAvailable: true
    },
    {
      id: 'voice-assistant',
      title: 'Voice Assistant',
      description: 'Natural language interface powered by speech recognition. Control your estate management with voice commands.',
      icon: <Mic className="h-8 w-8 text-green-600" />,
      route: '/voice-assistant',
      category: 'Interaction',
      status: 'beta',
      highlights: ['Natural language processing', 'Voice commands', 'Hands-free operation', 'Multi-language support'],
      demoAvailable: true
    },
    {
      id: '3d-viewer',
      title: '3D Property Visualization',
      description: 'Interactive 3D models of properties with VR support, virtual tours, and detailed floor plans.',
      icon: <Box className="h-8 w-8 text-orange-600" />,
      route: '/3d-viewer',
      category: 'Visualization',
      status: 'available',
      highlights: ['3D property models', 'VR tours', 'Interactive floor plans', 'Real-time rendering'],
      demoAvailable: true
    },
    {
      id: 'advanced-analytics',
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive business intelligence with real-time metrics, interactive charts, and detailed reporting.',
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      route: '/analytics',
      category: 'Analytics',
      status: 'available',
      highlights: ['Real-time metrics', 'Interactive charts', 'Custom reports', 'KPI tracking'],
      demoAvailable: true
    },
    {
      id: 'iot-dashboard',
      title: 'IoT Device Management',
      description: 'Monitor and control smart estate devices including sensors, cameras, access control systems, and environmental monitors in real-time.',
      icon: <Wifi className="h-8 w-8 text-teal-600" />,
      route: '/iot-dashboard',
      category: 'IoT',
      status: 'available',
      highlights: ['Real-time monitoring', 'Device control', 'Alert management', 'Energy optimization'],
      demoAvailable: true
    },
    {
      id: 'drone-management',
      title: 'Drone Fleet Management',
      description: 'Manage autonomous drone fleets for aerial surveys, security monitoring, and estate inspection with real-time telemetry and mission control.',
      icon: <Plane className="h-8 w-8 text-red-600" />,
      route: '/drone-management',
      category: 'Management',
      status: 'available',
      highlights: ['Fleet management', 'Mission planning', 'Real-time telemetry', 'Survey analytics'],
      demoAvailable: true
    },
    {
      id: 'smart-reports',
      title: 'Smart Reporting Engine',
      description: 'Automated report generation with customizable templates, data visualization, and export options for comprehensive estate analytics.',
      icon: <FileText className="h-8 w-8 text-amber-600" />,
      route: '/smart-reports',
      category: 'Reporting',
      status: 'available',
      highlights: ['Automated generation', 'Custom templates', 'Data visualization', 'Multi-format export'],
      demoAvailable: true
    },
    {
      id: 'geospatial-analytics',
      title: 'Geospatial Analytics',
      description: 'Advanced location intelligence with spatial analysis, heatmaps, proximity analytics, and risk assessment for smart estate planning.',
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      route: '/geospatial-analytics',
      category: 'Analytics',
      status: 'available',
      highlights: ['Spatial analysis', 'Heatmap visualization', 'Proximity analytics', 'Risk assessment'],
      demoAvailable: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-100 text-yellow-800">Beta</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-100 text-gray-800">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return 'bg-purple-100 text-purple-800';
      case 'Blockchain': return 'bg-blue-100 text-blue-800';
      case 'Visualization': return 'bg-orange-100 text-orange-800';
      case 'Analytics': return 'bg-indigo-100 text-indigo-800';
      case 'Interaction': return 'bg-green-100 text-green-800';
      case 'IoT': return 'bg-teal-100 text-teal-800';
      case 'Management': return 'bg-red-100 text-red-800';
      case 'Reporting': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { icon: <Zap className="h-6 w-6" />, label: 'AI-Powered Features', value: '10+' },
    { icon: <Shield className="h-6 w-6" />, label: 'Blockchain Integration', value: '100%' },
    { icon: <Eye className="h-6 w-6" />, label: '3D Visualization', value: 'VR Ready' },
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Performance Boost', value: '400%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Star className="h-8 w-8 text-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-900">Amazing New Features</h1>
          <Star className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the future of estate management with our cutting-edge features powered by 
          AI, blockchain technology, and immersive 3D visualization.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3 text-blue-600">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {['AI', 'Blockchain', 'Visualization', 'Analytics', 'Interaction', 'IoT', 'Management', 'Reporting'].map((category) => (
          <div key={category} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Badge className={getCategoryColor(category)}>
              {category}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              {features.filter(f => f.category === category).length} Feature{features.filter(f => f.category === category).length !== 1 ? 's' : ''}
            </p>
          </div>
        ))}
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {features.map((feature) => (
          <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getCategoryColor(feature.category)}>
                        {feature.category}
                      </Badge>
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>
                </div>
                {feature.demoAvailable && (
                  <Badge className="bg-blue-50 text-blue-600 border border-blue-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Demo
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Feature Highlights */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <Link to={feature.route} className="flex-1">
                  <Button 
                    className="w-full group-hover:bg-blue-700 transition-colors"
                    disabled={feature.status === 'coming-soon'}
                  >
                    {feature.status === 'coming-soon' ? 'Coming Soon' : 'Explore Feature'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                {feature.demoAvailable && (
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Demo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Palette className="h-6 w-6 mr-3 text-blue-600" />
            Powered by Modern Technology
          </h2>
          <p className="text-gray-600">
            Built with cutting-edge technologies for maximum performance and scalability
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { name: 'React 18', description: 'Modern UI Framework' },
              { name: 'TypeScript', description: 'Type Safety' },
              { name: 'Blockchain', description: 'Web3 Integration' },
              { name: 'AI/ML', description: 'Predictive Analytics' },
              { name: 'WebGL', description: '3D Visualization' },
              { name: 'Speech API', description: 'Voice Recognition' },
              { name: 'IoT Protocols', description: 'Device Integration' },
              { name: 'Drone APIs', description: 'Fleet Management' }
            ].map((tech, idx) => (
              <div key={idx} className="text-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-gray-900 mb-1">{tech.name}</div>
                <div className="text-sm text-gray-600">{tech.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Savings</h3>
            <p className="text-gray-600">Reduce manual tasks by up to 80% with AI automation and voice commands</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Collaboration</h3>
            <p className="text-gray-600">Enhanced team collaboration with real-time updates and shared 3D models</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Standards</h3>
            <p className="text-gray-600">Meet international real estate standards with blockchain verification</p>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Experience the Future?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Transform your estate management with these revolutionary features. 
          Start exploring today and see the difference modern technology can make.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/ai-predictions">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Brain className="h-5 w-5 mr-2" />
              Start with AI Analytics
            </Button>
          </Link>
          <Link to="/3d-viewer">
            <Button size="lg" variant="outline">
              <Box className="h-5 w-5 mr-2" />
              Try 3D Viewer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
