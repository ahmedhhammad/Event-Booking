import { api } from './client';

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

export const bookingsApi = {
  getMyBookings: () => api.get<BookingDto[]>('/api/bookings'),

  createBooking: (eventId: number, quantity: number) =>
    api.post<BookingDto>('/api/bookings', { eventId, quantity }),

  cancelBooking: (bookingId: number) =>
    api.delete<void>(`/api/bookings/${bookingId}`),
};
