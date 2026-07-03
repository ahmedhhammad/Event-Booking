using System.ComponentModel.DataAnnotations;

namespace EventBooking.DAL.Entities
{
    public class Inquiry
    {
        [Key]
        public int InquiryId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Message { get; set; } = string.Empty;

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
