using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class InquiryRepository : IInquiryRepository
    {
        private readonly AppDbContext _db;
        public InquiryRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(Inquiry entity)
        {
            await _db.Inquiries.AddAsync(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<Inquiry>> GetAllAsync()
            => await _db.Inquiries.AsNoTracking().OrderByDescending(i => i.SubmittedAt).ToListAsync();
    }
}
