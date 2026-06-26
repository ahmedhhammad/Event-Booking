using EventBooking.BLL.Services;
using EventBooking.Web.Models;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly AuthService _authService;

        public AccountController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var (success, error) = _authService.Register(model.Name, model.Email, model.Password);

            if (!success)
            {
                ModelState.AddModelError("", error!);
                return View(model);
            }

            return RedirectToAction(nameof(Login));
        }

        public IActionResult Login()
        {
            return View();
        }
    }
}
