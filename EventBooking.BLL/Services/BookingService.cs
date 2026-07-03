using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IEventRepository _eventRepo;

        public BookingService(IBookingRepository bookingRepo, IEventRepository eventRepo)
        {
            _bookingRepo = bookingRepo;
            _eventRepo = eventRepo;
        }

        public async Task<BookingDto> BookAsync(int eventId, int userId, int quantity)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.Status != EventStatus.Published)
                throw new InvalidOperationException("Only published events can be booked.");

            if (quantity < 1)
                throw new ArgumentException("Quantity must be at least 1.");

            var booking = new Booking
            {
                EventId = eventId,
                UserId = userId,
                Quantity = quantity,
                BookingDate = DateTime.UtcNow,
                Status = "Confirmed"
            };

            await _bookingRepo.AddAsync(booking);

            return new BookingDto
            {
                BookingId = booking.BookingId,
                EventId = eventId,
                EventTitle = ev.Title,
                EventDate = ev.Date,
                Venue = ev.Venue,
                Quantity = quantity,
                Status = booking.Status,
                BookingDate = booking.BookingDate,
                TotalPrice = ev.Price * quantity
            };
        }

        public async Task<IEnumerable<BookingDto>> GetMyBookingsAsync(int userId)
        {
            var bookings = await _bookingRepo.GetByUserIdAsync(userId);
            return bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                EventId = b.EventId,
                EventTitle = b.Event?.Title ?? string.Empty,
                EventDate = b.Event?.Date ?? default,
                Venue = b.Event?.Venue ?? string.Empty,
                Quantity = b.Quantity,
                Status = b.Status,
                BookingDate = b.BookingDate,
                TotalPrice = (b.Event?.Price ?? 0) * b.Quantity
            });
        }

        public async Task CancelAsync(int bookingId, int userId)
        {
            var booking = await _bookingRepo.GetByIdAsync(bookingId)
                ?? throw new KeyNotFoundException($"Booking {bookingId} not found.");

            if (booking.UserId != userId)
                throw new UnauthorizedAccessException("You do not own this booking.");

            if (booking.Status == "Cancelled")
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = "Cancelled";
            await _bookingRepo.UpdateAsync(booking);
        }
    }
}
