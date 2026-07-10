using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.DAL.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _db;

        public TicketRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<Ticket>> GetByEventIdAsync(int eventId)
        {
            return await _db.Tickets
                .AsNoTracking()
                .Include(t => t.TicketCategory)
                .Where(t => t.TicketCategory.EventId == eventId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetByTicketCategoryIdAsync(int ticketCategoryId)
        {
            return await _db.Tickets
                .AsNoTracking()
                .Where(t => t.TicketCategoryId == ticketCategoryId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetByBookingIdAsync(int bookingId)
        {
            return await _db.Tickets
                .AsNoTracking()
                .Where(t => t.BookingId == bookingId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Ticket>> GetConfirmedByEventIdAsync(int eventId)
        {
            return await _db.Tickets
                .AsNoTracking()
                .Include(t => t.TicketCategory)
                .Where(t => t.TicketCategory.EventId == eventId && 
                            t.Booking != null && 
                            t.Booking.Status == "Confirmed")
                .ToListAsync();
        }

        public async Task AddAsync(Ticket entity)
        {
            await _db.Tickets.AddAsync(entity);
            await _db.SaveChangesAsync();
        }
    }
}
