namespace EventBooking.BLL.DTOs
{
    /// <summary>Only usable while Status == Draft.</summary>
    public class UpdateEventDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Venue { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int Capacity { get; set; }
        public decimal Price { get; set; }
    }
}
