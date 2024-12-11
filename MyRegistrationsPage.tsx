import React from 'react';
import { useRegistrationStore } from '../store/registrationStore';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import { format } from 'date-fns';
import { processPayment } from '../utils/payment';
import { Ticket, CheckCircle, Clock, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { PaymentConfirmation } from '../components/PaymentConfirmation';
import { useRegistrationRefresh } from '../hooks/useRegistrationRefresh';
import { RegistrationBackground } from '../components/animations/RegistrationBackground';
import { motion } from 'framer-motion';

export const MyRegistrationsPage: React.FC = () => {
  const { currentUser } = useUserStore();
  const { getRegistrationsByUser, cancelRegistration, getPaymentStatus } = useRegistrationStore();
  const { events } = useEventStore();
  const [selectedPayment, setSelectedPayment] = React.useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState<string | null>(null);

  useRegistrationRefresh();

  const registrations = currentUser 
    ? getRegistrationsByUser(currentUser.id)
    : getRegistrationsByUser('guest');

  const getEventDetails = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  const handlePayment = async (registration: any) => {
    const response = await processPayment(registration);
    setSelectedPayment(registration.id);
  };

  const handleCancelRegistration = (registrationId: string) => {
    setShowCancelConfirm(registrationId);
  };

  const confirmCancellation = (registrationId: string) => {
    cancelRegistration(registrationId);
    setShowCancelConfirm(null);
  };

  const shouldShowPayButton = (registration: any) => {
    const paymentStatus = getPaymentStatus(registration.id);
    if (registration.status === 'cancelled' && (!paymentStatus || paymentStatus.status !== 'paid')) {
      return false;
    }
    return !paymentStatus || paymentStatus.status === 'pending' || paymentStatus.status === 'failed';
  };

  const getRegistrationStatus = (registration: any) => {
    const paymentStatus = getPaymentStatus(registration.id);
    
    if (registration.status === 'cancelled') {
      const refundStatus = paymentStatus?.refundStatus;
      if (paymentStatus?.status === 'paid' && refundStatus === 'pending') {
        return (
          <div className="space-y-1">
            <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">
              <XCircle className="w-4 h-4 mr-1" />
              Cancelled
            </span>
            <span className="flex items-center text-yellow-700 text-xs">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refund in process (3-4 working days)
            </span>
          </div>
        );
      }
      return (
        <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">
          <XCircle className="w-4 h-4 mr-1" />
          Cancelled
        </span>
      );
    }

    if (paymentStatus?.status === 'paid') {
      return (
        <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          Booked
        </span>
      );
    }

    if (paymentStatus?.status === 'pending') {
      return (
        <span className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm">
          <Clock className="w-4 h-4 mr-1" />
          Payment Pending
        </span>
      );
    }

    if (paymentStatus?.status === 'failed') {
      return (
        <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Payment Failed
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      <RegistrationBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <Ticket className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
        </motion.div>
        
        {registrations.length > 0 ? (
          <div className="space-y-6">
            {registrations.map((registration, index) => {
              const event = getEventDetails(registration.eventId);
              const paymentStatus = getPaymentStatus(registration.id);
              
              return (
                <motion.div
                  key={registration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/90 backdrop-blur-lg rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-blue-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {event?.title || 'Event Not Found'} - {registration.ticketType.toUpperCase()}
                      </h3>
                      <p className="text-gray-600">
                        Purchased on {format(new Date(registration.purchaseDate), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-gray-600">
                        Quantity: {registration.quantity} | Total: ₹{registration.totalPrice.toLocaleString('en-IN')}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Attendee: {registration.attendeeInfo.name}</p>
                        <p>Email: {registration.attendeeInfo.email}</p>
                        <p>Phone: {registration.attendeeInfo.phone}</p>
                      </div>
                      {event && (
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Event Date: {format(new Date(event.date), 'MMMM d, yyyy')}</p>
                          <p>Location: {event.location}</p>
                          <p>Organizer: {event.organizer}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-4">
                      {getRegistrationStatus(registration)}
                      {shouldShowPayButton(registration) && (
                        <button
                          onClick={() => handlePayment(registration)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Pay Now
                        </button>
                      )}
                      {registration.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelRegistration(registration.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cancellation Confirmation Modal */}
                  {showCancelConfirm === registration.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm Cancellation</h3>
                        <p className="text-gray-600 mb-6">
                          {paymentStatus?.status === 'paid' 
                            ? "Your registration will be cancelled and the amount will be refunded within 3-4 working days."
                            : "Are you sure you want to cancel this registration?"}
                        </p>
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setShowCancelConfirm(null)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Keep Registration
                          </button>
                          <button
                            onClick={() => confirmCancellation(registration.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Confirm Cancellation
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/90 backdrop-blur-lg rounded-lg shadow-md"
          >
            <Ticket className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No Registrations Found</p>
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          </motion.div>
        )}
      </div>

      {selectedPayment && (
        <PaymentConfirmation
          paymentResponse={paymentStatus}
          registrationId={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};