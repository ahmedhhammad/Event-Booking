using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/bookings")]
    [Authorize(Roles = "Attendee")]
    public class BookingsApiController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsApiController(IBookingService bookingService) =>
            _bookingService = bookingService;

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetMyBookings()
        {
            var bookings = await _bookingService.GetMyBookingsAsync(GetUserId());
            return Ok(bookings);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequest req)
        {
            try
            {
                var booking = await _bookingService.BookAsync(req.EventId, GetUserId(), req.LineItems);
                return Ok(booking);
            }
            catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
            catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                await _bookingService.CancelAsync(id, GetUserId());
                return NoContent();
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }

    public class CreateBookingRequest 
    {
        public int EventId { get; set; }
        public List<EventBooking.BLL.DTOs.BookingLineItemRequest> LineItems { get; set; } = new();
    }
}
