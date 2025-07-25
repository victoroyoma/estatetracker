import React, { useState } from 'react';
import { CreditCardIcon, CheckIcon, AlertTriangleIcon, ShieldIcon } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import NigerianPatterns from '../components/ui/NigerianPatterns';
// Mock PaystackButton component (in a real app, you'd use the actual Paystack integration)
const PaystackButton = ({
  amount,
  email,
  onSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        reference: 'PST' + Math.floor(Math.random() * 1000000)
      });
    }, 2000);
  };
  return <Button variant="primary" fullWidth onClick={handlePayment} disabled={isProcessing}>
      {isProcessing ? <>
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Processing...
        </> : <>Pay ₦{amount.toLocaleString()} with Paystack</>}
    </Button>;
};
const SubscriptionPage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // Mock subscription data
  const subscriptionData = {
    plan: 'Basic Plan',
    price: '₦5,000',
    billingCycle: 'monthly',
    nextBillingDate: '15/08/2023',
    status: 'active',
    estateLimit: 2,
    estatesUsed: 2,
    paymentMethod: 'Card ending in 4242',
    invoices: [{
      id: 1,
      date: '15/07/2023',
      amount: '₦5,000',
      status: 'paid'
    }, {
      id: 2,
      date: '15/06/2023',
      amount: '₦5,000',
      status: 'paid'
    }, {
      id: 3,
      date: '15/05/2023',
      amount: '₦5,000',
      status: 'paid'
    }]
  };
  // Available plans
  const availablePlans = [{
    id: 'basic',
    name: 'Basic Plan',
    price: 5000,
    estateLimit: 2,
    features: ['Up to 2 estates', 'Unlimited clients', 'Document verification', 'Construction tracking', 'Client portal access', 'Mobile app access', 'Offline functionality']
  }, {
    id: 'premium',
    name: 'Premium Plan',
    price: 15000,
    estateLimit: 10,
    features: ['Up to 10 estates', 'Unlimited clients', 'Document verification', 'Construction tracking', 'Client portal access', 'Mobile app access', 'Offline functionality', 'Priority support', 'Advanced analytics', 'Custom branding']
  }];
  const handlePaymentSuccess = response => {
    console.log('Payment successful', response);
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
    }, 3000);
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-10">
      {/* Nigerian Pattern Background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none opacity-5 h-64 overflow-hidden">
        <NigerianPatterns variant="tribal" className="w-full h-full text-primary-500" />
      </div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Subscription Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your EstateTrack subscription and billing
        </p>
      </div>
      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-gray-900">Current Plan</h2>
            <Badge variant="success">Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {subscriptionData.plan}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {subscriptionData.price}/{subscriptionData.billingCycle}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Next billing date: {subscriptionData.nextBillingDate}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" onClick={() => setShowPaymentModal(true)}>
                Change Plan
              </Button>
            </div>
          </div>
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Estate limit reached
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You're using {subscriptionData.estatesUsed} out of{' '}
                    {subscriptionData.estateLimit} available estates. Upgrade
                    your plan to add more estates.
                  </p>
                </div>
                <div className="mt-3">
                  <Button variant="primary" size="sm" onClick={() => setShowPaymentModal(true)}>
                    Upgrade Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Plan Features */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Plan Features
        </h2>
        <div className="bg-white rounded-lg shadow-medium overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Up to 2 estates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage up to 2 different estate projects
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Unlimited clients
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No limit on the number of clients per estate
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Document verification
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      AI-powered document verification system
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Construction tracking
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Track and share construction progress
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Client portal access
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Dedicated portal for your clients
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Offline functionality
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Works even with limited internet access
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Method */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="font-medium text-gray-900">Payment Method</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                <CreditCardIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {subscriptionData.paymentMethod}
                </p>
                <p className="text-xs text-gray-500">Expires 12/2024</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <ShieldIcon className="h-4 w-4 text-green-500 mr-2" />
            <span>
              Your payment information is secured with industry-standard
              encryption
            </span>
          </div>
        </CardContent>
      </Card>
      {/* Billing History */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Billing History
        </h2>
        <div className="bg-white shadow-soft overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptionData.invoices.map(invoice => <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {invoice.date}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {invoice.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={invoice.status === 'paid' ? 'success' : 'danger'}>
                        {invoice.status === 'paid' ? 'Paid' : 'Failed'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Cancel Subscription */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Cancel Subscription
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Cancelling your subscription will disable access to all EstateTrack
          features at the end of your billing period. Your data will be retained
          for 30 days after cancellation.
        </p>
        <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
          Cancel Subscription
        </Button>
      </div>
      {/* Payment Modal */}
      {showPaymentModal && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {paymentSuccess ? 'Payment Successful!' : 'Select a Plan'}
              </h3>
              {paymentSuccess ? <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <CheckIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-gray-700">
                    Your subscription has been updated successfully! You now
                    have access to the premium features.
                  </p>
                </div> : <>
                  <div className="space-y-4 mb-6">
                    {availablePlans.map(plan => <div key={plan.id} className={`border rounded-lg p-4 cursor-pointer hover:border-primary-500 ${plan.id === 'premium' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {plan.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Up to {plan.estateLimit} estates
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ₦{plan.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">per month</p>
                          </div>
                        </div>
                        {plan.id === 'premium' && <Badge variant="accent" className="mt-2">
                            Recommended
                          </Badge>}
                      </div>)}
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-4">
                      You'll be charged ₦15,000 for the Premium Plan. Your
                      subscription will upgrade immediately.
                    </p>
                    <PaystackButton amount={15000} email="user@example.com" onSuccess={handlePaymentSuccess} />
                    <div className="flex justify-center mt-4">
                      <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>}
            </div>
          </div>
        </div>}
    </div>;
};
export default SubscriptionPage;