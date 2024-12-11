import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EventCard } from '../../components/EventCard';
import { useEventStore } from '../../store/eventStore';
import { eventCategories } from '../../components/events/EventCategories';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { EventCategory } from '../../types/event';

export const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: EventCategory }>();
  const navigate = useNavigate();
  const { events } = useEventStore();
  
  const categoryInfo = eventCategories.find(c => c.id === category);
  const categoryEvents = events.filter(event => 
    event.category === category && event.status === 'approved'
  );

  if (!categoryInfo) {
    return null;
  }

  const Icon = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={categoryInfo.image}
          alt={categoryInfo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-3 mb-4"
            >
              <Icon className="w-10 h-10" />
              <h1 className="text-4xl font-bold">{categoryInfo.name}</h1>
            </motion.div>
            <p className="text-xl text-gray-200">{categoryInfo.description}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-white flex items-center space-x-2 hover:text-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Categories</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {categoryEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                showPendingStatus={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No events found in this category. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};