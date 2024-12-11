import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/events/CreateEventPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage } from './pages/AboutPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { AdminDashboard } from './pages/admin/Dashboard';
import { EventApprovals } from './pages/admin/EventApprovals';
import { SupportTickets } from './pages/admin/SupportTickets';
import { OrganizerDashboard } from './pages/organizer/Dashboard';
import { CategoryPage } from './pages/categories/CategoryPage';
import { QueryPage } from './pages/QueryPage';
import { useUserStore } from './store/userStore';
import { LogOut, Calendar, HelpCircle } from 'lucide-react';

function App() {
  const { currentUser, setCurrentUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to={currentUser?.isAdmin ? '/admin' : '/'} className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span>EventHub</span>
              </Link>
              {!currentUser?.isAdmin && (
                <>
                  <Link to="/" className="text-gray-600 hover:text-gray-900">Events</Link>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
                  <Link to="/query" className="text-gray-600 hover:text-gray-900 flex items-center">
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Support
                  </Link>
                </>
              )}
              {!currentUser?.isAdmin && !currentUser?.isOrganizer && (
                <Link to="/my-registrations" className="text-gray-600 hover:text-gray-900">
                  My Registrations
                </Link>
              )}
              {currentUser && !currentUser.isAdmin && (
                <Link to="/organizer/dashboard" className="text-gray-600 hover:text-gray-900">
                  Organizer Dashboard
                </Link>
              )}
              {currentUser?.isAdmin && (
                <>
                  <Link to="/admin/approvals" className="text-gray-600 hover:text-gray-900">
                    Event Approvals
                  </Link>
                  <Link to="/admin/support" className="text-gray-600 hover:text-gray-900">
                    Support Tickets
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-gray-600">Welcome, {currentUser.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Event Organizer Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={currentUser?.isAdmin ? <Navigate to="/admin" replace /> : <EventsPage />} />
        <Route path="/events/create" element={<CreateEventPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/my-registrations" element={<MyRegistrationsPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approvals" element={<EventApprovals />} />
        <Route path="/admin/support" element={<SupportTickets />} />
        <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/query" element={<QueryPage />} />
      </Routes>
    </div>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;