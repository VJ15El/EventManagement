import React from 'react';

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600">
          {subtitle}
        </p>
      )}
    </div>
  );
};