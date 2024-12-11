import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Star, Users } from 'lucide-react';

export const RegistrationBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            'linear-gradient(120deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
            'linear-gradient(120deg, #3b82f6 0%, #60a5fa 50%, #2563eb 100%)',
            'linear-gradient(120deg, #60a5fa 0%, #2563eb 50%, #3b82f6 100%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* Floating icons */}
      {[Ticket, Calendar, Star, Users].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.5,
            opacity: 0.1
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            rotate: [0, 180, 360],
            scale: [0.5, 0.7, 0.5],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <Icon className="w-12 h-12 text-blue-200" />
        </motion.div>
      ))}

      {/* Decorative circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full bg-blue-100/20 backdrop-blur-sm"
          initial={{
            width: Math.random() * 200 + 100,
            height: Math.random() * 200 + 100,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0.8
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
            ],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />
      ))}

      {/* Overlay gradient for better content contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80" />
    </div>
  );
};