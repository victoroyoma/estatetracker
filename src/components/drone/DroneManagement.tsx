import React, { useState, useEffect } from 'react';
import { 
  Plane,
  MapPin,
  Camera,
  Battery,
  Clock,
  Navigation,
  Wind,
  Eye,
  Download,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Radio,
  Thermometer,
  Cloud
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DroneUnit {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'idle' | 'charging' | 'maintenance' | 'emergency';
  batteryLevel: number;
  flightTime: number;
  maxFlightTime: number;
  currentMission?: DroneMission;
  lastMaintenance: Date;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  capabilities: string[];
  sensors: {
    camera: boolean;
    thermalCamera: boolean;
    lidar: boolean;
    gps: boolean;
    weatherStation: boolean;
  };
}

interface DroneMission {
  id: string;
  type: 'survey' | 'inspection' | 'monitoring' | 'mapping' | 'security';
  estate: string;
  startTime: Date;
  estimatedDuration: number;
  progress: number;
  waypoints: Array<{
    lat: number;
    lng: number;
    altitude: number;
    action: string;
  }>;
  status: 'pending' | 'active' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface DroneData {
  timestamp: Date;
  altitude: number;
  speed: number;
  batteryLevel: number;
  temperature: number;
  windSpeed: number;
  humidity: number;
}

interface SurveyResult {
  id: string;
  missionId: string;
  estate: string;
  type: 'photo' | 'video' | 'thermal' | '3d_model' | 'measurement';
  captureTime: Date;
  fileSize: number;
  coordinates: [number, number];
  metadata: {
    altitude: number;
    weather: string;
    quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

const DroneManagement: React.FC = () => {
  const [drones, setDrones] = useState<DroneUnit[]>([]);
  const [missions, setMissions] = useState<DroneMission[]>([]);
  const [telemetryData, setTelemetryData] = useState<DroneData[]>([]);
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
  const [selectedDrone, setSelectedDrone] = useState<string | null>(null);
  const [weatherConditions] = useState({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    visibility: 'excellent',
    flightStatus: 'optimal'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDroneData();
    simulateTelemetry();
  }, []);

  const loadDroneData = async () => {
    setLoading(true);
    
    // Simulate loading drone data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockDrones: DroneUnit[] = [
      {
        id: 'drone-001',
        name: 'SkyEye Alpha',
        model: 'DJI Matrice 300 RTK',
        status: 'active',
        batteryLevel: 85,
        flightTime: 25,
        maxFlightTime: 45,
        lastMaintenance: new Date('2024-01-15'),
        location: {
          latitude: 6.5244,
          longitude: 3.3792,
          altitude: 120
        },
        capabilities: ['4K Video', 'Thermal Imaging', 'RTK GPS', 'Obstacle Avoidance'],
        sensors: {
          camera: true,
          thermalCamera: true,
          lidar: false,
          gps: true,
          weatherStation: true
        },
        currentMission: {
          id: 'mission-001',
          type: 'survey',
          estate: 'Green Valley Estate',
          startTime: new Date(),
          estimatedDuration: 30,
          progress: 65,
          waypoints: [
            { lat: 6.5244, lng: 3.3792, altitude: 100, action: 'photo' },
            { lat: 6.5248, lng: 3.3794, altitude: 100, action: 'video' }
          ],
          status: 'active',
          priority: 'high'
        }
      },
      {
        id: 'drone-002',
        name: 'Guardian Beta',
        model: 'Autel EVO II Pro',
        status: 'idle',
        batteryLevel: 92,
        flightTime: 0,
        maxFlightTime: 40,
        lastMaintenance: new Date('2024-01-10'),
        location: {
          latitude: 6.5250,
          longitude: 3.3796,
          altitude: 0
        },
        capabilities: ['6K Video', 'Night Vision', 'Long Range'],
        sensors: {
          camera: true,
          thermalCamera: false,
          lidar: false,
          gps: true,
          weatherStation: false
        }
      },
      {
        id: 'drone-003',
        name: 'Mapper Gamma',
        model: 'SenseFly eBee X',
        status: 'charging',
        batteryLevel: 35,
        flightTime: 0,
        maxFlightTime: 90,
        lastMaintenance: new Date('2024-01-05'),
        location: {
          latitude: 6.5252,
          longitude: 3.3798,
          altitude: 0
        },
        capabilities: ['Photogrammetry', 'LiDAR', 'Fixed Wing', 'Long Endurance'],
        sensors: {
          camera: true,
          thermalCamera: false,
          lidar: true,
          gps: true,
          weatherStation: false
        }
      }
    ];

    const mockMissions: DroneMission[] = [
      {
        id: 'mission-001',
        type: 'survey',
        estate: 'Green Valley Estate',
        startTime: new Date(),
        estimatedDuration: 30,
        progress: 65,
        waypoints: [
          { lat: 6.5244, lng: 3.3792, altitude: 100, action: 'photo' },
          { lat: 6.5248, lng: 3.3794, altitude: 100, action: 'video' }
        ],
        status: 'active',
        priority: 'high'
      },
      {
        id: 'mission-002',
        type: 'inspection',
        estate: 'Sunset Gardens',
        startTime: new Date(Date.now() + 3600000),
        estimatedDuration: 45,
        progress: 0,
        waypoints: [
          { lat: 6.5250, lng: 3.3796, altitude: 80, action: 'thermal_scan' }
        ],
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'mission-003',
        type: 'monitoring',
        estate: 'Royal Heights',
        startTime: new Date(Date.now() - 1800000),
        estimatedDuration: 60,
        progress: 100,
        waypoints: [
          { lat: 6.5252, lng: 3.3798, altitude: 150, action: 'security_patrol' }
        ],
        status: 'completed',
        priority: 'low'
      }
    ];

    const mockSurveyResults: SurveyResult[] = [
      {
        id: 'result-001',
        missionId: 'mission-001',
        estate: 'Green Valley Estate',
        type: 'photo',
        captureTime: new Date(Date.now() - 300000),
        fileSize: 15.2,
        coordinates: [6.5244, 3.3792],
        metadata: {
          altitude: 100,
          weather: 'Clear',
          quality: 'excellent'
        }
      },
      {
        id: 'result-002',
        missionId: 'mission-003',
        estate: 'Royal Heights',
        type: '3d_model',
        captureTime: new Date(Date.now() - 900000),
        fileSize: 245.8,
        coordinates: [6.5252, 3.3798],
        metadata: {
          altitude: 150,
          weather: 'Partly Cloudy',
          quality: 'good'
        }
      }
    ];

    setDrones(mockDrones);
    setMissions(mockMissions);
    setSurveyResults(mockSurveyResults);
    setLoading(false);
  };

  const simulateTelemetry = () => {
    const generateTelemetryData = () => {
      const now = new Date();
      const data: DroneData[] = [];
      
      for (let i = 0; i < 20; i++) {
        data.push({
          timestamp: new Date(now.getTime() - (19 - i) * 60000),
          altitude: 80 + Math.random() * 40,
          speed: 5 + Math.random() * 10,
          batteryLevel: 95 - i * 2,
          temperature: 25 + Math.random() * 5,
          windSpeed: 8 + Math.random() * 8,
          humidity: 60 + Math.random() * 20
        });
      }
      
      setTelemetryData(data);
    };

    generateTelemetryData();
    const interval = setInterval(generateTelemetryData, 10000);
    return () => clearInterval(interval);
  };

  const getStatusIcon = (status: DroneUnit['status']) => {
    switch (status) {
      case 'active': return <Play className="h-5 w-5 text-green-500" />;
      case 'idle': return <Pause className="h-5 w-5 text-gray-500" />;
      case 'charging': return <Battery className="h-5 w-5 text-blue-500" />;
      case 'maintenance': return <RotateCcw className="h-5 w-5 text-yellow-500" />;
      case 'emergency': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: DroneUnit['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'charging': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMissionIcon = (type: DroneMission['type']) => {
    switch (type) {
      case 'survey': return <Camera className="h-5 w-5" />;
      case 'inspection': return <Eye className="h-5 w-5" />;
      case 'monitoring': return <Radio className="h-5 w-5" />;
      case 'mapping': return <MapPin className="h-5 w-5" />;
      case 'security': return <CheckCircle className="h-5 w-5" />;
      default: return <Navigation className="h-5 w-5" />;
    }
  };

  const startMission = (missionId: string) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, status: 'active', startTime: new Date() }
        : mission
    ));
  };

  const pauseMission = (missionId: string) => {
    setMissions(prev => prev.map(mission => 
      mission.id === missionId 
        ? { ...mission, status: 'pending' }
        : mission
    ));
  };

  const recallDrone = (droneId: string) => {
    setDrones(prev => prev.map(drone => 
      drone.id === droneId 
        ? { ...drone, status: 'idle', currentMission: undefined }
        : drone
    ));
  };

  const activeDrones = drones.filter(drone => drone.status === 'active').length;
  const totalFlightTime = drones.reduce((total, drone) => total + drone.flightTime, 0);
  const averageBattery = Math.round(
    drones.reduce((total, drone) => total + drone.batteryLevel, 0) / drones.length
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drone Fleet Management</h1>
          <p className="text-gray-600 mt-1">Monitor and control your drone operations for estate surveillance and mapping</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button
            onClick={loadDroneData}
            loading={loading}
            icon={<RotateCcw className="h-4 w-4" />}
            variant="secondary"
          >
            Refresh Fleet
          </Button>
          
          <Button
            icon={<Plane className="h-4 w-4" />}
          >
            New Mission
          </Button>
        </div>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{drones.length}</p>
                <p className="text-gray-600">Total Drones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Play className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{activeDrones}</p>
                <p className="text-gray-600">Active Flights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalFlightTime}m</p>
                <p className="text-gray-600">Flight Time Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Battery className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{averageBattery}%</p>
                <p className="text-gray-600">Avg Battery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Conditions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Flight Conditions</h3>
          <p className="text-sm text-gray-600">Current weather and flight safety status</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="font-semibold">{weatherConditions.temperature}°C</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Wind className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="font-semibold">{weatherConditions.windSpeed} km/h</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Cloud className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="font-semibold">{weatherConditions.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Visibility</p>
                <p className="font-semibold">{weatherConditions.visibility}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Flight Status</p>
                <Badge className="bg-green-100 text-green-800">
                  {weatherConditions.flightStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Missions */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Active Missions</h3>
            <p className="text-sm text-gray-600">Current and scheduled drone operations</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions.filter(mission => mission.status !== 'completed').map((mission) => (
                <div key={mission.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getMissionIcon(mission.type)}
                      <div>
                        <h4 className="font-medium text-gray-900">{mission.estate}</h4>
                        <p className="text-sm text-gray-600 capitalize">{mission.type} Mission</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        mission.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        mission.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        mission.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {mission.priority}
                      </Badge>
                      <Badge className={
                        mission.status === 'active' ? 'bg-green-100 text-green-800' :
                        mission.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {mission.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {mission.status === 'active' && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>Duration: {mission.estimatedDuration} min</span>
                      <span className="mx-2">•</span>
                      <span>{mission.waypoints.length} waypoints</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {mission.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => startMission(mission.id)}
                          icon={<Play className="h-3 w-3" />}
                        >
                          Start
                        </Button>
                      )}
                      {mission.status === 'active' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => pauseMission(mission.id)}
                          icon={<Pause className="h-3 w-3" />}
                        >
                          Pause
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Telemetry */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Live Telemetry</h3>
            <p className="text-sm text-gray-600">Real-time flight data from active drones</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="altitude" 
                  stroke="#3b82f6" 
                  name="Altitude (m)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="batteryLevel" 
                  stroke="#ef4444" 
                  name="Battery (%)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  name="Speed (m/s)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Drone Fleet Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Drone Fleet Status</h3>
          <p className="text-sm text-gray-600">Overview of all drones in your fleet</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drones.map((drone) => (
                  <tr key={drone.id} className={selectedDrone === drone.id ? 'bg-blue-50 border-blue-200' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Plane className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{drone.name}</div>
                          <div className="text-sm text-gray-500">{drone.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(drone.status)}
                        <Badge className={getStatusColor(drone.status)}>
                          {drone.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Battery className={`h-4 w-4 ${
                          drone.batteryLevel > 50 ? 'text-green-500' :
                          drone.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span className="text-sm text-gray-900">{drone.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{drone.location.latitude.toFixed(4)}, {drone.location.longitude.toFixed(4)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Alt: {drone.location.altitude}m
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {drone.currentMission ? (
                        <div>
                          <div className="font-medium">{drone.currentMission.estate}</div>
                          <div className="text-xs text-gray-500 capitalize">
                            {drone.currentMission.type} - {drone.currentMission.progress}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">No active mission</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDrone(drone.id)}
                          icon={<Eye className="h-3 w-3" />}
                        >
                          View
                        </Button>
                        {drone.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => recallDrone(drone.id)}
                            icon={<RotateCcw className="h-3 w-3" />}
                          >
                            Recall
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Survey Results */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Survey Results</h3>
          <p className="text-sm text-gray-600">Latest captured data and media from drone missions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {surveyResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-blue-100 text-blue-800 capitalize">
                    {result.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={
                    result.metadata.quality === 'excellent' ? 'bg-green-100 text-green-800' :
                    result.metadata.quality === 'good' ? 'bg-blue-100 text-blue-800' :
                    result.metadata.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {result.metadata.quality}
                  </Badge>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{result.estate}</h4>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span>{result.fileSize} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Altitude:</span>
                    <span>{result.metadata.altitude}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weather:</span>
                    <span>{result.metadata.weather}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Captured:</span>
                    <span>{result.captureTime.toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center space-x-2">
                  <Button size="sm" icon={<Eye className="h-3 w-3" />}>
                    Preview
                  </Button>
                  <Button size="sm" variant="ghost" icon={<Download className="h-3 w-3" />}>
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneManagement;
