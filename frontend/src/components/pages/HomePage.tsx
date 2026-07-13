import { Link, useNavigate } from 'react-router';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventsApi, EventDto } from '@/api/eventsApi';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useAuth } from '@/context/AuthContext';

// Unsplash category images fallback
const CATEGORY_IMAGES: Record<string, string> = {
  Music: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  Food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
  Art: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
  Sports: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
  Entertainment: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
  Business: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
};

function eventImage(ev: EventDto) {
  return CATEGORY_IMAGES[ev.category] ?? 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800';
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    eventsApi.getEvents({ page: 1, pageSize: 6, sortBy: 'date' })
      .then(res => setFeaturedEvents(res.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/events${searchQuery ? `?searchTerm=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Find and book tickets for concerts, conferences, workshops, and more
            </p>
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-md">
                  <Search className="size-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events by name, date, category..."
                    className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                  Search Events
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Events</h2>
              <p className="text-gray-600">Don't miss these popular upcoming events</p>
            </div>
            <Link to="/events" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              View All <ArrowRight className="size-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((ev) => (
                <div key={ev.eventId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <ImageWithFallback
                      src={eventImage(ev)}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ${ev.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">
                      {ev.category}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{ev.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="size-4" />
                        <span>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="size-4" />
                        <span>{ev.venue}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/events/${ev.eventId}`}
                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
                        View Details
                      </Link>
                      {isAuthenticated && user?.role === 'Attendee' && (
                        <Link to={`/booking/${ev.eventId}`}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium text-sm">
                          Book
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/events" className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-8">
            View All Events <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['1000+', 'Events'], ['50K+', 'Happy Customers'], ['100+', 'Cities'], ['500+', 'Organizers']].map(([val, label]) => (
              <div key={label}>
                <div className="text-4xl font-bold text-blue-600 mb-2">{val}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest CTA */}
      {!isAuthenticated && (
        <section className="py-16 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to start booking?</h2>
            <p className="text-gray-600 mb-8">Create your free account and get access to thousands of events.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Create Free Account
              </Link>
              <Link to="/contact" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
