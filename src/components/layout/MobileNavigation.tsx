import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, LayoutDashboardIcon, MapIcon, FileTextIcon, CreditCardIcon } from 'lucide-react';
const MobileNavigation = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5">
        <Link to="/" className={`flex flex-col items-center justify-center py-2 ${isActive('/') ? 'text-primary-500' : 'text-gray-500'}`}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/developer" className={`flex flex-col items-center justify-center py-2 ${isActive('/developer') ? 'text-primary-500' : 'text-gray-500'}`}>
          <LayoutDashboardIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link to="/map" className={`flex flex-col items-center justify-center py-2 ${isActive('/map') ? 'text-primary-500' : 'text-gray-500'}`}>
          <MapIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Map</span>
        </Link>
        <Link to="/documents" className={`flex flex-col items-center justify-center py-2 ${isActive('/documents') ? 'text-primary-500' : 'text-gray-500'}`}>
          <FileTextIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Documents</span>
        </Link>
        <Link to="/subscription" className={`flex flex-col items-center justify-center py-2 ${isActive('/subscription') ? 'text-primary-500' : 'text-gray-500'}`}>
          <CreditCardIcon className="h-6 w-6" />
          <span className="text-xs mt-1">Billing</span>
        </Link>
      </div>
    </div>;
};
export default MobileNavigation;