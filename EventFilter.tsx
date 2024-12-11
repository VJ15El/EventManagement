import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchSuggestions } from './SearchSuggestions';
import { useEventStore } from '../store/eventStore';
import { Event } from '../types/event';

interface EventFilterProps {
  onFilter: (criteria: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

export const EventFilter: React.FC<EventFilterProps> = ({ onFilter }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const { events } = useEventStore();

  useEffect(() => {
    if (search.length >= 2) {
      const filtered = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search, events]);

  const handleFilter = () => {
    onFilter({
      search,
      category: category || undefined,
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange({ min: '', max: '' });
    onFilter({});
  };

  const handleSuggestionSelect = (event: Event) => {
    setSearch(event.title);
    setShowSuggestions(false);
    onFilter({ search: event.title });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionSelect}
            visible={showSuggestions}
          />
        </div>
        
        <select
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="concert">Concert</option>
          <option value="exhibition">Exhibition</option>
          <option value="seminar">Seminar</option>
          <option value="networking">Networking</option>
        </select>

        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Min Price"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>

        <div className="flex space-x-2">
          <button
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleFilter}
          >
            <Filter className="w-5 h-5" />
            <span>Apply Filters</span>
          </button>
          <button
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleClearFilters}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};