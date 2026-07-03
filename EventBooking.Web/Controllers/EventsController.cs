using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using EventBooking.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers
{
    public class EventsController : Controller
    {
        private readonly IEventService _eventService;
        private readonly ITicketCategoryService _ticketCategoryService;
        private readonly IRevenueService _revenueService;
        private readonly IAttendanceService _attendanceService;

        private static readonly List<string> _categories = new()
        {
            "Conference", "Workshop", "Concert", "Sports", "Festival", "Other"
        };

        public EventsController(
            IEventService eventService,
            ITicketCategoryService ticketCategoryService,
            IRevenueService revenueService,
            IAttendanceService attendanceService)
        {
            _eventService = eventService;
            _ticketCategoryService = ticketCategoryService;
            _revenueService = revenueService;
            _attendanceService = attendanceService;
        }

        // ── Existing public listing — UNTOUCHED ──

        // GET /Events
        public async Task<IActionResult> Index(EventQueryDto query)
        {
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

        // ── Organizer-only actions ──

        private int GetCurrentUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET /Events/Create
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public IActionResult Create() => View(new CreateEventDto());

        // POST /Events/Create
        [Authorize(Roles = "Organizer")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateEventDto dto)
        {
            if (!ModelState.IsValid) return View(dto);
            try
            {
                var ev = await _eventService.CreateEventAsync(dto, GetCurrentUserId());
                TempData["Success"] = $"Event \"{ev.Title}\" created as Draft.";
                return RedirectToAction(nameof(Edit), new { id = ev.EventId });
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", ex.Message);
                return View(dto);
            }
        }

        // GET /Events/Edit/5
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                var ev = await _eventService.GetByIdAsync(id);
                var dto = new UpdateEventDto
                {
                    Title = ev.Title, Description = ev.Description, Venue = ev.Venue,
                    Category = ev.Category, Date = ev.Date, Capacity = ev.Capacity, Price = ev.Price
                };
                ViewBag.EventId = id;
                ViewBag.EventStatus = ev.Status;
                return View(dto);
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        // POST /Events/Edit/5
        [Authorize(Roles = "Organizer")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, UpdateEventDto dto)
        {
            if (!ModelState.IsValid) { ViewBag.EventId = id; return View(dto); }
            try
            {
                await _eventService.UpdateEventAsync(id, dto, GetCurrentUserId());
                TempData["Success"] = "Event updated.";
                return RedirectToAction(nameof(Edit), new { id });
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { ModelState.AddModelError("", ex.Message); ViewBag.EventId = id; return View(dto); }
        }

        // POST /Events/5/Publish
        [Authorize(Roles = "Organizer")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Publish(int id)
        {
            try
            {
                await _eventService.PublishEventAsync(id, GetCurrentUserId());
                TempData["Success"] = "Event published successfully.";
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(Edit), new { id });
        }

        // GET /Events/5/TicketCategories
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public async Task<IActionResult> TicketCategories(int id)
        {
            try
            {
                var ev = await _eventService.GetByIdAsync(id);
                var categories = await _ticketCategoryService.GetByEventAsync(id);
                ViewBag.EventId = id;
                ViewBag.EventTitle = ev.Title;
                ViewBag.NewCategory = new CreateTicketCategoryDto();
                return View(categories);
            }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        // POST /Events/5/TicketCategories/Add
        [Authorize(Roles = "Organizer")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddTicketCategory(int id, CreateTicketCategoryDto dto)
        {
            try
            {
                await _ticketCategoryService.AddAsync(id, dto, GetCurrentUserId());
                TempData["Success"] = "Ticket category added.";
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (Exception ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(TicketCategories), new { id });
        }

        // GET /TicketCategories/Edit/5
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public async Task<IActionResult> EditTicketCategory(int id)
        {
            try
            {
                var categories = await _ticketCategoryService.GetByEventAsync(0); // placeholder
                // Fetch single via GetByEventAsync — we reload from repo via service
                // Workaround: redirect to parent event's TicketCategories page for now
                // (A dedicated GetByIdAsync on TicketCategoryService would be a future enhancement)
                return RedirectToAction(nameof(TicketCategories));
            }
            catch { return NotFound(); }
        }

        // POST /TicketCategories/Edit/5
        [Authorize(Roles = "Organizer")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditTicketCategory(int id, int eventId, CreateTicketCategoryDto dto)
        {
            try
            {
                await _ticketCategoryService.UpdateAsync(id, dto, GetCurrentUserId());
                TempData["Success"] = "Ticket category updated.";
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (Exception ex) { TempData["Error"] = ex.Message; }
            return RedirectToAction(nameof(TicketCategories), new { id = eventId });
        }

        // GET /Events/5/Revenue
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public async Task<IActionResult> Revenue(int id)
        {
            try
            {
                var summary = await _revenueService.GetRevenueAsync(id, GetCurrentUserId());
                return View(summary);
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (KeyNotFoundException) { return NotFound(); }
        }

        // GET /Events/5/Attendance
        [Authorize(Roles = "Organizer")]
        [HttpGet]
        public async Task<IActionResult> Attendance(int id)
        {
            try
            {
                var summary = await _attendanceService.GetAttendanceAsync(id, GetCurrentUserId());
                return View(summary);
            }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }
}
