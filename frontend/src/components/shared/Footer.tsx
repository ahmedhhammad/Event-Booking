import { Link } from 'react-router';
import { Ticket, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="size-6 text-blue-500" />
              <span className="text-xl font-semibold text-white">EventBook</span>
            </div>
            <p className="text-sm text-gray-400">
              Your premier destination for discovering and booking amazing events. Join thousands of event-goers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/events?category=Music" className="hover:text-white transition-colors">Music</Link></li>
              <li><Link to="/events?category=Technology" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link to="/events?category=Food" className="hover:text-white transition-colors">Food &amp; Drink</Link></li>
              <li><Link to="/events?category=Sports" className="hover:text-white transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Mail className="size-4 mt-0.5 flex-shrink-0" /><span>support@eventbook.com</span></li>
              <li className="flex items-start gap-2"><Phone className="size-4 mt-0.5 flex-shrink-0" /><span>+1 (555) 123-4567</span></li>
              <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 flex-shrink-0" /><span>123 Event Street, New York, NY 10001</span></li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="size-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="size-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="size-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="size-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>© {new Date().getFullYear()} EventBook. All rights reserved. | <a href="#" className="hover:text-white">Privacy Policy</a> | <a href="#" className="hover:text-white">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
}
