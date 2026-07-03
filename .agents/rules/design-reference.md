---
description: wireguide_event_book is the design source of truth for all frontend UI/UX
globs: frontend/**/*.{jsx,tsx,js,ts,css}
alwaysApply: true
---
# Design Reference

The directory "wireguide_event_book" (project root, sibling to frontend/) is the Figma-derived
design system for this project. It contains:

- app/components/ui/ — the shadcn/ui component set (button, card, dialog, form, table, tabs,
  sidebar, etc.)
- app/components/layouts/, app/components/shared/ — layout, Header, Footer
- app/components/pages/ — reference page layouts (Home, Events Listing, Event Details, Checkout,
  Login, Register, User Dashboard, Admin)
- styles/tailwind.css, theme.css, fonts.css — colors, typography, spacing tokens

## Rule

Any new frontend page, component, or feature — now or in the future — must use the components and
styling already merged in from wireguide_event_book, not new ad hoc styling.

- Reuse an existing component from `components/ui/` before writing a new one. Only add a new UI
  primitive if nothing in that set fits.
- Match existing spacing, color tokens, and typography from `theme.css` — don't introduce new
  colors, fonts, or spacing values outside what's already defined there.
- New pages follow the same layout pattern as the reference pages (RootLayout wrapper, Header/
  Footer, same container widths) unless there's a specific reason not to.
- If a new feature doesn't have an obvious matching pattern in the wireframe, build it in the
  closest existing style rather than inventing a new visual language.

This applies to all roles (Guest, Attendee, Organizer, Admin) — the whole app shares one design
system, not per-role styling.
