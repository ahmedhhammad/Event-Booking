using System;

namespace EventBooking.BLL.DTOs
{
    public class AdminActionLogDto
    {
        public int LogId { get; set; }
        public int AdminUserId { get; set; }
        public string AdminName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
