using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IAttendanceService
    {
        Task<AttendanceSummaryDto> GetAttendanceAsync(int eventId, int organizerId);
    }
}
