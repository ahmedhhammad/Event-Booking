using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface ITicketCategoryService
    {
        Task<IEnumerable<TicketCategoryDto>> GetByEventAsync(int eventId);
        Task<TicketCategoryDto> AddAsync(int eventId, CreateTicketCategoryDto dto, int organizerId);
        Task<TicketCategoryDto> UpdateAsync(int ticketCategoryId, CreateTicketCategoryDto dto, int organizerId);
    }
}
