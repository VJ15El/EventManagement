import React, { useState } from 'react';
import { QueryForm } from '../components/queries/QueryForm';
import { QueryList } from '../components/queries/QueryList';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare } from 'lucide-react';

export const QueryPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Need Help?</h1>
          <p className="mt-2 text-lg text-gray-600">
            Submit your query and our support team will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            <span>{showForm ? 'Hide Form' : 'New Query'}</span>
          </button>
        </div>

        {showForm && <QueryForm />}

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Queries</h2>
          <QueryList />
        </div>
      </div>
    </div>
  );
};