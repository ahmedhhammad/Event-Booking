using EventBooking.BLL.DTOs;
using EventBooking.DAL.Data;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.BLL.Services
{
    public class PlatformStatsService : IPlatformStatsService
    {
        private readonly AppDbContext _db;

        public PlatformStatsService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<PlatformStatsDto> GetStatsAsync()
        {
            var totalEvents = await _db.Events.CountAsync();
            var totalUsers = await _db.Users.CountAsync();
            var totalBookings = await _db.Bookings.CountAsync();
            var totalRevenue = await _db.TicketCategories
                .SumAsync(tc => (decimal)(tc.QuantitySold * tc.Price));
            var totalTicketsSold = await _db.TicketCategories.SumAsync(tc => tc.QuantitySold);
            var totalCheckedIn = await _db.Tickets.CountAsync(t => t.CheckedIn);

            return new PlatformStatsDto
            {
                TotalEvents = totalEvents,
                TotalUsers = totalUsers,
                TotalBookings = totalBookings,
                TotalRevenue = totalRevenue,
                TotalTicketsSold = totalTicketsSold,
                TotalCheckedIn = totalCheckedIn
            };
        }
    }
}
