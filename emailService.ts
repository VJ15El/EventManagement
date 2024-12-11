import { Registration } from '../types/registration';
import { Event } from '../types/event';

// Mock email service for frontend
export const sendBookingConfirmation = async (
  registration: Registration,
  event: Event
): Promise<boolean> => {
  try {
    console.log('Sending confirmation email to:', registration.attendeeInfo.email);
    console.log('Email content:', {
      event: event.title,
      date: new Date(event.date).toLocaleDateString(),
      time: event.time,
      location: event.location,
      tickets: `${registration.quantity} ${registration.ticketType} ticket(s)`,
      totalAmount: `₹${registration.totalPrice.toLocaleString('en-IN')}`,
      bookingReference: registration.id
    });

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
};