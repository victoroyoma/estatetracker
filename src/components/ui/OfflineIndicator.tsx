import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, WifiOffIcon } from 'lucide-react';
import Button from './Button';
interface OfflineIndicatorProps {
  className?: string;
}
const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  useEffect(() => {
    // Set up online/offline detection
    const handleOnline = () => {
      setIsOnline(true);
      setLastSynced('Just now');
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Check initial state
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  const toggleOfflineMode = () => {
    // In a real app, this would enable explicit offline mode
    alert(isOnline ? 'Offline mode enabled. App will sync when connection is restored.' : 'App will sync as soon as connection is available.');
  };
  return <div className={`fixed bottom-20 md:bottom-4 right-4 z-40 ${className}`}>
      <div className="bg-white shadow-medium rounded-full px-4 py-2 flex items-center cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
        <span className="text-sm font-medium text-gray-700">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <Button variant="ghost" size="sm" className="ml-2 p-0 h-6 w-6 rounded-full" onClick={e => {
        e.stopPropagation();
        toggleOfflineMode();
      }}>
          {isOnline ? <CheckCircleIcon className="h-4 w-4 text-gray-500" /> : <WifiOffIcon className="h-4 w-4 text-gray-500" />}
        </Button>
      </div>
      {showDetails && <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Connection Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last synced:</span>
              <span className="text-gray-900">{lastSynced}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending changes:</span>
              <span className="text-gray-900">0</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" fullWidth onClick={toggleOfflineMode}>
                {isOnline ? 'Enable Offline Mode' : 'Sync When Online'}
              </Button>
            </div>
          </div>
        </div>}
    </div>;
};
export default OfflineIndicator;