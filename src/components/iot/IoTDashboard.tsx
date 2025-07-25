import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Zap, 
  Shield, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Camera,
  Lock,
  Sun,
  Wind,
  Gauge,
  MapPin,
  Settings,
  TrendingUp,
  Battery,
  Signal
} from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'camera' | 'access_control' | 'lighting' | 'security' | 'environmental';
  status: 'online' | 'offline' | 'warning' | 'maintenance' | 'critical';
  location: {
    estate: string;
    area: string;
    coordinates: [number, number];
  };
  lastSeen: Date;
  batteryLevel?: number;
  signalStrength: number;
  firmware: string;
  metrics: {
    temperature?: number;
    humidity?: number;
    airQuality?: number;
    motion?: boolean;
    lightLevel?: number;
    powerConsumption?: number;
  };
}

interface IoTAlert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface IoTAnalytics {
  totalDevices: number;
  onlineDevices: number;
  criticalAlerts: number;
  energyUsage: number;
  averageUptime: number;
  deviceHealth: Array<{
    category: string;
    healthy: number;
    warning: number;
    critical: number;
  }>;
  environmentalData: Array<{
    time: string;
    temperature: number;
    humidity: number;
    airQuality: number;
  }>;
}

const IoTDashboard: React.FC = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [alerts, setAlerts] = useState<IoTAlert[]>([]);
  const [analytics, setAnalytics] = useState<IoTAnalytics | null>(null);
  const [selectedEstate, setSelectedEstate] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadIoTData();
    
    if (autoRefresh) {
      const interval = setInterval(loadIoTData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedEstate]);

  const loadIoTData = async () => {
    setLoading(true);
    
    // Simulate loading IoT data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockDevices: IoTDevice[] = [
      {
        id: 'iot-001',
        name: 'Gate Access Controller',
        type: 'access_control',
        status: 'online',
        location: {
          estate: 'Green Valley Estate',
          area: 'Main Gate',
          coordinates: [6.5244, 3.3792]
        },
        lastSeen: new Date(),
        batteryLevel: 85,
        signalStrength: 95,
        firmware: 'v2.1.3',
        metrics: {
          motion: true,
          powerConsumption: 12.5
        }
      },
      {
        id: 'iot-002',
        name: 'Environmental Sensor A1',
        type: 'environmental',
        status: 'online',
        location: {
          estate: 'Green Valley Estate',
          area: 'Block A',
          coordinates: [6.5248, 3.3794]
        },
        lastSeen: new Date(Date.now() - 300000),
        batteryLevel: 92,
        signalStrength: 88,
        firmware: 'v1.8.2',
        metrics: {
          temperature: 28.5,
          humidity: 65,
          airQuality: 85,
          lightLevel: 750
        }
      },
      {
        id: 'iot-003',
        name: 'Security Camera C1',
        type: 'camera',
        status: 'warning',
        location: {
          estate: 'Green Valley Estate',
          area: 'Common Area',
          coordinates: [6.5250, 3.3796]
        },
        lastSeen: new Date(Date.now() - 120000),
        signalStrength: 45,
        firmware: 'v3.2.1',
        metrics: {
          motion: false,
          powerConsumption: 8.2
        }
      },
      {
        id: 'iot-004',
        name: 'Smart Lighting System',
        type: 'lighting',
        status: 'online',
        location: {
          estate: 'Sunset Gardens',
          area: 'Central Plaza',
          coordinates: [6.5252, 3.3798]
        },
        lastSeen: new Date(),
        signalStrength: 92,
        firmware: 'v2.0.5',
        metrics: {
          lightLevel: 1200,
          powerConsumption: 45.8
        }
      },
      {
        id: 'iot-005',
        name: 'Water Level Sensor',
        type: 'sensor',
        status: 'critical',
        location: {
          estate: 'Sunset Gardens',
          area: 'Water Tank',
          coordinates: [6.5254, 3.3800]
        },
        lastSeen: new Date(Date.now() - 1800000),
        batteryLevel: 15,
        signalStrength: 30,
        firmware: 'v1.5.8',
        metrics: {
          humidity: 95,
          powerConsumption: 2.1
        }
      }
    ];

    const mockAlerts: IoTAlert[] = [
      {
        id: 'alert-001',
        deviceId: 'iot-005',
        deviceName: 'Water Level Sensor',
        type: 'critical',
        message: 'Low battery level detected (15%). Immediate attention required.',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: false
      },
      {
        id: 'alert-002',
        deviceId: 'iot-003',
        deviceName: 'Security Camera C1',
        type: 'warning',
        message: 'Weak signal strength detected. Consider repositioning device.',
        timestamp: new Date(Date.now() - 600000),
        acknowledged: false
      },
      {
        id: 'alert-003',
        deviceId: 'iot-002',
        deviceName: 'Environmental Sensor A1',
        type: 'info',
        message: 'Temperature threshold exceeded (28.5°C). Normal summer conditions.',
        timestamp: new Date(Date.now() - 900000),
        acknowledged: true
      }
    ];

    const mockAnalytics: IoTAnalytics = {
      totalDevices: mockDevices.length,
      onlineDevices: mockDevices.filter(d => d.status === 'online').length,
      criticalAlerts: mockAlerts.filter(a => a.type === 'critical' && !a.acknowledged).length,
      energyUsage: 68.6,
      averageUptime: 98.5,
      deviceHealth: [
        { category: 'Environmental', healthy: 15, warning: 2, critical: 1 },
        { category: 'Security', healthy: 8, warning: 3, critical: 0 },
        { category: 'Access Control', healthy: 5, warning: 0, critical: 0 },
        { category: 'Lighting', healthy: 12, warning: 1, critical: 0 }
      ],
      environmentalData: [
        { time: '00:00', temperature: 26.5, humidity: 68, airQuality: 82 },
        { time: '04:00', temperature: 25.2, humidity: 72, airQuality: 85 },
        { time: '08:00', temperature: 27.8, humidity: 65, airQuality: 78 },
        { time: '12:00', temperature: 29.1, humidity: 58, airQuality: 75 },
        { time: '16:00', temperature: 28.5, humidity: 62, airQuality: 80 },
        { time: '20:00', temperature: 27.3, humidity: 66, airQuality: 83 }
      ]
    };

    setDevices(mockDevices);
    setAlerts(mockAlerts);
    setAnalytics(mockAnalytics);
    setLoading(false);
  };

  const getDeviceIcon = (type: IoTDevice['type']) => {
    switch (type) {
      case 'sensor': return <Gauge className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'access_control': return <Lock className="h-5 w-5" />;
      case 'lighting': return <Sun className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'environmental': return <Wind className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: IoTDevice['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: IoTAlert['type']) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const filteredDevices = selectedEstate === 'all' 
    ? devices 
    : devices.filter(device => device.location.estate === selectedEstate);

  const estates = [...new Set(devices.map(device => device.location.estate))];

  if (!analytics) {
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
          <h1 className="text-2xl font-bold text-gray-900">IoT Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and control all connected devices across your estates</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={selectedEstate}
            onChange={(e) => setSelectedEstate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="all">All Estates</option>
            {estates.map(estate => (
              <option key={estate} value={estate}>{estate}</option>
            ))}
          </select>
          
          <Button
            onClick={loadIoTData}
            loading={loading}
            icon={<Activity className="h-4 w-4" />}
            variant="secondary"
          >
            Refresh
          </Button>
          
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "primary" : "secondary"}
            icon={<TrendingUp className="h-4 w-4" />}
          >
            {autoRefresh ? 'Auto On' : 'Auto Off'}
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{analytics.totalDevices}</p>
                <p className="text-gray-600">Total Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{analytics.onlineDevices}</p>
                <p className="text-gray-600">Online Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{analytics.criticalAlerts}</p>
                <p className="text-gray-600">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{analytics.energyUsage}kW</p>
                <p className="text-gray-600">Energy Usage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{analytics.averageUptime}%</p>
                <p className="text-gray-600">Avg Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Alerts</h3>
          <p className="text-sm text-gray-600">Monitor critical events and device notifications</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${alert.acknowledged ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.deviceName}</h4>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={
                      alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {alert.type}
                    </Badge>
                    
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Data */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Environmental Monitoring</h3>
            <p className="text-sm text-gray-600">Real-time environmental conditions</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.environmentalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity (%)" />
                <Line type="monotone" dataKey="airQuality" stroke="#10b981" name="Air Quality" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Health Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Device Health Status</h3>
            <p className="text-sm text-gray-600">Health status by device category</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.deviceHealth.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-xs text-gray-500">
                      {category.healthy + category.warning + category.critical} devices
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="flex h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ 
                          width: `${(category.healthy / (category.healthy + category.warning + category.critical)) * 100}%` 
                        }}
                      />
                      <div 
                        className="bg-yellow-500" 
                        style={{ 
                          width: `${(category.warning / (category.healthy + category.warning + category.critical)) * 100}%` 
                        }}
                      />
                      <div 
                        className="bg-red-500" 
                        style={{ 
                          width: `${(category.critical / (category.healthy + category.warning + category.critical)) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Connected Devices</h3>
          <p className="text-sm text-gray-600">Manage all IoT devices across your estates</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            {getDeviceIcon(device.type)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{device.location.estate}</div>
                      <div className="text-sm text-gray-500">{device.location.area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(device.status)}>
                        {device.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.batteryLevel ? (
                        <div className="flex items-center space-x-2">
                          <Battery className={`h-4 w-4 ${
                            device.batteryLevel > 50 ? 'text-green-500' :
                            device.batteryLevel > 20 ? 'text-yellow-500' : 'text-red-500'
                          }`} />
                          <span>{device.batteryLevel}%</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Signal className={`h-4 w-4 ${
                          device.signalStrength > 70 ? 'text-green-500' :
                          device.signalStrength > 40 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span>{device.signalStrength}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" icon={<Settings className="h-3 w-3" />}>
                          Config
                        </Button>
                        <Button size="sm" variant="ghost" icon={<MapPin className="h-3 w-3" />}>
                          Locate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTDashboard;
