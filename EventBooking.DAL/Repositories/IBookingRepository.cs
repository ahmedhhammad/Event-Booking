using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
        Task<Booking?> GetByIdAsync(int id);
        Task AddAsync(Booking entity);
        Task UpdateAsync(Booking entity);
    }
}
