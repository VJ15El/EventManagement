import React, { useEffect, useState } from 'react';
import { EventCategories } from '../components/events/EventCategories';
import { EventGroupList } from '../components/EventGroupList';
import { SearchFilters } from '../components/search/SearchFilters';
import { useEventStore } from '../store/eventStore';
import { LoadingScreen } from '../components/LoadingScreen';
import { AnimatedTitle } from '../components/AnimatedTitle';
import { EventHeroAnimation } from '../components/animations/EventHeroAnimation';
import { useUserStore } from '../store/userStore';
import { useEventRefresh } from '../hooks/useEventRefresh';
import { EventCategory } from '../types/event';
import { filterEvents } from '../utils/eventFilters';
import { motion } from 'framer-motion';

export const EventsPage: React.FC = () => {
  const { events, setEvents, getVisibleEvents } = useEventStore();
  const { currentUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [filteredEvents, setFilteredEvents] = useState(events);

  // Use the event refresh hook
  useEventRefresh();

  useEffect(() => {
    const existingEvents = events || [];
    setEvents(existingEvents);
    setFilteredEvents(getVisibleEvents());
    setIsLoading(false);
  }, []);

  const handleFilter = (criteria: any) => {
    // Get visible events based on user role
    const visibleEvents = getVisibleEvents();
    
    // Apply search and filter criteria
    const filtered = filterEvents(visibleEvents, criteria);
    setFilteredEvents(filtered);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!currentUser?.isAdmin && !currentUser?.isOrganizer && <EventHeroAnimation />}
      
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedTitle 
            title={currentUser?.isOrganizer ? "My Events" : "Discover Events"}
            subtitle={currentUser?.isOrganizer 
              ? "Manage your created events" 
              : "Find and book amazing events in your area"}
          />
          
          {!currentUser?.isAdmin && !currentUser?.isOrganizer && (
            <EventCategories
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-8"
          >
            <SearchFilters onFilter={handleFilter} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <EventGroupList
              events={filteredEvents}
              showPendingStatus={currentUser?.isOrganizer || currentUser?.isAdmin}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};