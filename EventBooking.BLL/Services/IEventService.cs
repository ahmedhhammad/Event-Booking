using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IEventService
    {
        // ── Existing (untouched) ──
        Task<PagedResultDto<EventDto>> GetEventsAsync(EventQueryDto query);

        // ── Organizer cycle additions ──
        Task<EventDto> GetByIdAsync(int eventId);
        Task<IEnumerable<EventDto>> GetByOrganizerAsync(int organizerId);
        Task<EventDto> CreateEventAsync(CreateEventDto dto, int organizerId);
        Task<EventDto> UpdateEventAsync(int eventId, UpdateEventDto dto, int organizerId);
        Task<EventDto> PublishEventAsync(int eventId, int organizerId);
    }
}
