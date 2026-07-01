using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IEventService
    {
        Task<PagedResultDto<EventDto>> GetEventsAsync(EventQueryDto query);
    }
}
