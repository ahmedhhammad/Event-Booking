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

            // ── Skip if new image events already seeded ──
            if (await db.Events.AnyAsync(e => e.ImageUrl != null)) return;

            var events = new List<Event>
            {
                new() {
                    Title = "Andrei Stratu Event", Category = "Entertainment",
                    Date = new DateTime(2026, 8, 15, 18, 0, 0, DateTimeKind.Utc), Venue = "Central Park Arena",
                    Price = 89m, Capacity = 2000, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/andrei-stratu-kcJsQ3PJrYU-unsplash.jpg",
                    Description = "Join us for an unforgettable evening of live entertainment featuring top performers. Experience amazing shows and grab some craft beverages."
                },
                new() {
                    Title = "Campaign Creators Summit", Category = "Business",
                    Date = new DateTime(2026, 9, 22, 9, 0, 0, DateTimeKind.Utc), Venue = "Convention Center",
                    Price = 299m, Capacity = 500, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/campaign-creators-gMsnXqILjp4-unsplash.jpg",
                    Description = "Discover the latest in business strategies and marketing. Network with industry leaders, attend workshops, and explore cutting-edge products."
                },
                new() {
                    Title = "Edwin Andrade Exhibition", Category = "Art",
                    Date = new DateTime(2026, 8, 10, 12, 0, 0, DateTimeKind.Utc), Venue = "Riverside Plaza",
                    Price = 65m, Capacity = 800, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/edwin-andrade-4V1dC_eoCwg-unsplash.jpg",
                    Description = "Celebrate contemporary art with an exclusive gallery exhibition. Sample exquisite art pieces in a beautiful setting."
                },
                new() {
                    Title = "Evangeline Shaw Concert", Category = "Music",
                    Date = new DateTime(2026, 7, 25, 19, 0, 0, DateTimeKind.Utc), Venue = "Modern Art Museum",
                    Price = 45m, Capacity = 150, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/evangeline-shaw-nwLTVwb7DbU-unsplash.jpg",
                    Description = "Experience an intimate evening of live acoustic music. Enjoy cocktails, live music, and guided tours."
                },
                new() {
                    Title = "Headway Tech Conference", Category = "Technology",
                    Date = new DateTime(2026, 10, 20, 7, 0, 0, DateTimeKind.Utc), Venue = "City Center",
                    Price = 55m, Capacity = 5000, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/headway-F2KRf_QfCqw-unsplash.jpg",
                    Description = "Learn from top tech leaders and developers. Attend keynote speeches, panel discussions, and explore new tech trends."
                },
                new() {
                    Title = "Jaime Lopes Workshop", Category = "Art",
                    Date = new DateTime(2026, 9, 18, 20, 0, 0, DateTimeKind.Utc), Venue = "Laugh Factory",
                    Price = 39m, Capacity = 200, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/jaime-lopes-0RDBOAdnbWM-unsplash.jpg",
                    Description = "An evening of interactive art sessions. Get ready for hands-on experience and creative techniques."
                },
                new() {
                    Title = "Kevin Gonzalez Show", Category = "Entertainment",
                    Date = new DateTime(2026, 8, 28, 8, 30, 0, DateTimeKind.Utc), Venue = "Grand Hotel",
                    Price = 399m, Capacity = 300, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/kevin-gonzalez--NXNaE9lu6w-unsplash.jpg",
                    Description = "Experience a thrilling live performance. Perfect for audiences looking for top-notch entertainment."
                },
                new() {
                    Title = "Miguel Henriques Fest", Category = "Food",
                    Date = new DateTime(2026, 9, 2, 19, 30, 0, DateTimeKind.Utc), Venue = "Blue Note Club",
                    Price = 55m, Capacity = 120, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/miguel-henriques-RfiBK6Y_upQ-unsplash.jpg",
                    Description = "Indulge in culinary delights from local chefs. A perfect night for food lovers."
                },
                new() {
                    Title = "Paul Hanaoka Meetup", Category = "Technology",
                    Date = new DateTime(2026, 8, 5, 18, 0, 0, DateTimeKind.Utc), Venue = "Tech Hub",
                    Price = 20m, Capacity = 50, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/paul-hanaoka-6FqkGMOLskY-unsplash.jpg",
                    Description = "Meetup with fellow developers and tech enthusiasts to discuss the future of AI and software engineering."
                },
                new() {
                    Title = "Product School Bootcamp", Category = "Business",
                    Date = new DateTime(2026, 10, 10, 9, 0, 0, DateTimeKind.Utc), Venue = "Startup Center",
                    Price = 499m, Capacity = 100, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/product-school-dJICd7b_LlE-unsplash.jpg",
                    Description = "An intensive bootcamp for aspiring product managers. Learn product strategy, roadmap planning, and execution."
                },
                new() {
                    Title = "Terren Hurst Gathering", Category = "Music",
                    Date = new DateTime(2026, 7, 30, 20, 0, 0, DateTimeKind.Utc), Venue = "Outdoor Amphitheater",
                    Price = 75m, Capacity = 1500, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/terren-hurst-blgOFmPIlr0-unsplash.jpg",
                    Description = "A vibrant outdoor music festival gathering featuring electronic and alternative acts."
                },
                new() {
                    Title = "The Climate Reality Project", Category = "Business",
                    Date = new DateTime(2026, 9, 15, 10, 0, 0, DateTimeKind.Utc), Venue = "Global Center",
                    Price = 0m, Capacity = 1000, Status = EventStatus.Published, OrganizerId = organizer.UserId,
                    ImageUrl = "/images/events/the-climate-reality-project-Hb6uWq0i4MI-unsplash.jpg",
                    Description = "A free summit dedicated to discussing sustainable business practices and climate action plans."
                }
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
