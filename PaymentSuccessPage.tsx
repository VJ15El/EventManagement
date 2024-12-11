import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useRegistrationStore } from '../store/registrationStore';

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registrationId = searchParams.get('registrationId');
  const { getRegistrationById } = useRegistrationStore();
  const registration = registrationId ? getRegistrationById(registrationId) : null;

  useEffect(() => {
    if (!registration) {
      navigate('/');
    }
  }, [registration, navigate]);

  if (!registration) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Payment Successful!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-gray-600"
          >
            Your registration has been confirmed
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <div className="border-t border-b border-gray-200 py-4">
            <h3 className="text-lg font-medium text-gray-900">Registration Details</h3>
            <dl className="mt-4 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Registration ID</dt>
                <dd className="text-sm font-medium text-gray-900">{registration.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Event</dt>
                <dd className="text-sm font-medium text-gray-900">{registration.eventId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Ticket Type</dt>
                <dd className="text-sm font-medium text-gray-900">{registration.ticketType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Amount Paid</dt>
                <dd className="text-sm font-medium text-gray-900">₹{registration.totalPrice.toLocaleString('en-IN')}</dd>
              </div>
            </dl>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <button
            onClick={() => navigate('/my-registrations')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Registrations
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Events
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};