import { api } from './client';

export interface PlatformStats {
  totalEvents: number;
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalTicketsSold: number;
  totalCheckedIn: number;
}

export interface UserAdminDto {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserAdminDto {
  name: string;
  email: string;
  role: string;
}

export interface BookingDto {
  bookingId: number;
  eventId: number;
  eventTitle: string;
  eventDate: string;
  venue: string;
  quantity: number;
  status: string;
  bookingDate: string;
  totalPrice: number;
}

export interface EventDto {
  eventId: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  date: string;
  price: number;
  capacity: number;
  status: string;
  organizerId: number | null;
}

export interface AdminActionLogDto {
  logId: number;
  adminUserId: number;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export const adminApi = {
  getStats: () => api.get<PlatformStats>('/api/admin/stats'),
  getUsers: () => api.get<UserAdminDto[]>('/api/admin/users'),
  changeRole: (userId: number, newRole: string) =>
    api.post<void>(`/api/admin/users/${userId}/role`, { newRole }),
  
  updateUser: (userId: number, data: UpdateUserAdminDto) =>
    api.put<void>(`/api/admin/users/${userId}`, data),
  
  getBookings: () => api.get<BookingDto[]>('/api/admin/bookings'),
  
  cancelBooking: (bookingId: number) =>
    api.post<void>(`/api/admin/bookings/${bookingId}/cancel`, {}),
  
  reassignBooking: (bookingId: number, newUserId: number) =>
    api.post<void>(`/api/admin/bookings/${bookingId}/reassign`, { newUserId }),
  
  getEvents: () => api.get<EventDto[]>('/api/admin/events'),
  
  cancelEvent: (eventId: number) =>
    api.post<void>(`/api/admin/events/${eventId}/cancel`, {}),
  
  getAuditLogs: () => api.get<AdminActionLogDto[]>('/api/admin/audit-logs'),
};
