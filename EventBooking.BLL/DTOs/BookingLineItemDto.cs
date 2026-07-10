namespace EventBooking.BLL.DTOs
{
    public class BookingLineItemDto
    {
        public int TicketCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal => Quantity * UnitPrice;
    }
}
