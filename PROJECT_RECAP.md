# Project Recap: EventBooking N-Tier Application

This document summarizes the state of the EventBooking application, which has transitioned from a traditional MVC monolithic structure to a hybrid architecture featuring an API backend and a modern React/Vite Single Page Application (SPA).

## Architecture & Layers

The solution is divided into the following key components:

1. **EBMS.DAL (Data Access Layer)**
   - Manages the database schema using Entity Framework Core and MySQL.
   - Core entities: `User`, `Event`, `TicketCategory`, `Booking`, `Inquiry`, `Notification`.
   - Seed data provided via `DataSeeder.cs`, which idempotently populates initial users, events, and categories.
   - Includes repositories for encapsulated database access.

2. **EBMS.BLL (Business Logic Layer)**
   - Houses the core business rules and orchestrates data transformations.
   - Exposes clean interfaces and utilizes DTOs to separate the DAL from the presentation layer.
   - Services implemented: `EventService`, `BookingService`, `AuthService`, `UserAdminService`, `PlatformStatsService`, etc.

3. **EBMS.Web (Presentation Layer / API Backend)**
   - The ASP.NET Core application running on port `7001`.
   - Contains traditional MVC controllers for Organizer flows (Event management, Ticket Categories, Revenue, Attendance) and Guest inquiries.
   - Hosts JSON REST APIs under `Controllers/Api` (`/api/events`, `/api/bookings`, `/api/auth`, `/api/admin`) specifically designed to power the React frontend.
   - Configured with CORS (`ReactDev` policy) and customized cookie authentication handling to return 401/403 responses instead of MVC redirects when accessed from the SPA.

4. **Frontend (React SPA)**
   - A modern Vite + React 18 frontend running on port `5173`.
   - Integrates the Figma wireframe designs (`wireguide_event_book`) utilizing Tailwind CSS 4 and shadcn/ui components.
   - Communicates with the .NET backend via the custom API client in `src/api/client.ts`, with Vite proxying requests to bypass CORS issues in development or utilizing `credentials: 'include'` for persistent sessions.
   - Incorporates role-based routing (Attendee, Organizer, Admin) and dynamic data fetching.

## Key Features Implemented

*   **Authentication & Authorization:** Secure login/registration flows leveraging ASP.NET Core Identity cookies, smoothly integrated with the React `AuthContext`.
*   **Role-Based Access Control:** Distinct experiences and access rights for Guests, Attendees, Organizers, and Admins.
*   **Event Browsing & Booking:** Attendees can search, filter, view event details, and book tickets directly within the SPA.
*   **User Dashboard:** A personalized space for attendees to view and manage (cancel) their bookings.
*   **Admin Dashboard:** A high-level overview featuring platform-wide statistics (events, users, revenue) and a user management table for assigning roles.
*   **Organizer Hub Integration:** Organizers are provided a React landing page that seamlessly links out to the dedicated MVC views for advanced event management tasks.

## Future Roadmap / Next Steps

*   **Payment Integration:** Implement a robust payment gateway (e.g., Stripe, PayPal) for the ticket booking checkout flow.
*   **Notification System:** Finalize real-time or email notifications for booking confirmations, event updates, and system alerts.
*   **Complete SPA Transition:** Gradually migrate the remaining Organizer MVC views (Event Creation, Ticket Categories, Revenue Tracking) into the React SPA for a fully unified frontend experience.
*   **Testing:** Expand automated test coverage across both the .NET BLL/Controllers and the React components.
