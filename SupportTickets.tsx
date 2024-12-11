import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../store/adminStore';
import { MessageSquare, Send, Filter } from 'lucide-react';

export const SupportTickets: React.FC = () => {
  const { supportTickets, updateTicketStatus, addTicketMessage, getOpenTicketsCount } = useAdminStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  const handleSendReply = (ticketId: string) => {
    if (replyMessage.trim()) {
      addTicketMessage(ticketId, replyMessage, true);
      setReplyMessage('');
    }
  };

  const handleStatusChange = (ticketId: string, status: 'open' | 'in-progress' | 'resolved') => {
    updateTicketStatus(ticketId, status);
  };

  const filteredTickets = supportTickets.filter(ticket => {
    if (statusFilter === 'open') return ticket.status === 'open' || ticket.status === 'in-progress';
    if (statusFilter === 'closed') return ticket.status === 'resolved';
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
              className="border rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tickets</option>
              <option value="open">Open Tickets</option>
              <option value="closed">Closed Tickets</option>
            </select>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {getOpenTicketsCount()} Open Tickets
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedTicket === ticket.id
                  ? 'bg-blue-50 border-2 border-blue-200'
                  : 'bg-white hover:bg-gray-50 border-2 border-transparent'
              }`}
              onClick={() => setSelectedTicket(ticket.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value as any)}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'open'
                      ? 'bg-red-100 text-red-700'
                      : ticket.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </motion.div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tickets found for the selected filter.
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedTicket ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md h-full flex flex-col"
            >
              {/* Ticket details */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {supportTickets.find((t) => t.id === selectedTicket)?.subject}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {supportTickets
                  .find((t) => t.id === selectedTicket)
                  ?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isAdmin ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.isAdmin
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Reply input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSendReply(selectedTicket)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a ticket to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};