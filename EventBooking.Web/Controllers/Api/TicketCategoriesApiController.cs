using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/events/{eventId}/ticket-categories")]
    public class TicketCategoriesApiController : ControllerBase
    {
        private readonly ITicketCategoryService _categoryService;
        private readonly IEventService _eventService;

        public TicketCategoriesApiController(ITicketCategoryService categoryService, IEventService eventService)
        {
            _categoryService = categoryService;
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketCategoryDto>>> GetByEventId(int eventId)
        {
            try
            {
                // Verify event exists and is published
                var ev = await _eventService.GetByIdAsync(eventId);
                if (ev.Status != "Published")
                {
                    return BadRequest(new { message = "Only published events have accessible ticket categories." });
                }

                var categories = await _categoryService.GetByEventAsync(eventId);
                return Ok(categories);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Event not found." });
            }
        }
    }
}
