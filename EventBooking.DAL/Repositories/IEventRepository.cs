using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface IEventRepository
    {
        Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
            string? searchTerm,
            string? category,
            string sortBy,
            bool sortDesc,
            int page,
            int pageSize
        );

        /// <summary>Public-facing fetch — excludes Cancelled events.</summary>
        Task<Event?> GetByIdAsync(int id);
        /// <summary>Organizer/Admin fetch — returns the event regardless of status.</summary>
        Task<Event?> GetByIdUnrestrictedAsync(int id);
        Task<IEnumerable<Event>> GetByOrganizerAsync(int organizerId);
        Task AddAsync(Event entity);
        Task UpdateAsync(Event entity);
        Task DeleteAsync(int id);
    }
}
