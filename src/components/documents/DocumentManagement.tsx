import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2, 
  Share, 
  Lock, 
  Search,
  FolderPlus,
  File,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate, formatFileSize } from '../../lib/utils';

interface DocumentItem {
  id: string;
  name: string;
  type: 'certificate' | 'survey' | 'agreement' | 'plan' | 'approval' | 'other';
  category: 'legal' | 'technical' | 'financial' | 'administrative';
  size: number;
  format: string;
  uploadDate: Date;
  lastModified: Date;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  plotId?: string;
  plotNumber?: string;
  estateId?: string;
  estateName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  isPublic: boolean;
  isRequired: boolean;
  expiryDate?: Date;
  version: number;
  downloadCount: number;
  url: string;
  thumbnail?: string;
  tags: string[];
  notes?: string;
}

interface DocumentStats {
  totalDocuments: number;
  pendingApproval: number;
  expiringDocuments: number;
  recentUploads: number;
  storageUsed: number;
  storageLimit: number;
}

const DocumentManagement: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('list');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocumentData();
  }, []);

  const loadDocumentData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDocuments(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading document data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    const mockDocuments: DocumentItem[] = [
      {
        id: 'doc-1',
        name: 'Certificate of Occupancy - Plot A12',
        type: 'certificate',
        category: 'legal',
        size: 2048576, // 2MB
        format: 'PDF',
        uploadDate: new Date('2024-11-15'),
        lastModified: new Date('2024-11-20'),
        uploadedBy: {
          id: 'user-1',
          name: 'John Okafor',
          role: 'Client'
        },
        plotId: 'plot-a12',
        plotNumber: 'A12',
        estateId: 'estate-1',
        estateName: 'Green Valley Estate',
        status: 'approved',
        isPublic: false,
        isRequired: true,
        expiryDate: new Date('2025-11-15'),
        version: 1,
        downloadCount: 15,
        url: '/documents/certificate-a12.pdf',
        tags: ['certificate', 'c-of-o', 'legal', 'plot-a12'],
        notes: 'Original certificate of occupancy for plot A12'
      },
      {
        id: 'doc-2',
        name: 'Survey Plan - Green Valley Estate',
        type: 'survey',
        category: 'technical',
        size: 5242880, // 5MB
        format: 'DWG',
        uploadDate: new Date('2024-10-20'),
        lastModified: new Date('2024-10-25'),
        uploadedBy: {
          id: 'user-2',
          name: 'Surveyor Ltd',
          role: 'Surveyor'
        },
        estateId: 'estate-1',
        estateName: 'Green Valley Estate',
        status: 'approved',
        isPublic: true,
        isRequired: true,
        version: 2,
        downloadCount: 45,
        url: '/documents/survey-plan.dwg',
        tags: ['survey', 'plan', 'technical', 'estate'],
        notes: 'Updated survey plan with latest measurements'
      },
      {
        id: 'doc-3',
        name: 'Purchase Agreement - Plot B5',
        type: 'agreement',
        category: 'legal',
        size: 1048576, // 1MB
        format: 'PDF',
        uploadDate: new Date('2024-12-01'),
        lastModified: new Date('2024-12-01'),
        uploadedBy: {
          id: 'user-3',
          name: 'Mary Adebayo',
          role: 'Client'
        },
        plotId: 'plot-b5',
        plotNumber: 'B5',
        estateId: 'estate-1',
        estateName: 'Green Valley Estate',
        status: 'pending',
        isPublic: false,
        isRequired: true,
        version: 1,
        downloadCount: 3,
        url: '/documents/agreement-b5.pdf',
        tags: ['agreement', 'purchase', 'legal', 'plot-b5'],
        notes: 'Purchase agreement awaiting legal review'
      },
      {
        id: 'doc-4',
        name: 'Building Plan - Modern Villa Design',
        type: 'plan',
        category: 'technical',
        size: 8388608, // 8MB
        format: 'PDF',
        uploadDate: new Date('2024-11-30'),
        lastModified: new Date('2024-12-02'),
        uploadedBy: {
          id: 'user-4',
          name: 'ArchDesign Studio',
          role: 'Architect'
        },
        plotId: 'plot-c8',
        plotNumber: 'C8',
        estateId: 'estate-1',
        estateName: 'Green Valley Estate',
        status: 'approved',
        isPublic: false,
        isRequired: false,
        version: 3,
        downloadCount: 12,
        url: '/documents/building-plan-c8.pdf',
        tags: ['building', 'plan', 'architecture', 'villa'],
        notes: 'Approved architectural plan for villa construction'
      },
      {
        id: 'doc-5',
        name: 'Environmental Impact Assessment',
        type: 'approval',
        category: 'administrative',
        size: 3145728, // 3MB
        format: 'PDF',
        uploadDate: new Date('2024-09-15'),
        lastModified: new Date('2024-09-15'),
        uploadedBy: {
          id: 'user-5',
          name: 'Environmental Agency',
          role: 'Government'
        },
        estateId: 'estate-1',
        estateName: 'Green Valley Estate',
        status: 'approved',
        isPublic: true,
        isRequired: true,
        expiryDate: new Date('2025-09-15'),
        version: 1,
        downloadCount: 28,
        url: '/documents/eia-report.pdf',
        tags: ['environmental', 'impact', 'assessment', 'compliance'],
        notes: 'Environmental clearance for estate development'
      }
    ];
    setDocuments(mockDocuments);
  };

  const loadStats = async () => {
    const mockStats: DocumentStats = {
      totalDocuments: 156,
      pendingApproval: 8,
      expiringDocuments: 3,
      recentUploads: 12,
      storageUsed: 2048, // MB
      storageLimit: 10240 // MB (10GB)
    };
    setStats(mockStats);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved': return 'green';
      case 'pending': return 'yellow';
      case 'rejected': return 'red';
      case 'expired': return 'gray';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'survey': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'agreement': return <Lock className="h-5 w-5 text-purple-600" />;
      case 'plan': return <File className="h-5 w-5 text-orange-600" />;
      case 'approval': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleDownload = (document: DocumentItem) => {
    console.log('Downloading document:', document.name);
    // Implementation for document download
  };

  const handleShare = (document: DocumentItem) => {
    console.log('Sharing document:', document.name);
    // Implementation for document sharing
  };

  const handleDelete = (documentId: string) => {
    console.log('Deleting document:', documentId);
    // Implementation for document deletion
  };

  const handleUpload = () => {
    console.log('Opening upload modal');
    // Implementation for document upload
  };

  const isExpiringSoon = (document: DocumentItem): boolean => {
    if (!document.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((document.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
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
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApproval}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.expiringDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Upload className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Recent Uploads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentUploads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Storage Usage */}
      {stats && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Storage Usage</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">
                {stats.storageUsed} MB of {stats.storageLimit} MB used
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((stats.storageUsed / stats.storageLimit) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (stats.storageUsed / stats.storageLimit) > 0.9 ? 'bg-red-500' :
                  (stats.storageUsed / stats.storageLimit) > 0.7 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(stats.storageUsed / stats.storageLimit) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          <option value="certificate">Certificates</option>
          <option value="survey">Surveys</option>
          <option value="agreement">Agreements</option>
          <option value="plan">Plans</option>
          <option value="approval">Approvals</option>
          <option value="other">Other</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
        </select>
        <div className="flex border border-gray-300 rounded-md">
          <button
            onClick={() => setActiveView('list')}
            className={`px-3 py-2 text-sm ${
              activeView === 'list' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setActiveView('grid')}
            className={`px-3 py-2 text-sm ${
              activeView === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Documents List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plot/Estate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getTypeIcon(document.type)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {document.name}
                            {document.isRequired && (
                              <Star className="h-4 w-4 text-yellow-500 ml-2" />
                            )}
                            {isExpiringSoon(document) && (
                              <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {document.format} • Version {document.version}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {document.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.plotNumber ? `Plot ${document.plotNumber}` : document.estateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={getStatusColor(document.status) as any}
                        className="capitalize"
                      >
                        {document.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.uploadDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(document.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedDocument(document)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownload(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(document)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Document Details Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{selectedDocument.name}</h3>
              <button 
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm text-gray-900 capitalize">{selectedDocument.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge variant={getStatusColor(selectedDocument.status) as any}>
                    {selectedDocument.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Upload Date</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedDocument.uploadDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Size</p>
                  <p className="text-sm text-gray-900">{formatFileSize(selectedDocument.size)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Uploaded By</p>
                  <p className="text-sm text-gray-900">{selectedDocument.uploadedBy.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Downloads</p>
                  <p className="text-sm text-gray-900">{selectedDocument.downloadCount}</p>
                </div>
              </div>
              {selectedDocument.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm text-gray-900">{selectedDocument.notes}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Tags</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedDocument.tags.map(tag => (
                    <Badge key={tag} className="text-xs bg-gray-100 text-gray-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
