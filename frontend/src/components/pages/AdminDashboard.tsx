import { Link } from 'react-router';
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminApi, PlatformStats, UserAdminDto } from '@/api/adminApi';

export function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const [tab, setTab] = useState<'overview' | 'users'>('overview');
  const [loading, setLoading] = useState(true);
  const [roleChanging, setRoleChanging] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getUsers()])
      .then(([s, u]) => { setStats(s); setUsers(u); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setRoleChanging(userId);
    try {
      await adminApi.changeRole(userId, newRole);
      setUsers(us => us.map(u => u.userId === userId ? { ...u, role: newRole } : u));
    } catch { alert('Could not change role.'); }
    finally { setRoleChanging(null); }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview', icon: BarChart3 },
    { id: 'users',    label: '👥 Users',    icon: Users },
  ] as const;

  const SIDEBAR = [
    { label: 'Dashboard', href: '#', active: true },
    { label: 'Events',    href: '/events' },
    { label: 'Users',     href: '#', onClick: () => setTab('users') },
    { label: 'Reports',   href: '#', onClick: () => setTab('overview') },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-300 flex-shrink-0 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 text-white font-bold mb-8">
            <ShieldCheck className="size-5" /> Admin Panel
          </div>
          <nav className="space-y-1">
            {SIDEBAR.map(s => (
              <a key={s.label} href={s.href}
                onClick={(e) => { if (s.onClick) { e.preventDefault(); s.onClick(); } }}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${s.active ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}>
                {s.label}
              </a>
            ))}
            <hr className="border-gray-700 my-3" />
            <a href="/" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white">← Back to Site</a>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Platform-wide management</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse" />)}
          </div>
        ) : tab === 'overview' && stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Events',    value: stats.totalEvents,                    icon: Calendar,   color: 'bg-blue-50 text-blue-600' },
                { label: 'Total Users',     value: stats.totalUsers,                     icon: Users,      color: 'bg-green-50 text-green-600' },
                { label: 'Total Bookings',  value: stats.totalBookings,                  icon: BarChart3,  color: 'bg-purple-50 text-purple-600' },
                { label: 'Tickets Sold',    value: stats.totalTicketsSold,               icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600' },
                { label: 'Revenue',         value: `$${stats.totalRevenue.toFixed(0)}`,  icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Checked In',      value: stats.totalCheckedIn,                 icon: ShieldCheck,color: 'bg-teal-50 text-teal-600' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-xl shadow-sm p-5">
                    <div className={`size-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                      <Icon className="size-5" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Check-in Rate</h2>
              {stats.totalTicketsSold > 0 ? (
                <>
                  <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.round(stats.totalCheckedIn / stats.totalTicketsSold * 100)}%` }} />
                  </div>
                  <p className="text-sm text-gray-500">{Math.round(stats.totalCheckedIn / stats.totalTicketsSold * 100)}% checked in ({stats.totalCheckedIn}/{stats.totalTicketsSold})</p>
                </>
              ) : <p className="text-sm text-gray-400">No tickets sold yet.</p>}
            </div>
          </>
        ) : tab === 'users' ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">User Management ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-400">{u.userId}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-3 text-gray-500">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'Admin' ? 'bg-red-100 text-red-700' :
                          u.role === 'Organizer' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        {u.role !== 'Admin' ? (
                          <select defaultValue={u.role}
                            disabled={roleChanging === u.userId}
                            onChange={e => handleRoleChange(u.userId, e.target.value)}
                            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="Attendee">Attendee</option>
                            <option value="Organizer">Organizer</option>
                          </select>
                        ) : <span className="text-xs text-gray-400">Protected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
