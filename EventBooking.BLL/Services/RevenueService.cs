using EventBooking.BLL.DTOs;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class RevenueService : IRevenueService
    {
        private readonly IEventRepository _eventRepo;
        private readonly ITicketCategoryRepository _categoryRepo;
        private readonly ITicketRepository _ticketRepo;

        public RevenueService(IEventRepository eventRepo, ITicketCategoryRepository categoryRepo, ITicketRepository ticketRepo)
        {
            _eventRepo = eventRepo;
            _categoryRepo = categoryRepo;
            _ticketRepo = ticketRepo;
        }

        public async Task<RevenueSummaryDto> GetRevenueAsync(int eventId, int organizerId)
        {
            var ev = await _eventRepo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            var categories = await _categoryRepo.GetByEventIdAsync(eventId);
            var confirmedTickets = await _ticketRepo.GetConfirmedByEventIdAsync(eventId);

            var lines = categories.Select(tc => {
                var categoryTickets = confirmedTickets.Where(t => t.TicketCategoryId == tc.TicketCategoryId).ToList();
                int qtySold = categoryTickets.Count;

                return new RevenueCategoryLineDto
                {
                    Name = tc.Name,
                    Price = tc.Price,
                    QuantitySold = qtySold,
                    Subtotal = qtySold * tc.Price
                };
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
