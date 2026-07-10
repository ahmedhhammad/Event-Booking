using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Seeding
{
    /// <summary>
    /// Dev-only seeder. Called from Program.cs inside IsDevelopment().
    /// Inserts the 8 sample events from the wireguide mockData.ts.
    /// Idempotent — skips if Events table already has rows.
    /// </summary>
    public static class DataSeeder
    {
        // Pre-computed BCrypt hash of "Seed@1234" (cost=11) — dev seed only
        private const string SeedPasswordHash =
            "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.";

        public static async Task SeedAsync(AppDbContext db)
        {
            // ── Seed admin user if absent ──
            var admin = await db.Users.FirstOrDefaultAsync(u => u.Email == "admin@admin.com");
            if (admin is null)
            {
                db.Users.Add(new User
                {
                    Name = "Admin",
                    Email = "admin@admin.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("test1234"),
                    Role = "Admin"
                });
                await db.SaveChangesAsync();
            }

            // ── Seed organizer user if absent ──
            var organizer = await db.Users.FirstOrDefaultAsync(u => u.Email == "organizer@seed.dev");
            if (organizer is null)
            {
                organizer = new User
                {
                    Name = "Seed Organizer",
                    Email = "organizer@seed.dev",
                    PasswordHash = SeedPasswordHash,
                    Role = "Organizer"
                };
                db.Users.Add(organizer);
                await db.SaveChangesAsync();
            }

            // ── Seed attendee user for sample bookings ──
            var attendee = await db.Users.FirstOrDefaultAsync(u => u.Email == "attendee@seed.dev");
            if (attendee is null)
            {
                attendee = new User
                {
                    Name = "Seed Attendee",
                    Email = "attendee@seed.dev",
                    PasswordHash = SeedPasswordHash,
                    Role = "Attendee"
                };
                db.Users.Add(attendee);
                await db.SaveChangesAsync();
            }

            // ── Skip if events already seeded ──
            if (await db.Events.AnyAsync()) return;

            var events = new List<Event>
            {
                new() {
                    Title = "Summer Music Festival 2026",
                    Category = "Music",
                    Date = new DateTime(2026, 6, 15, 18, 0, 0, DateTimeKind.Utc),
                    Venue = "Central Park Arena",
                    Price = 89m,
                    Capacity = 2000,
                    Description = "Join us for an unforgettable evening of live music featuring top artists from around the world. Experience amazing performances across multiple stages with food trucks and craft beverages.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Tech Innovation Summit",
                    Category = "Technology",
                    Date = new DateTime(2026, 4, 22, 9, 0, 0, DateTimeKind.Utc),
                    Venue = "Convention Center",
                    Price = 299m,
                    Capacity = 500,
                    Description = "Discover the latest in technology and innovation. Network with industry leaders, attend workshops, and explore cutting-edge products from leading tech companies.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Food & Wine Festival",
                    Category = "Food",
                    Date = new DateTime(2026, 5, 10, 12, 0, 0, DateTimeKind.Utc),
                    Venue = "Riverside Plaza",
                    Price = 65m,
                    Capacity = 800,
                    Description = "Indulge in culinary delights from world-renowned chefs. Sample exquisite wines, gourmet dishes, and artisanal foods in a beautiful outdoor setting.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Art Gallery Opening",
                    Category = "Art",
                    Date = new DateTime(2026, 4, 5, 19, 0, 0, DateTimeKind.Utc),
                    Venue = "Modern Art Museum",
                    Price = 45m,
                    Capacity = 150,
                    Description = "Celebrate contemporary art with an exclusive gallery opening featuring emerging and established artists. Enjoy cocktails, live music, and guided tours.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Marathon Championship",
                    Category = "Sports",
                    Date = new DateTime(2026, 7, 20, 7, 0, 0, DateTimeKind.Utc),
                    Venue = "City Center",
                    Price = 55m,
                    Capacity = 5000,
                    Description = "Watch elite runners compete in this prestigious marathon event. Cheer on participants as they race through scenic city routes.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Comedy Night Live",
                    Category = "Entertainment",
                    Date = new DateTime(2026, 4, 18, 20, 0, 0, DateTimeKind.Utc),
                    Venue = "Laugh Factory",
                    Price = 39m,
                    Capacity = 200,
                    Description = "An evening of non-stop laughter with some of the funniest comedians in the country. Get ready for stand-up, improv, and interactive comedy.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Business Leadership Conference",
                    Category = "Business",
                    Date = new DateTime(2026, 5, 28, 8, 30, 0, DateTimeKind.Utc),
                    Venue = "Grand Hotel",
                    Price = 399m,
                    Capacity = 300,
                    Description = "Learn from top business leaders and entrepreneurs. Attend keynote speeches, panel discussions, and networking sessions designed to elevate your business acumen.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
                new() {
                    Title = "Jazz & Blues Night",
                    Category = "Music",
                    Date = new DateTime(2026, 6, 2, 19, 30, 0, DateTimeKind.Utc),
                    Venue = "Blue Note Club",
                    Price = 55m,
                    Capacity = 120,
                    Description = "Experience smooth jazz and soulful blues performed by talented musicians in an intimate club setting. A perfect night for music lovers.",
                    Status = EventStatus.Published,
                    OrganizerId = organizer.UserId,
                },
            };

            db.Events.AddRange(events);
            await db.SaveChangesAsync();

            // ── Seed one TicketCategory per event (General Admission) ──
            var ticketCategories = events.Select(ev => new TicketCategory
            {
                EventId = ev.EventId,
                Name = "General Admission",
                Price = ev.Price,
                QuantityAvailable = ev.Capacity,
                QuantitySold = 0,
            }).ToList();
            db.TicketCategories.AddRange(ticketCategories);
            await db.SaveChangesAsync();

            // ── 2 sample bookings (mockData.ts B001, B002) ──
            var event1 = events[0]; // Summer Music Festival
            var event3 = events[2]; // Food & Wine Festival

            db.Bookings.AddRange(
                new Booking
                {
                    EventId = event1.EventId,
                    UserId = attendee.UserId,
                    Quantity = 2,
                    BookingDate = new DateTime(2026, 3, 10, 0, 0, 0, DateTimeKind.Utc),
                    Status = "Confirmed",
                },
                new Booking
                {
                    EventId = event3.EventId,
                    UserId = attendee.UserId,
                    Quantity = 3,
                    BookingDate = new DateTime(2026, 3, 12, 0, 0, 0, DateTimeKind.Utc),
                    Status = "Confirmed",
                }
            );
            await db.SaveChangesAsync();
        }
    }
}
