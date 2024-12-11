import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { useAdminStore } from '../../store/adminStore';
import { nanoid } from 'nanoid';

const querySubjects = [
  'Technical Issue',
  'Booking Problem',
  'Payment Issue',
  'Event Information',
  'Refund Request',
  'Account Access',
  'General Inquiry',
  'Feature Request',
  'Other'
] as const;

const querySchema = z.object({
  subject: z.enum(querySubjects, {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

type QueryFormData = z.infer<typeof querySchema>;

export const QueryForm: React.FC = () => {
  const { currentUser } = useUserStore();
  const { addSupportTicket } = useAdminStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
  });

  const onSubmit = (data: QueryFormData) => {
    const ticket = {
      id: nanoid(),
      userId: currentUser?.id || 'guest',
      subject: data.subject,
      description: data.description,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: nanoid(),
        ticketId: nanoid(),
        userId: currentUser?.id || 'guest',
        message: data.description,
        timestamp: new Date().toISOString(),
        isAdmin: false,
      }],
    };

    addSupportTicket(ticket);
    reset();
    alert('Your query has been submitted successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Submit a Query</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            {...register('subject')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a subject</option>
            {querySubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your query in detail"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Query
        </button>
      </form>
    </motion.div>
  );
};