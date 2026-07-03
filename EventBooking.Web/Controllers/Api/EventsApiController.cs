using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/events")]
    public class EventsApiController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsApiController(IEventService eventService) =>
            _eventService = eventService;

        [HttpGet]
        public async Task<IActionResult> GetEvents([FromQuery] EventQueryDto query)
        {
            if (query.Page < 1) query.Page = 1;
            var result = await _eventService.GetEventsAsync(query);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var ev = await _eventService.GetByIdAsync(id);
                return Ok(ev);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }
}
