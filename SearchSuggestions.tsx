import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Event } from '../types/event';

interface SearchSuggestionsProps {
  suggestions: Event[];
  onSelect: (event: Event) => void;
  visible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  visible
}) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
      >
        {suggestions.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ backgroundColor: '#f3f4f6' }}
            className="p-3 cursor-pointer border-b last:border-b-0 hover:bg-gray-50"
            onClick={() => onSelect(event)}
          >
            <div className="flex items-center space-x-3">
              <Search className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">
                  {event.category} • {event.location} • ₹{event.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};