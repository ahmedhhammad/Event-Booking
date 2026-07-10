import { api } from './client';

export interface BookingLineItemDto {
  ticketCategoryId: number;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
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
  lineItems: BookingLineItemDto[];
}

export const bookingsApi = {
  getMyBookings: () => api.get<BookingDto[]>('/api/bookings'),

  createBooking: (eventId: number, lineItems: { ticketCategoryId: number; quantity: number }[]) =>
    api.post<BookingDto>('/api/bookings', { eventId, lineItems }),

  cancelBooking: (bookingId: number) =>
    api.delete<void>(`/api/bookings/${bookingId}`),
};
