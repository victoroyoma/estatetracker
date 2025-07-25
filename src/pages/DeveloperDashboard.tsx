import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, AlertTriangleIcon, UploadIcon, BarChart3Icon, UsersIcon, TrendingUpIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import NigerianPatterns from '../components/ui/NigerianPatterns';
const DeveloperDashboard = () => {
  // Mock data for estates
  const estates = [{
    id: 1,
    name: 'Green Valley Estate',
    location: 'Lekki, Lagos',
    totalPlots: 120,
    allocatedPlots: 87,
    progress: 72,
    clients: 65,
    disputes: 2,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    id: 2,
    name: 'Sunshine Gardens',
    location: 'Abuja, FCT',
    totalPlots: 85,
    allocatedPlots: 42,
    progress: 49,
    clients: 38,
    disputes: 0,
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }];
  // Mock data for alerts
  const alerts = [{
    id: 1,
    type: 'warning',
    message: 'Duplicate plot detected in Green Valley Estate',
    time: '2 hours ago'
  }, {
    id: 2,
    type: 'info',
    message: 'New client registration for Sunshine Gardens',
    time: '1 day ago'
  }, {
    id: 3,
    type: 'danger',
    message: 'Document verification failed for Plot A12',
    time: '2 days ago'
  }];
  // Chart data for analytics
  const plotStatusData = [{
    name: 'Green Valley',
    developed: 45,
    construction: 42,
    undeveloped: 33
  }, {
    name: 'Sunshine Gardens',
    developed: 20,
    construction: 22,
    undeveloped: 43
  }];
  const documentStatusData = [{
    name: 'Verified',
    value: 65
  }, {
    name: 'Pending',
    value: 15
  }, {
    name: 'Rejected',
    value: 7
  }];
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];
  const progressData = [{
    month: 'Jan',
    progress: 10
  }, {
    month: 'Feb',
    progress: 15
  }, {
    month: 'Mar',
    progress: 25
  }, {
    month: 'Apr',
    progress: 32
  }, {
    month: 'May',
    progress: 40
  }, {
    month: 'Jun',
    progress: 48
  }, {
    month: 'Jul',
    progress: 60
  }];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Nigerian Pattern Background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-5 h-64 overflow-hidden">
        <NigerianPatterns variant="geometric" className="w-full h-full text-primary-500" />
      </div>

      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Developer Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your estates and client allocations
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="primary" icon={<PlusIcon className="h-4 w-4" />}>
            Add New Estate
          </Button>
        </div>
      </div>

      {/* Subscription Status */}
      <Card className="mb-8">
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-medium text-gray-900">
              Basic Plan: ₦5,000/month
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              2 estates active • Next billing date: 15/08/2023
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Badge variant="success">Active</Badge>
            <Button variant="outline" size="sm">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary-100">
                <BarChart3Icon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Plots</p>
                <p className="text-xl font-bold text-gray-900">205</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-secondary-100">
                <UsersIcon className="h-5 w-5 text-secondary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-xl font-bold text-gray-900">103</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-accent-100">
                <UploadIcon className="h-5 w-5 text-accent-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-xl font-bold text-gray-900">87</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Disputes</p>
                <p className="text-xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Analytics Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <h3 className="font-medium text-gray-900">
                Plot Status by Estate
              </h3>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plotStatusData} margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="developed" fill="#10B981" name="Developed" />
                    <Bar dataKey="construction" fill="#F59E0B" name="Under Construction" />
                    <Bar dataKey="undeveloped" fill="#9CA3AF" name="Undeveloped" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="font-medium text-gray-900">
                Document Verification
              </h3>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={documentStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                    name,
                    percent
                  }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {documentStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Verified</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Rejected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-900">
                Construction Progress Trend
              </h3>
              <Badge variant="primary">
                <div className="flex items-center">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  <span>+12% this month</span>
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#0E6D31" activeDot={{
                  r: 8
                }} name="Overall Progress (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estates */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Estates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {estates.map(estate => <Card key={estate.id} className="overflow-hidden">
            <div className="relative h-40">
              <img src={estate.image} alt={estate.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">{estate.name}</h3>
                  <p className="text-sm">{estate.location}</p>
                </div>
              </div>
            </div>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Plots</p>
                  <p className="font-medium">
                    {estate.allocatedPlots} / {estate.totalPlots}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clients</p>
                  <p className="font-medium">{estate.clients}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="font-medium">{estate.progress}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disputes</p>
                  <p className="font-medium">{estate.disputes}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{
              width: `${estate.progress}%`
            }}></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/map?estate=${estate.id}`}>
                <Button variant="outline" size="sm">
                  View Map
                </Button>
              </Link>
              <Link to={`/progress?estate=${estate.id}`}>
                <Button variant="primary" size="sm">
                  Track Progress
                </Button>
              </Link>
            </CardFooter>
          </Card>)}
        {/* Add New Estate Card */}
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center h-full py-12">
            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <PlusIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Add New Estate
            </h3>
            <p className="text-sm text-gray-600 text-center mt-2 mb-4">
              Create a new estate to manage plots and construction
            </p>
            <Button variant="outline">Get Started</Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Document Upload */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">Recent Alerts</h2>
            </CardHeader>
            <div className="divide-y divide-gray-200">
              {alerts.map(alert => <div key={alert.id} className="px-4 py-3">
                  <div className="flex">
                    {alert.type === 'warning' && <AlertTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />}
                    {alert.type === 'danger' && <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />}
                    {alert.type === 'info' && <AlertTriangleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />}
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                </div>)}
            </div>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Alerts
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Quick Upload */}
        <div>
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">Upload Documents</h2>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                <UploadIcon className="h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 text-center">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Support for C of O, survey plans, and receipts
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Select Files
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Documents
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Enhanced Offline Mode Indicator */}
      <div className="fixed bottom-20 md:bottom-4 right-4 bg-white shadow-medium rounded-full px-4 py-2 flex items-center">
        <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">Online</span>
        <Button variant="ghost" size="sm" className="ml-2 p-0 h-6 w-6 rounded-full" onClick={() => alert('Offline mode enabled. App will sync when connection is restored.')}>
          <CheckCircleIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    </div>;
};
export default DeveloperDashboard;