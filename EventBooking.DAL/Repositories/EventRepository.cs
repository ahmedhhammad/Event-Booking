using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _db;

        public EventRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<(IEnumerable<Event> Items, int TotalCount)> GetPagedAsync(
            string? searchTerm,
            string? category,
            string sortBy,
            bool sortDesc,
            int page,
            int pageSize)
        {
            IQueryable<Event> query = _db.Events.AsNoTracking();

            // Search filter
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                string pattern = $"%{searchTerm}%";
                query = query.Where(e =>
                    EF.Functions.Like(e.Title, pattern) ||
                    EF.Functions.Like(e.Description, pattern));
            }

            // Category filter
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(e => e.Category == category);
            }

            // Sort
            query = (sortBy?.ToLower()) switch
            {
                "title" => sortDesc ? query.OrderByDescending(e => e.Title) : query.OrderBy(e => e.Title),
                "price" => sortDesc ? query.OrderByDescending(e => e.Price) : query.OrderBy(e => e.Price),
                _       => sortDesc ? query.OrderByDescending(e => e.Date)  : query.OrderBy(e => e.Date),
            };

            int totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _db.Events.AsNoTracking().FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task AddAsync(Event entity)
        {
            await _db.Events.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Event entity)
        {
            _db.Events.Update(entity);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _db.Events.FindAsync(id);
            if (entity is not null)
            {
                _db.Events.Remove(entity);
                await _db.SaveChangesAsync();
            }
        }
    }
}
