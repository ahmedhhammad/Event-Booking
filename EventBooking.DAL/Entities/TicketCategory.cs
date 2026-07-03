using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBooking.DAL.Entities
{
    public class TicketCategory
    {
        [Key]
        public int TicketCategoryId { get; set; }

        [Required]
        public int EventId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int QuantityAvailable { get; set; }

        public int QuantitySold { get; set; } = 0;

        // Navigation
        [ForeignKey(nameof(EventId))]
        public Event Event { get; set; } = null!;

        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
