import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Event } from '../types/event';
import { useUserStore } from '../store/userStore';
import { useRegistrationStore } from '../store/registrationStore';
import { useEventStore } from '../store/eventStore';
import { processPayment } from '../utils/payment';
import { PaymentConfirmation } from './PaymentConfirmation';
import { PaymentResponse } from '../types/payment';
import { sendBookingConfirmation } from '../utils/emailService';
import { EmailNotification } from './notifications/EmailNotification';

interface RegistrationModalProps {
  event: Event;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ event, onClose }) => {
  const { currentUser } = useUserStore();
  const { addRegistration } = useRegistrationStore();
  const { updateTicketAvailability } = useEventStore();
  const [ticketType, setTicketType] = useState<'general' | 'vip'>('general');
  const [quantity, setQuantity] = useState(1);
  const [attendeeInfo, setAttendeeInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);
  const [currentRegistrationId, setCurrentRegistrationId] = useState<string | null>(null);
  const [emailNotification, setEmailNotification] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });

  const calculatePrice = () => {
    const basePrice = event.price * quantity;
    return ticketType === 'vip' ? basePrice * 1.5 : basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registrationId = Math.random().toString(36).substr(2, 9);
    setCurrentRegistrationId(registrationId);

    const registration = {
      id: registrationId,
      eventId: event.id,
      userId: currentUser?.id || 'guest',
      ticketType,
      quantity,
      totalPrice: calculatePrice(),
      status: 'confirmed' as const,
      purchaseDate: new Date().toISOString(),
      attendeeInfo,
    };

    addRegistration(registration);
    const response = await processPayment(registration);
    setPaymentResponse(response);

    if (response.success) {
      updateTicketAvailability(event.id, quantity);
      
      // Send confirmation email
      const emailSent = await sendBookingConfirmation(registration, event);
      setEmailNotification({
        show: true,
        success: emailSent,
        message: emailSent
          ? 'Booking confirmation email sent successfully!'
          : 'Could not send confirmation email. Please check your email address.'
      });
    }
  };

  const handlePaymentConfirmationClose = () => {
    setPaymentResponse(null);
    if (paymentResponse?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {emailNotification.show && (
        <EmailNotification
          success={emailNotification.success}
          message={emailNotification.message}
          onClose={() => setEmailNotification({ ...emailNotification, show: false })}
        />
      )}

      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        {paymentResponse ? (
          <PaymentConfirmation
            paymentResponse={paymentResponse}
            registrationId={currentRegistrationId!}
            onClose={handlePaymentConfirmationClose}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Register for {event.title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ticket Type</label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as 'general' | 'vip')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="general">General Admission (₹{event.price.toLocaleString('en-IN')})</option>
                  <option value="vip">VIP (₹{(event.price * 1.5).toLocaleString('en-IN')})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={event.ticketsAvailable}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  {event.ticketsAvailable} tickets available
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={attendeeInfo.name}
                  onChange={(e) => setAttendeeInfo({ ...attendeeInfo, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={attendeeInfo.email}
                  onChange={(e) => setAttendeeInfo({ ...attendeeInfo, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={attendeeInfo.phone}
                  onChange={(e) => setAttendeeInfo({ ...attendeeInfo, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold">₹{calculatePrice().toLocaleString('en-IN')}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};