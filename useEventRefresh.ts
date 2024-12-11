import { useEffect, useCallback } from 'react';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';

export const useEventRefresh = () => {
  const { subscribe, clearEvents, filterEvents } = useEventStore();
  const { currentUser } = useUserStore();

  const handleStoreUpdate = useCallback(() => {
    // Re-filter events when store changes
    filterEvents({});
  }, [filterEvents]);

  useEffect(() => {
    // Clear events when user logs out
    if (!currentUser) {
      clearEvents();
    }

    // Subscribe to event store changes
    const unsubscribe = subscribe(handleStoreUpdate);

    return () => {
      unsubscribe();
    };
  }, [currentUser, subscribe, clearEvents, handleStoreUpdate]);
};