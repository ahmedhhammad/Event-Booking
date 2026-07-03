using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;

namespace EventBooking.BLL.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private static readonly HashSet<string> ValidRegistrationRoles = new() { "Attendee", "Organizer" };

        public AuthService(AppDbContext db) => _db = db;

        /// <param name="role">Attendee or Organizer only. Defaults to Attendee.</param>
        public (bool Success, string? Error) Register(string name, string email, string password, string role = "Attendee")
        {
            if (!ValidRegistrationRoles.Contains(role))
                role = "Attendee";

            bool emailTaken = _db.Users.Any(u => u.Email.ToLower() == email.ToLower());
            if (emailTaken)
                return (false, "Email is already registered");

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role
            };

            _db.Users.Add(user);
            _db.SaveChanges();
            return (true, null);
        }

        public User? Login(string email, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return null;
            return user;
        }
    }
}
