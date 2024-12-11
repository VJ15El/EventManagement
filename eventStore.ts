import { create } from 'zustand';
import { Event } from '../types/event';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';

interface EventStore {
  events: Event[];
  filteredEvents: Event[];
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, event: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  filterEvents: (criteria: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  updateTicketAvailability: (eventId: string, quantity: number, isCancel?: boolean) => void;
  getEventById: (eventId: string) => Event | undefined;
  getVisibleEvents: () => Event[];
  clearEvents: () => void;
  subscribe: (callback: () => void) => () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => {
      const subscribers = new Set<() => void>();

      const notifySubscribers = () => {
        subscribers.forEach(callback => callback());
      };

      return {
        events: [],
        filteredEvents: [],
        
        setEvents: (events) => {
          const visibleEvents = events.filter(event => event.status !== 'rejected');
          set({ events, filteredEvents: visibleEvents });
          notifySubscribers();
        },
        
        addEvent: (event) =>
          set(
            produce((state) => {
              state.events.push(event);
              if (event.status !== 'rejected') {
                state.filteredEvents.push(event);
              }
            }),
            false,
            () => notifySubscribers()
          ),
          
        updateEvent: (eventId, updatedEvent) =>
          set(
            produce((state) => {
              const eventIndex = state.events.findIndex((e) => e.id === eventId);
              if (eventIndex !== -1) {
                const oldEvent = state.events[eventIndex];
                state.events[eventIndex] = {
                  ...oldEvent,
                  ...updatedEvent,
                  previousVersion: oldEvent,
                  version: (oldEvent.version || 0) + 1,
                  lastModified: new Date().toISOString(),
                  status: updatedEvent.status || 'pending-changes'
                };
              }

              // Update filtered events, removing rejected events
              state.filteredEvents = state.events.filter(event => 
                event.status !== 'rejected' && 
                (event.status === 'approved' || event.organizer === 'Admin')
              );
            }),
            false,
            () => notifySubscribers()
          ),
          
        deleteEvent: (eventId) =>
          set(
            produce((state) => {
              state.events = state.events.filter((event) => event.id !== eventId);
              state.filteredEvents = state.filteredEvents.filter((event) => event.id !== eventId);
            }),
            false,
            () => notifySubscribers()
          ),
          
        filterEvents: (criteria) =>
          set(
            (state) => ({
              ...state,
              filteredEvents: get().getVisibleEvents().filter((event) => {
                const matchesSearch =
                  !criteria.search ||
                  event.title.toLowerCase().includes(criteria.search.toLowerCase()) ||
                  event.description.toLowerCase().includes(criteria.search.toLowerCase()) ||
                  event.location.toLowerCase().includes(criteria.search.toLowerCase());
                const matchesCategory = !criteria.category || event.category === criteria.category;
                const matchesPrice =
                  (!criteria.minPrice || event.price >= criteria.minPrice) &&
                  (!criteria.maxPrice || event.price <= criteria.maxPrice);
                return matchesSearch && matchesCategory && matchesPrice;
              })
            }),
            false,
            () => notifySubscribers()
          ),
          
        updateTicketAvailability: (eventId, quantity, isCancel = false) =>
          set(
            produce((state) => {
              const updateEvent = (event: Event) => {
                if (event.id === eventId) {
                  event.ticketsAvailable = isCancel
                    ? event.ticketsAvailable + quantity
                    : event.ticketsAvailable - quantity;
                }
                return event;
              };

              state.events = state.events.map(updateEvent);
              state.filteredEvents = state.filteredEvents.map(updateEvent);
            }),
            false,
            () => notifySubscribers()
          ),

        getEventById: (eventId) => get().events.find((event) => event.id === eventId),

        getVisibleEvents: () => {
          const { events } = get();
          return events.filter((event) => {
            if (event.status === 'rejected') {
              return false;
            }
            if (event.organizer === 'Admin') {
              return event.status !== 'pending-changes';
            }
            return event.status === 'approved';
          });
        },

        clearEvents: () => {
          set({ events: [], filteredEvents: [] });
          notifySubscribers();
        },

        subscribe: (callback) => {
          subscribers.add(callback);
          return () => {
            subscribers.delete(callback);
          };
        },
      };
    },
    {
      name: 'event-storage',
      partialize: (state) => ({
        events: state.events,
        filteredEvents: state.filteredEvents,
      }),
    }
  )
);