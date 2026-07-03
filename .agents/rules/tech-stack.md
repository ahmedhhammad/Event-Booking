---
description: EBMS tech stack, versions, and standard conventions
globs:
alwaysApply: true
---
# EBMS Tech Stack

## Backend

- **Framework:** ASP.NET Core MVC (N-Tier architecture: Web / BLL / DAL)
- **ORM:** Entity Framework Core, Code-First migrations
- **Database:** MySQL
- **Auth:** Cookie-based authentication; passwords hashed with BCrypt
- **Dependency Injection:** built-in ASP.NET Core DI — register services/repositories in `Program.cs`, always via interfaces (`IUserService` → `UserService`), never concrete classes directly

## Frontend

- **Framework:** React 18
- **Build tool:** Vite
- **Data fetching:** calls EBMS.Web API endpoints via `frontend/src/api/`
- Functional components with hooks only — no class components

## Standard Conventions

- All new services get an interface in `EBMS.BLL/Interfaces/` before the implementation.
- All EF Core changes go through a migration (`dotnet ef migrations add <Name>`), never manual schema edits.
- DTOs are suffixed `Dto` (e.g. `EventDto`, `BookingRequestDto`), entities are not.
- Passwords: always BCrypt hash + verify, never store or log plaintext.
- Auth-protected controller actions use `[Authorize]`; never re-implement session checks manually.
- MySQL connection string lives in `appsettings.json` / environment config, never hardcoded.
- Frontend API calls use a single shared client/base URL config, not hardcoded endpoint strings scattered across components.

## When Adding a New Package/Library

- Backend: confirm it's compatible with the currently installed EF Core / ASP.NET Core version before adding.
- Frontend: prefer existing dependencies already in `package.json` over introducing a new library for the same job.
