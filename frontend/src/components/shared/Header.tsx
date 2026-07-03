import { Link, useLocation, useNavigate } from 'react-router';
import { Ticket, Menu, X, LogOut, LayoutDashboard, Settings, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    toast.info('Logged out successfully');
    navigate('/');
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Ticket className="size-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">EventBook</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {/* Contact — links to the MVC inquiry page */}
            <a href="/Inquiry/Create" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {user.role === 'Attendee' && (
                  <Link to="/dashboard" className={`text-sm flex items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                )}
                {user.role === 'Organizer' && (
                  <a href="/Organizer" className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors">
                    <Settings className="size-4" /> Organizer Hub
                  </a>
                )}
                {user.role === 'Admin' && (
                  <Link to="/admin" className={`text-sm flex items-center gap-1 transition-colors ${isActive('/admin') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Settings className="size-4" /> Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <UserCircle className="size-5 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{user.role}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors ml-1"
                  >
                    <LogOut className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-6 text-gray-600" /> : <Menu className="size-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 space-y-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm ${isActive(link.path) ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user ? (
              <>
                {user.role === 'Attendee' && (
                  <Link to="/dashboard" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                )}
                {user.role === 'Admin' && (
                  <Link to="/admin" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                )}
                {user.role === 'Organizer' && (
                  <a href="/Organizer" className="block py-2 text-sm text-gray-600">Organizer Hub</a>
                )}
                <button onClick={handleLogout} className="block w-full text-left py-2 text-sm text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 text-sm text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
