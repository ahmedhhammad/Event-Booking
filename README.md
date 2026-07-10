# Event Booking System

A full-stack event booking platform built with ASP.NET Core (Web / BLL / DAL) and a React + Vite frontend.

## ⚡ Quick Start (new clone)

> **No manual migration steps needed.** The app automatically creates and migrates the database on first run.

### Prerequisites

| Tool | Version |
|------|---------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0+ |
| [MySQL](https://dev.mysql.com/downloads/) | 8.0+ (running on port 3306) |
| [Node.js](https://nodejs.org/) | 18+ (for the React frontend) |

### 1 — Clone the repo

```bash
git clone <repo-url>
cd Event-Booking
```

### 2 — Configure your database connection

If your MySQL credentials differ from `root / root`, create a local override file:

```bash
copy EventBooking.Web\appsettings.Development.example.json EventBooking.Web\appsettings.Development.json
```

Then edit `appsettings.Development.json` with your credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=EventBookingDb;User=YOUR_USER;Password=YOUR_PASSWORD;"
  }
}
```

> `appsettings.Development.json` is gitignored — it will never be committed.  
> If you use `root / root` (MySQL default), you can **skip this step entirely**.

### 3 — Run the backend

```bash
dotnet run --project EventBooking.Web
```

On first run the app will:
- ✅ Create the `EventBookingDb` database (if it doesn't exist)
- ✅ Apply all EF Core migrations automatically
- ✅ Seed sample events, organizer, attendee, and admin accounts

### 4 — Run the frontend (optional, for React UI)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Dev seed accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@admin.com` | `test1234` |
| Organizer | `organizer@seed.dev` | `Seed@1234` |
| Attendee | `attendee@seed.dev` | `Seed@1234` |

## Stripe Test Cards

Use any future expiry date, any 3-digit CVC, and any postal code.

### ✅ Successful Payments
| Card Number           | Brand      |
|------------------------|------------|
| 4242 4242 4242 4242    | Visa       |
| 5555 5555 5555 4444    | Mastercard |

### ❌ Declined Payments
| Card Number           | Result                         |
|------------------------|---------------------------------|
| 4000 0000 0000 0002    | Card declined (generic)         |
| 4000 0000 0000 9995    | Declined — insufficient funds   |

Full reference: https://docs.stripe.com/testing

---

## 🏗️ Architecture

```
EventBooking.Web   — ASP.NET Core MVC + REST API controllers
EventBooking.BLL   — Business logic, services, DTOs
EventBooking.DAL   — EF Core, repositories, migrations, seeding
frontend/          — React 18 + Vite client
```

---

## Adding a migration (developers only)

```bash
dotnet ef migrations add <MigrationName> --project EventBooking.DAL --startup-project EventBooking.Web
```

> You do **not** need to run `dotnet ef database update` — the app applies migrations automatically on startup.