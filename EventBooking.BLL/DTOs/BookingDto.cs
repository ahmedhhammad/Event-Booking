namespace EventBooking.BLL.DTOs
{
    public class BookingDto
    {
        public int BookingId { get; set; }
        public int EventId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string Venue { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public decimal TotalPrice { get; set; }
        /// <summary>Null if no payment attempt yet. Pending / Paid / Failed.</summary>
        public string? PaymentStatus { get; set; }

        public List<BookingLineItemDto> LineItems { get; set; } = new();
    }
}

