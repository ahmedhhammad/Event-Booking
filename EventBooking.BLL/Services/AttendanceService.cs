using EventBooking.BLL.DTOs;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IEventRepository _eventRepo;
        private readonly ITicketCategoryRepository _categoryRepo;
        private readonly ITicketRepository _ticketRepo;

        public AttendanceService(
            IEventRepository eventRepo,
            ITicketCategoryRepository categoryRepo,
            ITicketRepository ticketRepo)
        {
            _eventRepo = eventRepo;
            _categoryRepo = categoryRepo;
            _ticketRepo = ticketRepo;
        }

        public async Task<AttendanceSummaryDto> GetAttendanceAsync(int eventId, int organizerId)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            var categories = await _categoryRepo.GetByEventIdAsync(eventId);
            var allTickets = await _ticketRepo.GetConfirmedByEventIdAsync(eventId);

            var lines = categories.Select(tc =>
            {
                var categoryTickets = allTickets.Where(t => t.TicketCategoryId == tc.TicketCategoryId).ToList();
                return new AttendanceCategoryLineDto
                {
                    Name = tc.Name,
                    QuantitySold = categoryTickets.Count,
                    QuantityRemaining = tc.QuantityAvailable,
                    CheckedIn = categoryTickets.Count(t => t.CheckedIn)
                };
            }).ToList();

            return new AttendanceSummaryDto
            {
                EventId = eventId,
                Categories = lines,
                TotalSold = lines.Sum(l => l.QuantitySold),
                TotalCheckedIn = lines.Sum(l => l.CheckedIn)
            };
        }
    }
}
