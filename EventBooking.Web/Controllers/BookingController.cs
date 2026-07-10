using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers
{
    [Authorize(Roles = "Attendee")]
    public class BookingController : Controller
    {
        private readonly IBookingService _bookingService;
        private readonly IEventService _eventService;

        public BookingController(IBookingService bookingService, IEventService eventService)
        {
            _bookingService = bookingService;
            _eventService = eventService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET /Booking/Book/5
        [HttpGet]
        public async Task<IActionResult> Book(int id)
        {
            try
            {
                var ev = await _eventService.GetByIdAsync(id);
                return View(ev);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        // POST /Booking/Book
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Book(int eventId, int quantity)
        {
            try
            {
                // Fallback for MVC view: pick the first category available
                var categories = await (HttpContext.RequestServices.GetService(typeof(ITicketCategoryService)) as ITicketCategoryService)!.GetByEventAsync(eventId);
                var firstCat = categories.FirstOrDefault() ?? throw new Exception("No ticket categories available.");

                var items = new List<EventBooking.BLL.DTOs.BookingLineItemRequest>
                {
                    new EventBooking.BLL.DTOs.BookingLineItemRequest
                    {
                        TicketCategoryId = firstCat.TicketCategoryId,
                        Quantity = quantity
                    }
                };

                var booking = await _bookingService.BookAsync(eventId, GetUserId(), items);
                TempData["Success"] = $"Booking confirmed! Booking #{booking.BookingId} for \"{booking.EventTitle}\".";
                return RedirectToAction(nameof(MyBookings));
            }
            catch (Exception ex)
            {
                TempData["Error"] = ex.Message;
                return RedirectToAction(nameof(Book), new { id = eventId });
            }
        }

        // GET /Booking/MyBookings
        [HttpGet]
        public async Task<IActionResult> MyBookings()
        {
            var bookings = await _bookingService.GetMyBookingsAsync(GetUserId());
            return View(bookings);
        }

        // POST /Booking/Cancel/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Cancel(int id)
        {
            try
            {
                await _bookingService.CancelAsync(id, GetUserId());
                TempData["Success"] = "Booking cancelled.";
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (Exception ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(MyBookings));
        }
    }
}
