import React, { useEffect, useState, Fragment } from 'react';
import { MapIcon, LayersIcon, AlertTriangleIcon, InfoIcon, UsersIcon } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NigerianPatterns from '../components/ui/NigerianPatterns';
// Fix for Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
const EstateMap = () => {
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => {
    // Set map ready after component mounts to avoid SSR issues
    setMapReady(true);
  }, []);
  // Mock plot data
  const plots = [{
    id: 1,
    number: 'A1',
    status: 'developed',
    owner: 'John Okafor',
    risk: 'low',
    coordinates: [6.5244, 3.3792],
    bounds: [[6.5242, 3.379], [6.5246, 3.3794]]
  }, {
    id: 2,
    number: 'A2',
    status: 'undeveloped',
    owner: 'Mary Adebayo',
    risk: 'low',
    coordinates: [6.5248, 3.3792],
    bounds: [[6.5246, 3.379], [6.525, 3.3794]]
  }, {
    id: 3,
    number: 'A3',
    status: 'construction',
    owner: 'Ibrahim Musa',
    risk: 'medium',
    coordinates: [6.5252, 3.3792],
    bounds: [[6.525, 3.379], [6.5254, 3.3794]]
  }, {
    id: 4,
    number: 'A4',
    status: 'developed',
    owner: 'Chioma Eze',
    risk: 'low',
    coordinates: [6.5256, 3.3792],
    bounds: [[6.5254, 3.379], [6.5258, 3.3794]]
  }, {
    id: 5,
    number: 'A5',
    status: 'undeveloped',
    owner: null,
    risk: 'high',
    coordinates: [6.526, 3.3792],
    bounds: [[6.5258, 3.379], [6.5262, 3.3794]]
  }, {
    id: 6,
    number: 'B1',
    status: 'developed',
    owner: 'Adeola Johnson',
    risk: 'low',
    coordinates: [6.5244, 3.3796],
    bounds: [[6.5242, 3.3794], [6.5246, 3.3798]]
  }, {
    id: 7,
    number: 'B2',
    status: 'construction',
    owner: 'Emmanuel Okonkwo',
    risk: 'low',
    coordinates: [6.5248, 3.3796],
    bounds: [[6.5246, 3.3794], [6.525, 3.3798]]
  }, {
    id: 8,
    number: 'B3',
    status: 'undeveloped',
    owner: 'Fatima Bello',
    risk: 'medium',
    coordinates: [6.5252, 3.3796],
    bounds: [[6.525, 3.3794], [6.5254, 3.3798]]
  }, {
    id: 9,
    number: 'B4',
    status: 'developed',
    owner: 'David Nwachukwu',
    risk: 'low',
    coordinates: [6.5256, 3.3796],
    bounds: [[6.5254, 3.3794], [6.5258, 3.3798]]
  }, {
    id: 10,
    number: 'B5',
    status: 'construction',
    owner: 'Grace Okoro',
    risk: 'low',
    coordinates: [6.526, 3.3796],
    bounds: [[6.5258, 3.3794], [6.5262, 3.3798]]
  }];
  // Mock estate data
  const estateData = {
    name: 'Green Valley Estate',
    location: 'Lekki, Lagos',
    totalPlots: 120,
    developedPlots: 45,
    undevelopedPlots: 35,
    constructionPlots: 40,
    disputes: 2,
    center: [6.5252, 3.3794]
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'developed':
        return 'bg-green-500';
      case 'undeveloped':
        return 'bg-gray-300';
      case 'construction':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };
  const getPlotStyle = (status: string, risk: string, isSelected: boolean) => {
    let color;
    let fillOpacity = isSelected ? 0.7 : 0.5;
    if (status === 'developed') {
      color = '#10B981'; // green-500
    } else if (status === 'construction') {
      color = '#F59E0B'; // yellow-500
    } else {
      color = '#9CA3AF'; // gray-400
    }
    if (risk === 'high') {
      // Add red border for high risk plots
      return {
        color: '#EF4444',
        fillColor: color,
        weight: 2,
        fillOpacity
      };
    } else if (risk === 'medium') {
      // Add yellow border for medium risk plots
      return {
        color: '#F59E0B',
        fillColor: color,
        weight: 2,
        fillOpacity
      };
    } else {
      return {
        color: '#6B7280',
        fillColor: color,
        weight: 1,
        fillOpacity
      };
    }
  };
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estate Map</h1>
          <p className="text-gray-600 mt-1">
            {estateData.name} • {estateData.location}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Button variant="outline" size="sm" icon={<LayersIcon className="h-4 w-4" />} onClick={() => setShowFilters(!showFilters)}>
            Filters
          </Button>
          <Button variant="primary" size="sm">
            Download Map
          </Button>
        </div>
      </div>

      {/* Nigerian Pattern Background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-5 h-64 overflow-hidden">
        <NigerianPatterns variant="ankara" className="w-full h-full text-primary-500" />
      </div>

      {/* Filters */}
      {showFilters && <Card className="mb-6">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Plot Status
                </label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
                  <option value="">All Statuses</option>
                  <option value="developed">Developed</option>
                  <option value="undeveloped">Undeveloped</option>
                  <option value="construction">Under Construction</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Risk Level
                </label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
                  <option value="">All Risk Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Ownership
                </label>
                <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm">
                  <option value="">All Plots</option>
                  <option value="allocated">Allocated</option>
                  <option value="unallocated">Unallocated</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Plot Number
                </label>
                <input type="text" placeholder="e.g. A12" className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm" />
              </div>
            </div>
          </CardContent>
        </Card>}

      {/* Map and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="font-medium text-gray-900">Interactive Map</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs text-gray-600">Developed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs text-gray-600">Construction</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-300 mr-1"></div>
                    <span className="text-xs text-gray-600">Undeveloped</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            {/* Interactive Leaflet Map */}
            <div className="h-96 relative bg-gray-100">
              {mapReady ? <MapContainer center={estateData.center as [number, number]} zoom={17} style={{
              height: '100%',
              width: '100%'
            }} attributionControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
                  {plots.map(plot => <Fragment key={plot.id}>
                      <Rectangle bounds={plot.bounds as [[number, number], [number, number]]} pathOptions={getPlotStyle(plot.status, plot.risk, selectedPlot === plot.id)} eventHandlers={{
                  click: () => {
                    setSelectedPlot(plot.id);
                  }
                }} />
                      <Marker position={plot.coordinates as [number, number]}>
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">Plot {plot.number}</h3>
                            <p>
                              {plot.owner ? `Owner: ${plot.owner}` : 'Unallocated'}
                            </p>
                            <p className="capitalize">Status: {plot.status}</p>
                            <p className="capitalize">Risk: {plot.risk}</p>
                          </div>
                        </Popup>
                      </Marker>
                    </Fragment>)}
                </MapContainer> : <div className="absolute inset-0 flex items-center justify-center">
                  <MapIcon className="h-16 w-16 text-gray-400" />
                </div>}
            </div>
          </Card>
          {/* Selected Plot Details */}
          {selectedPlot && <Card className="mt-4">
              <CardContent className="py-4">
                {(() => {
              const plot = plots.find(p => p.id === selectedPlot);
              if (!plot) return null;
              return <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Plot {plot.number}
                          </h3>
                          {plot.owner ? <p className="text-sm text-gray-600">
                              Owner: {plot.owner}
                            </p> : <p className="text-sm text-gray-600">
                              Status: Unallocated
                            </p>}
                          <p className="text-sm text-gray-600 mt-1">
                            Coordinates: {plot.coordinates[0].toFixed(4)}° N,{' '}
                            {plot.coordinates[1].toFixed(4)}° E
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={plot.status === 'developed' ? 'success' : plot.status === 'construction' ? 'warning' : 'default'}>
                            {plot.status === 'developed' ? 'Developed' : plot.status === 'construction' ? 'Construction' : 'Undeveloped'}
                          </Badge>
                          <div className={`h-5 w-5 rounded-full flex items-center justify-center ${getRiskColor(plot.risk)}`}>
                            <span className="text-xs text-white font-bold">
                              {plot.risk === 'high' ? 'H' : plot.risk === 'medium' ? 'M' : 'L'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <Button variant="outline" size="sm" icon={<InfoIcon className="h-4 w-4" />}>
                          View Details
                        </Button>
                        <Button variant="primary" size="sm">
                          Track Progress
                        </Button>
                      </div>
                    </div>;
            })()}
              </CardContent>
            </Card>}
        </div>
        {/* Estate Stats */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <h2 className="font-medium text-gray-900">Estate Overview</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Developed Plots
                    </span>
                    <span className="text-sm font-medium">
                      {estateData.developedPlots}/{estateData.totalPlots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{
                    width: `${Math.round(estateData.developedPlots / estateData.totalPlots * 100)}%`
                  }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Under Construction
                    </span>
                    <span className="text-sm font-medium">
                      {estateData.constructionPlots}/{estateData.totalPlots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{
                    width: `${Math.round(estateData.constructionPlots / estateData.totalPlots * 100)}%`
                  }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Undeveloped Plots
                    </span>
                    <span className="text-sm font-medium">
                      {estateData.undevelopedPlots}/{estateData.totalPlots}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{
                    width: `${Math.round(estateData.undevelopedPlots / estateData.totalPlots * 100)}%`
                  }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Total Plots</span>
                  <span className="font-medium">{estateData.totalPlots}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Disputes</span>
                  <span className="font-medium">{estateData.disputes}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm">Today, 10:30 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="font-medium text-gray-900">Risk Analysis</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        High Risk Area Detected
                      </h3>
                      <p className="text-xs text-red-700 mt-1">
                        Plot A5 has potential Omo-Onile dispute risk. Recommend
                        additional verification.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex">
                    <AlertTriangleIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Medium Risk Areas
                      </h3>
                      <p className="text-xs text-yellow-700 mt-1">
                        Plots A3 and B3 have incomplete documentation. Review
                        recommended.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" size="sm" className="w-full" icon={<UsersIcon className="h-4 w-4" />}>
                  View Community Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default EstateMap;