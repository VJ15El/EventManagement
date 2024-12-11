import { create } from 'zustand';
import { EventLog } from '../types/organizer';

interface EventLogStore {
  logs: EventLog[];
  addLog: (log: EventLog) => void;
  getLogsByEventId: (eventId: string) => EventLog[];
  getLogsByUser: (userId: string) => EventLog[];
}

export const useEventLogStore = create<EventLogStore>((set, get) => ({
  logs: [],
  
  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log]
    })),
    
  getLogsByEventId: (eventId) =>
    get().logs.filter(log => log.eventId === eventId),
    
  getLogsByUser: (userId) =>
    get().logs.filter(log => log.userId === userId)
}));