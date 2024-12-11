import { create } from 'zustand';
import { SupportTicket, EventApproval, AdminStats } from '../types/admin';

interface AdminStore {
  supportTickets: SupportTicket[];
  eventApprovals: EventApproval[];
  adminStats: AdminStats | null;
  setAdminStats: (stats: AdminStats) => void;
  addSupportTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  addTicketMessage: (ticketId: string, message: string, isAdmin: boolean) => void;
  approveEvent: (eventId: string, adminNotes?: string) => void;
  rejectEvent: (eventId: string, adminNotes?: string) => void;
  getOpenTicketsCount: () => number;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  supportTickets: [],
  eventApprovals: [],
  adminStats: null,
  
  setAdminStats: (stats) => set({ adminStats: stats }),
  
  addSupportTicket: (ticket) =>
    set((state) => {
      const newState = {
        supportTickets: [...state.supportTickets, ticket],
        adminStats: state.adminStats ? {
          ...state.adminStats,
          openTickets: state.adminStats.openTickets + 1
        } : null
      };
      return newState;
    }),
    
  updateTicketStatus: (ticketId, status) =>
    set((state) => {
      const oldTicket = state.supportTickets.find(t => t.id === ticketId);
      const wasOpen = oldTicket?.status === 'open';
      const isNowOpen = status === 'open';
      
      const openTicketsDelta = 
        (isNowOpen ? 1 : 0) - (wasOpen ? 1 : 0);

      return {
        supportTickets: state.supportTickets.map((ticket) =>
          ticket.id === ticketId ? { 
            ...ticket, 
            status,
            updatedAt: new Date().toISOString()
          } : ticket
        ),
        adminStats: state.adminStats ? {
          ...state.adminStats,
          openTickets: state.adminStats.openTickets + openTicketsDelta
        } : null
      };
    }),
    
  addTicketMessage: (ticketId, message, isAdmin) =>
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              messages: [
                ...ticket.messages,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  ticketId,
                  userId: isAdmin ? 'admin' : ticket.userId,
                  message,
                  timestamp: new Date().toISOString(),
                  isAdmin,
                },
              ],
              updatedAt: new Date().toISOString()
            }
          : ticket
      ),
    })),
    
  approveEvent: (eventId, adminNotes) =>
    set((state) => ({
      eventApprovals: [
        ...state.eventApprovals,
        {
          eventId,
          status: 'approved',
          adminNotes,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'admin',
        },
      ],
    })),
    
  rejectEvent: (eventId, adminNotes) =>
    set((state) => ({
      eventApprovals: [
        ...state.eventApprovals,
        {
          eventId,
          status: 'rejected',
          adminNotes,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'admin',
        },
      ],
    })),

  getOpenTicketsCount: () => {
    return get().supportTickets.filter(ticket => ticket.status === 'open').length;
  },
}));