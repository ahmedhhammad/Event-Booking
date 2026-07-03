using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IBookingService
    {
        Task<BookingDto> BookAsync(int eventId, int userId, int quantity);
        Task<IEnumerable<BookingDto>> GetMyBookingsAsync(int userId);
        Task CancelAsync(int bookingId, int userId);
    }
}
