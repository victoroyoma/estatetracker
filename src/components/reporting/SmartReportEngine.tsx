import React, { useState, useEffect } from 'react';
import { 
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  FileText,
  Share2,
  Settings,
  Clock,
  DollarSign,
  Target,
  Eye,
  Zap
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'operational' | 'marketing' | 'compliance' | 'executive';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'on-demand';
  format: 'pdf' | 'excel' | 'csv' | 'html' | 'powerpoint';
  estimatedTime: number;
  lastGenerated?: Date;
  isScheduled: boolean;
  priority: 'low' | 'medium' | 'high';
  dataSource: string[];
  visualization: 'charts' | 'tables' | 'mixed' | 'dashboards';
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  generatedDate: Date;
  status: 'generating' | 'completed' | 'failed' | 'scheduled';
  format: string;
  fileSize: number;
  downloadCount: number;
  recipients: string[];
  parameters: Record<string, any>;
}

interface ReportInsights {
  totalReports: number;
  monthlyGenerated: number;
  averageGenerationTime: number;
  mostUsedTemplate: string;
  popularFormats: Array<{
    format: string;
    count: number;
    percentage: number;
  }>;
  generationTrends: Array<{
    date: string;
    count: number;
    automated: number;
    manual: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    avgTime: number;
  }>;
}

