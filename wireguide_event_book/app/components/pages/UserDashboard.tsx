import { Link } from 'react-router';
import { User, Ticket, Bell, LogOut, Calendar, MapPin, QrCode, X } from 'lucide-react';
import { mockBookings } from '../../utils/mockData';
import { useState } from 'react';

export function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'profile' | 'notifications'>('bookings');
  const [bookings, setBookings] = useState(mockBookings);

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
      ));
      alert('Booking cancelled successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your bookings and profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="size-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">john@example.com</div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="size-5" />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Ticket className="size-5" />
                  <span className="font-medium">My Bookings</span>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="size-5" />
                  <span className="font-medium">Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    3
                  </span>
                </button>

                <Link
                  to="/login"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-5" />
                  <span className="font-medium">Logout</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                  <Link
                    to="/events"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Events
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Ticket className="size-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start exploring events and book your first ticket!
                    </p>
                    <Link
                      to="/events"
                      className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {booking.eventTitle}
                                  </h3>
                                  <div className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2">
                                    <span
                                      className={
                                        booking.status === 'confirmed'
                                          ? 'bg-green-100 text-green-700'
                                          : booking.status === 'pending'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'
                                      }
                                    >
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-start gap-2">
                                  <Calendar className="size-4 mt-0.5 flex-shrink-0" />
                                  <span>
                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}{' '}
                                    at {booking.time}
                                  </span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                                  <span>{booking.venue}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Ticket className="size-4 mt-0.5 flex-shrink-0" />
                                  <span>{booking.tickets} ticket(s) • ${booking.totalPrice}</span>
                                </div>
                              </div>

                              <div className="text-xs text-gray-500">
                                Booking ID: {booking.id} • Booked on{' '}
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                              {/* QR Code Placeholder */}
                              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                <QrCode className="size-12 text-gray-400" />
                              </div>
                              <p className="text-xs text-center text-gray-500">
                                Scan QR code at venue
                              </p>

                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                  <X className="size-4" />
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-shrink-0">
                      <Bell className="size-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Event Reminder: Summer Music Festival
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Your event is coming up in 3 days! Don't forget to arrive early.
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Ticket className="size-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Booking Confirmed
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Your booking for Food & Wine Festival has been confirmed.
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <Calendar className="size-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        New Events in Your Area
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Check out 5 new events happening near you this month!
                      </p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
