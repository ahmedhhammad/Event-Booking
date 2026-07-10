using System;
using System.Security.Claims;
using System.Threading.Tasks;
using EventBooking.BLL.DTOs;
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
        private readonly IAdminService _adminService;

        public AdminApiController(
            IPlatformStatsService statsService, 
            IUserAdminService userAdminService,
            IAdminService adminService)
        {
            _statsService = statsService;
            _userAdminService = userAdminService;
            _adminService = adminService;
        }

        private int GetAdminUserId()
        {
            var claimVal = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claimVal, out var adminId) ? adminId : 0;
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

        [HttpPut("users/{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserAdminDto dto)
        {
            try
            {
                int adminId = GetAdminUserId();
                await _adminService.UpdateUserAdminAsync(id, dto, adminId);
                return Ok();
            }
            catch (ArgumentException ex) { return BadRequest(new { error = ex.Message }); }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            var bookings = await _adminService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpPost("bookings/{id:int}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                int adminId = GetAdminUserId();
                await _adminService.CancelBookingByAdminAsync(id, adminId);
                return Ok();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }

        [HttpPost("bookings/{id:int}/reassign")]
        public async Task<IActionResult> ReassignBooking(int id, [FromBody] ReassignBookingRequest req)
        {
            try
            {
                int adminId = GetAdminUserId();
                await _adminService.ReassignBookingAsync(id, req.NewUserId, adminId);
                return Ok();
            }
            catch (KeyNotFoundException ex) { return NotFound(new { error = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }

        [HttpGet("events")]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _adminService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpPost("events/{id:int}/cancel")]
        public async Task<IActionResult> CancelEvent(int id)
        {
            try
            {
                int adminId = GetAdminUserId();
                await _adminService.CancelEventByAdminAsync(id, adminId);
                return Ok();
            }
            catch (KeyNotFoundException) { return NotFound(); }
            catch (InvalidOperationException ex) { return BadRequest(new { error = ex.Message }); }
            catch (Exception ex) { return StatusCode(500, new { error = ex.Message }); }
        }

        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _adminService.GetAuditLogsAsync();
            return Ok(logs);
        }
    }

    public record ChangeRoleRequest(string NewRole);
    public record ReassignBookingRequest(int NewUserId);
}
