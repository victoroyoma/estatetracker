import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Maximize, 
  RotateCcw, 
  Move3d, 
  Home, 
  Layers, 
  Settings, 
  Download,
  Share,
  VolumeX,
  Volume2,
  Play,
  Pause,
  Info
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LoadingSpinner } from '../ui/Loading';

interface VRScene {
  id: string;
  name: string;
  type: '360_photo' | '3d_model' | 'drone_footage' | 'construction_timelapse';
  url: string;
  thumbnail: string;
  description: string;
  capturedAt: Date;
  plotId?: string;
  estateId?: string;
  metadata: {
    duration?: number;
    resolution?: string;
    fileSize?: number;
    coordinates?: [number, number];
  };
}

interface Plot3D {
  id: string;
  number: string;
  bounds: Array<[number, number]>;
  status: 'available' | 'allocated' | 'construction' | 'completed';
  price: number;
  size: number;
  owner?: string;
  constructionStage?: string;
  completionPercentage?: number;
}

interface VRViewerProps {
  estateId?: string;
  plotId?: string;
  mode?: 'viewer' | 'tour' | 'construction';
}

const VRPlotVisualization: React.FC<VRViewerProps> = ({ estateId, plotId, mode = 'viewer' }) => {
  const [scenes, setScenes] = useState<VRScene[]>([]);
  const [plots, setPlots] = useState<Plot3D[]>([]);
  const [selectedScene, setSelectedScene] = useState<VRScene | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot3D | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'vr' | '360' | '3d' | 'ar'>('3d');
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const viewerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock VR scenes data
  const mockScenes: VRScene[] = [
    {
      id: 'scene_1',
      name: 'Estate Overview - Aerial View',
      type: 'drone_footage',
      url: '/vr/aerial-overview.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300',
      description: 'Complete aerial view of Green Valley Estate showing all plots and infrastructure',
      capturedAt: new Date('2023-07-15'),
      estateId: 'estate_1',
      metadata: {
        duration: 120,
        resolution: '4K',
        fileSize: 250000000,
        coordinates: [6.5244, 3.3792]
      }
    },
    {
      id: 'scene_2',
      name: 'Plot A12 - 360° Ground View',
      type: '360_photo',
      url: '/vr/plot-a12-360.jpg',
      thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300',
      description: 'Interactive 360° view of Plot A12 showing current construction progress',
      capturedAt: new Date('2023-07-20'),
      plotId: 'plot_a12',
      estateId: 'estate_1',
      metadata: {
        resolution: '8K',
        fileSize: 15000000,
        coordinates: [6.5244, 3.3792]
      }
    },
    {
      id: 'scene_3',
      name: 'Construction Progress - Time-lapse',
      type: 'construction_timelapse',
      url: '/vr/construction-timelapse.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1541976590-713941681591?w=300',
      description: '3-month construction time-lapse showing foundation to roofing completion',
      capturedAt: new Date('2023-07-25'),
      plotId: 'plot_a12',
      estateId: 'estate_1',
      metadata: {
        duration: 45,
        resolution: '4K',
        fileSize: 120000000
      }
    },
    {
      id: 'scene_4',
      name: 'Interactive 3D Plot Model',
      type: '3d_model',
      url: '/vr/plot-3d-model.glb',
      thumbnail: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=300',
      description: 'Detailed 3D model of the completed house design for Plot A12',
      capturedAt: new Date('2023-07-28'),
      plotId: 'plot_a12',
      estateId: 'estate_1',
      metadata: {
        fileSize: 45000000,
        resolution: 'High Poly'
      }
    }
  ];

  const mockPlots: Plot3D[] = [
    {
      id: 'plot_a12',
      number: 'A12',
      bounds: [[6.5244, 3.3792], [6.5248, 3.3798]],
      status: 'construction',
      price: 5000000,
      size: 500,
      owner: 'Oluwaseun Adeyemi',
      constructionStage: 'Roofing',
      completionPercentage: 75
    },
    {
      id: 'plot_b5',
      number: 'B5',
      bounds: [[6.5250, 3.3800], [6.5254, 3.3806]],
      status: 'allocated',
      price: 4500000,
      size: 450,
      owner: 'Adebayo Johnson',
      constructionStage: 'Foundation',
      completionPercentage: 25
    },
    {
      id: 'plot_c3',
      number: 'C3',
      bounds: [[6.5240, 3.3785], [6.5244, 3.3791]],
      status: 'available',
      price: 4800000,
      size: 480
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setScenes(mockScenes);
      setPlots(mockPlots);
      setSelectedScene(mockScenes[0]);
      if (plotId) {
        const plot = mockPlots.find(p => p.id === plotId);
        setSelectedPlot(plot || null);
      }
      setLoading(false);
    }, 1500);
  }, [estateId, plotId]);

  const handleFullscreen = () => {
    if (!isFullscreen && viewerRef.current) {
      viewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getSceneIcon = (type: string) => {
    switch (type) {
      case 'drone_footage':
        return <Move3d className="h-4 w-4" />;
      case '360_photo':
        return <Eye className="h-4 w-4" />;
      case '3d_model':
        return <Layers className="h-4 w-4" />;
      case 'construction_timelapse':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'allocated':
        return 'warning';
      case 'construction':
        return 'primary';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading VR Experience...</p>
          <p className="text-sm text-gray-600">Preparing 3D models and scenes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">VR Plot Visualization</h1>
          <p className="text-gray-600 mt-1">Immersive 3D experience of your estate and plots</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="3d">3D View</option>
            <option value="vr">VR Mode</option>
            <option value="360">360° View</option>
            <option value="ar">AR Preview</option>
          </select>
          
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button variant="primary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Scene Selector */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Available Scenes</h3>
              <p className="text-sm text-gray-600">{scenes.length} VR experiences</p>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {scenes.map((scene) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedScene?.id === scene.id 
                      ? 'bg-primary-50 border-2 border-primary-200' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={scene.thumbnail}
                      alt={scene.name}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getSceneIcon(scene.type)}
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {scene.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {scene.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {scene.type.replace('_', ' ')}
                        </Badge>
                        {scene.metadata.duration && (
                          <span className="text-xs text-gray-500">
                            {scene.metadata.duration}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Plot Information */}
          {selectedPlot && (
            <Card className="mt-4">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Plot Details</h3>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Plot Number</p>
                  <p className="font-semibold text-gray-900">{selectedPlot.number}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={getStatusColor(selectedPlot.status)}>
                    {selectedPlot.status}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-semibold text-gray-900">{selectedPlot.size} sqm</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-semibold text-gray-900">₦{selectedPlot.price.toLocaleString()}</p>
                </div>
                
                {selectedPlot.owner && (
                  <div>
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-semibold text-gray-900">{selectedPlot.owner}</p>
                  </div>
                )}
                
                {selectedPlot.constructionStage && (
                  <div>
                    <p className="text-sm text-gray-600">Construction Stage</p>
                    <p className="font-semibold text-gray-900">{selectedPlot.constructionStage}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${selectedPlot.completionPercentage || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedPlot.completionPercentage}% Complete
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* VR Viewer */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div 
                ref={viewerRef}
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: '16/9' }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                {selectedScene ? (
                  <>
                    {/* Video/3D Content Area */}
                    {selectedScene.type === 'drone_footage' || selectedScene.type === 'construction_timelapse' ? (
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster={selectedScene.thumbnail}
                        controls={false}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      >
                        <source src={selectedScene.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : selectedScene.type === '360_photo' ? (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-xl font-semibold mb-2">360° Interactive View</p>
                          <p className="text-sm opacity-75">Drag to look around • Scroll to zoom</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Layers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-xl font-semibold mb-2">3D Model Viewer</p>
                          <p className="text-sm opacity-75">Interactive 3D experience</p>
                        </div>
                      </div>
                    )}

                    {/* VR Controls Overlay */}
                    {showControls && (
                      <>
                        {/* Top Controls */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                          <div className="bg-black/50 backdrop-blur rounded-lg px-3 py-2">
                            <p className="text-white font-medium text-sm">{selectedScene.name}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-black/50 backdrop-blur text-white hover:bg-black/70"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-black/50 backdrop-blur text-white hover:bg-black/70"
                              onClick={handleFullscreen}
                            >
                              <Maximize className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-black/50 backdrop-blur text-white hover:bg-black/70"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-black/50 backdrop-blur rounded-lg px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {(selectedScene.type === 'drone_footage' || selectedScene.type === 'construction_timelapse') && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-white hover:bg-white/20"
                                      onClick={handlePlayPause}
                                    >
                                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-white hover:bg-white/20"
                                      onClick={handleMute}
                                    >
                                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </Button>
                                  </>
                                )}
                                
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-white hover:bg-white/20"
                                  >
                                    <Move3d className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-white hover:bg-white/20"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-white hover:bg-white/20"
                                  >
                                    <Home className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="text-white text-sm">
                                <Badge variant="primary" className="bg-white/20 text-white">
                                  {viewMode.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* VR Mode Indicator */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="primary" className="bg-blue-600">
                        VR Ready • {selectedScene.metadata.resolution}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-600">Select a scene to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scene Details */}
          {selectedScene && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Captured</p>
                    <p className="font-medium text-gray-900">
                      {selectedScene.capturedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resolution</p>
                    <p className="font-medium text-gray-900">
                      {selectedScene.metadata.resolution || 'High Quality'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">File Size</p>
                    <p className="font-medium text-gray-900">
                      {selectedScene.metadata.fileSize ? 
                        `${(selectedScene.metadata.fileSize / 1000000).toFixed(1)} MB` : 
                        'Optimized'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900">{selectedScene.description}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VRPlotVisualization;
