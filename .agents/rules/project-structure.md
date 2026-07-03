---
description: EBMS project structure and where things live
globs:
alwaysApply: true
---
# EBMS Project Structure

Event Booking Management System — N-Tier ASP.NET Core MVC solution with a separate React frontend.

## Solution Layout

```
EBMS/
├── EBMS.Web/           # Presentation layer — MVC controllers, views, API endpoints
│   ├── Controllers/
│   ├── Views/
│   ├── Program.cs
│   └── appsettings.json
├── EBMS.BLL/           # Business Logic Layer — services, business rules, validation
│   ├── Services/
│   ├── Interfaces/
│   └── DTOs/
├── EBMS.DAL/           # Data Access Layer — EF Core, repositories, migrations
│   ├── Entities/
│   ├── Repositories/
│   ├── Migrations/
│   └── EBMSDbContext.cs
└── frontend/            # React 18 + Vite client
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── api/          # API client calls to EBMS.Web endpoints
    │   └── App.jsx
    └── vite.config.js
```

## Layer Responsibility Rules

- **EBMS.Web** never talks to EF Core or MySQL directly. It only calls EBMS.BLL services.
- **EBMS.BLL** never references EF Core entities outside DTO mapping. Controllers/Views only see DTOs, never raw `EBMS.DAL.Entities`.
- **EBMS.DAL** is the only layer allowed to import `Microsoft.EntityFrameworkCore` or touch `EBMSDbContext`.
- New feature = new entity (DAL) → new repository (DAL) → new service + DTO (BLL) → new controller action (Web) → new API call (frontend), in that order.

## Where New Code Goes

- New database table → `EBMS.DAL/Entities/` + migration in `EBMS.DAL/Migrations/`
- New business rule / validation → `EBMS.BLL/Services/`
- New DTO (request/response shape) → `EBMS.BLL/DTOs/`
- New page/route → `EBMS.Web/Controllers/` (or API controller) + `frontend/src/pages/`
- New reusable UI piece → `frontend/src/components/`
- New API call from frontend → `frontend/src/api/`

## Never

- Never put business logic in controllers — controllers only orchestrate calls to BLL and return results.
- Never put raw SQL or `DbContext` calls in EBMS.Web or EBMS.BLL.
- Never expose EF Core entities directly from an API endpoint — always map to a DTO first.
