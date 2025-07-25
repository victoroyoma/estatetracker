import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  RefreshCw,
  Smartphone,
  Globe,
  Shield
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, formatNumber } from '../../lib/utils';

interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  method: 'card' | 'bank_transfer' | 'ussd' | 'qr_code' | 'mobile_money';
  gateway: 'paystack' | 'flutterwave' | 'interswitch';
  description: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  plotId?: string;
  estateId?: string;
  createdAt: Date;
  paidAt?: Date;
  fees: number;
  netAmount: number;
  metadata?: Record<string, any>;
}

interface PaymentAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageAmount: number;
  monthlyGrowth: number;
  topPaymentMethods: Array<{ name: string; value: number; color: string }>;
  revenueByEstate: Array<{ name: string; amount: number }>;
  dailyRevenue: Array<{ date: string; amount: number; transactions: number }>;
  paymentStatus: Array<{ status: string; count: number; percentage: number }>;
}

interface PaymentDashboardProps {
  estateId?: string;
}

const PaymentDashboard: React.FC<PaymentDashboardProps> = ({ estateId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock payment data
  const mockPayments: Payment[] = [
    {
      id: 'pay_1',
      reference: 'EST_1690123456',
      amount: 5000000,
      currency: 'NGN',
      status: 'successful',
      method: 'card',
      gateway: 'paystack',
      description: 'Plot A12 - Initial Payment',
      customer: {
        name: 'Oluwaseun Adeyemi',
        email: 'oluwaseun@example.com',
        phone: '+2348123456789'
      },
      plotId: 'plot_a12',
      estateId: 'estate_1',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      fees: 75000,
      netAmount: 4925000
    },
    {
      id: 'pay_2',
      reference: 'EST_1690123457',
      amount: 2500000,
      currency: 'NGN',
      status: 'pending',
      method: 'bank_transfer',
      gateway: 'paystack',
      description: 'Plot B5 - Installment Payment',
      customer: {
        name: 'Adebayo Johnson',
        email: 'adebayo@example.com',
        phone: '+2348123456790'
      },
      plotId: 'plot_b5',
      estateId: 'estate_1',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      fees: 37500,
      netAmount: 2462500
    },
    {
      id: 'pay_3',
      reference: 'EST_1690123458',
      amount: 750000,
      currency: 'NGN',
      status: 'failed',
      method: 'card',
      gateway: 'flutterwave',
      description: 'Documentation Fee - Plot C3',
      customer: {
        name: 'Fatima Usman',
        email: 'fatima@example.com',
        phone: '+2348123456791'
      },
      plotId: 'plot_c3',
      estateId: 'estate_2',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      fees: 11250,
      netAmount: 738750
    }
  ];

  const mockAnalytics: PaymentAnalytics = {
    totalRevenue: 8250000,
    totalTransactions: 15,
    successRate: 86.7,
    averageAmount: 2750000,
    monthlyGrowth: 23.5,
    topPaymentMethods: [
      { name: 'Card Payment', value: 60, color: '#10B981' },
      { name: 'Bank Transfer', value: 25, color: '#3B82F6' },
      { name: 'USSD', value: 10, color: '#F59E0B' },
      { name: 'Mobile Money', value: 5, color: '#8B5CF6' }
    ],
    revenueByEstate: [
      { name: 'Green Valley', amount: 4500000 },
      { name: 'Sunset Gardens', amount: 2200000 },
      { name: 'Royal Heights', amount: 1550000 }
    ],
    dailyRevenue: [
      { date: '2023-07-20', amount: 1200000, transactions: 3 },
      { date: '2023-07-21', amount: 890000, transactions: 2 },
      { date: '2023-07-22', amount: 2100000, transactions: 4 },
      { date: '2023-07-23', amount: 1800000, transactions: 3 },
      { date: '2023-07-24', amount: 2260000, transactions: 3 }
    ],
    paymentStatus: [
      { status: 'Successful', count: 13, percentage: 86.7 },
      { status: 'Pending', count: 1, percentage: 6.7 },
      { status: 'Failed', count: 1, percentage: 6.6 }
    ]
  };

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setTimeout(() => {
      setPayments(mockPayments);
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod, estateId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Globe className="h-4 w-4" />;
      case 'ussd':
        return <Smartphone className="h-4 w-4" />;
      case 'mobile_money':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesSearch = payment.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor transactions and revenue analytics</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="primary" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analytics.monthlyGrowth}% from last month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.totalTransactions)}
                </p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  12 this week
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  +2.3% this month
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.averageAmount)}
                </p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Per transaction
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <p className="text-sm text-gray-600">Daily revenue and transaction count</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" tickFormatter={(value) => formatCurrency(value).replace('₦', '₦')} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'amount' ? formatCurrency(value as number) : value,
                    name === 'amount' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="amount" fill="#10B981" name="Revenue" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <p className="text-sm text-gray-600">Distribution by payment type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topPaymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.topPaymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-600">{filteredPayments.length} transactions</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.reference}</p>
                        <p className="text-sm text-gray-500">{payment.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.customer.name}</p>
                        <p className="text-sm text-gray-500">{payment.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Fee: {formatCurrency(payment.fees)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMethodIcon(payment.method)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <Badge variant={getStatusColor(payment.status)} className="ml-2">
                          {payment.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.createdAt.toLocaleDateString('en-NG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentDashboard;
