namespace EventBooking.BLL.DTOs
{
    public class EventQueryDto
    {
        public string? SearchTerm { get; set; }
        public string? Category { get; set; }
        public string SortBy { get; set; } = "date";
        public bool SortDesc { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 9;
    }
}
