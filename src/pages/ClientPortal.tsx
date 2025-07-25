import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, FileTextIcon, MessageSquareIcon, CameraIcon, BellIcon, CheckIcon, XIcon } from 'lucide-react';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
const ClientPortal = () => {
  // Mock client data
  const clientData = {
    name: 'Oluwaseun Adeyemi',
    plotNumber: 'A12',
    estateName: 'Green Valley Estate',
    allocationDate: '15/03/2023',
    verificationStatus: 'verified',
    paymentStatus: 'complete',
    constructionProgress: 65,
    nextMilestone: 'Roofing',
    nextMilestoneDate: '01/09/2023'
  };
  // Mock timeline data
  const timeline = [{
    id: 1,
    date: '15/03/2023',
    title: 'Plot Allocation',
    description: 'Plot A12 allocated and payment confirmed',
    status: 'complete'
  }, {
    id: 2,
    date: '22/03/2023',
    title: 'Document Verification',
    description: 'C of O and survey plan verified',
    status: 'complete'
  }, {
    id: 3,
    date: '10/04/2023',
    title: 'Foundation Completed',
    description: 'Foundation laid and cured',
    status: 'complete',
    hasMedia: true
  }, {
    id: 4,
    date: '05/06/2023',
    title: 'Walls Constructed',
    description: 'External and internal walls completed',
    status: 'complete',
    hasMedia: true
  }, {
    id: 5,
    date: '01/09/2023',
    title: 'Roofing',
    description: 'Roof trusses and covering installation',
    status: 'pending'
  }, {
    id: 6,
    date: '15/11/2023',
    title: 'Finishing',
    description: 'Painting, fixtures, and final touches',
    status: 'pending'
  }, {
    id: 7,
    date: '01/01/2024',
    title: 'Handover',
    description: 'Final inspection and key handover',
    status: 'pending'
  }];
  // Mock notifications
  const notifications = [{
    id: 1,
    title: 'New construction photos added',
    time: '2 hours ago'
  }, {
    id: 2,
    title: 'Milestone completed: Walls Construction',
    time: '3 days ago'
  }, {
    id: 3,
    title: 'Message from Estate Manager',
    time: '1 week ago'
  }];
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Client Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {clientData.name}
        </h1>
        <p className="text-gray-600 mt-1">
          Plot {clientData.plotNumber} • {clientData.estateName}
        </p>
      </div>
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Allocation Status */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-primary-100">
                <FileTextIcon className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Document Status</p>
                <div className="flex items-center mt-1">
                  {clientData.verificationStatus === 'verified' ? <>
                      <Badge variant="success">Verified</Badge>
                      <CheckIcon className="h-4 w-4 text-green-500 ml-1" />
                    </> : <>
                      <Badge variant="warning">Pending</Badge>
                      <XIcon className="h-4 w-4 text-yellow-500 ml-1" />
                    </>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Payment Status */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-accent-100">
                <CalendarIcon className="h-5 w-5 text-accent-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Next Milestone</p>
                <div className="flex items-center mt-1">
                  <p className="font-medium text-gray-900">
                    {clientData.nextMilestone}
                  </p>
                  <span className="text-xs text-gray-500 ml-2">
                    {clientData.nextMilestoneDate}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Construction Progress */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full bg-secondary-100">
                <CameraIcon className="h-5 w-5 text-secondary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Construction Progress</p>
                <p className="font-medium text-gray-900">
                  {clientData.constructionProgress}% Complete
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-secondary-500 h-2.5 rounded-full" style={{
              width: `${clientData.constructionProgress}%`
            }}></div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Construction Timeline and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Construction Timeline */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="font-medium text-gray-900">
                Construction Timeline
              </h2>
              <Link to="/progress">
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <ol className="relative border-l border-gray-200">
                {timeline.map(item => <li key={item.id} className="mb-6 ml-4 last:mb-0">
                    <div className="absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white 
                      ${item.status === 'complete' ? 'bg-green-500' : 'bg-gray-300'}">
                      {item.status === 'complete' && <div className="bg-green-500 h-3 w-3 rounded-full"></div>}
                      {item.status === 'pending' && <div className="bg-gray-300 h-3 w-3 rounded-full"></div>}
                    </div>
                    <time className="mb-1 text-xs font-normal leading-none text-gray-500">
                      {item.date}
                    </time>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center">
                      {item.title}
                      {item.hasMedia && <span className="ml-2 text-xs text-blue-600 flex items-center">
                          <CameraIcon className="h-3 w-3 mr-1" />
                          Photos
                        </span>}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                    {item.hasMedia && <div className="mt-2 flex space-x-2 overflow-x-auto pb-1">
                        <img src={`https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80`} alt={`${item.title} progress`} className="h-16 w-16 object-cover rounded-md" />
                        <img src={`https://images.unsplash.com/photo-1585545335512-2e73bf1fc5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80`} alt={`${item.title} progress`} className="h-16 w-16 object-cover rounded-md" />
                      </div>}
                  </li>)}
              </ol>
            </CardContent>
          </Card>
        </div>
        {/* Notifications and Chat */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-gray-900">Notifications</h2>
                <Badge variant="primary">{notifications.length}</Badge>
              </div>
            </CardHeader>
            <div className="divide-y divide-gray-200">
              {notifications.map(notification => <div key={notification.id} className="px-4 py-3 flex items-start">
                  <BellIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>)}
            </div>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">
                Contact Estate Manager
              </h2>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary-700">
                      EM
                    </span>
                  </div>
                  <div className="ml-3 bg-white rounded-lg p-3 shadow-soft">
                    <p className="text-sm text-gray-800">
                      Hello! How can I help you with your plot today?
                    </p>
                    <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center border rounded-lg">
                <input type="text" placeholder="Type your message..." className="flex-grow px-4 py-2 bg-transparent text-sm focus:outline-none" />
                <Button variant="primary" size="sm" className="m-1">
                  <MessageSquareIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Offline Mode Indicator */}
      <div className="fixed bottom-20 md:bottom-4 right-4 bg-white shadow-medium rounded-full px-4 py-2 flex items-center">
        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
        <span className="text-sm font-medium text-gray-700">Online</span>
      </div>
    </div>;
};
export default ClientPortal;