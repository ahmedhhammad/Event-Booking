using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class UserAdminService : IUserAdminService
    {
        private readonly IUserRepository _repo;
        private readonly IMapper _mapper;

        private static readonly HashSet<string> AllowedRoles = new() { "Attendee", "Organizer" };

        public UserAdminService(IUserRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<UserAdminDto>> GetAllUsersAsync()
        {
            var users = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<UserAdminDto>>(users);
        }

        public async Task ChangeRoleAsync(int userId, string newRole)
        {
            if (!AllowedRoles.Contains(newRole))
                throw new ArgumentException($"Invalid role. Allowed: {string.Join(", ", AllowedRoles)}.");

            var user = await _repo.GetByIdAsync(userId)
                ?? throw new KeyNotFoundException($"User {userId} not found.");

            user.Role = newRole;
            await _repo.UpdateAsync(user);
        }
    }
}
