namespace EventBooking.BLL.DTOs
{
    public class TicketCategoryDto
    {
        public int TicketCategoryId { get; set; }
        public int EventId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QuantityAvailable { get; set; }
        public int QuantitySold { get; set; }
    }
}
