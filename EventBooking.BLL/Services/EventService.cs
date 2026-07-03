using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repo;
        private readonly ITicketCategoryRepository _categoryRepo;
        private readonly IMapper _mapper;

        public EventService(IEventRepository repo, ITicketCategoryRepository categoryRepo, IMapper mapper)
        {
            _repo = repo;
            _categoryRepo = categoryRepo;
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
            var entity = await _repo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (entity.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (entity.Status != EventStatus.Draft)
                throw new InvalidOperationException("Only Draft events can be edited.");

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
            var entity = await _repo.GetByIdAsync(eventId)
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
    }
}
