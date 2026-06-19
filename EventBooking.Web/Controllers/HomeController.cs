using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}
