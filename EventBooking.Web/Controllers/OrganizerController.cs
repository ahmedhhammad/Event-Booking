using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers
{
    [Authorize(Roles = "Organizer")]
    public class OrganizerController : Controller
    {
        private readonly IEventService _eventService;
        private readonly IConfiguration _configuration;

        public OrganizerController(IEventService eventService, IConfiguration configuration)
        {
            _eventService = eventService;
            _configuration = configuration;
        }

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        public async Task<IActionResult> Index()
        {
            var events = await _eventService.GetByOrganizerAsync(GetCurrentUserId());
            return View(events);
        }

        /// <summary>
        /// Redirects to the React Organizer Hub page using the configured frontend URL.
        /// </summary>
        public IActionResult Hub()
        {
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            return Redirect($"{frontendUrl}/Organizer");
        }
    }
}
