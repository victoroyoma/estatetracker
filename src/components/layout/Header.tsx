import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, BellIcon, UserIcon } from 'lucide-react';
import Logo from '../ui/Logo';
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-lg font-medium text-gray-900 hidden sm:block">
                EstateTrack
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/developer" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500">
              Dashboard
            </Link>
            <Link to="/map" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500">
              Estate Map
            </Link>
            <Link to="/documents" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500">
              Documents
            </Link>
            <Link to="/subscription" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500">
              Subscription
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-primary-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-accent-500"></span>
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-primary-500">
              <UserIcon className="h-6 w-6" />
            </button>
            <button className="md:hidden p-1 rounded-full text-gray-500 hover:text-primary-500" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && <div className="md:hidden bg-white shadow-lg rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/developer" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
              Estate Map
            </Link>
            <Link to="/documents" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
              Documents
            </Link>
            <Link to="/subscription" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-500" onClick={() => setMenuOpen(false)}>
              Subscription
            </Link>
          </div>
        </div>}
    </header>;
};
export default Header;