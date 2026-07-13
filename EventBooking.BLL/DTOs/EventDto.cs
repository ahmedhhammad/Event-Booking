namespace EventBooking.BLL.DTOs
{
    public class EventDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        // ── Organizer cycle additions ──
        public string Status { get; set; } = "Draft";
        public int? OrganizerId { get; set; }
        public string? ImageUrl { get; set; }
    }
}
