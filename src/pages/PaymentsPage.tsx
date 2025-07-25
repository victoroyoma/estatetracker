import React from 'react';
import PaymentDashboard from '../components/payments/PaymentDashboard';

const PaymentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentDashboard />
    </div>
  );
};

export default PaymentsPage;
