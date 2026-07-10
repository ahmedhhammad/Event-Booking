using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventBooking.DAL.Entities
{
    public class AdminActionLog
    {
        [Key]
        public int LogId { get; set; }

        [Required]
        public int AdminUserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; } = string.Empty;

        [Required]
        public string Details { get; set; } = string.Empty;

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(AdminUserId))]
        public User AdminUser { get; set; } = null!;
    }
}
