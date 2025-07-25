import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Box, RotateCcw, ZoomIn, ZoomOut, Move3D, Sun, Moon, Eye, Camera, Download, Share2, Settings, Layers } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Property3DData {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'mixed';
  floors: Floor[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  materials: Material[];
  coordinates: [number, number];
  constructionStatus: number; // 0-100%
}

interface Floor {
  id: string;
  level: number;
  name: string;
  rooms: Room[];
  area: number;
  ceiling_height: number;
}

interface Room {
  id: string;
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'office' | 'storage';
  area: number;
  dimensions: {
    length: number;
    width: number;
  };
  position: {
    x: number;
    y: number;
  };
  features: string[];
}

interface Material {
  id: string;
  name: string;
  type: 'wall' | 'floor' | 'roof' | 'window' | 'door';
  color: string;
  texture: string;
  cost_per_unit: number;
  sustainability_rating: number;
}

interface ViewerSettings {
  lighting: 'day' | 'night' | 'auto';
  shadows: boolean;
  wireframe: boolean;
  transparency: number;
  showDimensions: boolean;
  showMaterials: boolean;
  quality: 'low' | 'medium' | 'high';
  autoRotate: boolean;
}

const Property3DViewer: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property3DData | null>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [viewerSettings, setViewerSettings] = useState<ViewerSettings>({
    lighting: 'day',
    shadows: true,
    wireframe: false,
    transparency: 0,
    showDimensions: true,
    showMaterials: true,
    quality: 'medium',
    autoRotate: false
  });
  const [isVRMode, setIsVRMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 10 });
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSampleProperty();
  }, []);

  const loadSampleProperty = () => {
    // Sample 3D property data
    const sampleProperty: Property3DData = {
      id: 'prop-001',
      name: 'Modern Villa - Plot 45',
      type: 'residential',
      dimensions: {
        length: 20,
        width: 15,
        height: 8
      },
      coordinates: [6.5244, 3.3792], // Lagos coordinates
      constructionStatus: 75,
      floors: [
        {
          id: 'floor-0',
          level: 0,
          name: 'Ground Floor',
          area: 300,
          ceiling_height: 3.5,
          rooms: [
            {
              id: 'room-1',
              name: 'Living Room',
              type: 'living',
              area: 45,
              dimensions: { length: 7, width: 6.5 },
              position: { x: 0, y: 0 },
              features: ['fireplace', 'large_windows', 'hardwood_floor']
            },
            {
              id: 'room-2',
              name: 'Kitchen',
              type: 'kitchen',
              area: 20,
              dimensions: { length: 5, width: 4 },
              position: { x: 7, y: 0 },
              features: ['island', 'granite_counters', 'modern_appliances']
            },
            {
              id: 'room-3',
              name: 'Guest Bathroom',
              type: 'bathroom',
              area: 6,
              dimensions: { length: 3, width: 2 },
              position: { x: 12, y: 0 },
              features: ['modern_fixtures', 'tiled_walls']
            }
          ]
        },
        {
          id: 'floor-1',
          level: 1,
          name: 'First Floor',
          area: 280,
          ceiling_height: 3.2,
          rooms: [
            {
              id: 'room-4',
              name: 'Master Bedroom',
              type: 'bedroom',
              area: 35,
              dimensions: { length: 7, width: 5 },
              position: { x: 0, y: 0 },
              features: ['walk_in_closet', 'balcony', 'en_suite']
            },
            {
              id: 'room-5',
              name: 'Bedroom 2',
              type: 'bedroom',
              area: 25,
              dimensions: { length: 5, width: 5 },
              position: { x: 7, y: 0 },
              features: ['built_in_wardrobe', 'study_area']
            },
            {
              id: 'room-6',
              name: 'Main Bathroom',
              type: 'bathroom',
              area: 12,
              dimensions: { length: 4, width: 3 },
              position: { x: 12, y: 0 },
              features: ['bathtub', 'separate_shower', 'double_vanity']
            }
          ]
        }
      ],
      materials: [
        {
          id: 'mat-1',
          name: 'Concrete Block',
          type: 'wall',
          color: '#D3D3D3',
          texture: 'concrete',
          cost_per_unit: 450,
          sustainability_rating: 7
        },
        {
          id: 'mat-2',
          name: 'Ceramic Tiles',
          type: 'floor',
          color: '#F5F5DC',
          texture: 'ceramic',
          cost_per_unit: 3500,
          sustainability_rating: 8
        },
        {
          id: 'mat-3',
          name: 'Aluminum Roofing',
          type: 'roof',
          color: '#C0C0C0',
          texture: 'metal',
          cost_per_unit: 2800,
          sustainability_rating: 9
        }
      ]
    };

    setSelectedProperty(sampleProperty);
  };

  const render3DViewer = () => {
    if (!selectedProperty) return null;

    // This would integrate with Three.js or Babylon.js in a real implementation
    // For now, we'll create a mock 3D representation
    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg overflow-hidden">
        {/* Mock 3D Scene */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform perspective-1000">
            {/* Building Structure */}
            <div 
              className={`relative transform transition-all duration-1000 ${
                viewerSettings.autoRotate ? 'animate-spin' : ''
              }`}
              style={{
                transform: `rotateX(${cameraPosition.x}deg) rotateY(${cameraPosition.y}deg) scale(${cameraPosition.z / 10})`
              }}
            >
              {/* Ground Floor */}
              <div className="relative">
                <div 
                  className={`w-32 h-24 border-2 border-gray-600 ${
                    viewerSettings.wireframe ? 'bg-transparent' : 'bg-blue-200'
                  } ${viewerSettings.transparency > 0 ? 'opacity-75' : ''}`}
                  style={{ 
                    boxShadow: viewerSettings.shadows ? '4px 4px 8px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {/* Room divisions */}
                  <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                    {selectedProperty.floors[currentFloor]?.rooms.map((room) => (
                      <div
                        key={room.id}
                        className={`border border-gray-400 rounded text-xs flex items-center justify-center cursor-pointer transition-colors ${
                          selectedRoom?.id === room.id ? 'bg-yellow-300' : 'bg-white bg-opacity-50'
                        }`}
                        onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                      >
                        {room.name.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* First Floor (if exists) */}
                {selectedProperty.floors.length > 1 && (
                  <div 
                    className={`absolute -top-6 left-1 w-30 h-22 border-2 border-gray-600 ${
                      viewerSettings.wireframe ? 'bg-transparent' : 'bg-green-200'
                    } ${viewerSettings.transparency > 0 ? 'opacity-75' : ''}`}
                    style={{ 
                      boxShadow: viewerSettings.shadows ? '3px 3px 6px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1">
                      {selectedProperty.floors[1]?.rooms.map((room) => (
                        <div
                          key={room.id}
                          className={`border border-gray-400 rounded text-xs flex items-center justify-center cursor-pointer transition-colors ${
                            selectedRoom?.id === room.id ? 'bg-yellow-300' : 'bg-white bg-opacity-50'
                          }`}
                          onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                        >
                          {room.name.slice(0, 3)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Roof */}
                <div 
                  className={`absolute -top-8 -left-1 w-34 h-26 border-2 border-gray-700 ${
                    viewerSettings.wireframe ? 'bg-transparent' : 'bg-red-300'
                  } transform -skew-x-12 ${viewerSettings.transparency > 0 ? 'opacity-75' : ''}`}
                  style={{ 
                    boxShadow: viewerSettings.shadows ? '2px 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lighting indicator */}
        <div className="absolute top-4 right-4">
          {viewerSettings.lighting === 'day' ? (
            <Sun className="h-8 w-8 text-yellow-500" />
          ) : viewerSettings.lighting === 'night' ? (
            <Moon className="h-8 w-8 text-blue-300" />
          ) : (
            <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full" />
          )}
        </div>

        {/* Construction progress overlay */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
          Construction: {selectedProperty.constructionStatus}%
        </div>

        {/* Dimensions overlay */}
        {viewerSettings.showDimensions && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
            {selectedProperty.dimensions.length}m × {selectedProperty.dimensions.width}m × {selectedProperty.dimensions.height}m
          </div>
        )}
      </div>
    );
  };

  const handleCameraControl = (action: string) => {
    setCameraPosition(prev => {
      switch (action) {
        case 'rotate-left':
          return { ...prev, y: prev.y - 15 };
        case 'rotate-right':
          return { ...prev, y: prev.y + 15 };
        case 'rotate-up':
          return { ...prev, x: prev.x - 15 };
        case 'rotate-down':
          return { ...prev, x: prev.x + 15 };
        case 'zoom-in':
          return { ...prev, z: Math.min(prev.z + 2, 20) };
        case 'zoom-out':
          return { ...prev, z: Math.max(prev.z - 2, 5) };
        case 'reset':
          return { x: 0, y: 0, z: 10 };
        default:
          return prev;
      }
    });
  };

  const exportModel = async (format: 'glb' | 'obj' | 'fbx') => {
    setLoading(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Exporting model as ${format.toUpperCase()}`);
    setLoading(false);
  };

  const toggleSetting = (setting: keyof ViewerSettings) => {
    setViewerSettings(prev => ({
      ...prev,
      [setting]: typeof prev[setting] === 'boolean' ? !prev[setting] : prev[setting]
    }));
  };

  if (!selectedProperty) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading 3D property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Box className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">3D Property Viewer</h2>
            <p className="text-gray-600">Interactive 3D visualization and virtual tours</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsVRMode(!isVRMode)}
            variant={isVRMode ? 'primary' : 'outline'}
            icon={<Eye className="h-4 w-4" />}
          >
            {isVRMode ? 'Exit VR' : 'VR Mode'}
          </Button>
          
          <Button
            onClick={() => exportModel('glb')}
            loading={loading}
            variant="outline"
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Main 3D Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{selectedProperty.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge className={`${
                    selectedProperty.type === 'residential' ? 'bg-blue-100 text-blue-800' :
                    selectedProperty.type === 'commercial' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedProperty.type}
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {selectedProperty.constructionStatus}% Complete
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
                {render3DViewer()}
              </Suspense>
              
              {/* Camera Controls */}
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('rotate-left')}
                  icon={<RotateCcw className="h-4 w-4" />}
                >
                  ↺
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('rotate-up')}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('zoom-in')}
                  icon={<ZoomIn className="h-4 w-4" />}
                >
                  +
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('reset')}
                  icon={<Move3D className="h-4 w-4" />}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('zoom-out')}
                  icon={<ZoomOut className="h-4 w-4" />}
                >
                  -
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('rotate-down')}
                >
                  ↓
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCameraControl('rotate-right')}
                  icon={<RotateCcw className="h-4 w-4 transform scale-x-[-1]" />}
                >
                  ↻
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          {/* Floor Navigation */}
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Floor Navigation</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedProperty.floors.map((floor, idx) => (
                  <button
                    key={floor.id}
                    onClick={() => setCurrentFloor(idx)}
                    className={`w-full text-left p-2 rounded border ${
                      currentFloor === idx ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{floor.name}</div>
                    <div className="text-sm text-gray-600">{floor.area}m² • {floor.rooms.length} rooms</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Viewer Settings */}
          <Card>
            <CardHeader>
              <h4 className="font-semibold flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Viewer Settings
              </h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lighting</span>
                  <select
                    value={viewerSettings.lighting}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, lighting: e.target.value as any }))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quality</span>
                  <select
                    value={viewerSettings.quality}
                    onChange={(e) => setViewerSettings(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                {[
                  { key: 'shadows', label: 'Shadows' },
                  { key: 'wireframe', label: 'Wireframe' },
                  { key: 'showDimensions', label: 'Dimensions' },
                  { key: 'showMaterials', label: 'Materials' },
                  { key: 'autoRotate', label: 'Auto Rotate' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{label}</span>
                    <button
                      onClick={() => toggleSetting(key as keyof ViewerSettings)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        viewerSettings[key as keyof ViewerSettings] 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                        viewerSettings[key as keyof ViewerSettings] 
                          ? 'transform translate-x-4' 
                          : 'transform translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Details */}
          {selectedRoom && (
            <Card>
              <CardHeader>
                <h4 className="font-semibold">Room Details</h4>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h5 className="font-medium">{selectedRoom.name}</h5>
                  <p className="text-sm text-gray-600">Type: {selectedRoom.type}</p>
                  <p className="text-sm text-gray-600">Area: {selectedRoom.area}m²</p>
                  <p className="text-sm text-gray-600">
                    Dimensions: {selectedRoom.dimensions.length}m × {selectedRoom.dimensions.width}m
                  </p>
                  
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRoom.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {feature.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          <Card>
            <CardHeader>
              <h4 className="font-semibold">Export & Share</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportModel('glb')}
                  loading={loading}
                  icon={<Download className="h-4 w-4" />}
                  className="w-full"
                >
                  Export GLB
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportModel('obj')}
                  loading={loading}
                  icon={<Download className="h-4 w-4" />}
                  className="w-full"
                >
                  Export OBJ
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Camera className="h-4 w-4" />}
                  className="w-full"
                >
                  Screenshot
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Share2 className="h-4 w-4" />}
                  className="w-full"
                >
                  Share Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Materials & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Materials Used
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedProperty.materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: material.color }}
                    />
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-600">{material.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{material.cost_per_unit.toLocaleString()}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Sustainability: {material.sustainability_rating}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Property Statistics</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {selectedProperty.floors.reduce((acc, floor) => acc + floor.area, 0)}m²
                </p>
                <p className="text-sm text-gray-600">Total Area</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {selectedProperty.floors.reduce((acc, floor) => acc + floor.rooms.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Rooms</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-purple-600">
                  {selectedProperty.floors.length}
                </p>
                <p className="text-sm text-gray-600">Floors</p>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold text-orange-600">
                  {selectedProperty.constructionStatus}%
                </p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Property3DViewer;
