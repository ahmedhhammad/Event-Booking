using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace EventBooking.DAL.Data
{
    // only used by dotnet-ef at design time — not at runtime
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseMySql(
                "Server=localhost;Port=3306;Database=EventBookingDb;User=root;Password=root;",
                new MySqlServerVersion(new Version(8, 0, 0))
            );

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
