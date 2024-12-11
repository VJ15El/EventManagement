import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useUserStore } from '../../store/userStore';
import { format } from 'date-fns';

export const QueryList: React.FC = () => {
  const { currentUser } = useUserStore();
  const { supportTickets } = useAdminStore();

  // Filter tickets for the current user
  const userTickets = supportTickets.filter(
    ticket => ticket.userId === (currentUser?.id || 'guest')
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (userTickets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No queries found. Submit a new query to get started.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {userTickets.map((ticket) => (
        <motion.div
          key={ticket.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
              <p className="text-sm text-gray-500">
                Submitted on {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getStatusColor(
                ticket.status
              )}`}
            >
              {getStatusIcon(ticket.status)}
              <span className="ml-1 capitalize">{ticket.status}</span>
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{ticket.description}</p>
            </div>

            {ticket.messages.length > 1 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Responses:</h4>
                {ticket.messages.slice(1).map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.isAdmin
                        ? 'bg-blue-50 ml-4'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {message.isAdmin ? 'Support Team' : 'You'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(message.timestamp), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};