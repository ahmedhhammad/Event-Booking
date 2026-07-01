import { Link } from 'react-router';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { mockEvents } from '../../utils/mockData';
import { useState } from 'react';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredEvents = mockEvents.filter(event => event.featured);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Find and book tickets for concerts, conferences, workshops, and more
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-xl p-2">
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
                <Link
                  to={`/events${searchQuery ? `?search=${searchQuery}` : ''}`}
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-center"
                >
                  Search Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Events</h2>
              <p className="text-gray-600">Don't miss these popular upcoming events</p>
            </div>
            <Link
              to="/events"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${event.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-3">
                    {event.category}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="size-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="size-4" />
                      <span>{event.venue}, {event.location}</span>
                    </div>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/events"
            className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium mt-8"
          >
            View All Events <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Organizers</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
