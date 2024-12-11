import { create } from 'zustand';
import { EventModification } from '../types/event';
import { persist } from 'zustand/middleware';

interface EventModificationStore {
  modifications: EventModification[];
  addModification: (modification: EventModification) => void;
  updateModificationStatus: (modificationId: string, status: 'approved' | 'rejected', adminNotes?: string) => void;
  getModificationsByEventId: (eventId: string) => EventModification[];
  getPendingModifications: () => EventModification[];
}

export const useEventModificationStore = create<EventModificationStore>()(
  persist(
    (set, get) => ({
      modifications: [],
      
      addModification: (modification) =>
        set((state) => ({
          modifications: [...state.modifications, modification]
        })),
        
      updateModificationStatus: (modificationId, status, adminNotes) =>
        set((state) => ({
          modifications: state.modifications.map((mod) =>
            mod.id === modificationId
              ? { ...mod, status, adminNotes }
              : mod
          )
        })),
        
      getModificationsByEventId: (eventId) =>
        get().modifications.filter((mod) => mod.eventId === eventId),
        
      getPendingModifications: () =>
        get().modifications.filter((mod) => mod.status === 'pending'),
    }),
    {
      name: 'event-modifications'
    }
  )
);