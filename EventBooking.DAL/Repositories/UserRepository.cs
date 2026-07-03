using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<User>> GetAllAsync()
            => await _db.Users.AsNoTracking().OrderBy(u => u.Name).ToListAsync();

        public async Task<User?> GetByIdAsync(int id)
            => await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);

        public async Task UpdateAsync(User entity)
        {
            _db.Users.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}
