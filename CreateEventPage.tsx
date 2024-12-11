import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../../components/events/EventForm';
import { useEventStore } from '../../store/eventStore';
import { useOrganizerStore } from '../../store/organizerStore';
import { useEventLogStore } from '../../store/eventLogStore';
import { AnimatedTitle } from '../../components/AnimatedTitle';
import { motion } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import type { Event } from '../../types/event';
import { Shield } from 'lucide-react';

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { addEvent } = useEventStore();
  const { addPendingEvent } = useOrganizerStore();
  const { addLog } = useEventLogStore();

  if (!currentUser) {
    navigate('/auth', { 
      state: { 
        redirectTo: '/events/create',
        message: 'Please log in to create events' 
      } 
    });
    return null;
  }

  const handleSubmit = (data: Partial<Event>) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...data as Event,
      organizer: currentUser.name,
      ticketsAvailable: data.capacity || 0,
    };

    if (currentUser.isAdmin) {
      // Admin-created events are automatically approved
      addEvent(newEvent);
      addLog({
        id: Math.random().toString(36).substr(2, 9),
        eventId: newEvent.id,
        action: 'created',
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        details: 'Event created by admin'
      });
    } else {
      // Organizer-created events need approval
      addPendingEvent(newEvent);
      addLog({
        id: Math.random().toString(36).substr(2, 9),
        eventId: newEvent.id,
        action: 'created',
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        userName: currentUser.name,
        details: 'Event pending approval'
      });
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <AnimatedTitle
          title={currentUser.isAdmin ? "Create New Event" : "Submit Event for Approval"}
          subtitle={currentUser.isAdmin 
            ? "Fill in the details to create your event"
            : "Your event will be reviewed by an admin before being published"}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-md"
        >
          <EventForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </div>
  );
};