import React, { useState, useEffect } from 'react';
import { Shield, Link, CheckCircle, AlertCircle, Clock, Hash, Eye, Download, Share2 } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface BlockchainRecord {
  id: string;
  txHash: string;
  propertyId: string;
  propertyName: string;
  recordType: 'ownership' | 'transfer' | 'verification' | 'document';
  timestamp: Date;
  blockNumber: number;
  status: 'confirmed' | 'pending' | 'failed';
  participants: string[];
  documentHash?: string;
  previousHash?: string;
  gasUsed?: number;
  confirmations: number;
}

interface PropertyOwnership {
  propertyId: string;
  currentOwner: string;
  ownershipHistory: {
    owner: string;
    from: Date;
    to?: Date;
    txHash: string;
  }[];
  verificationStatus: 'verified' | 'pending' | 'disputed';
  legalDocuments: {
    type: string;
    hash: string;
    verified: boolean;
  }[];
}

interface SmartContract {
  address: string;
  name: string;
  description: string;
  functions: string[];
  deployedAt: Date;
  verified: boolean;
}

const BlockchainIntegration: React.FC = () => {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyOwnership | null>(null);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [networkStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');

  useEffect(() => {
    loadBlockchainData();
    loadSmartContracts();
  }, []);

  const loadBlockchainData = () => {
    // Simulated blockchain data
    const mockRecords: BlockchainRecord[] = [
      {
        id: '1',
        txHash: '0x1234567890abcdef1234567890abcdef12345678',
        propertyId: 'EST-001-PLT-045',
        propertyName: 'Green Valley Estate - Plot 45',
        recordType: 'ownership',
        timestamp: new Date(Date.now() - 86400000),
        blockNumber: 18542301,
        status: 'confirmed',
        participants: ['0xABC123...', '0xDEF456...'],
        confirmations: 15,
        gasUsed: 21000
      },
      {
        id: '2',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        propertyId: 'EST-001-PLT-046',
        propertyName: 'Green Valley Estate - Plot 46',
        recordType: 'verification',
        timestamp: new Date(Date.now() - 172800000),
        blockNumber: 18542298,
        status: 'confirmed',
        participants: ['0xGHI789...'],
        documentHash: '0x789abc123def456...',
        confirmations: 25,
        gasUsed: 45000
      },
      {
        id: '3',
        txHash: '0x987654321fedcba987654321fedcba987654321f',
        propertyId: 'EST-002-PLT-012',
        propertyName: 'Sunrise Gardens - Plot 12',
        recordType: 'transfer',
        timestamp: new Date(Date.now() - 300000000),
        blockNumber: 18542295,
        status: 'pending',
        participants: ['0xJKL012...', '0xMNO345...'],
        confirmations: 3,
        gasUsed: 35000
      }
    ];

    setRecords(mockRecords);

    // Simulated property ownership data
    const mockOwnership: PropertyOwnership = {
      propertyId: 'EST-001-PLT-045',
      currentOwner: 'Adebayo Johnson',
      ownershipHistory: [
        {
          owner: 'Estate Developer Ltd.',
          from: new Date('2023-01-15'),
          to: new Date('2023-06-20'),
          txHash: '0x1111111111111111111111111111111111111111'
        },
        {
          owner: 'Adebayo Johnson',
          from: new Date('2023-06-20'),
          txHash: '0x1234567890abcdef1234567890abcdef12345678'
        }
      ],
      verificationStatus: 'verified',
      legalDocuments: [
        { type: 'Certificate of Occupancy', hash: '0x789abc...', verified: true },
        { type: 'Survey Plan', hash: '0x456def...', verified: true },
        { type: 'Purchase Agreement', hash: '0x123ghi...', verified: false }
      ]
    };

    setSelectedProperty(mockOwnership);
  };

  const loadSmartContracts = () => {
    const mockContracts: SmartContract[] = [
      {
        address: '0x1234567890123456789012345678901234567890',
        name: 'PropertyRegistry',
        description: 'Main contract for property registration and ownership tracking',
        functions: ['registerProperty', 'transferOwnership', 'verifyDocument', 'getOwnershipHistory'],
        deployedAt: new Date('2023-01-01'),
        verified: true
      },
      {
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        name: 'DocumentVerification',
        description: 'Contract for secure document verification and storage',
        functions: ['addDocument', 'verifyDocument', 'getDocumentHash', 'revokeDocument'],
        deployedAt: new Date('2023-01-15'),
        verified: true
      },
      {
        address: '0x9876543210987654321098765432109876543210',
        name: 'PaymentEscrow',
        description: 'Escrow contract for secure property transactions',
        functions: ['createEscrow', 'releasePayment', 'refund', 'getEscrowStatus'],
        deployedAt: new Date('2023-02-01'),
        verified: false
      }
    ];

    setContracts(mockContracts);
  };

  const createBlockchainRecord = async (type: string) => {
    setLoading(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newRecord: BlockchainRecord = {
      id: Date.now().toString(),
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      propertyId: 'EST-001-PLT-047',
      propertyName: 'New Property Registration',
      recordType: type as any,
      timestamp: new Date(),
      blockNumber: 18542302,
      status: 'pending',
      participants: ['0xUSER123...'],
      confirmations: 0,
      gasUsed: 42000
    };

    setRecords(prev => [newRecord, ...prev]);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shortenHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Link className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blockchain Property Records</h2>
            <p className="text-gray-600">Immutable property ownership and transaction history</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              networkStatus === 'connected' ? 'bg-green-500' : 
              networkStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600 capitalize">{networkStatus}</span>
          </div>
          
          <Button
            onClick={() => createBlockchainRecord('ownership')}
            loading={loading}
            icon={<Shield className="h-4 w-4" />}
          >
            Register Property
          </Button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Hash className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">18,542,301</p>
                <p className="text-gray-600">Latest Block</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-gray-600">Properties Registered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Link className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">3,891</p>
                <p className="text-gray-600">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">99.8%</p>
                <p className="text-gray-600">Verification Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Blockchain Records */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Blockchain Transactions</h3>
          <p className="text-sm text-gray-600">Latest property-related blockchain activities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(record.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{record.propertyName}</h4>
                      <p className="text-sm text-gray-600">{record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(record.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Transaction Hash</span>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono">{shortenHash(record.txHash)}</p>
                      <Button size="sm" variant="ghost" icon={<Eye className="h-3 w-3" />}>
                        View
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Block Number</span>
                    <p className="font-mono">{record.blockNumber.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Confirmations</span>
                    <p className="font-medium">{record.confirmations}/15</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Gas Used</span>
                    <p className="font-mono">{record.gasUsed?.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Participants:</span>
                    {record.participants.map((participant, idx) => (
                      <span key={idx} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {shortenHash(participant)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" icon={<Download className="h-3 w-3" />}>
                      Export
                    </Button>
                    <Button size="sm" variant="ghost" icon={<Share2 className="h-3 w-3" />}>
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Ownership Details */}
      {selectedProperty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Ownership History</h3>
              <p className="text-sm text-gray-600">Complete ownership trail for {selectedProperty.propertyId}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedProperty.ownershipHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{entry.owner}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.from.toLocaleDateString()} {entry.to ? `- ${entry.to.toLocaleDateString()}` : '- Present'}
                      </p>
                      <p className="text-xs font-mono text-gray-500">{shortenHash(entry.txHash)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Legal Documents</h3>
              <p className="text-sm text-gray-600">Blockchain-verified property documents</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedProperty.legalDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div className="flex items-center space-x-3">
                      {doc.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{doc.type}</p>
                        <p className="text-xs font-mono text-gray-500">{shortenHash(doc.hash)}</p>
                      </div>
                    </div>
                    
                    <Badge className={doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {doc.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Contracts */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Smart Contracts</h3>
          <p className="text-sm text-gray-600">Deployed smart contracts for property management</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <div key={contract.address} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{contract.name}</h4>
                  <Badge className={contract.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {contract.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{contract.description}</p>
                
                <div className="text-xs">
                  <p className="text-gray-500 mb-1">Address:</p>
                  <p className="font-mono bg-gray-100 p-1 rounded text-xs break-all">{contract.address}</p>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Functions:</p>
                  <div className="flex flex-wrap gap-1">
                    {contract.functions.slice(0, 3).map((func, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {func}
                      </span>
                    ))}
                    {contract.functions.length > 3 && (
                      <span className="text-xs text-gray-500">+{contract.functions.length - 3} more</span>
                    )}
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

export default BlockchainIntegration;
