using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.BLL.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase) 
        { 
            "Attendee", "Organizer", "Admin" 
        };

        public AdminService(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        private async Task LogActionAsync(int adminId, string action, string details)
        {
            var log = new AdminActionLog
            {
                AdminUserId = adminId,
                Action = action,
                Details = details,
                Timestamp = DateTime.UtcNow
            };
            _db.AdminActionLogs.Add(log);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateUserAdminAsync(int userId, UpdateUserAdminDto dto, int adminId)
        {
            if (!AllowedRoles.Contains(dto.Role))
                throw new ArgumentException($"Invalid role. Allowed: {string.Join(", ", AllowedRoles)}.");

            var user = await _db.Users.FindAsync(userId)
                ?? throw new KeyNotFoundException($"User {userId} not found.");

            var originalName = user.Name;
            var originalEmail = user.Email;
            var originalRole = user.Role;

            user.Name = dto.Name;
            user.Email = dto.Email;
            user.Role = dto.Role;

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            await LogActionAsync(adminId, "UpdateUser", 
                $"Updated user {userId} details: " +
                $"Name '{originalName}' -> '{dto.Name}', " +
                $"Email '{originalEmail}' -> '{dto.Email}', " +
                $"Role '{originalRole}' -> '{dto.Role}'");
        }

        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _db.Bookings
                .Include(b => b.User)
                .Include(b => b.Event)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            // Manually map to BookingDto to match BookingService behavior
            return bookings.Select(b => new BookingDto
            {
                BookingId = b.BookingId,
                EventId = b.EventId,
                EventTitle = b.Event?.Title ?? "Unknown Event",
                EventDate = b.Event?.Date ?? DateTime.MinValue,
                Venue = b.Event?.Venue ?? "Unknown Venue",
                Quantity = b.Quantity,
                Status = b.Status,
                BookingDate = b.BookingDate,
                TotalPrice = (b.Event?.Price ?? 0) * b.Quantity
            });
        }

        public async Task CancelBookingByAdminAsync(int bookingId, int adminId)
        {
            var booking = await _db.Bookings
                .Include(b => b.Event)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId)
                ?? throw new KeyNotFoundException($"Booking {bookingId} not found.");

            if (booking.Status == "Cancelled")
                throw new InvalidOperationException("Booking is already cancelled.");

            booking.Status = "Cancelled";
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync();

            await LogActionAsync(adminId, "CancelBooking", 
                $"Cancelled booking {bookingId} for Event '{booking.Event?.Title}' (ID: {booking.EventId})");
        }

        public async Task ReassignBookingAsync(int bookingId, int newUserId, int adminId)
        {
            var booking = await _db.Bookings
                .Include(b => b.Event)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId)
                ?? throw new KeyNotFoundException($"Booking {bookingId} not found.");

            var newUser = await _db.Users.FindAsync(newUserId)
                ?? throw new KeyNotFoundException($"Target User {newUserId} not found.");

            var originalUserId = booking.UserId;
            var originalUserName = booking.User?.Name ?? "Unknown";

            booking.UserId = newUserId;
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync();

            await LogActionAsync(adminId, "ReassignBooking", 
                $"Reassigned booking {bookingId} for Event '{booking.Event?.Title}' (ID: {booking.EventId}) from user {originalUserId} ({originalUserName}) to user {newUserId} ({newUser.Name})");
        }

        public async Task<IEnumerable<EventDto>> GetAllEventsAsync()
        {
            var events = await _db.Events
                .Include(e => e.Organizer)
                .OrderByDescending(e => e.Date)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EventDto>>(events);
        }

        public async Task CancelEventByAdminAsync(int eventId, int adminId)
        {
            var ev = await _db.Events.FindAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.Status == EventStatus.Cancelled)
                throw new InvalidOperationException("Event is already cancelled.");

            var originalStatus = ev.Status;
            ev.Status = EventStatus.Cancelled;
            _db.Events.Update(ev);
            await _db.SaveChangesAsync();

            await LogActionAsync(adminId, "CancelEvent", 
                $"Cancelled event {eventId} ('{ev.Title}') (Original Status: {originalStatus})");
        }

        public async Task<IEnumerable<AdminActionLogDto>> GetAuditLogsAsync()
        {
            var logs = await _db.AdminActionLogs
                .Include(l => l.AdminUser)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

            return _mapper.Map<IEnumerable<AdminActionLogDto>>(logs);
        }
    }
}
