import { Outlet } from 'react-router';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
