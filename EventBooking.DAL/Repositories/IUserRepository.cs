using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task UpdateAsync(User entity);
    }
}
