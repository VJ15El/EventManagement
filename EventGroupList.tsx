import React from 'react';
import { motion } from 'framer-motion';
import { Event, EventCategory } from '../types/event';
import { EventCard } from './EventCard';
import { eventCategories } from './events/EventCategories';

interface EventGroupListProps {
  events: Event[];
  showPendingStatus?: boolean;
}

export const EventGroupList: React.FC<EventGroupListProps> = ({ events, showPendingStatus = false }) => {
  // Filter out events based on status
  const filteredEvents = events.filter(event => {
    if (showPendingStatus) {
      // For admin/organizer view, show all except rejected events
      return event.status !== 'rejected';
    }
    // For regular users, only show approved events
    return event.status === 'approved';
  });

  // Group events by category
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<EventCategory, Event[]>);

  // Sort events within each category by date
  Object.keys(groupedEvents).forEach(category => {
    groupedEvents[category as EventCategory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  // Filter out categories with no events
  const nonEmptyCategories = Object.entries(groupedEvents).filter(
    ([_, categoryEvents]) => categoryEvents.length > 0
  );

  if (nonEmptyCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No events found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex flex-nowrap gap-6 min-w-full">
        {nonEmptyCategories.map(([category, categoryEvents], index) => {
          const categoryInfo = eventCategories.find(c => c.id === category);
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-none w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]"
            >
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center space-x-3 mb-4">
                  {categoryInfo && (
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <categoryInfo.icon className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {categoryInfo?.name || category}
                  </h2>
                  <span className="text-sm text-gray-500">
                    ({categoryEvents.length} {categoryEvents.length === 1 ? 'event' : 'events'})
                  </span>
                </div>
                <div className="space-y-4">
                  {categoryEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      showPendingStatus={showPendingStatus}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};