---
description: React 18 + Vite frontend conventions for EBMS
globs: frontend/**/*.{jsx,tsx,js,ts}
alwaysApply: false
---
# EBMS Frontend Conventions

## Structure

- `frontend/src/pages/` — one component per route/page (e.g. `EventsPage.jsx`)
- `frontend/src/components/` — reusable UI pieces used across pages
- `frontend/src/api/` — all calls to the EBMS.Web backend live here, never inline `fetch`/`axios` calls inside components

## Component Rules

- Functional components with hooks only. No class components.
- One component per file, filename matches component name (`EventCard.jsx` exports `EventCard`).
- Data fetching happens in the page component (or a hook), then passed down as props — child components stay presentational where possible.
- Loading and error states are handled explicitly for every API call (no silent failures, no unhandled promise rejections).

## API Calls

- All requests to EBMS.Web go through `frontend/src/api/` functions, not scattered `fetch` calls.
- Use a single base URL config (env variable), never hardcode `http://localhost:xxxx` in components.
- Match the shape of DTOs returned by the backend — if `EventDto` changes in EBMS.BLL, update the corresponding frontend type/usage in the same task.

## State

- Local component state via `useState`/`useReducer` for UI-only state.
- Don't introduce a global state library unless a real cross-page sharing need appears — prop drilling or context is enough for current app size.

## Styling

- Keep consistent with whatever styling approach is already in use in the codebase (check existing components before introducing a new pattern — CSS modules, plain CSS, or a UI library).
