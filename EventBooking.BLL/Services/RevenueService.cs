using EventBooking.BLL.DTOs;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class RevenueService : IRevenueService
    {
        private readonly IEventRepository _eventRepo;
        private readonly ITicketCategoryRepository _categoryRepo;

        public RevenueService(IEventRepository eventRepo, ITicketCategoryRepository categoryRepo)
        {
            _eventRepo = eventRepo;
            _categoryRepo = categoryRepo;
        }

        public async Task<RevenueSummaryDto> GetRevenueAsync(int eventId, int organizerId)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            var categories = await _categoryRepo.GetByEventIdAsync(eventId);

            var lines = categories.Select(tc => new RevenueCategoryLineDto
            {
                Name = tc.Name,
                Price = tc.Price,
                QuantitySold = tc.QuantitySold,
                Subtotal = tc.QuantitySold * tc.Price
            }).ToList();

            return new RevenueSummaryDto
            {
                EventId = eventId,
                Categories = lines,
                TotalRevenue = lines.Sum(l => l.Subtotal)
            };
        }
    }
}
