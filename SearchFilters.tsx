import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { DateFilter } from './DateFilter';
import { LocationFilter } from './LocationFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { CategoryFilter } from './CategoryFilter';

interface FilterCriteria {
  search: string;
  startDate: string;
  endDate: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  category: string;
}

interface SearchFiltersProps {
  onFilter: (criteria: FilterCriteria) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    search: '',
    startDate: '',
    endDate: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    category: '',
  });

  const handleFilterChange = (key: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      startDate: '',
      endDate: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      category: '',
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const handleApplyFilters = () => {
    onFilter(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SearchBar
          value={filters.search}
          onChange={(value) => handleFilterChange('search', value)}
        />
        <CategoryFilter
          selectedCategory={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateFilter
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(value) => handleFilterChange('startDate', value)}
          onEndDateChange={(value) => handleFilterChange('endDate', value)}
        />
        <LocationFilter
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriceRangeFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => handleFilterChange('minPrice', value)}
          onMaxPriceChange={(value) => handleFilterChange('maxPrice', value)}
        />
        <div className="flex space-x-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Apply Filters</span>
          </button>
          <button
            onClick={clearFilters}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};