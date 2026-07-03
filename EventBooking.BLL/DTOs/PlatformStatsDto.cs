namespace EventBooking.BLL.DTOs
{
    public class PlatformStatsDto
    {
        public int TotalEvents { get; set; }
        public int TotalUsers { get; set; }
        public int TotalBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalTicketsSold { get; set; }
        public int TotalCheckedIn { get; set; }
    }
}
