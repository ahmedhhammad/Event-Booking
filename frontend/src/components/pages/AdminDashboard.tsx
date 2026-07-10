import { Link } from 'react-router';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Settings, 
  Edit, 
  Ban, 
  RefreshCw, 
  User, 
  HelpCircle,
  XCircle,
  CheckCircle,
  Bookmark
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  adminApi, 
  PlatformStats, 
  UserAdminDto, 
  BookingDto, 
  EventDto, 
  AdminActionLogDto 
} from '@/api/adminApi';
import { toast } from 'sonner';

type TabType = 'overview' | 'users' | 'bookings' | 'events' | 'logs';

export function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [logs, setLogs] = useState<AdminActionLogDto[]>([]);
  
  const [tab, setTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [editingUser, setEditingUser] = useState<UserAdminDto | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'Attendee' });
  const [reassigningBookingId, setReassigningBookingId] = useState<number | null>(null);
  const [reassignTargetUserId, setReassignTargetUserId] = useState<string>('');

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [s, u, b, e, l] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getBookings(),
        adminApi.getEvents(),
        adminApi.getAuditLogs()
      ]);
      setStats(s);
      setUsers(u);
      setBookings(b);
      setEvents(e);
      setLogs(l);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to retrieve dashboard data.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUserClick = (u: UserAdminDto) => {
    setEditingUser(u);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(true);
    try {
      await adminApi.updateUser(editingUser.userId, editForm);
      toast.success('User updated successfully.');
      setEditingUser(null);
      await fetchData(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setActionLoading(true);
    try {
      await adminApi.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully.');
      await fetchData(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReassignBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassigningBookingId) return;
    const targetId = parseInt(reassignTargetUserId);
    if (isNaN(targetId)) {
      toast.error('Please enter a valid User ID.');
      return;
    }
    setActionLoading(true);
    try {
      await adminApi.reassignBooking(reassigningBookingId, targetId);
      toast.success('Booking reassigned successfully.');
      setReassigningBookingId(null);
      setReassignTargetUserId('');
      await fetchData(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reassign booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to cancel this event? This action is irreversible.')) return;
    setActionLoading(true);
    try {
      await adminApi.cancelEvent(eventId);
      toast.success('Event cancelled successfully.');
      await fetchData(true);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel event.');
    } finally {
      setActionLoading(false);
    }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview', icon: BarChart3 },
    { id: 'users',    label: '👥 Users',    icon: Users },
    { id: 'bookings', label: '🎫 Bookings', icon: Bookmark },
    { id: 'events',   label: '📅 Events',   icon: Calendar },
    { id: 'logs',     label: '📝 Audit Logs',icon: FileText },
  ] as const;

  const SIDEBAR = [
    { label: 'Dashboard', active: tab === 'overview', onClick: () => setTab('overview') },
    { label: 'Users', active: tab === 'users', onClick: () => setTab('users') },
    { label: 'Bookings', active: tab === 'bookings', onClick: () => setTab('bookings') },
    { label: 'Events', active: tab === 'events', onClick: () => setTab('events') },
    { label: 'Audit Logs', active: tab === 'logs', onClick: () => setTab('logs') },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden lg:block border-r border-slate-800 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white font-bold mb-8 text-lg">
            <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="size-5" />
            </div>
            Admin Center
          </div>
          <nav className="space-y-1">
            {SIDEBAR.map(s => (
              <button key={s.label}
                onClick={s.onClick}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  s.active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-100'
                }`}>
                {s.label}
              </button>
            ))}
            <hr className="border-slate-800 my-4" />
            <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
              ← Main Site
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Platform management, auditing & control hub</p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shadow-sm font-medium">
            <RefreshCw className="size-4 animate-spin-hover" /> Refresh Data
          </button>
        </div>

        {/* Tab Switcher (Mobile & Desktop Tab View) */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl max-w-max border border-slate-200/50">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  tab === t.id 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                }`}>
                <Icon className="size-4" />
                {t.label.split(' ')[1] || t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse" />
              ))}
            </div>
            <div className="h-64 bg-white border border-slate-100 rounded-2xl shadow-sm animate-pulse" />
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                    { label: 'Total Bookings', value: stats.totalBookings, icon: Bookmark, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                    { label: 'Tickets Sold', value: stats.totalTicketsSold, icon: TrendingUp, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-teal-50 text-teal-600 border-teal-100' },
                    { label: 'Checked In', value: stats.totalCheckedIn, icon: ShieldCheck, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all duration-300">
                        <div>
                          <span className="text-sm font-semibold text-slate-400 block mb-1">{s.label}</span>
                          <span className="text-3xl font-black text-slate-800 tracking-tight">{s.value}</span>
                        </div>
                        <div className={`size-12 rounded-2xl ${s.color} border flex items-center justify-center shadow-inner`}>
                          <Icon className="size-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-blue-600 size-5" /> Attendance Check-in Rate
                  </h3>
                  {stats.totalTicketsSold > 0 ? (
                    <div>
                      <div className="w-full bg-slate-100 rounded-full h-4 mb-3 overflow-hidden border border-slate-200/50">
                        <div 
                          className="bg-blue-600 h-4 rounded-full transition-all duration-1000 shadow-inner" 
                          style={{ width: `${Math.round(stats.totalCheckedIn / stats.totalTicketsSold * 100)}%` }} 
                        />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        {Math.round(stats.totalCheckedIn / stats.totalTicketsSold * 100)}% of tickets checked in ({stats.totalCheckedIn} / {stats.totalTicketsSold})
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-sm">No ticket metrics available.</p>
                  )}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {tab === 'users' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-800">User Management</h3>
                  <span className="text-xs bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-bold">Total: {users.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left">ID</th>
                        <th className="px-6 py-4 text-left">Name</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Role</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {users.map(u => (
                        <tr key={u.userId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-bold">#{u.userId}</td>
                          <td className="px-6 py-4 text-slate-900">{u.name}</td>
                          <td className="px-6 py-4 text-slate-500">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              u.role === 'Admin' ? 'bg-red-50 text-red-600 border border-red-100' :
                              u.role === 'Organizer' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleEditUserClick(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 transition-all font-semibold active:scale-95">
                              <Edit className="size-3.5" /> Edit Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {tab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-800">System Bookings</h3>
                  <span className="text-xs bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-bold">Total: {bookings.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left">ID</th>
                        <th className="px-6 py-4 text-left">Event</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {bookings.map(b => (
                        <tr key={b.bookingId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-bold">#{b.bookingId}</td>
                          <td className="px-6 py-4 text-slate-900 font-bold">{b.eventTitle}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(b.eventDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-800">{b.quantity}</td>
                          <td className="px-6 py-4 text-right text-slate-900 font-bold">${b.totalPrice}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                              b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {b.status === 'Confirmed' ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                disabled={b.status === 'Cancelled' || actionLoading}
                                onClick={() => setReassigningBookingId(b.bookingId)}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold active:scale-95">
                                Reassign
                              </button>
                              <button 
                                disabled={b.status === 'Cancelled' || actionLoading}
                                onClick={() => handleCancelBooking(b.bookingId)}
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-xs text-red-600 disabled:opacity-50 disabled:pointer-events-none transition-all font-bold active:scale-95 border border-red-100">
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {tab === 'events' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-800">All Events</h3>
                  <span className="text-xs bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-bold">Total: {events.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left">ID</th>
                        <th className="px-6 py-4 text-left">Title</th>
                        <th className="px-6 py-4 text-left">Category</th>
                        <th className="px-6 py-4 text-left">Venue</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {events.map(e => (
                        <tr key={e.eventId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-6 py-4 text-slate-400 font-bold">#{e.eventId}</td>
                          <td className="px-6 py-4 text-slate-900 font-bold">{e.title}</td>
                          <td className="px-6 py-4 text-slate-500">{e.category}</td>
                          <td className="px-6 py-4 text-slate-500">{e.venue}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(e.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${
                              e.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              e.status === 'Draft' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {e.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              disabled={e.status === 'Cancelled' || actionLoading}
                              onClick={() => handleCancelEvent(e.eventId)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-xs text-rose-600 disabled:opacity-50 disabled:pointer-events-none transition-all font-bold active:scale-95 border border-rose-100 inline-flex items-center gap-1">
                              <Ban className="size-3.5" /> Cancel Event
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Audit Logs Tab */}
            {tab === 'logs' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-lg font-bold text-slate-800">Admin Action Audit Log</h3>
                  <span className="text-xs bg-slate-200/70 text-slate-600 px-3 py-1 rounded-full font-bold">Total logs: {logs.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left">Log ID</th>
                        <th className="px-6 py-4 text-left">Admin</th>
                        <th className="px-6 py-4 text-left">Action</th>
                        <th className="px-6 py-4 text-left">Details</th>
                        <th className="px-6 py-4 text-left">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No actions logged yet.</td>
                        </tr>
                      ) : (
                        logs.map(l => (
                          <tr key={l.logId} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-bold">#{l.logId}</td>
                            <td className="px-6 py-4 text-slate-900">{l.adminName || `Admin #${l.adminUserId}`}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                {l.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 max-w-md break-words">{l.details}</td>
                            <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Settings className="text-blue-600 size-5" /> Edit User Profile
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">System Role</label>
                <select 
                  value={editForm.role}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold bg-white"
                >
                  <option value="Attendee">Attendee</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-colors disabled:opacity-50">
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Booking Modal */}
      {reassigningBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="text-blue-600 size-5" /> Reassign Ticket Booking
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the target User ID to reassign booking <strong>#{reassigningBookingId}</strong>.
            </p>
            <form onSubmit={handleReassignBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Attendee (User ID)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 5"
                  value={reassignTargetUserId}
                  onChange={e => setReassignTargetUserId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => { setReassigningBookingId(null); setReassignTargetUserId(''); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 transition-colors disabled:opacity-50">
                  {actionLoading ? 'Reassigning...' : 'Reassign Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
