import { Link } from 'react-router';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Power,
  Eye,
  Search,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { mockEvents, mockBookings } from '../../utils/mockData';
import { useState } from 'react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'bookings' | 'users' | 'reports'>('dashboard');
  const [events, setEvents] = useState(mockEvents);

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
      alert('Event deleted successfully!');
    }
  };

  const handleTogglePublish = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, published: !e.published } : e
    ));
  };

  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalBookings = mockBookings.length;
  const totalEvents = events.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 min-h-screen sticky top-0">
          <div className="p-6">
            <div className="flex items-center gap-2 text-white mb-8">
              <Calendar className="size-8 text-blue-500" />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <LayoutDashboard className="size-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'events'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Calendar className="size-5" />
                <span className="font-medium">Manage Events</span>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'bookings'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Ticket className="size-5" />
                <span className="font-medium">Bookings</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Users className="size-5" />
                <span className="font-medium">Users</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <BarChart3 className="size-5" />
                <span className="font-medium">Reports</span>
              </button>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Eye className="size-5" />
                <span className="font-medium">View Site</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'events' && 'Manage Events'}
                {activeTab === 'bookings' && 'Bookings Management'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'reports' && 'Reports & Analytics'}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Admin User</span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="size-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <DollarSign className="size-5 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="size-4" />
                      <span>+12.5% from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Bookings</span>
                      <Ticket className="size-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {totalBookings}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="size-4" />
                      <span>+8.2% from last month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Active Events</span>
                      <Calendar className="size-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {totalEvents}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span>{events.filter(e => new Date(e.date) > new Date()).length} upcoming</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Users</span>
                      <Users className="size-5 text-orange-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      1,234
                    </div>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="size-4" />
                      <span>+15.3% from last month</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Event</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBookings.slice(0, 5).map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{booking.id}</td>
                            <td className="py-3 px-4 text-sm font-medium">{booking.eventTitle}</td>
                            <td className="py-3 px-4 text-sm">
                              {new Date(booking.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm">${booking.totalPrice}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    <Plus className="size-5" />
                    Create New Event
                  </button>
                </div>

                {/* Events Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Event</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Category</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Available</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="font-medium text-gray-900">{event.title}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm">{event.category}</td>
                            <td className="py-4 px-6 text-sm">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-sm">{event.location}</td>
                            <td className="py-4 px-6 text-sm font-medium">${event.price}</td>
                            <td className="py-4 px-6 text-sm">
                              {event.availableSeats}/{event.totalSeats}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                                <button
                                  onClick={() => handleTogglePublish(event.id)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Publish/Unpublish"
                                >
                                  <Power className="size-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Event</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tickets</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-medium">{booking.id}</td>
                          <td className="py-3 px-4 text-sm">{booking.eventTitle}</td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-sm">{booking.tickets}</td>
                          <td className="py-3 px-4 text-sm font-medium">${booking.totalPrice}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
                <div className="mb-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Bookings</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">John Doe</td>
                        <td className="py-3 px-4 text-sm">john@example.com</td>
                        <td className="py-3 px-4 text-sm">March 1, 2026</td>
                        <td className="py-3 px-4 text-sm">2</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Profile
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium">Jane Smith</td>
                        <td className="py-3 px-4 text-sm">jane@example.com</td>
                        <td className="py-3 px-4 text-sm">February 15, 2026</td>
                        <td className="py-3 px-4 text-sm">5</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Profile
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Analytics</h2>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - Revenue over time</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Event Categories</h2>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Pie chart placeholder</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Trends</h2>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Line chart placeholder</p>
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
