import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  FileText, 
  Scan, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Zap,
  Brain,
  Shield
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LoadingSpinner } from '../ui/Loading';
import { useToast } from '../ui/Toast';

interface DocumentAnalysis {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'failed';
  aiAnalysis: {
    documentType: 'certificate_of_occupancy' | 'survey_plan' | 'building_approval' | 'payment_receipt' | 'unknown';
    confidence: number;
    extractedData: {
      plotNumber?: string;
      ownerName?: string;
      issueDate?: string;
      expiryDate?: string;
      amount?: number;
      authority?: string;
      coordinates?: [number, number];
    };
    verification: {
      authenticity: number;
      completeness: number;
      legibility: number;
      compliance: number;
    };
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      message: string;
      field?: string;
    }>;
  };
  ocrResults?: {
    text: string;
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
    }>;
  };
  preview?: string;
}

interface AIDocumentProcessorProps {
  onDocumentProcessed?: (analysis: DocumentAnalysis) => void;
}

const AIDocumentProcessor: React.FC<AIDocumentProcessorProps> = ({ onDocumentProcessed }) => {
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentAnalysis | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const processDocument = async (file: File): Promise<DocumentAnalysis> => {
    // Simulate AI processing with realistic delays and results
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockAnalysis: DocumentAnalysis = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      uploadedAt: new Date(),
      status: 'completed',
      aiAnalysis: {
        documentType: file.name.toLowerCase().includes('certificate') ? 'certificate_of_occupancy' :
                     file.name.toLowerCase().includes('survey') ? 'survey_plan' :
                     file.name.toLowerCase().includes('approval') ? 'building_approval' :
                     file.name.toLowerCase().includes('receipt') ? 'payment_receipt' : 'unknown',
        confidence: 0.92,
        extractedData: {
          plotNumber: 'A12',
          ownerName: 'Oluwaseun Adeyemi',
          issueDate: '2023-03-15',
          expiryDate: '2028-03-15',
          amount: 5000000,
          authority: 'Lagos State Ministry of Physical Planning',
          coordinates: [6.5244, 3.3792]
        },
        verification: {
          authenticity: 0.95,
          completeness: 0.88,
          legibility: 0.92,
          compliance: 0.85
        },
        issues: [
          {
            type: 'warning',
            message: 'Document expires within 5 years',
            field: 'expiryDate'
          },
          {
            type: 'info',
            message: 'Signature verification successful',
            field: 'signature'
          }
        ]
      },
      ocrResults: {
        text: 'CERTIFICATE OF OCCUPANCY\nLagos State Government\nPlot Number: A12\nOwner: Oluwaseun Adeyemi...',
        entities: [
          { type: 'PERSON', value: 'Oluwaseun Adeyemi', confidence: 0.98 },
          { type: 'PLOT', value: 'A12', confidence: 0.95 },
          { type: 'DATE', value: '2023-03-15', confidence: 0.92 }
        ]
      },
      preview: URL.createObjectURL(file)
    };

    return mockAnalysis;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    setProcessing(true);
    
    for (const file of files) {
      try {
        addToast({
          type: 'info',
          title: 'Processing Document',
          description: `AI is analyzing ${file.name}...`
        });

        const analysis = await processDocument(file);
        
        setDocuments(prev => [...prev, analysis]);
        onDocumentProcessed?.(analysis);

        addToast({
          type: 'success',
          title: 'Document Processed',
          description: `${file.name} has been successfully analyzed by AI`
        });

      } catch (error) {
        addToast({
          type: 'error',
          title: 'Processing Failed',
          description: `Failed to process ${file.name}`
        });
      }
    }
    
    setProcessing(false);
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'certificate_of_occupancy': return 'text-green-600 bg-green-100';
      case 'survey_plan': return 'text-blue-600 bg-blue-100';
      case 'building_approval': return 'text-purple-600 bg-purple-100';
      case 'payment_receipt': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'certificate_of_occupancy': return 'Certificate of Occupancy';
      case 'survey_plan': return 'Survey Plan';
      case 'building_approval': return 'Building Approval';
      case 'payment_receipt': return 'Payment Receipt';
      default: return 'Unknown Document';
    }
  };

  const getVerificationScore = (doc: DocumentAnalysis) => {
    const scores = doc.aiAnalysis.verification;
    return Math.round((scores.authenticity + scores.completeness + scores.legibility + scores.compliance) / 4 * 100);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI Document Processor</h2>
            <Badge variant="primary">Beta</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Upload documents for AI-powered analysis, OCR, and verification
          </p>
        </CardHeader>
        
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {processing ? (
              <div className="space-y-4">
                <LoadingSpinner size="lg" className="mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">AI Processing in Progress...</p>
                  <p className="text-sm text-gray-600">
                    Analyzing document structure, extracting data, and verifying authenticity
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <Zap className="h-8 w-8 text-yellow-500 mt-2" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop documents here or click to upload
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Supports PDF, PNG, JPG up to 10MB. AI will automatically detect document type.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={processing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Scan className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">OCR Technology</p>
                <p className="text-xs text-blue-700">Extract text and data automatically</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Fraud Detection</p>
                <p className="text-xs text-green-700">AI-powered authenticity verification</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Smart Classification</p>
                <p className="text-xs text-purple-700">Auto-detect document types</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processed Documents */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents List */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Processed Documents</h3>
              <p className="text-sm text-gray-600">{documents.length} documents analyzed</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-8 w-8 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getDocumentTypeColor(doc.aiAnalysis.documentType)}>
                            {getDocumentTypeName(doc.aiAnalysis.documentType)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {Math.round(doc.aiAnalysis.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={getVerificationScore(doc) > 85 ? 'success' : 
                                getVerificationScore(doc) > 70 ? 'warning' : 'danger'}
                      >
                        {getVerificationScore(doc)}% verified
                      </Badge>
                      {doc.aiAnalysis.issues.some(issue => issue.type === 'error') && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      {doc.aiAnalysis.issues.some(issue => issue.type === 'warning') && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {!doc.aiAnalysis.issues.some(issue => issue.type === 'error' || issue.type === 'warning') && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Document Details */}
          {selectedDocument && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Extracted Data */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Extracted Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(selectedDocument.aiAnalysis.extractedData).map(([key, value]) => (
                      value && (
                        <div key={key}>
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <p className="font-medium text-gray-900">{value.toString()}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                {/* Verification Scores */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Verification Metrics</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedDocument.aiAnalysis.verification).map(([key, score]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className="font-medium">{Math.round(score * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full ${
                              score > 0.8 ? 'bg-green-500' : score > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                {selectedDocument.aiAnalysis.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Analysis Issues</h4>
                    <div className="space-y-2">
                      {selectedDocument.aiAnalysis.issues.map((issue, index) => (
                        <div 
                          key={index}
                          className={`flex items-start space-x-2 p-3 rounded-lg ${
                            issue.type === 'error' ? 'bg-red-50 border border-red-200' :
                            issue.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                            'bg-blue-50 border border-blue-200'
                          }`}
                        >
                          {issue.type === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                          {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                          {issue.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              issue.type === 'error' ? 'text-red-800' :
                              issue.type === 'warning' ? 'text-yellow-800' :
                              'text-blue-800'
                            }`}>
                              {issue.message}
                            </p>
                            {issue.field && (
                              <p className="text-xs text-gray-600 mt-1">
                                Field: {issue.field}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OCR Results */}
                {selectedDocument.ocrResults && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">OCR Results</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                        {selectedDocument.ocrResults.text.substring(0, 200)}...
                      </p>
                    </div>
                    
                    {selectedDocument.ocrResults.entities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Detected Entities:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedDocument.ocrResults.entities.map((entity, index) => (
                            <Badge key={index} variant="secondary">
                              {entity.type}: {entity.value} ({Math.round(entity.confidence * 100)}%)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AIDocumentProcessor;
