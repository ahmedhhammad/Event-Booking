using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IUserAdminService
    {
        Task<IEnumerable<UserAdminDto>> GetAllUsersAsync();
        Task ChangeRoleAsync(int userId, string newRole);
    }
}
