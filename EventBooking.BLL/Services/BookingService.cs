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

        public async Task<BookingDto> BookAsync(int eventId, int userId, List<BookingLineItemRequest> items)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.Status != EventStatus.Published)
                throw new InvalidOperationException("Only published events can be booked.");

            if (items == null || !items.Any())
                throw new ArgumentException("At least one ticket must be selected.");

            // Get available ticket categories for the event
            var categories = await _ticketCategoryRepo.GetByEventIdAsync(eventId);
            var categoryDict = categories.ToDictionary(c => c.TicketCategoryId);

            int totalQuantity = 0;
            decimal totalPrice = 0;
            var lineItemDtos = new List<BookingLineItemDto>();

            // Validate all items before creating the booking
            foreach (var item in items)
            {
                if (item.Quantity < 1)
                    throw new ArgumentException("Quantity must be at least 1.");

                if (!categoryDict.TryGetValue(item.TicketCategoryId, out var category))
                    throw new InvalidOperationException($"Ticket category {item.TicketCategoryId} is not available for this event.");

                if (category.QuantityAvailable < item.Quantity)
                    throw new InvalidOperationException($"Not enough tickets available for {category.Name}.");

                totalQuantity += item.Quantity;
                totalPrice += category.Price * item.Quantity;

                lineItemDtos.Add(new BookingLineItemDto
                {
                    TicketCategoryId = item.TicketCategoryId,
                    CategoryName = category.Name,
                    Quantity = item.Quantity,
                    UnitPrice = category.Price
                });
            }

            var booking = new Booking
            {
                EventId = eventId,
                UserId = userId,
                Quantity = totalQuantity,
                BookingDate = DateTime.UtcNow,
                // Pending until Stripe payment_intent.succeeded webhook confirms it
                Status = "Pending"
            };

            await _bookingRepo.AddAsync(booking);

            foreach (var item in items)
            {
                var category = categoryDict[item.TicketCategoryId];
                
                // Update ticket category counts
                category.QuantityAvailable -= item.Quantity;
                category.QuantitySold += item.Quantity;
                await _ticketCategoryRepo.UpdateAsync(category);

                // Generate individual tickets
                for (int i = 0; i < item.Quantity; i++)
                {
                    var ticket = new Ticket
                    {
                        TicketCategoryId = category.TicketCategoryId,
                        AttendeeUserId = userId,
                        BookingId = booking.BookingId, // Link ticket to this booking
                        PurchasedAt = DateTime.UtcNow,
                        CheckedIn = false
                    };
                    await _ticketRepo.AddAsync(ticket);
                }
            }

            return new BookingDto
            {
                BookingId = booking.BookingId,
                EventId = eventId,
                EventTitle = ev.Title,
                EventDate = ev.Date,
                Venue = ev.Venue,
                Quantity = totalQuantity,
                Status = booking.Status,
                BookingDate = booking.BookingDate,
                TotalPrice = totalPrice,
                PaymentStatus = null, // Payment not yet created
                LineItems = lineItemDtos
            };
        }

        public async Task<IEnumerable<BookingDto>> GetMyBookingsAsync(int userId)
        {
            var bookings = await _bookingRepo.GetByUserIdAsync(userId);
            var dtos = new List<BookingDto>();

            foreach (var b in bookings)
            {
                var tickets = await _ticketRepo.GetByBookingIdAsync(b.BookingId);
                
                // Group tickets by category to reconstruct line items
                var groupedTickets = tickets
                    .GroupBy(t => t.TicketCategoryId)
                    .ToList();

                var lineItems = new List<BookingLineItemDto>();
                
                // Note: GetMyBookingsAsync doesn't load ticket categories currently, 
                // but since we need CategoryName and UnitPrice, we need to fetch them.
                var eventCategories = await _ticketCategoryRepo.GetByEventIdAsync(b.EventId);
                var catDict = eventCategories.ToDictionary(c => c.TicketCategoryId);

                decimal totalPrice = 0;

                foreach (var group in groupedTickets)
                {
                    if (catDict.TryGetValue(group.Key, out var cat))
                    {
                        int qty = group.Count();
                        totalPrice += cat.Price * qty;
                        lineItems.Add(new BookingLineItemDto
                        {
                            TicketCategoryId = cat.TicketCategoryId,
                            CategoryName = cat.Name,
                            Quantity = qty,
                            UnitPrice = cat.Price
                        });
                    }
                }

                // Fallback for old bookings that don't have linked tickets
                if (!lineItems.Any() && b.Quantity > 0)
                {
                    totalPrice = (b.Event?.Price ?? 0) * b.Quantity;
                }

                dtos.Add(new BookingDto
                {
                    BookingId = b.BookingId,
                    EventId = b.EventId,
                    EventTitle = b.Event?.Title ?? string.Empty,
                    EventDate = b.Event?.Date ?? default,
                    Venue = b.Event?.Venue ?? string.Empty,
                    Quantity = b.Quantity,
                    Status = b.Status,
                    BookingDate = b.BookingDate,
                    TotalPrice = totalPrice,
                    PaymentStatus = b.Payment?.Status,
                    LineItems = lineItems
                });
            }

            return dtos;
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
