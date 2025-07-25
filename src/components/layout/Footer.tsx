import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
const Footer = () => {
  return <footer className="bg-gray-800 text-white pt-12 pb-4 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Logo className="h-8 w-auto text-white" />
              <span className="ml-2 text-lg font-medium">EstateTrack</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Modern real estate management for Nigerian developers and clients.
            </p>
            <p className="mt-4 text-sm text-gray-300">
              © {new Date().getFullYear()} EstateTrack Nigeria
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;