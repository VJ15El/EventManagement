import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({ value, onChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter by location..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </motion.div>
  );
};