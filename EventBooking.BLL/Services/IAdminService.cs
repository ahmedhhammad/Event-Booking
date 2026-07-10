using System.Collections.Generic;
using System.Threading.Tasks;
using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IAdminService
    {
        Task UpdateUserAdminAsync(int userId, UpdateUserAdminDto dto, int adminId);
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task CancelBookingByAdminAsync(int bookingId, int adminId);
        Task ReassignBookingAsync(int bookingId, int newUserId, int adminId);
        Task<IEnumerable<EventDto>> GetAllEventsAsync();
        Task CancelEventByAdminAsync(int eventId, int adminId);
        Task<IEnumerable<AdminActionLogDto>> GetAuditLogsAsync();
    }
}
