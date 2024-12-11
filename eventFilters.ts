import { Event } from '../types/event';

interface FilterCriteria {
  search: string;
  startDate: string;
  endDate: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  category: string;
}

export const filterEvents = (events: Event[], criteria: FilterCriteria): Event[] => {
  return events.filter(event => {
    // Search filter
    const searchMatch = !criteria.search || 
      event.title.toLowerCase().includes(criteria.search.toLowerCase()) ||
      event.description.toLowerCase().includes(criteria.search.toLowerCase()) ||
      event.location.toLowerCase().includes(criteria.search.toLowerCase());

    // Date filter
    const eventDate = new Date(event.date);
    const dateMatch = (!criteria.startDate || eventDate >= new Date(criteria.startDate)) &&
      (!criteria.endDate || eventDate <= new Date(criteria.endDate));

    // Location filter
    const locationMatch = !criteria.location ||
      event.location.toLowerCase().includes(criteria.location.toLowerCase());

    // Price filter
    const priceMatch = (!criteria.minPrice || event.price >= Number(criteria.minPrice)) &&
      (!criteria.maxPrice || event.price <= Number(criteria.maxPrice));

    // Category filter
    const categoryMatch = !criteria.category || event.category === criteria.category;

    return searchMatch && dateMatch && locationMatch && priceMatch && categoryMatch;
  });
};