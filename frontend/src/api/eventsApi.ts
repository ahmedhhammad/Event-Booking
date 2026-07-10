import { api } from './client';

export interface EventDto {
  eventId: number;
  title: string;
  description: string;
  category: string;
  date: string;        // ISO string
  venue: string;
  price: number;
  capacity: number;
  status: string;
  organizerId: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface EventQuery {
  searchTerm?: string;
  category?: string;
  sortBy?: string;
  sortDesc?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TicketCategoryDto {
  ticketCategoryId: number;
  eventId: number;
  name: string;
  price: number;
  quantityAvailable: number;
  quantitySold: number;
}

export const eventsApi = {
  getEvents: (query: EventQuery = {}) => {
    const params = new URLSearchParams();
    if (query.searchTerm) params.set('searchTerm', query.searchTerm);
    if (query.category)   params.set('category', query.category);
    if (query.sortBy)     params.set('sortBy', query.sortBy);
    if (query.sortDesc)   params.set('sortDesc', String(query.sortDesc));
    if (query.page)       params.set('page', String(query.page));
    if (query.pageSize)   params.set('pageSize', String(query.pageSize));
    return api.get<PagedResult<EventDto>>(`/api/events?${params}`);
  },

  getById: (id: number) => api.get<EventDto>(`/api/events/${id}`),

  getTicketCategories: (eventId: number) => 
    api.get<TicketCategoryDto[]>(`/api/events/${eventId}/ticket-categories`),
};
