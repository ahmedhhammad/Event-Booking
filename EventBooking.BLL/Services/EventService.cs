using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Data;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.BLL.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repo;
        private readonly ITicketCategoryRepository _categoryRepo;
        private readonly IPaymentService _paymentService;
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public EventService(
            IEventRepository repo,
            ITicketCategoryRepository categoryRepo,
            IPaymentService paymentService,
            AppDbContext db,
            IMapper mapper)
        {
            _repo = repo;
            _categoryRepo = categoryRepo;
            _paymentService = paymentService;
            _db = db;
            _mapper = mapper;
        }

        // ── Existing (untouched behaviour) ──
        public async Task<PagedResultDto<EventDto>> GetEventsAsync(EventQueryDto query)
        {
            var (items, totalCount) = await _repo.GetPagedAsync(
                query.SearchTerm,
                query.Category,
                query.SortBy,
                query.SortDesc,
                query.Page,
                query.PageSize
            );

            var dtos = _mapper.Map<IEnumerable<EventDto>>(items);

            return new PagedResultDto<EventDto>
            {
                Items = dtos,
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        public async Task<EventDto> GetByIdAsync(int eventId)
        {
            var ev = await _repo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");
            return _mapper.Map<EventDto>(ev);
        }

        /// <summary>
        /// Organizer / Admin version: loads the event regardless of status.
        /// Validates ownership (organizer must own the event).
        /// </summary>
        public async Task<EventDto> GetByIdForOrganizerAsync(int eventId, int organizerId)
        {
            var ev = await _repo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            return _mapper.Map<EventDto>(ev);
        }

        public async Task<IEnumerable<EventDto>> GetByOrganizerAsync(int organizerId)
        {
            var events = await _repo.GetByOrganizerAsync(organizerId);
            return _mapper.Map<IEnumerable<EventDto>>(events);
        }

        // ── Organizer cycle ──
        public async Task<EventDto> CreateEventAsync(CreateEventDto dto, int organizerId)
        {
            var entity = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                Venue = dto.Venue,
                Category = dto.Category,
                Date = dto.Date,
                Capacity = dto.Capacity,
                Price = dto.Price,
                OrganizerId = organizerId,
                Status = EventStatus.Draft
            };

            await _repo.AddAsync(entity);
            return _mapper.Map<EventDto>(entity);
        }

        public async Task<EventDto> UpdateEventAsync(int eventId, UpdateEventDto dto, int organizerId)
        {
            var entity = await _repo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (entity.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            // Allow editing Draft AND Cancelled events (not Published)
            if (entity.Status == EventStatus.Published)
                throw new InvalidOperationException("Published events cannot be edited. Cancel the event first.");

            entity.Title = dto.Title;
            entity.Description = dto.Description;
            entity.Venue = dto.Venue;
            entity.Category = dto.Category;
            entity.Date = dto.Date;
            entity.Capacity = dto.Capacity;
            entity.Price = dto.Price;

            await _repo.UpdateAsync(entity);
            return _mapper.Map<EventDto>(entity);
        }

        public async Task<EventDto> PublishEventAsync(int eventId, int organizerId)
        {
            var entity = await _repo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (entity.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (entity.Status == EventStatus.Published)
                throw new InvalidOperationException("Event is already published.");

            var categories = await _categoryRepo.GetByEventIdAsync(eventId);
            if (!categories.Any())
                throw new InvalidOperationException("An event must have at least one ticket category before publishing.");

            entity.Status = EventStatus.Published;
            await _repo.UpdateAsync(entity);
            return _mapper.Map<EventDto>(entity);
        }

        // ── Cancellation & Republish ──

        public async Task<EventDto> CancelEventAsync(int eventId, int organizerId)
        {
            var entity = await _repo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (entity.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (entity.Status == EventStatus.Cancelled)
                throw new InvalidOperationException("Event is already cancelled.");

            if (entity.Status == EventStatus.Draft)
                throw new InvalidOperationException("Draft events cannot be cancelled — delete them instead.");

            entity.Status = EventStatus.Cancelled;
            await _repo.UpdateAsync(entity);

            // Refund all Confirmed bookings and notify their attendees
            var bookings = await _db.Bookings
                .Where(b => b.EventId == eventId && b.Status == "Confirmed")
                .ToListAsync();

            var notifiedUserIds = new HashSet<int>();

            foreach (var booking in bookings)
            {
                // Issue Stripe refund (no-ops if payment is missing)
                try { await _paymentService.RefundPaymentAsync(booking.BookingId); }
                catch { /* Log in production; don't block cancellation if one refund fails */ }

                // Notify each attendee once
                if (notifiedUserIds.Add(booking.UserId))
                {
                    _db.Notifications.Add(new Notification
                    {
                        UserId = booking.UserId,
                        Message = $"Unfortunately, the event \"{entity.Title}\" (on {entity.Date:MMM d, yyyy}) has been cancelled. Your booking has been refunded.",
                        DateSent = DateTime.UtcNow
                    });
                }
            }

            if (_db.ChangeTracker.HasChanges())
                await _db.SaveChangesAsync();

            return _mapper.Map<EventDto>(entity);
        }

        public async Task<EventDto> RepublishEventAsync(int eventId, int organizerId)
        {
            var entity = await _repo.GetByIdUnrestrictedAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (entity.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (entity.Status != EventStatus.Cancelled)
                throw new InvalidOperationException("Only cancelled events can be republished.");

            // Transition back to Draft so the organizer can review/edit before re-publishing
            entity.Status = EventStatus.Draft;
            await _repo.UpdateAsync(entity);
            return _mapper.Map<EventDto>(entity);
        }
    }
}
