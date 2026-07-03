namespace EventBooking.BLL.DTOs
{
    public class RevenueSummaryDto
    {
        public int EventId { get; set; }
        public List<RevenueCategoryLineDto> Categories { get; set; } = new();
        public decimal TotalRevenue { get; set; }
    }

    public class RevenueCategoryLineDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QuantitySold { get; set; }
        public decimal Subtotal { get; set; }
    }
}
