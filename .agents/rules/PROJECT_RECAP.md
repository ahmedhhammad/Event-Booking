# Project Recap

## Current State
- **4 roles working**: Guest (unauthenticated), Attendee, Organizer, Admin
- Events listing (search/filter/sort/pagination) at `/Events` — public
- Attendee: Browse events, Book tickets (`/Booking/Book/{id}`), My Bookings, Dashboard
- Organizer: Create/Edit/Publish events, Ticket Categories, Revenue, Attendance (hub at `/Organizer`)
- Admin: Dashboard stats, Manage Users, Manage Events, Reports + Inquiries (at `/Admin`)
- Guest: Browse events, Contact form at `/Inquiry/Create` (no account needed)
- Auth: Register (Attendee or Organizer), Login, Logout, AccessDenied pages
- Migration `AddInquiryTable` applied: `Inquiries` table added

## Architecture
- `EventBooking.Web` — ASP.NET Core MVC; Bootstrap 5; cookie auth
- `EventBooking.BLL` — Services + DTOs + AutoMapper (v16)
- `EventBooking.DAL` — EF Core + MySQL; repositories + migrations; `AppDbContext`

## Roles & Routes
| Role        | Key Routes                                              |
|-------------|----------------------------------------------------------|
| Guest       | `/`, `/Events`, `/Events/Index`, `/Inquiry/Create`      |
| Attendee    | `/Dashboard`, `/Booking/Book/{id}`, `/Booking/MyBookings` |
| Organizer   | `/Organizer`, `/Events/Create`, `/Events/Edit/{id}`, `/Events/{id}/TicketCategories`, `/Events/{id}/Revenue`, `/Events/{id}/Attendance` |
| Admin       | `/Admin`, `/Admin/Users`, `/Admin/Events`, `/Admin/Reports` |

## Auth / Claims
- Cookie: `ClaimTypes.NameIdentifier` (UserId), `ClaimTypes.Name`, `ClaimTypes.Email`, `ClaimTypes.Role`
- Default role on register: **Attendee** (was "User" — existing rows need SQL update)
- Admin cannot be set via UI; must be set directly in DB
- `AccessDeniedPath` → `/Account/AccessDenied`

## Known Issues / TODO
- Existing users with `Role = 'User'` won't match `[Authorize(Roles = "Attendee")]`
  → Run: `UPDATE Users SET Role = 'Attendee' WHERE Role = 'User'`
- No password confirmation field on Register (add ConfirmPassword + Compare attribute if needed)
- Booking does not deduct from `Event.Capacity` (future: add capacity check in BookingService)
- Admin event delete not yet implemented (placeholder in AdminController.DeleteEvent)
- No QR code generation for tickets (wireframe mentions it — future feature)

## Conventions
- Namespaces: `EventBooking.*`
- Entity PKs: `EventId`, `UserId`, `BookingId`, `TicketCategoryId`, `TicketId`, `InquiryId`
- `Event.Venue` (not Location); `Event.Price` retained; ticket pricing via `TicketCategory.Price`
- Publish is irreversible: `Draft → Published`
- Organizer ownership enforced in service layer (throws `UnauthorizedAccessException`)
- Attendee ownership on booking cancel enforced in `BookingService`
- Admin role changes capped at Attendee/Organizer (cannot set Admin via UI)
