using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/auth")]
    public class AuthApiController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthApiController(AuthService authService) =>
            _authService = authService;

        [HttpGet("me")]
        public IActionResult Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            return Ok(new
            {
                userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                name = User.FindFirstValue(ClaimTypes.Name),
                email = User.FindFirstValue(ClaimTypes.Email),
                role = User.FindFirstValue(ClaimTypes.Role)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = _authService.Login(req.Email, req.Password);
            if (user is null)
                return Unauthorized(new { error = "Invalid email or password." });

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new(ClaimTypes.Name,  user.Name),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role,  user.Role),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return Ok(new { userId = user.UserId, name = user.Name, email = user.Email, role = user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var (success, error) = _authService.Register(req.Name, req.Email, req.Password, req.Role ?? "Attendee");
            if (!success)
                return BadRequest(new { error });

            // Auto-login after register
            var user = _authService.Login(req.Email, req.Password)!;
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new(ClaimTypes.Name,  user.Name),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role,  user.Role),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));

            return Ok(new { userId = user.UserId, name = user.Name, email = user.Email, role = user.Role });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
    }

    public record LoginRequest(string Email, string Password);
    public record RegisterRequest(string Name, string Email, string Password, string? Role);
}
