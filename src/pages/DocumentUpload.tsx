import React, { useState } from 'react';
import { UploadIcon, FileTextIcon, CheckCircleIcon, AlertTriangleIcon, SearchIcon, XIcon } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
const DocumentUpload = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  // Mock documents data
  const documents = [{
    id: 1,
    name: 'Certificate of Occupancy - Plot A12',
    type: 'C of O',
    status: 'verified',
    date: '15/03/2023',
    estate: 'Green Valley Estate',
    verificationScore: 98
  }, {
    id: 2,
    name: 'Survey Plan - Plot A12',
    type: 'Survey Plan',
    status: 'verified',
    date: '15/03/2023',
    estate: 'Green Valley Estate',
    verificationScore: 95
  }, {
    id: 3,
    name: 'Building Approval - Plot A12',
    type: 'Approval',
    status: 'verified',
    date: '22/03/2023',
    estate: 'Green Valley Estate',
    verificationScore: 92
  }, {
    id: 4,
    name: 'Payment Receipt - Plot B3',
    type: 'Receipt',
    status: 'pending',
    date: '01/06/2023',
    estate: 'Sunshine Gardens',
    verificationScore: 75
  }, {
    id: 5,
    name: 'Certificate of Occupancy - Plot B3',
    type: 'C of O',
    status: 'rejected',
    date: '01/06/2023',
    estate: 'Sunshine Gardens',
    verificationScore: 45
  }];
  // Simulate upload progress
  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.type.toLowerCase().includes(searchQuery.toLowerCase()) || doc.estate.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload, verify and manage property documents
          </p>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upload' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('upload')}>
            Upload Documents
          </button>
          <button className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'library' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('library')}>
            Document Library
          </button>
          <button className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'verification' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('verification')}>
            Verification Status
          </button>
        </div>
      </div>
      {activeTab === 'upload' && <div>
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">
                Upload New Documents
              </h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <UploadIcon className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-center text-gray-600">
                  Drag and drop files here, or click to select files
                </p>
                <p className="mt-1 text-sm text-center text-gray-500">
                  Supports PDF, JPG, PNG up to 10MB
                </p>
                <Button variant="primary" className="mt-4" onClick={simulateUpload}>
                  Select Files
                </Button>
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && <div className="mt-6">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <FileTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        Certificate_of_Occupancy.pdf
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{
                width: `${uploadProgress}%`
              }}></div>
                  </div>
                </div>}
              {uploadProgress === 100 && <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileTextIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        Certificate_of_Occupancy.pdf
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Uploaded</span>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Document uploaded successfully
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            AI verification in progress. This may take a few
                            minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center mb-1">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
                      <span className="text-sm text-gray-700">
                        Extracting document data...
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Type
                      </label>
                      <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
                        <option>Certificate of Occupancy</option>
                        <option>Survey Plan</option>
                        <option>Building Approval</option>
                        <option>Payment Receipt</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Related Plot
                      </label>
                      <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500">
                        <option>Plot A12 - Green Valley Estate</option>
                        <option>Plot A13 - Green Valley Estate</option>
                        <option>Plot B3 - Sunshine Gardens</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="primary">Submit for Verification</Button>
                  </div>
                </div>}
            </CardContent>
          </Card>
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Document Verification Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <UploadIcon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="font-medium text-gray-900">
                  1. Upload Document
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Upload your land documents including C of O, survey plans, and
                  receipts.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <FileTextIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="font-medium text-gray-900">
                  2. AI Verification
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Our AI system extracts and validates key information from your
                  documents.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-soft">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">
                  3. Verification Complete
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Receive verification results and fraud detection alerts if
                  applicable.
                </p>
              </div>
            </div>
          </div>
        </div>}
      {activeTab === 'library' && <div>
          <div className="mb-6">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search documents by name, type or estate..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button onClick={() => setSearchQuery('')}>
                    <XIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>}
            </div>
          </div>
          <div className="bg-white shadow-soft overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.length > 0 ? filteredDocuments.map(doc => <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {doc.estate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {doc.date}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={doc.status === 'verified' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}>
                            {doc.status === 'verified' ? 'Verified' : doc.status === 'pending' ? 'Pending' : 'Rejected'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>) : <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        <p className="text-gray-500">
                          No documents found matching your search.
                        </p>
                      </td>
                    </tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>}
      {activeTab === 'verification' && <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <h2 className="font-medium text-gray-900">
                  Verification Summary
                </h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Verified Documents
                      </span>
                      <span className="text-sm font-medium">3/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{
                    width: '60%'
                  }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Pending Verification
                      </span>
                      <span className="text-sm font-medium">1/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{
                    width: '20%'
                  }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">
                        Rejected Documents
                      </span>
                      <span className="text-sm font-medium">1/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{
                    width: '20%'
                  }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="font-medium text-gray-900">
                  Recent Verification Results
                </h2>
              </CardHeader>
              <div className="divide-y divide-gray-200">
                <div className="px-4 py-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Certificate of Occupancy - Plot A12
                        </p>
                        <p className="text-xs text-gray-500">
                          Verified 2 days ago
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">98%</Badge>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <AlertTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Payment Receipt - Plot B3
                        </p>
                        <p className="text-xs text-gray-500">
                          Pending verification
                        </p>
                      </div>
                    </div>
                    <Badge variant="warning">75%</Badge>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <XIcon className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Certificate of Occupancy - Plot B3
                        </p>
                        <p className="text-xs text-gray-500">
                          Verification failed
                        </p>
                      </div>
                    </div>
                    <Badge variant="danger">45%</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">
                Detailed Verification Report
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Verification Issue Detected
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        The Certificate of Occupancy for Plot B3 has
                        inconsistencies with government records.
                      </p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Plot coordinates do not match survey plan</li>
                        <li>Signature verification failed</li>
                        <li>Document appears to be altered</li>
                      </ul>
                    </div>
                    <div className="mt-3">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white shadow-soft sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Certificate of Occupancy - Plot A12
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Verification score: 98%
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Plot Number
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        A12
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Owner Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        Oluwaseun Adeyemi
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Document Date
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        15/03/2023
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Coordinates
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        6.5244° N, 3.3792° E
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Verification Status
                      </dt>
                      <dd className="mt-1 sm:mt-0 sm:col-span-2">
                        <Badge variant="success">Verified</Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>}
    </div>;
};
export default DocumentUpload;