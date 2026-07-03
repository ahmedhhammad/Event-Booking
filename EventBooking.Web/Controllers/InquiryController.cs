using EventBooking.BLL.DTOs;
using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    public class InquiryController : Controller
    {
        private readonly IInquiryService _inquiryService;

        public InquiryController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }

        [HttpGet]
        public IActionResult Create() => View(new CreateInquiryDto());

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateInquiryDto dto)
        {
            if (!ModelState.IsValid) return View(dto);
            await _inquiryService.SubmitAsync(dto);
            TempData["Success"] = "Your inquiry has been sent! We'll get back to you soon.";
            return RedirectToAction(nameof(Create));
        }
    }
}
