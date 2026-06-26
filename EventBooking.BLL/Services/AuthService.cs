using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;

namespace EventBooking.BLL.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;

        public AuthService(AppDbContext db)
        {
            _db = db;
        }

        public (bool Success, string? Error) Register(string name, string email, string password)
        {
            bool emailTaken = _db.Users
                .Any(u => u.Email.ToLower() == email.ToLower());

            if (emailTaken)
                return (false, "Email is already registered");

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = "User"
            };

            _db.Users.Add(user);
            _db.SaveChanges();

            return (true, null);
        }
    }
}
