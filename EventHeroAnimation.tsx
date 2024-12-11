import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Ticket, Music, Star } from 'lucide-react';

const icons = [
  { Icon: Calendar, label: 'Plan Events', color: 'text-blue-500' },
  { Icon: Users, label: 'Connect', color: 'text-green-500' },
  { Icon: MapPin, label: 'Discover', color: 'text-red-500' },
  { Icon: Ticket, label: 'Book Tickets', color: 'text-purple-500' },
  { Icon: Music, label: 'Experience', color: 'text-yellow-500' },
  { Icon: Star, label: 'Enjoy', color: 'text-pink-500' }
];

export const EventHeroAnimation: React.FC = () => {
  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-7xl mx-auto h-full flex items-center justify-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {icons.map(({ Icon, label, color }, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                className="flex flex-col items-center space-y-2"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.2
                  }}
                  className={`p-4 rounded-full bg-white shadow-lg ${color}`}
                >
                  <Icon className="w-8 h-8" />
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-sm font-medium text-gray-600"
                >
                  {label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-200 rounded-full blur-xl" />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none" />
    </div>
  );
};