import React from 'react';
import { useUserStore } from '../../store/userStore';
import { useEventStore } from '../../store/eventStore';
import { useOrganizerStore } from '../../store/organizerStore';
import { EventCard } from '../../components/EventCard';

export const EventList: React.FC = () => {
  const { currentUser } = useUserStore();
  const { events } = useEventStore();
  const { pendingEvents } = useOrganizerStore();

  if (!currentUser) return null;

  // Combine events from both stores and filter by organizer
  const organizerEvents = [
    ...events,
    ...pendingEvents
  ].filter(event => event.organizer === currentUser.name);

  // Remove duplicates based on event ID
  const uniqueEvents = Array.from(
    new Map(organizerEvents.map(event => [event.id, event])).values()
  );

  // Sort events by date
  const sortedEvents = uniqueEvents.sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedEvents.map((event) => (
        <EventCard 
          key={event.id} 
          event={event}
          showPendingStatus={true}
        />
      ))}

      {sortedEvents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>You haven't created any events yet.</p>
        </div>
      )}
    </div>
  );
};