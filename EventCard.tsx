import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Tag, User, Edit, Trash2 } from 'lucide-react';
import { Event } from '../types/event';
import { format } from 'date-fns';
import { RegistrationModal } from './RegistrationModal';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import { useOrganizerStore } from '../store/organizerStore';
import { useEventLogStore } from '../store/eventLogStore';
import { useNavigate } from 'react-router-dom';
import { EventForm } from './events/EventForm';

interface EventCardProps {
  event: Event;
  showPendingStatus?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, showPendingStatus = false }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { currentUser } = useUserStore();
  const { updateEvent, deleteEvent } = useEventStore();
  const { updatePendingEvent } = useOrganizerStore();
  const { addLog } = useEventLogStore();
  const navigate = useNavigate();

  const handleRegistrationClick = () => {
    setShowRegistrationModal(true);
  };

  const handleEdit = (data: Partial<Event>) => {
    const updatedEvent = {
      ...event,
      ...data,
      ticketsAvailable: data.capacity || event.ticketsAvailable,
      status: 'pending-changes',
      previousVersion: event,
      lastModified: new Date().toISOString(),
      lastModifiedBy: currentUser?.name || 'Unknown'
    };

    updateEvent(event.id, updatedEvent);
    updatePendingEvent(event.id, updatedEvent as Event);

    if (currentUser) {
      addLog({
        id: Math.random().toString(36).substr(2, 9),
        eventId: event.id,
        action: 'edited',
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        details: 'Event modified and pending re-approval'
      });
    }

    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(event.id);
      
      if (currentUser) {
        addLog({
          id: Math.random().toString(36).substr(2, 9),
          eventId: event.id,
          action: 'deleted',
          timestamp: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          details: 'Event deleted'
        });
      }
    }
  };

  // Show register button for non-logged in users and regular users
  const showRegisterButton = !currentUser || 
    (!currentUser.isAdmin && 
     !currentUser.isOrganizer && 
     currentUser.name !== event.organizer);

  // Show edit/delete buttons only for the organizer who created the event or admin
  const showControls = currentUser?.isAdmin || currentUser?.name === event.organizer;

  // Don't show registration button if event is pending approval or changes
  const isEventPending = event.status === 'pending' || event.status === 'pending-changes';

  // If event is pending and we're not showing pending status, don't render the card
  if (isEventPending && !showPendingStatus) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {event.title}
          </h3>
          {showControls && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Tag className="w-4 h-4 mr-2" />
            <span>₹{event.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Organized by Eventhub</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {event.ticketsAvailable} tickets left
          </span>
          {showRegisterButton && !isEventPending && event.status === 'approved' && (
            <button
              onClick={handleRegistrationClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={event.ticketsAvailable === 0}
            >
              {event.ticketsAvailable > 0 ? 'Register Now' : 'Sold Out'}
            </button>
          )}
          {isEventPending && showPendingStatus && (
            <span className="text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
              {event.status === 'pending-changes' ? 'Pending Re-approval' : 'Pending Approval'}
            </span>
          )}
        </div>
      </div>

      {showRegistrationModal && (
        <RegistrationModal
          event={event}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Event</h2>
              <EventForm
                onSubmit={handleEdit}
                initialData={event}
                isEditing={true}
              />
              <button
                onClick={() => setShowEditModal(false)}
                className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};