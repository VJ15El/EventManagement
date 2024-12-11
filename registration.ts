export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  ticketType: 'general' | 'vip';
  quantity: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'transferred';
  purchaseDate: string;
  attendeeInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  isOrganizer?: boolean;
}