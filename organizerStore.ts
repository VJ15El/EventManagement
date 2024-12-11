import { create } from 'zustand';
import { Event } from '../types/event';
import { persist } from 'zustand/middleware';

interface OrganizerStore {
  pendingEvents: Event[];
  eventStatus: Record<string, 'pending' | 'approved' | 'rejected'>;
  subscribers: Set<(state: any) => void>;
  addPendingEvent: (event: Event) => void;
  removePendingEvent: (eventId: string) => void;
  updateEventStatus: (eventId: string, status: 'pending' | 'approved' | 'rejected') => void;
  getPendingEventById: (eventId: string) => Event | undefined;
  getEventStatus: (eventId: string) => 'pending' | 'approved' | 'rejected' | undefined;
  updatePendingEvent: (eventId: string, updatedEvent: Event) => void;
  subscribe: (callback: (state: any) => void) => () => void;
}

export const useOrganizerStore = create<OrganizerStore>()(
  persist(
    (set, get) => {
      // Initialize subscribers Set
      const subscribers = new Set<(state: any) => void>();

      return {
        pendingEvents: [],
        eventStatus: {},
        subscribers,
        
        addPendingEvent: (event) => 
          set((state) => {
            const newState = {
              ...state,
              pendingEvents: [...state.pendingEvents, event],
              eventStatus: { ...state.eventStatus, [event.id]: 'pending' }
            };
            // Notify subscribers
            subscribers.forEach(callback => callback(newState));
            return newState;
          }),
          
        removePendingEvent: (eventId) =>
          set((state) => {
            const newState = {
              ...state,
              pendingEvents: state.pendingEvents.filter(event => event.id !== eventId)
            };
            // Notify subscribers
            subscribers.forEach(callback => callback(newState));
            return newState;
          }),
          
        updateEventStatus: (eventId, status) =>
          set((state) => {
            const newState = {
              ...state,
              eventStatus: { ...state.eventStatus, [eventId]: status }
            };
            // Notify subscribers
            subscribers.forEach(callback => callback(newState));
            return newState;
          }),
          
        getPendingEventById: (eventId) => 
          get().pendingEvents.find(event => event.id === eventId),
          
        getEventStatus: (eventId) =>
          get().eventStatus[eventId],

        updatePendingEvent: (eventId, updatedEvent) =>
          set((state) => {
            const newState = {
              ...state,
              pendingEvents: [
                ...state.pendingEvents.filter(event => event.id !== eventId),
                updatedEvent
              ],
              eventStatus: { ...state.eventStatus, [eventId]: 'pending' }
            };
            // Notify subscribers
            subscribers.forEach(callback => callback(newState));
            return newState;
          }),

        subscribe: (callback) => {
          subscribers.add(callback);
          return () => {
            subscribers.delete(callback);
          };
        },
      };
    },
    {
      name: 'organizer-storage',
      partialize: (state) => ({
        pendingEvents: state.pendingEvents,
        eventStatus: state.eventStatus,
      }),
    }
  )
);