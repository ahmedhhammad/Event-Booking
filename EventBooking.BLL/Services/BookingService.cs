using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepo;
        private readonly IEventRepository _eventRepo;
        private readonly ITicketRepository _ticketRepo;
        private readonly ITicketCategoryRepository _ticketCategoryRepo;

        public BookingService(
            IBookingRepository bookingRepo, 
            IEventRepository eventRepo,
            ITicketRepository ticketRepo,
            ITicketCategoryRepository ticketCategoryRepo)
        {
            _bookingRepo = bookingRepo;
            _eventRepo = eventRepo;
            _ticketRepo = ticketRepo;
            _ticketCategoryRepo = ticketCategoryRepo;
        }

        public async Task<BookingDto> BookAsync(int eventId, int userId, int quantity)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.Status != EventStatus.Published)
                throw new InvalidOperationException("Only published events can be booked.");

            if (quantity < 1)
                throw new ArgumentException("Quantity must be at least 1.");

            // Get available ticket categories for the event
            var categories = await _ticketCategoryRepo.GetByEventIdAsync(eventId);
            var category = categories.FirstOrDefault() 
                ?? throw new InvalidOperationException("No ticket categories available for this event.");

            if (category.QuantityAvailable < quantity)
                throw new InvalidOperationException("Not enough tickets available.");

            var booking = new Booking
            {
                EventId = eventId,
                UserId = userId,
                Quantity = quantity,
                BookingDate = DateTime.UtcNow,
                Status = "Confirmed"
            };

            await _bookingRepo.AddAsync(booking);

            // Update ticket category counts
            category.QuantityAvailable -= quantity;
            category.QuantitySold += quantity;
            await _ticketCategoryRepo.UpdateAsync(category);

            // Generate individual tickets
            for (int i = 0; i < quantity; i++)
            {
                var ticket = new Ticket
                {
                    TicketCategoryId = category.TicketCategoryId,
                    AttendeeUserId = userId,
                    PurchasedAt = DateTime.UtcNow,
                    CheckedIn = false
                };
                await _ticketRepo.AddAsync(ticket);
            }

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
            
            // Note: In a full system, you would also free up the tickets and update the category counts here.
            // For now, we are just marking the booking as Cancelled.
        }
    }
}
