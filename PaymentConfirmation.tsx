import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { PaymentResponse } from '../types/payment';
import { useRegistrationStore } from '../store/registrationStore';

interface PaymentConfirmationProps {
  paymentResponse: PaymentResponse;
  registrationId: string;
  onClose: () => void;
}

export const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentResponse,
  registrationId,
  onClose,
}) => {
  const { updateRegistrationPaymentStatus } = useRegistrationStore();
  const {
    success,
    transactionId,
    amount,
    timestamp,
    error,
    paymentId,
    orderId,
  } = paymentResponse;

  // Update payment status when component mounts
  React.useEffect(() => {
    if (success && registrationId) {
      updateRegistrationPaymentStatus(registrationId, {
        status: 'paid',
        lastUpdated: new Date().toISOString(),
        transactionDetails: {
          transactionId,
          paymentId: paymentId || '',
          orderId: orderId || '',
          amount,
          timestamp
        }
      });
    } else if (!success && registrationId) {
      updateRegistrationPaymentStatus(registrationId, {
        status: 'failed',
        lastUpdated: new Date().toISOString(),
        error: error || 'Payment failed'
      });
    }
  }, [success, registrationId, transactionId, paymentId, orderId, amount, timestamp, error, updateRegistrationPaymentStatus]);

  const handleClose = () => {
    if (!success) {
      // If payment failed, update status to pending
      updateRegistrationPaymentStatus(registrationId, {
        status: 'pending',
        lastUpdated: new Date().toISOString()
      });
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="text-center mb-6">
          {success ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h2 className="text-2xl font-bold mb-2">
            {success ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p className="text-gray-600">
            {success
              ? 'Your payment has been processed successfully.'
              : 'There was an issue processing your payment.'}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {success && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderId}</span>
              </div>
            </>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {format(new Date(timestamp), 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error Details</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {!success && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};