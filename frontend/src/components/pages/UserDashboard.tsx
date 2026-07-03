import { Link, useSearchParams } from 'react-router';
import { Calendar, MapPin, Ticket, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { bookingsApi, BookingDto } from '@/api/bookingsApi';
import { useAuth } from '@/context/AuthContext';
import type { ApiError } from '@/api/client';
import { toast } from 'sonner';

export function UserDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const justBooked = searchParams.get('booked');

  const loadBookings = () => {
    bookingsApi.getMyBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await bookingsApi.cancelBooking(bookingId);
      setBookings(b => b.map(bk => bk.bookingId === bookingId ? { ...bk, status: 'Cancelled' } : bk));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      const e = err as ApiError;
      toast.error(e.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const confirmed = bookings.filter(b => b.status === 'Confirmed');
  const cancelled = bookings.filter(b => b.status === 'Cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{user?.role}</span>
                </div>
              </div>
              <nav className="space-y-1">
                <a className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium">
                  <Ticket className="size-4" /> My Bookings
                </a>
                <Link to="/events" className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
                  Browse Events
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-500 text-sm">Manage your event bookings</p>
            </div>

            {justBooked && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle className="size-5" />
                <span>Booking #{justBooked} confirmed! See it below.</span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Bookings', value: bookings.length, color: 'text-blue-600' },
                { label: 'Confirmed', value: confirmed.length, color: 'text-green-600' },
                { label: 'Cancelled', value: cancelled.length, color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">My Bookings</h2>
              </div>

              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Ticket className="size-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-900 font-medium mb-1">No bookings yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Find an event you love and book your tickets!</p>
                  <Link to="/events" className="text-blue-600 text-sm hover:underline font-medium">Browse Events →</Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bookings.map(b => (
                    <div key={b.bookingId} className="px-6 py-4 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{b.eventTitle}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="size-3.5" />{new Date(b.eventDate).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><MapPin className="size-3.5" />{b.venue}</span>
                          <span className="flex items-center gap-1"><Ticket className="size-3.5" />{b.quantity} ticket{b.quantity !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                            b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {b.status === 'Confirmed' ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                            {b.status}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="size-3" /> Booked {new Date(b.bookingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="font-semibold text-blue-600">${b.totalPrice.toFixed(2)}</div>
                        {b.status === 'Confirmed' && (
                          <button onClick={() => handleCancel(b.bookingId)} disabled={cancellingId === b.bookingId}
                            className="text-xs text-red-500 hover:text-red-700 border border-red-200 rounded px-2 py-1 hover:bg-red-50 disabled:opacity-50">
                            {cancellingId === b.bookingId ? 'Cancelling…' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