const SmartReportEngine: React.FC = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [insights, setInsights] = useState<ReportInsights | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState('last_30_days');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<string[]>([]);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    
    // Simulate loading data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTemplates: ReportTemplate[] = [
      {
        id: 'rpt-001',
        name: 'Monthly Estate Performance',
        description: 'Comprehensive monthly analysis of estate performance including sales, occupancy, and revenue metrics',
        category: 'financial',
        frequency: 'monthly',
        format: 'pdf',
        estimatedTime: 45,
        lastGenerated: new Date(Date.now() - 86400000),
        isScheduled: true,
        priority: 'high',
        dataSource: ['plots', 'sales', 'clients', 'payments'],
        visualization: 'mixed'
      },
      {
        id: 'rpt-002',
        name: 'Weekly Sales Dashboard',
        description: 'Weekly sales performance with lead conversion rates and client activity',
        category: 'marketing',
        frequency: 'weekly',
        format: 'html',
        estimatedTime: 15,
        lastGenerated: new Date(Date.now() - 172800000),
        isScheduled: true,
        priority: 'medium',
        dataSource: ['sales', 'leads', 'clients'],
        visualization: 'dashboards'
      },
      {
        id: 'rpt-003',
        name: 'Construction Progress Report',
        description: 'Daily construction progress tracking with milestone achievements and delays',
        category: 'operational',
        frequency: 'daily',
        format: 'excel',
        estimatedTime: 20,
        lastGenerated: new Date(Date.now() - 43200000),
        isScheduled: true,
        priority: 'high',
        dataSource: ['construction', 'contractors', 'materials'],
        visualization: 'charts'
      },
      {
        id: 'rpt-004',
        name: 'Compliance Audit Report',
        description: 'Quarterly compliance check including document verification and regulatory requirements',
        category: 'compliance',
        frequency: 'quarterly',
        format: 'pdf',
        estimatedTime: 120,
        lastGenerated: new Date(Date.now() - 7776000000),
        isScheduled: true,
        priority: 'high',
        dataSource: ['documents', 'approvals', 'legal'],
        visualization: 'tables'
      },
      {
        id: 'rpt-005',
        name: 'Client Satisfaction Survey',
        description: 'Monthly client feedback analysis with satisfaction scores and improvement recommendations',
        category: 'executive',
        frequency: 'monthly',
        format: 'powerpoint',
        estimatedTime: 60,
        lastGenerated: new Date(Date.now() - 2592000000),
        isScheduled: false,
        priority: 'medium',
        dataSource: ['clients', 'feedback', 'surveys'],
        visualization: 'mixed'
      },
      {
        id: 'rpt-006',
        name: 'Revenue Analytics Deep Dive',
        description: 'Comprehensive revenue analysis with forecasting and trend identification',
        category: 'financial',
        frequency: 'on-demand',
        format: 'excel',
        estimatedTime: 90,
        isScheduled: false,
        priority: 'medium',
        dataSource: ['payments', 'invoices', 'forecasts'],
        visualization: 'charts'
      }
    ];

    const mockReports: GeneratedReport[] = [
      {
        id: 'gen-001',
        templateId: 'rpt-001',
        templateName: 'Monthly Estate Performance',
        generatedDate: new Date(Date.now() - 86400000),
        status: 'completed',
        format: 'pdf',
        fileSize: 4.2,
        downloadCount: 12,
        recipients: ['admin@estate.com', 'manager@estate.com'],
        parameters: { estate: 'Green Valley', month: 'January 2024' }
      },
      {
        id: 'gen-002',
        templateId: 'rpt-002',
        templateName: 'Weekly Sales Dashboard',
        generatedDate: new Date(Date.now() - 172800000),
        status: 'completed',
        format: 'html',
        fileSize: 1.8,
        downloadCount: 25,
        recipients: ['sales@estate.com'],
        parameters: { week: '2024-W03' }
      },
      {
        id: 'gen-003',
        templateId: 'rpt-003',
        templateName: 'Construction Progress Report',
        generatedDate: new Date(),
        status: 'generating',
        format: 'excel',
        fileSize: 0,
        downloadCount: 0,
        recipients: ['construction@estate.com'],
        parameters: { date: '2024-01-20' }
      }
    ];

    const mockInsights: ReportInsights = {
      totalReports: 847,
      monthlyGenerated: 156,
      averageGenerationTime: 42,
      mostUsedTemplate: 'Weekly Sales Dashboard',
      popularFormats: [
        { format: 'PDF', count: 324, percentage: 38.3 },
        { format: 'Excel', count: 276, percentage: 32.6 },
        { format: 'HTML', count: 185, percentage: 21.8 },
        { format: 'PowerPoint', count: 62, percentage: 7.3 }
      ],
      generationTrends: [
        { date: '2024-01-15', count: 23, automated: 18, manual: 5 },
        { date: '2024-01-16', count: 28, automated: 22, manual: 6 },
        { date: '2024-01-17', count: 31, automated: 24, manual: 7 },
        { date: '2024-01-18', count: 26, automated: 20, manual: 6 },
        { date: '2024-01-19', count: 35, automated: 28, manual: 7 },
        { date: '2024-01-20', count: 29, automated: 23, manual: 6 }
      ],
      categoryBreakdown: [
        { category: 'Financial', count: 234, avgTime: 65 },
        { category: 'Operational', count: 198, avgTime: 32 },
        { category: 'Marketing', count: 167, avgTime: 28 },
        { category: 'Compliance', count: 134, avgTime: 98 },
        { category: 'Executive', count: 114, avgTime: 75 }
      ]
    };

    setTemplates(mockTemplates);
    setGeneratedReports(mockReports);
    setInsights(mockInsights);
    setLoading(false);
  };

  const generateReport = async (templateId: string, parameters: Record<string, any> = {}) => {
    setGenerating(prev => [...prev, templateId]);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const template = templates.find(t => t.id === templateId);
      if (!template) return;
      
      const newReport: GeneratedReport = {
        id: `gen-${Date.now()}`,
        templateId,
        templateName: template.name,
        generatedDate: new Date(),
        status: 'completed',
        format: template.format,
        fileSize: Math.random() * 5 + 1,
        downloadCount: 0,
        recipients: ['user@estate.com'],
        parameters
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      
      // Update template last generated
      setTemplates(prev => prev.map(t => 
        t.id === templateId 
          ? { ...t, lastGenerated: new Date() }
          : t
      ));
      
    } catch (error) {
      console.error('Report generation failed:', error);
    } finally {
      setGenerating(prev => prev.filter(id => id !== templateId));
    }
  };

  const getCategoryIcon = (category: ReportTemplate['category']) => {
    switch (category) {
      case 'financial': return <DollarSign className="h-5 w-5" />;
      case 'operational': return <Settings className="h-5 w-5" />;
      case 'marketing': return <TrendingUp className="h-5 w-5" />;
      case 'compliance': return <FileText className="h-5 w-5" />;
      case 'executive': return <Target className="h-5 w-5" />;
      default: return <FileBarChart className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: GeneratedReport['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel': return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'html': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'powerpoint': return <PieChart className="h-4 w-4 text-orange-500" />;
      default: return <FileBarChart className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

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
          <h1 className="text-2xl font-bold text-gray-900">Smart Report Engine</h1>
          <p className="text-gray-600 mt-1">Automated report generation and analytics dashboard</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            onClick={() => console.log('New template modal')}
            icon={<FileBarChart className="h-4 w-4" />}
            variant="secondary"
          >
            New Template
          </Button>
          
          <Button
            onClick={loadReportData}
            loading={loading}
            icon={<Zap className="h-4 w-4" />}
          >
            Refresh Reports
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileBarChart className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{insights.totalReports.toLocaleString()}</p>
                <p className="text-gray-600">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{insights.monthlyGenerated}</p>
                <p className="text-gray-600">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{insights.averageGenerationTime}s</p>
                <p className="text-gray-600">Avg Generation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-lg font-bold text-gray-900">{insights.mostUsedTemplate}</p>
                <p className="text-gray-600">Most Popular</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Trends */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Report Generation Trends</h3>
            <p className="text-sm text-gray-600">Daily report generation activity</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={insights.generationTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                <Legend />
                <Area type="monotone" dataKey="automated" stackId="1" stroke="#10b981" fill="#10b981" name="Automated" />
                <Area type="monotone" dataKey="manual" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Manual" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Format Distribution */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Popular Formats</h3>
            <p className="text-sm text-gray-600">Report format distribution</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={insights.popularFormats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ format, percentage }) => `${format} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {insights.popularFormats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Report Templates</h3>
              <p className="text-sm text-gray-600">Manage and generate reports from predefined templates</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All Categories</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="marketing">Marketing</option>
                <option value="compliance">Compliance</option>
                <option value="executive">Executive</option>
              </select>
              
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_90_days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getCategoryIcon(template.category)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Badge className={
                      template.priority === 'high' ? 'bg-red-100 text-red-800' :
                      template.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {template.priority}
                    </Badge>
                    {template.isScheduled && (
                      <Badge className="bg-green-100 text-green-800">
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="capitalize">{template.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Format:</span>
                    <div className="flex items-center space-x-1">
                      {getFormatIcon(template.format)}
                      <span className="uppercase">{template.format}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Est. Time:</span>
                    <span>{template.estimatedTime}s</span>
                  </div>
                  {template.lastGenerated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Generated:</span>
                      <span>{template.lastGenerated.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    onClick={() => generateReport(template.id)}
                    loading={generating.includes(template.id)}
                    icon={<Zap className="h-3 w-3" />}
                    className="flex-1"
                  >
                    {generating.includes(template.id) ? 'Generating...' : 'Generate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => console.log('Edit template:', template.name)}
                    icon={<Settings className="h-3 w-3" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Generated Reports</h3>
          <p className="text-sm text-gray-600">Latest report generation history</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {generatedReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            {getFormatIcon(report.format)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.templateName}</div>
                          <div className="text-sm text-gray-500 uppercase">{report.format}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.generatedDate.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.fileSize > 0 ? `${report.fileSize.toFixed(1)} MB` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.downloadCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {report.status === 'completed' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Eye className="h-3 w-3" />}
                            >
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Download className="h-3 w-3" />}
                            >
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              icon={<Share2 className="h-3 w-3" />}
                            >
                              Share
                            </Button>
                          </>
                        )}
                        {report.status === 'generating' && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Generating...</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Category Performance</h3>
          <p className="text-sm text-gray-600">Report generation statistics by category</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Report Count" />
              <Bar yAxisId="right" dataKey="avgTime" fill="#ef4444" name="Avg Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartReportEngine;
