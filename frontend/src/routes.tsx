import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from '@/context/AuthContext';
import { RootLayout } from '@/components/layouts/RootLayout';
import { HomePage } from '@/components/pages/HomePage';
import { EventsListingPage } from '@/components/pages/EventsListingPage';
import { EventDetailsPage } from '@/components/pages/EventDetailsPage';
import { BookingCheckoutPage } from '@/components/pages/BookingCheckoutPage';
import { LoginPage } from '@/components/pages/LoginPage';
import { RegisterPage } from '@/components/pages/RegisterPage';
import { UserDashboard } from '@/components/pages/UserDashboard';
import { AdminDashboard } from '@/components/pages/AdminDashboard';
import { OrganizerDashboard } from '@/components/pages/OrganizerDashboard';

/** Redirect to / while auth is loading, then gate by authenticated + role */
function RequireAuth({ role, children }: { role?: string; children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="size-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Redirect logged-in users away from login/register */
function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Perform a hard redirect to an MVC/server-side route outside the SPA */
function RedirectToMvc({ path }: { path: string }) {
  window.location.replace(path);
  return null;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public */}
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsListingPage />} />
          {/* Static segment MUST come before the dynamic :id route */}
          <Route path="events/create" element={<RedirectToMvc path="/Events/Create" />} />
          <Route path="events/:id" element={<EventDetailsPage />} />

          {/* Auth */}
          <Route path="login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

          {/* Attendee */}
          <Route path="dashboard" element={<RequireAuth role="Attendee"><UserDashboard /></RequireAuth>} />
          <Route path="booking/:id" element={<RequireAuth role="Attendee"><BookingCheckoutPage /></RequireAuth>} />

          {/* Organizer */}
          <Route path="organizer" element={<RequireAuth role="Organizer"><OrganizerDashboard /></RequireAuth>} />

          {/* Admin */}
          <Route path="admin" element={<RequireAuth role="Admin"><AdminDashboard /></RequireAuth>} />

          {/* Fallback */}
          <Route path="*" element={
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
              <a href="/" className="text-blue-600 hover:underline">← Go home</a>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
