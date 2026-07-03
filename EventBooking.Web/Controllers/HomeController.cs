using EventBooking.BLL.Services;
using EventBooking.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly IEventService _eventService;

        public HomeController(IEventService eventService)
        {
            _eventService = eventService;
        }

        public async Task<IActionResult> Index()
        {
            // Load published events for the featured section (first page, up to 6)
            var result = await _eventService.GetEventsAsync(new EventBooking.BLL.DTOs.EventQueryDto
            {
                Page = 1,
                PageSize = 6,
                SortBy = "date",
                SortDesc = false
            });
            return View(result.Items);
        }
    }
}
