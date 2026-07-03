namespace EventBooking.BLL.DTOs
{
    public class CreateEventDto
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
