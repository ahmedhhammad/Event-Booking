# Architecture Rules

We're using a 3-tier (N-Tier) architecture to keep our project clean, organized, and easy to maintain. By separating our code into three distinct layers, we make sure each part of the app has exactly one job, with dependencies flowing strictly in one direction: EventBooking.Web -> EventBooking.BLL -> EventBooking.DAL.

## EventBooking.DAL
This is our Data Access Layer, which handles how we store and load data.
- **What belongs here:** Database entity classes, the database context (`AppDbContext`), migrations, and any EF Core configurations (like index setup or relationship mapping via Fluent API).
- **What doesn't belong here:** Any kind of business rules, validation checks (like checking if an event is full), or web concepts (like reading cookies or processing HTTP requests).
- **Example:** The `Booking` and `Payment` entity classes, along with our database context `AppDbContext`, live strictly inside this layer.

## EventBooking.BLL
This is our Business Logic Layer, the brain of our application where all the rules live.
- **What belongs here:** Service classes and business workflows. This includes enforcing rules like checking if an event still has capacity before booking it, or determining if a booking can be cancelled within a certain time window.
- **What doesn't belong here:** Raw SQL queries or inline Entity Framework context queries, as well as any references to `HttpContext`, controller base classes, or ASP.NET Core MVC namespaces.
- **Example:** A `BookingService` class belongs here. It handles validating the booking requests, checking event capacity, and then using the DAL to save the booking once the rules are satisfied.

## EventBooking.Web
This is our presentation layer, which interacts with users and handles incoming web requests.
- **What belongs here:** Controllers, Views, ViewModels, middleware, authentication setups, and static assets. Its main job is routing requests to BLL services and returning HTML or JSON.
- **What doesn't belong here:** Directly querying the database using `AppDbContext`, or writing complex validation rules inside controller actions.
- **Example:** A `BookingController` class belongs here. When a user clicks "Book", `BookingController.Book()` handles the form submit and calls `BookingService.CreateBooking()`, instead of querying or saving database objects directly.

## Golden Rule
Web never talks to DAL directly, BLL never knows about HTTP or MVC, and DAL never knows about business rules.
