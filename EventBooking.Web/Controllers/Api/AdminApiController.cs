using EventBooking.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.Web.Controllers.Api
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminApiController : ControllerBase
    {
        private readonly IPlatformStatsService _statsService;
        private readonly IUserAdminService _userAdminService;

        public AdminApiController(IPlatformStatsService statsService, IUserAdminService userAdminService)
        {
            _statsService = statsService;
            _userAdminService = userAdminService;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _statsService.GetStatsAsync();
            return Ok(stats);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userAdminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpPost("users/{id:int}/role")]
        public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleRequest req)
        {
            try
            {
                await _userAdminService.ChangeRoleAsync(id, req.NewRole);
                return Ok();
            }
            catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
            catch (KeyNotFoundException) { return NotFound(); }
        }
    }

    public record ChangeRoleRequest(string NewRole);
}
