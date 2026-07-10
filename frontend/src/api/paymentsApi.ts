import { api } from './client';

export interface CreateIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentsApi = {
  /**
   * Creates a Stripe PaymentIntent for the given booking.
   * Returns the clientSecret used to confirm the payment on the frontend.
   */
  createPaymentIntent: (bookingId: number, amount: number) =>
    api.post<CreateIntentResponse>('/api/payments/create-intent', { bookingId, amount }),
};
