import { IconProps } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: EventCategory;
  imageUrl: string;
  organizer: string;
  capacity: number;
  ticketsAvailable: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'pending-changes';
  version: number;
  previousVersion?: Omit<Event, 'previousVersion'>;
  lastModified: string;
  lastModifiedBy: string;
}

export type EventCategory = 
  | 'corporate'
  | 'conference'
  | 'exhibition'
  | 'workshop'
  | 'seminar'
  | 'networking'
  | 'cultural'
  | 'concert'
  | 'sports';

export interface CategoryInfo {
  id: EventCategory;
  name: string;
  description: string;
  icon: React.FC<IconProps>;
  image: string;
}

export interface EventModification {
  id: string;
  eventId: string;
  modifiedFields: string[];
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  timestamp: string;
  modifiedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}