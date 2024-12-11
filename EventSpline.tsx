import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin } from 'lucide-react';

export const EventSpline = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  const handleSplineError = () => {
    setSplineError(true);
  };

  return (
    <div className="h-[400px] w-full relative overflow-hidden">
      {!splineError && (
        <div className="absolute inset-0" style={{ opacity: splineLoaded ? 1 : 0 }}>
          <Spline 
            scene="https://prod.spline.design/6PDxoyL8vHiHpVqN/scene.splinecode" 
            onLoad={handleSplineLoad}
            onError={handleSplineError}
          />
        </div>
      )}
      
      {/* Fallback Animation */}
      {(!splineLoaded || splineError) && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8">
              {[
                { icon: Calendar, delay: 0 },
                { icon: Users, delay: 0.2 },
                { icon: MapPin, delay: 0.4 }
              ].map(({ icon: Icon, delay }, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Icon className="w-16 h-16 text-blue-500" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none" />
    </div>
  );
};