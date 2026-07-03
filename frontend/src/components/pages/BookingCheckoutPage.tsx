import { Link, useParams, useNavigate } from 'react-router';
import { Calendar, MapPin, ArrowLeft, Ticket, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventsApi, EventDto } from '@/api/eventsApi';
import { bookingsApi } from '@/api/bookingsApi';
import type { ApiError } from '@/api/client';

export function BookingCheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    eventsApi.getById(parseInt(id))
      .then(setEvent)
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setError('');
    try {
      const booking = await bookingsApi.createBooking(event.eventId, quantity);
      navigate(`/dashboard?booked=${booking.bookingId}`);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-48 bg-gray-200 rounded-xl" />
      <div className="h-32 bg-gray-200 rounded-xl" />
    </div>
  );

  if (!event) return null;

  const total = (event.price * quantity).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm">
          <ArrowLeft className="size-4" /> Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Ticket className="size-6 text-blue-600" /> Book Tickets
        </h1>

        {/* Event Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{event.title}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-blue-500" />
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-blue-500" /> {event.venue}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <AlertCircle className="size-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
                <span className="text-xl font-semibold text-gray-900 w-8 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
              </div>
            </div>

            <div className="space-y-2 py-4 border-t border-b border-gray-100">
              <div className="flex justify-between text-sm text-gray-600">
                <span>${event.price} × {quantity} ticket{quantity !== 1 ? 's' : ''}</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-lg">
                <span>Total</span>
                <span className="text-blue-600">${total}</span>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
              💳 Payment integration coming soon — booking will be confirmed directly.
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50">
              {submitting ? 'Confirming…' : `Confirm Booking — $${total}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
