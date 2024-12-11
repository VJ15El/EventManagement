import React from 'react';
import { useOrganizerStore } from '../../store/organizerStore';
import { useEventStore } from '../../store/eventStore';
import { useEventLogStore } from '../../store/eventLogStore';
import { useEventModificationStore } from '../../store/eventModificationStore';
import { useUserStore } from '../../store/userStore';
import { Check, X, AlertCircle, History } from 'lucide-react';
import { format } from 'date-fns';
import { compareEvents } from '../../utils/eventAudit';

export const EventApprovals: React.FC = () => {
  const { currentUser } = useUserStore();
  const { pendingEvents, removePendingEvent, updateEventStatus } = useOrganizerStore();
  const { addEvent, updateEvent, getEventById } = useEventStore();
  const { addLog } = useEventLogStore();
  const { modifications, getPendingModifications, updateModificationStatus } = useEventModificationStore();

  const pendingModifications = getPendingModifications();

  const handleApprove = (eventId: string) => {
    const event = pendingEvents.find(e => e.id === eventId);
    if (event && currentUser) {
      // Check if this is a modification to an existing event
      const existingEvent = getEventById(eventId);
      if (existingEvent) {
        // Update the event with approved status
        updateEvent(eventId, {
          ...event,
          status: 'approved',
          version: (existingEvent.version || 0) + 1
        });
      } else {
        // Add new event with approved status
        addEvent({
          ...event,
          status: 'approved',
          version: 1
        });
      }

      // Remove from pending events and update status
      removePendingEvent(eventId);
      updateEventStatus(eventId, 'approved');

      // Log the approval
      addLog({
        id: Math.random().toString(36).substr(2, 9),
        eventId: event.id,
        action: 'approved',
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        details: event.previousVersion ? 'Event changes approved' : 'Event approved'
      });

      // If this was a modification, update the modification status
      if (event.previousVersion) {
        updateModificationStatus(eventId, 'approved', 'Changes approved by admin');
      }
    }
  };

  const handleReject = (eventId: string) => {
    const event = pendingEvents.find(e => e.id === eventId);
    if (event && currentUser) {
      // If this is a modification, revert to previous version
      if (event.previousVersion) {
        updateEvent(eventId, {
          ...event.previousVersion,
          status: 'approved',
          version: (event.version || 0) + 1
        });
      }

      // Remove from pending events and update status
      removePendingEvent(eventId);
      updateEventStatus(eventId, 'rejected');

      // Log the rejection
      addLog({
        id: Math.random().toString(36).substr(2, 9),
        eventId: event.id,
        action: 'rejected',
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        details: event.previousVersion ? 'Event changes rejected' : 'Event rejected'
      });

      // If this was a modification, update the modification status
      if (event.previousVersion) {
        updateModificationStatus(eventId, 'rejected', 'Changes rejected by admin');
      }
    }
  };

  const renderModificationDetails = (event: any) => {
    if (!event.previousVersion) return null;
    
    const differences = compareEvents(event.previousVersion, event);
    if (differences.length === 0) return null;

    return (
      <div className="mt-4 bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
          <History className="w-4 h-4 mr-2" />
          Modified Fields
        </h4>
        <ul className="list-disc list-inside text-sm text-blue-700">
          {differences.map((field) => (
            <li key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:{' '}
              <span className="text-blue-600">
                {event.previousVersion[field]} → {event[field]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Event Approvals</h1>
      
      <div className="space-y-6">
        {pendingEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600 mt-1">{event.description}</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Organizer:</span> {event.organizer}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {format(new Date(event.date), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Price:</span> ₹{event.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span> {event.capacity.toLocaleString('en-IN')} attendees
                  </p>
                </div>

                {renderModificationDetails(event)}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(event.id)}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(event.id)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-yellow-600 bg-yellow-50 p-3 rounded-md">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p className="text-sm">
                {event.previousVersion 
                  ? 'This event has been modified and requires re-approval.'
                  : 'This event requires review before being listed publicly.'}
              </p>
            </div>
          </div>
        ))}
        
        {pendingEvents.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            No events pending approval
          </div>
        )}
      </div>
    </div>
  );
};