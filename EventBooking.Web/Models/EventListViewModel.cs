using EventBooking.BLL.DTOs;

namespace EventBooking.Web.Models
{
    public class EventListViewModel
    {
        public PagedResultDto<EventDto> PagedResult { get; set; } = new();
        public EventQueryDto Query { get; set; } = new();
        public List<string> Categories { get; set; } = new();
    }
}
