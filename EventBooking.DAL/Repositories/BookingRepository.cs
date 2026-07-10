using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _db;
        public BookingRepository(AppDbContext db) => _db = db;

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
            => await _db.Bookings
                .AsNoTracking()
                .Include(b => b.Event)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

        public async Task<Booking?> GetByIdAsync(int id)
            => await _db.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.BookingId == id);

        public async Task AddAsync(Booking entity)
        {
            await _db.Bookings.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Booking entity)
        {
            _db.Bookings.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}
