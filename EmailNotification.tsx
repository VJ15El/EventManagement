import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface EmailNotificationProps {
  success: boolean;
  message: string;
  onClose: () => void;
}

export const EmailNotification: React.FC<EmailNotificationProps> = ({
  success,
  message,
  onClose
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg ${
          success ? 'bg-green-50' : 'bg-red-50'
        }`}
      >
        <div className="flex items-center">
          {success ? (
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 mr-3" />
          )}
          <p className={`text-sm ${success ? 'text-green-800' : 'text-red-800'}`}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};