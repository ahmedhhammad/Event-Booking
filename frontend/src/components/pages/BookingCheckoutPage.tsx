import { useParams, useNavigate } from 'react-router';
import { Calendar, MapPin, ArrowLeft, Ticket, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { eventsApi, EventDto } from '@/api/eventsApi';
import { bookingsApi } from '@/api/bookingsApi';
import { paymentsApi } from '@/api/paymentsApi';
import { stripePromise } from '@/lib/stripe';
import { CheckoutForm } from '@/components/CheckoutForm';
import type { ApiError } from '@/api/client';
import { toast } from 'sonner';

// ── Step machine ─────────────────────────────────────────────────────────────
type Step =
  | { id: 'select-quantity' }
  | { id: 'payment'; bookingId: number; clientSecret: string }
  | { id: 'success'; bookingId: number };

export function BookingCheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<Step>({ id: 'select-quantity' });

  useEffect(() => {
    if (!id) return;
    eventsApi
      .getById(parseInt(id))
      .then(setEvent)
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Step 1 → create booking (Pending) + create PaymentIntent → move to payment step
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    try {
      // Create the booking (status = Pending)
      const booking = await bookingsApi.createBooking(event.eventId, quantity);

      // Create the Stripe PaymentIntent
      const totalAmount = event.price * quantity;
      const { clientSecret } = await paymentsApi.createPaymentIntent(
        booking.bookingId,
        totalAmount
      );

      setStep({ id: 'payment', bookingId: booking.bookingId, clientSecret });
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr?.message || 'Could not initialise payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2 → payment succeeded
  const handlePaymentSuccess = () => {
    if (step.id !== 'payment') return;
    toast.success('Payment successful! Your booking is confirmed.');
    setStep({ id: 'success', bookingId: step.bookingId });
  };

  // Step 2 → payment failed
  const handlePaymentError = (message: string) => {
    toast.error(message);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!event) return null;

  const total = event.price * quantity;

  // ── Success screen ────────────────────────────────────────────────────────
  if (step.id === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-5">
          <div className="flex justify-center">
            <CheckCircle2 className="size-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">
            Your payment was successful and your tickets for{' '}
            <span className="font-medium text-gray-700">{event.title}</span> are confirmed.
          </p>
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/events')}
              className="w-full border border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Shared event summary card ─────────────────────────────────────────────
  const EventSummaryCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{event.title}</h2>
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-blue-500" />
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-blue-500" />
          {event.venue}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => (step.id === 'payment' ? setStep({ id: 'select-quantity' }) : navigate(-1))}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
        >
          <ArrowLeft className="size-4" />
          {step.id === 'payment' ? 'Back to order details' : 'Back'}
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Ticket className="size-6 text-blue-600" />
          {step.id === 'select-quantity' ? 'Book Tickets' : 'Complete Payment'}
        </h1>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <span className={`font-medium ${step.id === 'select-quantity' ? 'text-blue-600' : 'text-green-600'}`}>
            1 Order details
          </span>
          <div className="flex-1 h-px bg-gray-200" />
          <span className={`font-medium ${step.id === 'payment' ? 'text-blue-600' : 'text-gray-400'}`}>
            2 Payment
          </span>
        </div>

        <EventSummaryCard />

        {/* ── Step 1: Quantity ── */}
        {step.id === 'select-quantity' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2 py-4 border-t border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${event.price} × {quantity} ticket{quantity !== 1 ? 's' : ''}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
              >
                {submitting ? 'Preparing payment…' : `Continue to Payment — $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 2: Payment Element ── */}
        {step.id === 'payment' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-1">Payment</h3>
            <p className="text-sm text-gray-500 mb-5">
              Total: <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
            </p>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: step.clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#2563eb',
                    colorBackground: '#ffffff',
                    borderRadius: '8px',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  },
                },
              }}
            >
              <CheckoutForm
                totalAmount={total}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
}
