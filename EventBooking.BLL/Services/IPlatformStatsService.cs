using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IPlatformStatsService
    {
        Task<PlatformStatsDto> GetStatsAsync();
    }
}
