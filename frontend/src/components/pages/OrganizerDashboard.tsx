import { Link } from 'react-router';
import { Settings, PlusCircle, BarChart2, Users, Ticket, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/**
 * Organizer landing page in the React SPA.
 * The actual Organizer Hub (event list, per-event actions) lives
 * in the MVC Razor page at /Organizer — this page just links there.
 */
export function OrganizerDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      icon: PlusCircle, label: 'Create Event', desc: 'Start a new event from scratch',
      href: '/Events/Create', external: true, color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      icon: Calendar, label: 'My Events', desc: 'View and manage all your events',
      href: '/Organizer', external: true, color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    },
    {
      icon: Ticket, label: 'Ticket Categories', desc: 'Pick an event from My Events, then click 🎫 Tickets',
      href: '/Organizer', external: true, color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    },
    {
      icon: BarChart2, label: 'Revenue & Attendance', desc: 'Pick an event from My Events, then click 💰 or 📊',
      href: '/Organizer', external: true, color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Settings className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organizer Hub</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {actions.map(a => {
            const Icon = a.icon;
            return a.external ? (
              <a key={a.label} href={a.href}
                className={`flex items-start gap-4 p-5 rounded-xl shadow-sm transition-colors ${a.color}`}>
                <div className="p-2 bg-white/20 rounded-lg"><Icon className="size-5" /></div>
                <div>
                  <div className="font-semibold">{a.label}</div>
                  <div className="text-sm opacity-70 mt-0.5">{a.desc}</div>
                </div>
              </a>
            ) : (
              <Link key={a.label} to={a.href}
                className={`flex items-start gap-4 p-5 rounded-xl shadow-sm transition-colors ${a.color}`}>
                <div className="p-2 bg-gray-100 rounded-lg"><Icon className="size-5" /></div>
                <div>
                  <div className="font-semibold">{a.label}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{a.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-700">
          <strong>💡 Tip:</strong> Per-event Ticket Categories, Revenue, and Attendance are managed from the{' '}
          <a href="/Organizer" className="underline font-medium">Organizer Hub</a> page (your event table).
        </div>
      </div>
    </div>
  );
}
