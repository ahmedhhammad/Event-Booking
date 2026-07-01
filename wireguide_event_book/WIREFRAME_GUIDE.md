# Online Event Booking System - Wireframe Guide

## Overview
This is a complete, fully functional wireframe for an Online Event Booking System built with React, TypeScript, React Router, and Tailwind CSS. The application is mobile-responsive and ready for integration with a backend (e.g., .NET, ASP.NET MVC, Razor, or Blazor).

## Pages & Routes

### 1. **Home Page** (`/`)
- Hero section with search functionality
- Featured events carousel/grid
- Statistics section
- Call-to-action buttons

### 2. **Events Listing Page** (`/events`)
- Advanced filters (category, location, date range, price)
- Sort options (date, price, popularity)
- Grid/List view toggle
- Pagination
- Search functionality

### 3. **Event Details Page** (`/events/:id`)
- Large event banner image
- Complete event information (date, time, venue, description)
- Ticket selection with quantity controls
- Price breakdown
- Booking CTA
- Related events section

### 4. **Booking Checkout Page** (`/booking/:id`)
- Order summary
- User information form (name, email, phone)
- Payment section (placeholder)
- Price breakdown with fees
- Confirmation button

### 5. **Login Page** (`/login`)
- Email and password fields
- Remember me checkbox
- Forgot password link
- Social login options (Google, GitHub)
- Link to register page

### 6. **Register Page** (`/register`)
- Full name, email, password fields
- Password confirmation
- Terms & conditions checkbox
- Social registration options
- Link to login page

### 7. **User Dashboard** (`/dashboard`)
- Sidebar navigation (Profile, Bookings, Notifications, Logout)
- My Bookings section with:
  - Upcoming bookings
  - QR code placeholders
  - Cancel booking functionality
  - Booking status indicators
- Profile management
- Notifications feed

### 8. **Admin Dashboard** (`/admin`)
- Sidebar navigation (Dashboard, Events, Bookings, Users, Reports)
- Dashboard overview with stats cards
- Event management table with CRUD actions
- Bookings management
- User management
- Reports & analytics placeholders

## Key Features

### Design Elements
- Clean, modern UI with consistent spacing
- Blue (#3B82F6) as primary color
- Responsive grid layouts
- Card-based components
- Hover states and transitions
- Status badges (confirmed, pending, cancelled)

### Components
- **Header**: Logo, navigation menu, mobile hamburger menu
- **Footer**: Links, contact info, social media icons
- **Event Cards**: Image, title, date, location, price, CTA
- **Search Bar**: Full-width with icon
- **Filters**: Dropdowns and inputs
- **Modals**: (Ready to be implemented)
- **Forms**: Validation-ready input fields

### Mock Data
Located in `/src/app/utils/mockData.ts`:
- 8 sample events with different categories
- 2 sample bookings
- Categories and locations arrays
- Event and Booking TypeScript interfaces

### Icons
Using **Lucide React** icon library throughout:
- Ticket, Calendar, MapPin, User, Search, etc.

## Technical Stack

- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **React Router 7** - Client-side routing (Data mode)
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Backend Integration Notes

This wireframe is designed to be integrated with a .NET backend. To connect:

1. **Replace Mock Data**: Connect API endpoints to fetch real data
2. **Authentication**: Implement JWT or session-based auth
3. **Forms**: Add validation and API submission handlers
4. **Payment**: Integrate payment gateway (Stripe, PayPal, etc.)
5. **Image Uploads**: Replace Unsplash URLs with uploaded images
6. **QR Codes**: Generate real QR codes for tickets
7. **Email**: Send confirmation emails on booking
8. **Real-time Updates**: Add WebSocket for live updates

## File Structure

```
/src/app/
├── App.tsx                          # Main app component
├── routes.tsx                       # Route configuration
├── utils/
│   └── mockData.ts                  # Mock data and types
├── components/
│   ├── layouts/
│   │   └── RootLayout.tsx          # Main layout wrapper
│   ├── shared/
│   │   ├── Header.tsx              # Global header
│   │   └── Footer.tsx              # Global footer
│   └── pages/
│       ├── HomePage.tsx             # Landing page
│       ├── EventsListingPage.tsx   # Browse events
│       ├── EventDetailsPage.tsx    # Single event view
│       ├── BookingCheckoutPage.tsx # Checkout flow
│       ├── LoginPage.tsx           # User login
│       ├── RegisterPage.tsx        # User registration
│       ├── UserDashboard.tsx       # User account
│       └── AdminDashboard.tsx      # Admin panel
```

## Usage

Navigate between pages using the header menu or direct links:
- **Home**: Browse featured events
- **Events**: Filter and search all events
- **Login/Register**: Access user features
- **Dashboard**: View bookings (after login simulation)
- **Admin**: Manage platform (accessible via `/admin`)

## Customization

### Colors
Update primary colors in components by replacing:
- `bg-blue-600` → Your brand color
- `text-blue-600` → Matching text color
- `border-blue-600` → Matching border color

### Fonts
Fonts can be customized in `/src/styles/theme.css`

### Layout
All pages use a max-width container (`max-w-7xl`) for consistent spacing

## Next Steps

1. **Add Real Authentication**: Implement proper login/logout flow
2. **Connect Database**: Replace mock data with API calls
3. **Add Payment Gateway**: Integrate Stripe or similar
4. **Email Notifications**: Send booking confirmations
5. **Admin Features**: Complete CRUD operations for events
6. **Search Enhancement**: Add advanced search with filters
7. **Analytics**: Implement real charts in Reports section
8. **Testing**: Add unit and integration tests
9. **Accessibility**: Enhance ARIA labels and keyboard navigation
10. **Performance**: Optimize images and lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

Built with ❤️ for event organizers and attendees worldwide.
