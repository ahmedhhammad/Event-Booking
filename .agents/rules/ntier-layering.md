---
description: N-Tier layering rules for EBMS.Web / EBMS.BLL / EBMS.DAL — how data flows between layers
globs: **/*.cs
alwaysApply: false
---
# N-Tier Layering Conventions

## Flow of a Request

```
Controller (EBMS.Web)
   → Service (EBMS.BLL, via interface)
      → Repository (EBMS.DAL, via interface)
         → EBMSDbContext (EF Core)
```

Every call goes down through this chain. No layer skips the one below it — a controller never calls a repository directly, and a repository never calls a service.

## Controllers (EBMS.Web)

- Inject services via constructor, using the interface type (`IEventService`, not `EventService`).
- Keep actions thin: validate input shape → call one service method → return result. No loops, no business branching in the controller.
- Return DTOs, never entities.

## Services (EBMS.BLL)

- One interface + one implementation per service (`IEventService` / `EventService`).
- Business rules, validation, and orchestration across repositories live here — this is the only layer allowed to combine data from multiple repositories.
- Map entity → DTO here before returning to the controller.

## Repositories (EBMS.DAL)

- One interface + one implementation per aggregate/entity (`IEventRepository` / `EventRepository`).
- Repositories only do data access: CRUD and queries against `EBMSDbContext`. No business logic, no DTO mapping here.
- Use async methods (`GetByIdAsync`, `AddAsync`, etc.) consistently.

## Adding a New Feature — Checklist

1. Entity in `EBMS.DAL/Entities/` (if new table needed) + migration
2. Repository interface + implementation in `EBMS.DAL`
3. DTO(s) in `EBMS.BLL/DTOs/`
4. Service interface + implementation in `EBMS.BLL`, register in `Program.cs` DI container
5. Controller action in `EBMS.Web`, calling the service
6. Frontend API call in `frontend/src/api/` + UI in `frontend/src/pages` or `components`
