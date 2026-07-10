# Event Booking Management System (EBMS)

An event booking platform built with ASP.NET Core MVC (N-Tier architecture) and a React frontend.

## Tech Stack

- **Backend:** ASP.NET Core MVC (.NET), N-Tier architecture
  - `EventBooking.DAL` — Data Access Layer (Entity Framework Core)
  - `EventBooking.BLL` — Business Logic Layer
  - `EventBooking.WEB` — Web/API Layer
- **Frontend:** React 18 + Vite
- **Database:** MySQL
- **Payments:** Stripe
- **Roles:** Guest / Attendee / Organizer / Admin / Owner


## Applying migrations

```bash
git clone https://github.com/ahmedhhammad/Event-Booking.git
cd Event-Booking
git checkout dev
```

### 2. Backend setup

```bash
cd EventBooking.WEB
```

Create/update your local `appsettings.Development.json` (do **not** commit real credentials — this file should be gitignored):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=EventBookingDB;User=root;Password=YOUR_PASSWORD;"
  },
  "Stripe": {
    "PublishableKey": "pk_test_xxx",
    "SecretKey": "sk_test_xxx"
  }
}
```

> Ask the team lead for test Stripe keys — never use live keys in development.

Restore packages and apply migrations:

```bash
dotnet restore
dotnet ef database update --project EventBooking.DAL --startup-project EventBooking.WEB
```

Run the backend:

```bash
dotnet run --project EventBooking.WEB
```

### 3. Frontend setup

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will typically run on `http://localhost:5173` and expects the backend API to be running (check `frontend/.env` or `vite.config.js` for the API base URL).

---

## Common Commands

### Adding a new EF Core migration

```bash
dotnet ef migrations add MigrationName --project EventBooking.DAL --startup-project EventBooking.WEB
dotnet ef database update --project EventBooking.DAL --startup-project EventBooking.WEB
```

### Removing the last migration (if not yet applied)

```bash
dotnet ef migrations remove --project EventBooking.DAL --startup-project EventBooking.WEB
```

---

## Git Workflow

We use a `main` / `dev` / `feature` branch strategy. **Never commit directly to `main` or `dev`.**

1. Start from latest `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/short-name
   ```
2. Commit your work with clear messages:
   ```bash
   git commit -m "feat: add booking form validation"
   ```
3. Push and open a Pull Request into `dev`:
   ```bash
   git push -u origin feature/short-name
   ```
4. Fill out the PR template, link the related issue (`Closes #issue-number`), and request review.
5. Wait for approval before merging — do not merge your own PR.
6. After merge, delete your local and remote feature branch.

Full details in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## Project Structure

```
Event-Booking/
├── EventBooking.DAL/      # Entity Framework models, DbContext, migrations
├── EventBooking.BLL/      # Business logic, services
├── EventBooking.WEB/      # Controllers, API endpoints, appsettings
├── frontend/               # React + Vite app
│   ├── src/
│   └── package.json
├── CONTRIBUTING.md
└── README.md
```

---

## Troubleshooting

- **`npm run dev` fails with missing modules** → run `npm install` inside `frontend/`
- **EF Core migration errors** → make sure you're passing both `--project` and `--startup-project` flags exactly as shown above
- **MySQL connection errors** → confirm your local MySQL server is running and your connection string matches your local credentials
- **Merge conflicts** → don't force push; ping the team lead before resolving conflicts on shared files

---

## Team

- **Team Lead:** Ahmed Hammad ([@ahmedhhammad](https://github.com/ahmedhhammad))
