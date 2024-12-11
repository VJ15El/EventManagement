import { useEffect } from 'react';
import { useRegistrationStore } from '../store/registrationStore';

export const useRegistrationRefresh = () => {
  const { subscribe } = useRegistrationStore();

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      // Force component re-render when store updates
      console.log('Registration store updated');
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe]);
};