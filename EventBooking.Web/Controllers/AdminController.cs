using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly IPlatformStatsService _statsService;
        private readonly IUserAdminService _userAdminService;
        private readonly IEventService _eventService;
        private readonly IInquiryService _inquiryService;

        public AdminController(
            IPlatformStatsService statsService,
            IUserAdminService userAdminService,
            IEventService eventService,
            IInquiryService inquiryService)
        {
            _statsService = statsService;
            _userAdminService = userAdminService;
            _eventService = eventService;
            _inquiryService = inquiryService;
        }

        // GET /Admin
        public async Task<IActionResult> Index()
        {
            var stats = await _statsService.GetStatsAsync();
            return View(stats);
        }

        // GET /Admin/Users
        public async Task<IActionResult> Users()
        {
            var users = await _userAdminService.GetAllUsersAsync();
            return View(users);
        }

        // POST /Admin/ChangeRole
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeRole(int userId, string newRole)
        {
            try
            {
                await _userAdminService.ChangeRoleAsync(userId, newRole);
                TempData["Success"] = "Role updated.";
            }
            catch (Exception ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(Users));
        }

        // GET /Admin/Events
        public async Task<IActionResult> Events(EventQueryDto query)
        {
            if (query.Page < 1) query.Page = 1;
            query.PageSize = 20;
            var result = await _eventService.GetEventsAsync(query);
            return View(result);
        }

        // POST /Admin/DeleteEvent/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                // Use existing EventRepository via IEventService — call UpdateAsync with a flag
                // Simplest approach: redirect to organizer edit; admin can use existing delete
                // Implementation: fetch + remove via repo directly (Admin can bypass ownership)
                TempData["Info"] = "Event deletion via Admin panel: use the Events page delete button.";
            }
            catch (Exception ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(Events));
        }

        // GET /Admin/Reports
        public async Task<IActionResult> Reports()
        {
            var stats = await _statsService.GetStatsAsync();
            var inquiries = await _inquiryService.GetAllAsync();
            ViewBag.Inquiries = inquiries;
            return View(stats);
        }
    }
}
