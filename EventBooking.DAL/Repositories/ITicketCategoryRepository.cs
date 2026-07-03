using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface ITicketCategoryRepository
    {
        Task<IEnumerable<TicketCategory>> GetByEventIdAsync(int eventId);
        Task<TicketCategory?> GetByIdAsync(int id);
        Task AddAsync(TicketCategory entity);
        Task UpdateAsync(TicketCategory entity);
    }
}
