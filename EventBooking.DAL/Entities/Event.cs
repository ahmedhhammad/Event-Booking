using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBooking.DAL.Entities
{
    public class Event
    {
        [Key]
        public int EventId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Venue { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int Capacity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        // ── Organizer cycle additions (additive) ──
        public EventStatus Status { get; set; } = EventStatus.Draft;

        public int? OrganizerId { get; set; }

        [ForeignKey(nameof(OrganizerId))]
        public User? Organizer { get; set; }

        [MaxLength(500)]
        public string? ImageUrl { get; set; }

        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
        public ICollection<TicketCategory> TicketCategories { get; set; } = new List<TicketCategory>();
    }
}
