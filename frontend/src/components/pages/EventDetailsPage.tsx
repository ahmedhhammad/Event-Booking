import { Link, useParams, useNavigate } from 'react-router';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventsApi, EventDto } from '@/api/eventsApi';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/context/AuthContext';

const CATEGORY_IMAGES: Record<string, string> = {
  Music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  Art: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
  Sports: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
  Entertainment: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
  Business: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
};

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    eventsApi.getById(parseInt(id))
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-72 bg-gray-200 rounded-xl mb-6" />
      <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
    </div>
  );

  if (notFound || !event) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🎭</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h2>
      <Link to="/events" className="text-blue-600 hover:underline">← Back to events</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gray-200">
        <ImageWithFallback
          src={CATEGORY_IMAGES[event.category] ?? ''}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white text-sm font-medium">
          <ArrowLeft className="size-4" /> Back
        </button>
        <div className="absolute bottom-6 left-6">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{event.category}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <Calendar className="size-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Date & Time</div>
                    <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <Clock className="size-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="text-sm font-medium">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <MapPin className="size-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Venue</div>
                    <div className="text-sm font-medium">{event.venue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <Users className="size-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Capacity</div>
                    <div className="text-sm font-medium">{event.capacity} seats</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600">${event.price}</div>
                <div className="text-gray-500 text-sm">per ticket</div>
              </div>

              {event.status === 'Published' ? (
                isAuthenticated && user?.role === 'Attendee' ? (
                  <Link to={`/booking/${event.eventId}`}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Ticket className="size-5" /> Book Now
                  </Link>
                ) : isAuthenticated ? (
                  <p className="text-center text-sm text-gray-500">Only Attendees can book tickets.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-500">Sign in to book tickets</p>
                    <Link to="/login" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Login to Book
                    </Link>
                    <Link to="/register" className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                      Create Account
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                  This event is not yet published
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
