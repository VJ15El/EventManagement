import { nanoid } from 'nanoid';
import { Event, EventModification } from '../types/event';
import { useEventLogStore } from '../store/eventLogStore';
import { useEventModificationStore } from '../store/eventModificationStore';

export const createEventModification = (
  oldEvent: Event,
  newEvent: Partial<Event>,
  userId: string,
  userName: string
): EventModification => {
  const modifiedFields: string[] = [];
  const oldValues: Record<string, any> = {};
  const newValues: Record<string, any> = {};

  Object.keys(newEvent).forEach(key => {
    if (key !== 'id' && key !== 'version' && key !== 'previousVersion' &&
        oldEvent[key as keyof Event] !== newEvent[key as keyof Event]) {
      modifiedFields.push(key);
      oldValues[key] = oldEvent[key as keyof Event];
      newValues[key] = newEvent[key as keyof Event];
    }
  });

  return {
    id: nanoid(),
    eventId: oldEvent.id,
    modifiedFields,
    oldValues,
    newValues,
    timestamp: new Date().toISOString(),
    modifiedBy: userId,
    status: 'pending',
  };
};

export const logEventModification = (
  event: Event,
  modification: EventModification,
  userName: string
) => {
  const { addLog } = useEventLogStore.getState();
  
  addLog({
    id: nanoid(),
    eventId: event.id,
    action: 'edited',
    timestamp: new Date().toISOString(),
    userId: modification.modifiedBy,
    userName,
    details: `Modified fields: ${modification.modifiedFields.join(', ')}`
  });
};

export const compareEvents = (oldEvent: Event, newEvent: Event): string[] => {
  const differences: string[] = [];
  const fieldsToCompare = [
    'title', 'description', 'date', 'time', 'location', 
    'price', 'category', 'capacity', 'imageUrl'
  ];

  fieldsToCompare.forEach(field => {
    if (oldEvent[field as keyof Event] !== newEvent[field as keyof Event]) {
      differences.push(field);
    }
  });

  return differences;
};