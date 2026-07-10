using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBooking.DAL.Entities
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }

        [Required]
        public int TicketCategoryId { get; set; }

        [Required]
        public int AttendeeUserId { get; set; }

        /// <summary>
        /// The booking this ticket belongs to. Nullable for legacy rows created before this field existed.
        /// </summary>
        public int? BookingId { get; set; }

        [Required]
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;

        public bool CheckedIn { get; set; } = false;

        // Navigation
        [ForeignKey(nameof(TicketCategoryId))]
        public TicketCategory TicketCategory { get; set; } = null!;

        [ForeignKey(nameof(AttendeeUserId))]
        public User Attendee { get; set; } = null!;

        [ForeignKey(nameof(BookingId))]
        public Booking? Booking { get; set; }
    }
}
