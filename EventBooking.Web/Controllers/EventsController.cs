using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using EventBooking.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;

        private static readonly List<string> _categories = new()
        {
            "Conference", "Workshop", "Concert", "Sports", "Festival", "Other"
        };

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        // GET /Events
        public async Task<IActionResult> Index(EventQueryDto query)
        {
            // Guard against invalid page numbers
            if (query.Page < 1) query.Page = 1;

            var result = await _eventService.GetEventsAsync(query);

            var vm = new EventListViewModel
            {
                PagedResult = result,
                Query = query,
                Categories = _categories
            };

            return View(vm);
        }
    }
}
