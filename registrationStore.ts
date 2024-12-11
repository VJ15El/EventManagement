import { create } from 'zustand';
import { Registration } from '../types/registration';
import { PaymentStatus } from '../types/payment';
import { useEventStore } from './eventStore';

interface RegistrationStore {
  registrations: Registration[];
  paymentStatus: Record<string, PaymentStatus>;
  subscribers: Set<() => void>;
  addRegistration: (registration: Registration) => void;
  cancelRegistration: (registrationId: string) => void;
  transferRegistration: (registrationId: string, newAttendeeInfo: Registration['attendeeInfo']) => void;
  getRegistrationsByUser: (userId: string) => Registration[];
  getRegistrationsByEvent: (eventId: string) => Registration[];
  getRegistrationById: (registrationId: string) => Registration | null;
  updateRegistrationPaymentStatus: (registrationId: string, status: PaymentStatus) => void;
  getPaymentStatus: (registrationId: string) => PaymentStatus | undefined;
  subscribe: (callback: () => void) => () => void;
}

export const useRegistrationStore = create<RegistrationStore>((set, get) => {
  const subscribers = new Set<() => void>();

  const notifySubscribers = () => {
    subscribers.forEach(callback => callback());
  };

  return {
    registrations: [],
    paymentStatus: {},
    subscribers,
    
    addRegistration: (registration) =>
      set((state) => {
        const newState = {
          registrations: [...state.registrations, registration],
          paymentStatus: {
            ...state.paymentStatus,
            [registration.id]: {
              status: 'pending',
              lastUpdated: new Date().toISOString()
            }
          }
        };
        notifySubscribers();
        return newState;
      }),
      
    cancelRegistration: (registrationId) => {
      const registration = get().registrations.find(reg => reg.id === registrationId);
      if (registration) {
        const { updateTicketAvailability } = useEventStore.getState();
        updateTicketAvailability(registration.eventId, registration.quantity, true);
        
        set((state) => {
          const newState = {
            registrations: state.registrations.map((reg) =>
              reg.id === registrationId ? { ...reg, status: 'cancelled' } : reg
            ),
            // Keep the payment status as is, but mark the registration as cancelled
            paymentStatus: {
              ...state.paymentStatus,
              [registrationId]: {
                ...state.paymentStatus[registrationId],
                cancellationDate: new Date().toISOString(),
                refundStatus: state.paymentStatus[registrationId]?.status === 'paid' ? 'pending' : 'not_applicable'
              }
            }
          };
          notifySubscribers();
          return newState;
        });
      }
    },
      
    transferRegistration: (registrationId, newAttendeeInfo) =>
      set((state) => {
        const newState = {
          registrations: state.registrations.map((reg) =>
            reg.id === registrationId
              ? { ...reg, status: 'transferred', attendeeInfo: newAttendeeInfo }
              : reg
          )
        };
        notifySubscribers();
        return newState;
      }),
      
    getRegistrationsByUser: (userId) =>
      get().registrations.filter((reg) => reg.userId === userId),
      
    getRegistrationsByEvent: (eventId) =>
      get().registrations.filter((reg) => reg.eventId === eventId),
      
    getRegistrationById: (registrationId) =>
      get().registrations.find((reg) => reg.id === registrationId) || null,

    updateRegistrationPaymentStatus: (registrationId, status) =>
      set((state) => {
        const newState = {
          ...state,
          paymentStatus: {
            ...state.paymentStatus,
            [registrationId]: {
              ...status,
              lastUpdated: new Date().toISOString()
            }
          }
        };
        notifySubscribers();
        return newState;
      }),

    getPaymentStatus: (registrationId) =>
      get().paymentStatus[registrationId],

    subscribe: (callback) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },
  };
});