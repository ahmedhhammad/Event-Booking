# Event Booking System

A simple ASP.NET Core MVC app for booking events. Users can browse events, make bookings, and get notifications. Built as a college project using a 3-tier architecture (Web / BLL / DAL).

## How to run

1. Clone the repo
2. Open `EventBooking.sln` in Visual Studio
3. Make sure MySQL is running (configured in appsettings.json)
4. Apply migrations (see below)
5. Hit F5 or `dotnet run` from the `EventBooking.Web` folder

## Applying migrations

```bash
dotnet ef database update --project EventBooking.DAL --startup-project EventBooking.Web
```

If you need to recreate the migration from scratch:

```bash
dotnet ef migrations add InitialCreate --project EventBooking.DAL --startup-project EventBooking.Web
dotnet ef database update --project EventBooking.DAL --startup-project EventBooking.Web
```