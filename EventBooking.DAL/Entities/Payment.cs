using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBooking.DAL.Entities
{
    /// <summary>
    /// Records a payment attempt tied to a booking.
    /// Status: Pending → Paid (on payment_intent.succeeded)
    ///                  → Failed (on payment_intent.payment_failed)
    /// </summary>
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Required]
        public int BookingId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; }

        /// <summary>Pending / Paid / Failed</summary>
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        /// <summary>Stripe PaymentIntent ID — e.g. pi_xxxxx</summary>
        [MaxLength(255)]
        public string? StripePaymentIntentId { get; set; }

        /// <summary>Mirrors StripePaymentIntentId for legacy traceability.</summary>
        [MaxLength(255)]
        public string? TransactionId { get; set; }

        [ForeignKey(nameof(BookingId))]
        public Booking Booking { get; set; } = null!;
    }
}
