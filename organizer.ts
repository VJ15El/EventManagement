export interface EventLog {
  id: string;
  eventId: string;
  action: 'created' | 'approved' | 'rejected' | 'edited' | 'deleted';
  timestamp: string;
  userId: string;
  userName: string;
  details?: string;
}

export interface OrganizerDashboardStats {
  totalEvents: number;
  pendingApproval: number;
  approvedEvents: number;
  rejectedEvents: number;
}