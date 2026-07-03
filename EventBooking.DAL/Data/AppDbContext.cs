using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        // ── Organizer cycle ──
        public DbSet<TicketCategory> TicketCategories { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // unique email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Booking 1 --- 1 Payment
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BookingId);

            // User 1 --- * Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Event 1 --- * Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Event)
                .WithMany(e => e.Bookings)
                .HasForeignKey(b => b.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            // User 1 --- * Notification
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ── Organizer cycle relationships ──

            // Event (Organizer) — nullable FK, no cascade
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Organizer)
                .WithMany()
                .HasForeignKey(e => e.OrganizerId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);

            // Event.Status default
            modelBuilder.Entity<Event>()
                .Property(e => e.Status)
                .HasDefaultValue(EventStatus.Draft);

            // Event 1 --- * TicketCategory
            modelBuilder.Entity<TicketCategory>()
                .HasOne(tc => tc.Event)
                .WithMany(e => e.TicketCategories)
                .HasForeignKey(tc => tc.EventId)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketCategory 1 --- * Ticket
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.TicketCategory)
                .WithMany(tc => tc.Tickets)
                .HasForeignKey(t => t.TicketCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // User 1 --- * Ticket (attendee)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Attendee)
                .WithMany()
                .HasForeignKey(t => t.AttendeeUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
