import React from 'react';
import { motion } from 'framer-motion';

export const LoginBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Primary animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(120deg, #4f46e5 0%, #3b82f6 50%, #0ea5e9 100%)',
            'linear-gradient(120deg, #3b82f6 0%, #0ea5e9 50%, #4f46e5 100%)',
            'linear-gradient(120deg, #0ea5e9 0%, #4f46e5 50%, #3b82f6 100%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* Animated shapes */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-3xl"
            initial={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
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
              duration: 20 + i * 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Overlay gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80" />
    </div>
  );
};