# Project Recap

## Current State
- Events listing page works: search, filter, sort, pagination, TempData alerts (`/Events`)
- Auth system works: Register, Login, Logout with cookie-based auth (Role claim in cookie)
- Organizer cycle complete: Create/Edit/Publish events, Ticket Categories, Revenue, Attendance
- Migration `AddOrganizerCycle` applied: `TicketCategories` + `Tickets` tables, `Status` + `OrganizerId` columns on `Events`
- All existing endpoints and data shapes unchanged

## Architecture
- `EventBooking.Web` — ASP.NET Core MVC; controllers call BLL services only
- `EventBooking.BLL` — Services + DTOs + AutoMapper (v16); all business rules here
- `EventBooking.DAL` — EF Core + MySQL; repositories + migrations; `AppDbContext`
- Auth: cookie-based (`CookieAuthenticationDefaults`); claims include `NameIdentifier` (UserId), `Name`, `Email`, `Role`

## Recent Changes
- Added `EventStatus` enum, `TicketCategory`, `Ticket` entities; extended `Event` with `Status`/`OrganizerId`
- Added `ITicketCategoryRepository`, `ITicketRepository` and their EF Core implementations
- Added `IEventService` methods: `CreateEventAsync`, `UpdateEventAsync`, `PublishEventAsync` (Draft→Published, irreversible)
- Added `ITicketCategoryService`, `IRevenueService`, `IAttendanceService` with ownership enforcement in service layer
- Extended `EventsController` with 8 organizer-only actions; 5 new Razor views (Create, Edit, TicketCategories, Revenue, Attendance)

## Known Issues / TODO
- `EditTicketCategory GET` redirects to `TicketCategories` (no dedicated `GetByIdAsync` on service yet)
- No attendee ticket-purchase flow implemented (Tickets table exists, QuantitySold must be updated manually or via future purchase service)
- No navbar links added yet — add manually in `_Layout.cshtml` for Organizer role

## Conventions
- Namespaces: `EventBooking.*` (not `EBMS.*`)
- Entity PKs: `EventId`, `UserId`, `BookingId`, `TicketCategoryId`, `TicketId`
- `Event.Venue` (not Location); `Event.Price` is kept for listing display; per-ticket pricing is in `TicketCategory.Price`
- Publish is irreversible: `Draft → Published` only
- Organizer ownership enforced in service layer via `UnauthorizedAccessException`; controllers catch and return `Forbid()`
