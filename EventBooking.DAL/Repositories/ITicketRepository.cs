using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface ITicketRepository
    {
        Task<IEnumerable<Ticket>> GetByEventIdAsync(int eventId);
        Task<IEnumerable<Ticket>> GetByTicketCategoryIdAsync(int ticketCategoryId);
        Task AddAsync(Ticket entity);
    }
}
