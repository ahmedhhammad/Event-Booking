import { useParams, Link } from 'react-router';
import { Calendar, MapPin, Clock, Users, Tag, ArrowLeft, Ticket } from 'lucide-react';
import { mockEvents } from '../../utils/mockData';
import { useState } from 'react';

export function EventDetailsPage() {
  const { id } = useParams();
  const event = mockEvents.find(e => e.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-700">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const relatedEvents = mockEvents
    .filter(e => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="size-4" />
            Back to Events
          </Link>
        </div>
      </div>

      {/* Event Banner */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3">
                {event.category}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Date & Time</div>
                    <div className="font-medium text-gray-900">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-gray-600">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Venue</div>
                    <div className="font-medium text-gray-900">{event.venue}</div>
                    <div className="text-gray-600">{event.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Capacity</div>
                    <div className="font-medium text-gray-900">{event.totalSeats} seats</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Ticket className="size-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Available</div>
                    <div className="font-medium text-gray-900">{event.availableSeats} seats</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Tag className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-medium text-gray-900">{event.category}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${event.price}
                  <span className="text-lg text-gray-500 font-normal"> / ticket</span>
                </div>
                <div className="text-sm text-green-600">
                  {event.availableSeats} tickets available
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>General Admission - ${event.price}</option>
                    <option>VIP - ${event.price * 2}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max={event.availableSeats}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${event.price * quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${(event.price * quantity * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${(event.price * quantity * 1.1).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to={`/booking/${event.id}?quantity=${quantity}`}
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Book Now
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free cancellation up to 24 hours before the event
              </p>
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <div
                  key={relatedEvent.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-40 bg-gray-200">
                    <img
                      src={relatedEvent.image}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {relatedEvent.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Calendar className="size-4" />
                      <span>{new Date(relatedEvent.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">${relatedEvent.price}</span>
                      <Link
                        to={`/events/${relatedEvent.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
