import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Download,
  Search,
  Plus,
  Eye,
  Send
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';

interface Payment {
  id: string;
  plotId: string;
  plotNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  type: 'initial' | 'development' | 'infrastructure' | 'final';
  method?: 'bank_transfer' | 'cash' | 'cheque' | 'online';
  reference?: string;
  notes?: string;
}

interface Budget {
  id: string;
  estateId: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage: number;
}

interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  collectionRate: number;
  averagePaymentTime: number;
}

const FinancialManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'invoices' | 'budgets'>('overview');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      await Promise.all([
        loadPayments(),
        loadBudgets(),
        loadSummary()
      ]);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    const mockPayments: Payment[] = [
      {
        id: 'payment-1',
        plotId: 'plot-a12',
        plotNumber: 'A12',
        clientId: 'client-1',
        clientName: 'John Okafor',
        amount: 2500000,
        dueDate: new Date('2024-12-15'),
        paidDate: new Date('2024-12-10'),
        status: 'paid',
        type: 'initial',
        method: 'bank_transfer',
        reference: 'TXN-001-2024',
        notes: 'Initial payment for plot allocation'
      },
      {
        id: 'payment-2',
        plotId: 'plot-b5',
        plotNumber: 'B5',
        clientId: 'client-2',
        clientName: 'Mary Adebayo',
        amount: 1800000,
        dueDate: new Date('2024-12-20'),
        status: 'pending',
        type: 'development',
        notes: 'Development levy payment'
      },
      {
        id: 'payment-3',
        plotId: 'plot-c8',
        plotNumber: 'C8',
        clientId: 'client-3',
        clientName: 'Ahmed Hassan',
        amount: 3200000,
        dueDate: new Date('2024-11-30'),
        status: 'overdue',
        type: 'final',
        notes: 'Final certificate payment - overdue'
      },
      {
        id: 'payment-4',
        plotId: 'plot-a15',
        plotNumber: 'A15',
        clientId: 'client-4',
        clientName: 'Grace Okonkwo',
        amount: 1500000,
        dueDate: new Date('2024-12-25'),
        paidDate: new Date('2024-12-18'),
        status: 'paid',
        type: 'infrastructure',
        method: 'online',
        reference: 'PSK-789-2024'
      }
    ];
    setPayments(mockPayments);
  };

  const loadBudgets = async () => {
    const mockBudgets: Budget[] = [
      {
        id: 'budget-1',
        estateId: 'estate-1',
        category: 'Infrastructure',
        allocated: 50000000,
        spent: 35000000,
        remaining: 15000000,
        percentage: 70
      },
      {
        id: 'budget-2',
        estateId: 'estate-1',
        category: 'Marketing',
        allocated: 10000000,
        spent: 7500000,
        remaining: 2500000,
        percentage: 75
      },
      {
        id: 'budget-3',
        estateId: 'estate-1',
        category: 'Legal & Documentation',
        allocated: 5000000,
        spent: 3200000,
        remaining: 1800000,
        percentage: 64
      },
      {
        id: 'budget-4',
        estateId: 'estate-1',
        category: 'Maintenance',
        allocated: 15000000,
        spent: 8500000,
        remaining: 6500000,
        percentage: 57
      }
    ];
    setBudgets(mockBudgets);
  };

  const loadSummary = async () => {
    const mockSummary: FinancialSummary = {
      totalRevenue: 125000000,
      monthlyRevenue: 8500000,
      pendingPayments: 15600000,
      overduePayments: 3200000,
      collectionRate: 85.5,
      averagePaymentTime: 12
    };
    setSummary(mockSummary);
  };

  const handleGenerateInvoice = (plotId: string) => {
    console.log('Generating invoice for plot:', plotId);
    // Implementation for invoice generation
  };

  const handleSendReminder = (paymentId: string) => {
    console.log('Sending payment reminder for:', paymentId);
    // Implementation for sending payment reminders
  };

  const handleExportData = (type: 'payments' | 'invoices' | 'budgets') => {
    console.log('Exporting data:', type);
    // Implementation for data export
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      case 'partial': return 'orange';
      case 'sent': return 'blue';
      case 'draft': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.plotNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExportData('payments')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={() => handleGenerateInvoice('')}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'payments', label: 'Payments' },
            { id: 'invoices', label: 'Invoices' },
            { id: 'budgets', label: 'Budgets' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && summary && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.monthlyRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Pending Payments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.pendingPayments)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Overdue Payments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(summary.overduePayments)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collection Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Collection Rate</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Current Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {summary.collectionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${summary.collectionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Target: 90% | Industry Average: 78%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Payment Performance</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Average Payment Time</span>
                    <span className="font-medium">{summary.averagePaymentTime} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">On-time Payments</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Late Payments</span>
                    <span className="font-medium text-yellow-600">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Defaults</span>
                    <span className="font-medium text-red-600">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by client or plot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          {/* Payments Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client / Plot
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.clientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Plot {payment.plotNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {payment.type.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={getStatusColor(payment.status) as any}
                            className="capitalize"
                          >
                            {payment.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {payment.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSendReminder(payment.id)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budgets Tab */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((budget) => (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{budget.category}</h3>
                    <span className="text-sm text-gray-500">
                      {budget.percentage}% used
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          budget.percentage > 90 ? 'bg-red-500' :
                          budget.percentage > 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${budget.percentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Allocated</p>
                        <p className="font-medium">{formatCurrency(budget.allocated)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Spent</p>
                        <p className="font-medium">{formatCurrency(budget.spent)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Remaining</p>
                        <p className="font-medium">{formatCurrency(budget.remaining)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
