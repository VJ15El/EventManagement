import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { useOrganizerStore } from '../../store/organizerStore';
import { useEventStore } from '../../store/eventStore';
import { useEventLogStore } from '../../store/eventLogStore';
import { Calendar, IndianRupee, TicketCheck, MessageSquare, PlusCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { EventGroupList } from '../../components/EventGroupList';

export const OrganizerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { events } = useEventStore();
  const { pendingEvents, eventStatus } = useOrganizerStore();
  const { logs } = useEventLogStore();
  const [dashboardStats, setDashboardStats] = React.useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });

  useEffect(() => {
    if (currentUser) {
      // Get all events (both from main store and pending store) for this organizer
      const userEvents = events.filter(event => event.organizer === currentUser.name);
      const userPendingEvents = pendingEvents.filter(event => event.organizer === currentUser.name);
      
      // Calculate stats
      const stats = {
        pendingCount: userPendingEvents.length + userEvents.filter(event => 
          event.status === 'pending' || event.status === 'pending-changes'
        ).length,
        approvedCount: userEvents.filter(event => event.status === 'approved').length,
        rejectedCount: userEvents.filter(event => event.status === 'rejected').length
      };
      
      setDashboardStats(stats);
    }
  }, [events, pendingEvents, currentUser]);

  if (!currentUser) {
    navigate('/auth');
    return null;
  }

  // Combine and filter events for the current organizer
  const organizerEvents = [
    ...events,
    ...pendingEvents
  ].filter(event => event.organizer === currentUser.name);

  // Remove duplicates based on event ID
  const uniqueEvents = Array.from(
    new Map(organizerEvents.map(event => [event.id, event])).values()
  );

  const userLogs = logs.filter(log => log.userId === currentUser.id);

  const stats = [
    {
      title: 'Pending Approval',
      value: dashboardStats.pendingCount,
      icon: <Clock className="w-8 h-8 text-yellow-500" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Approved Events',
      value: dashboardStats.approvedCount,
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      color: 'bg-green-50',
    },
    {
      title: 'Rejected Events',
      value: dashboardStats.rejectedCount,
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      color: 'bg-red-50',
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
        <button
          onClick={() => navigate('/events/create')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`${stat.color} p-4 rounded-lg shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">My Events</h2>
        <EventGroupList events={uniqueEvents} showPendingStatus={true} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {userLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{log.details}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(log.timestamp), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  log.action === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : log.action === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
              </span>
            </div>
          ))}
          {userLogs.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};