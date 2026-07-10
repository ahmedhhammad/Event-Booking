using EventBooking.BLL.Mapping;
using EventBooking.BLL.Services;
using EventBooking.DAL.Data;
using EventBooking.DAL.Repositories;
using EventBooking.DAL.Seeding;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// ── CORS: no longer needed since frontend runs on the same origin ──
builder.Services.AddScoped<AuthService>();

// ── Events feature ──
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<ITicketCategoryRepository, TicketCategoryRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<ITicketCategoryService, TicketCategoryService>();
builder.Services.AddScoped<IRevenueService, RevenueService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddAutoMapper(cfg => { }, typeof(EventMappingProfile).Assembly);

// ── Role-based additions ──
builder.Services.AddScoped<IInquiryRepository, InquiryRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IInquiryService, InquiryService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IUserAdminService, UserAdminService>();
builder.Services.AddScoped<IPlatformStatsService, PlatformStatsService>();
builder.Services.AddScoped<IAdminService, AdminService>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(new Version(8, 0, 0))
    ));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        // Return 401 for API routes instead of redirecting
        options.Events.OnRedirectToLogin = ctx =>
        {
            if (ctx.Request.Path.StartsWithSegments("/api"))
                ctx.Response.StatusCode = 401;
            else
                ctx.Response.Redirect(ctx.RedirectUri);
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            if (ctx.Request.Path.StartsWithSegments("/api"))
                ctx.Response.StatusCode = 403;
            else
                ctx.Response.Redirect(ctx.RedirectUri);
            return Task.CompletedTask;
        };
    });

var app = builder.Build();

// ── Auto-migrate + seed on startup ──
// Applies any pending EF Core migrations automatically so new clones
// don't need to run `dotnet ef database update` manually.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();          // creates DB + applies all migrations
    await DataSeeder.SeedAsync(db);            // idempotent — safe to run every time
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseDefaultFiles(); // Added to serve index.html by default
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}"); // Removed '=Home'

// Map API controllers (attribute-routed)
app.MapControllers();

// Fallback for SPA routing
app.MapFallbackToFile("index.html");

app.Run();
