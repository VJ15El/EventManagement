import { Event } from './event';
import { Registration } from './registration';
import { User } from './registration';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface AdminStats {
  totalEvents: number;
  totalRevenue: number;
  pendingApprovals: number;
  openTickets: number;
  recentRegistrations: Registration[];
}

export interface EventApproval {
  eventId: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}