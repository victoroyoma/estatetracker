import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
const LandingPage = () => {
  return <div className="bg-white w-full">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Logo className="h-8 w-auto" />
                <span className="ml-2 text-lg font-medium text-gray-900">
                  EstateTrack
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/client" className="text-sm font-medium text-gray-700 hover:text-primary-500">
                Client Login
              </Link>
              <Link to="/developer">
                <Button variant="primary" size="sm">
                  Developer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-primary-50 pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                Track Land Allocation & Construction Progress
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Manage estates and engage clients with transparent updates for
                just ₦5,000/month.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" variant="primary" icon={<ArrowRightIcon className="h-5 w-5" />}>
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-primary-500" />
                  <span className="ml-2 text-gray-700">Title Verification</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-primary-500" />
                  <span className="ml-2 text-gray-700">
                    Construction Updates
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-primary-500" />
                  <span className="ml-2 text-gray-700">Client Engagement</span>
                </div>
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-primary-500" />
                  <span className="ml-2 text-gray-700">Fraud Detection</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-medium">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Nigerian Estate" className="w-full h-auto object-cover rounded-lg" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-medium p-4 hidden md:block">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    Construction: 75% Complete
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-12 bg-white md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need to manage your real estate projects
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              EstateTrack helps Nigerian real estate companies manage land
              allocation, verify titles, and keep clients updated with
              construction progress.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Land Allocation Management
              </h3>
              <p className="mt-2 text-gray-600">
                Easily manage plot allocations, track ownership, and store all
                land documents in one secure place.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Title Verification
              </h3>
              <p className="mt-2 text-gray-600">
                Verify land titles without government registry integration using
                our AI-powered document analysis.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Construction Progress Tracking
              </h3>
              <p className="mt-2 text-gray-600">
                Document and share construction milestones with photos and
                updates for complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-12 bg-gray-50 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No hidden fees, no complicated tiers. Just one affordable
              subscription.
            </p>
          </div>
          <div className="mt-12 max-w-lg mx-auto">
            <div className="bg-white rounded-lg shadow-medium overflow-hidden">
              <div className="px-6 py-8">
                <h3 className="text-center text-2xl font-medium text-gray-900">
                  Standard Plan
                </h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ₦5,000
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500 self-end">
                    /month
                  </span>
                </div>
                <p className="mt-4 text-center text-gray-600">
                  Everything you need to manage your real estate projects.
                </p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">Up to 5 estates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Unlimited clients
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Document verification
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Construction tracking
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Client portal access
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Mobile app access
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-700">
                      Offline functionality
                    </span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button variant="primary" fullWidth size="lg">
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-primary-600 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to transform your real estate business?
          </h2>
          <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
            Join leading Nigerian real estate companies already using
            EstateTrack to manage their projects.
          </p>
          <div className="mt-8">
            <Button variant="accent" size="lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center">
                <Logo className="h-8 w-auto text-white" />
                <span className="ml-2 text-lg font-medium">EstateTrack</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Modern real estate management for Nigerian developers and
                clients.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} EstateTrack Nigeria. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;