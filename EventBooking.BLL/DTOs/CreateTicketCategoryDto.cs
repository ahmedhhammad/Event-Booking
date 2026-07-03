namespace EventBooking.BLL.DTOs
{
    public class CreateTicketCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QuantityAvailable { get; set; }
    }
}
