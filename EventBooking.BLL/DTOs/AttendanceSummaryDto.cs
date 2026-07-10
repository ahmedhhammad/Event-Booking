namespace EventBooking.BLL.DTOs
{
    public class AttendanceSummaryDto
    {
        public int EventId { get; set; }
        public List<AttendanceCategoryLineDto> Categories { get; set; } = new();
        public int TotalSold { get; set; }
        public int TotalCheckedIn { get; set; }
    }

    public class AttendanceCategoryLineDto
    {
        public string Name { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public int QuantityRemaining { get; set; }
        public int CheckedIn { get; set; }
    }
}
