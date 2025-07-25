import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, CameraIcon, FileTextIcon, PlayCircleIcon, CheckCircleIcon } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import NigerianPatterns from '../components/ui/NigerianPatterns';
const ProgressTracker = () => {
  const [selectedStage, setSelectedStage] = useState(2);
  const [showModel, setShowModel] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  useEffect(() => {
    // Simulate 3D model loading
    if (showModel) {
      const timer = setTimeout(() => {
        setIsModelLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showModel]);
  // Mock construction stages
  const constructionStages = [{
    id: 0,
    name: 'Land Clearing',
    date: '01/03/2023',
    complete: true,
    progress: 100,
    description: 'Clearing land and preparing the site for construction.',
    photos: ['https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1591955506264-3f5a6834570a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'],
    modelUrl: 'https://example.com/models/land-clearing.glb'
  }, {
    id: 1,
    name: 'Foundation',
    date: '10/04/2023',
    complete: true,
    progress: 100,
    description: 'Laying the foundation and setting the structural base of the building.',
    photos: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1585545335512-2e73bf1fc5c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'],
    modelUrl: 'https://example.com/models/foundation.glb'
  }, {
    id: 2,
    name: 'Wall Construction',
    date: '05/06/2023',
    complete: true,
    progress: 100,
    description: 'Building external and internal walls, including windows and door frames.',
    photos: ['https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'],
    modelUrl: 'https://example.com/models/walls.glb',
    panoramaUrl: 'https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }, {
    id: 3,
    name: 'Roofing',
    date: '01/09/2023',
    complete: false,
    progress: 30,
    description: 'Installing roof trusses and covering, including waterproofing.',
    photos: ['https://images.unsplash.com/photo-1598250893367-6c3dd566be68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'],
    modelUrl: 'https://example.com/models/roofing.glb'
  }, {
    id: 4,
    name: 'Plumbing & Electrical',
    date: '15/10/2023',
    complete: false,
    progress: 0,
    description: 'Installing all plumbing fixtures, electrical wiring, and outlets.',
    photos: [],
    modelUrl: 'https://example.com/models/plumbing.glb'
  }, {
    id: 5,
    name: 'Finishing',
    date: '15/11/2023',
    complete: false,
    progress: 0,
    description: 'Painting, flooring, fixtures, and final touches.',
    photos: [],
    modelUrl: 'https://example.com/models/finishing.glb'
  }, {
    id: 6,
    name: 'Handover',
    date: '01/01/2024',
    complete: false,
    progress: 0,
    description: 'Final inspection and key handover to client.',
    photos: [],
    modelUrl: 'https://example.com/models/final.glb'
  }];
  const currentStage = constructionStages[selectedStage];
  const handlePreviousStage = () => {
    if (selectedStage > 0) {
      setSelectedStage(selectedStage - 1);
      setShowModel(false);
      setIsModelLoaded(false);
    }
  };
  const handleNextStage = () => {
    if (selectedStage < constructionStages.length - 1) {
      setSelectedStage(selectedStage + 1);
      setShowModel(false);
      setIsModelLoaded(false);
    }
  };
  const toggleModel = () => {
    setShowModel(!showModel);
    if (!showModel) {
      setIsModelLoaded(false);
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Nigerian Pattern Background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-5 h-64 overflow-hidden">
        <NigerianPatterns variant="adire" className="w-full h-full text-primary-500" />
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Construction Progress
          </h1>
          <p className="text-gray-600 mt-1">Plot A12 • Green Valley Estate</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Link to="/map">
            <Button variant="outline" size="sm">
              View on Map
            </Button>
          </Link>
          <Button variant="primary" size="sm" icon={<PlayCircleIcon className="h-4 w-4" />} onClick={toggleModel}>
            {showModel ? 'Hide 3D View' : '3D View'}
          </Button>
        </div>
      </div>
      {/* 3D Model Viewer (when active) */}
      {showModel && <Card className="mb-6 overflow-hidden">
          <CardHeader className="flex justify-between items-center">
            <h2 className="font-medium text-gray-900">3D Construction View</h2>
            <Badge variant="primary">Interactive</Badge>
          </CardHeader>
          <div className="relative bg-gray-100 h-96">
            {!isModelLoaded ? <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading 3D model...</p>
              </div> : <>
                {/* This would be replaced with a real 3D viewer component */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="360 Panorama View" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 text-white px-4 py-2 rounded-lg">
                      <p className="text-center">360° Panoramic View</p>
                      <p className="text-xs text-center mt-1">
                        Click and drag to look around
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <Button variant="outline" size="sm" className="bg-white/80">
                    <div className="h-4 w-4 mr-2" />
                    Switch View
                  </Button>
                  <Button variant="primary" size="sm">
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Take Measurement
                  </Button>
                </div>
              </>}
          </div>
        </Card>}
      {/* Progress Timeline */}
      <div className="relative mb-8">
        <div className="h-1 w-full bg-gray-200 rounded-full">
          <div className="h-1 bg-primary-500 rounded-full" style={{
          width: `${Math.round(constructionStages.filter(stage => stage.complete).length / constructionStages.length * 100)}%`
        }}></div>
        </div>
        <div className="flex justify-between mt-2">
          {constructionStages.map((stage, index) => <button key={stage.id} className={`flex flex-col items-center relative -ml-3 first:ml-0 last:mr-0 ${selectedStage === index ? 'text-primary-600' : stage.complete ? 'text-green-600' : 'text-gray-400'}`} onClick={() => setSelectedStage(index)}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${selectedStage === index ? 'bg-primary-100 border-2 border-primary-500' : stage.complete ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100 border-2 border-gray-300'}`}>
                {stage.complete && <div className="h-2 w-2 rounded-full bg-green-500"></div>}
                {selectedStage === index && !stage.complete && <div className="h-2 w-2 rounded-full bg-primary-500"></div>}
              </div>
              <span className="text-xs mt-1 hidden md:block">{stage.name}</span>
            </button>)}
        </div>
      </div>
      {/* Selected Stage Details */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="font-medium text-gray-900">{currentStage.name}</h2>
            {currentStage.complete ? <Badge variant="success" className="ml-2">
                Completed
              </Badge> : <Badge variant="warning" className="ml-2">
                In Progress
              </Badge>}
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">{currentStage.date}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{currentStage.description}</p>
          {!currentStage.complete && currentStage.progress > 0 && <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{currentStage.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary-500 h-2.5 rounded-full" style={{
              width: `${currentStage.progress}%`
            }}></div>
              </div>
            </div>}
          {/* Enhanced Photo Gallery */}
          {currentStage.photos.length > 0 ? <div>
              <div className="flex items-center mb-2">
                <CameraIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">
                  Photos
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStage.photos.map((photo, index) => <div key={index} className="rounded-md overflow-hidden shadow-medium relative group">
                    <img src={photo} alt={`${currentStage.name} progress ${index + 1}`} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div className="p-3 w-full">
                        <p className="text-white text-sm">
                          {currentStage.name} - Photo {index + 1}
                        </p>
                        <p className="text-white/80 text-xs">
                          Taken on {currentStage.date}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
              {/* Compare Progress Button */}
              {currentStage.id > 0 && <div className="mt-4 flex justify-center">
                  <Button variant="outline" size="sm" icon={<CameraIcon className="h-4 w-4" />}>
                    Compare with Previous Stage
                  </Button>
                </div>}
            </div> : <div className="text-center py-8 bg-gray-50 rounded-md">
              <CameraIcon className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">
                No photos available yet
              </p>
            </div>}
        </CardContent>
      </Card>
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousStage} disabled={selectedStage === 0} icon={<ChevronLeftIcon className="h-4 w-4" />}>
          Previous Stage
        </Button>
        <Button variant="outline" onClick={handleNextStage} disabled={selectedStage === constructionStages.length - 1}>
          Next Stage
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
      {/* Documents Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Related Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center p-4">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FileTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Building Approval
              </h3>
              <p className="text-xs text-gray-500">PDF • Uploaded 15/03/2023</p>
            </div>
          </Card>
          <Card className="flex items-center p-4">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FileTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Structural Plans
              </h3>
              <p className="text-xs text-gray-500">PDF • Uploaded 20/03/2023</p>
            </div>
          </Card>
          <Card className="flex items-center p-4">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <FileTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Survey Plan</h3>
              <p className="text-xs text-gray-500">PDF • Uploaded 10/03/2023</p>
            </div>
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
export default ProgressTracker;