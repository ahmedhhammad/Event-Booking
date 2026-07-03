using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IRevenueService
    {
        Task<RevenueSummaryDto> GetRevenueAsync(int eventId, int organizerId);
    }
}
