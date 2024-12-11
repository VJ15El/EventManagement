import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Users, MapPin } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const icons = [Calendar, Star, Users, MapPin];
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 z-50 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Icons */}
        <div className="relative w-32 h-32">
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                x: [0, Math.cos(index * Math.PI/2) * 40, 0],
                y: [0, Math.sin(index * Math.PI/2) * 40, 0],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-8 h-8 text-blue-600" />
            </motion.div>
          ))}
        </div>

        {/* Central Logo */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Calendar className="w-16 h-16 text-blue-600" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Loading EventHub
        </h1>
        <motion.div
          className="flex space-x-1 justify-center"
          animate={{
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};