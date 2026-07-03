using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class TicketCategoryRepository : ITicketCategoryRepository
    {
        private readonly AppDbContext _db;

        public TicketCategoryRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<TicketCategory>> GetByEventIdAsync(int eventId)
        {
            return await _db.TicketCategories
                .AsNoTracking()
                .Where(tc => tc.EventId == eventId)
                .ToListAsync();
        }

        public async Task<TicketCategory?> GetByIdAsync(int id)
        {
            return await _db.TicketCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(tc => tc.TicketCategoryId == id);
        }

        public async Task AddAsync(TicketCategory entity)
        {
            await _db.TicketCategories.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(TicketCategory entity)
        {
            _db.TicketCategories.Update(entity);
            await _db.SaveChangesAsync();
        }
    }
}
