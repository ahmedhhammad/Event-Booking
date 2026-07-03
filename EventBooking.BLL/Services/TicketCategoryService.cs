using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class TicketCategoryService : ITicketCategoryService
    {
        private readonly ITicketCategoryRepository _repo;
        private readonly IEventRepository _eventRepo;
        private readonly IMapper _mapper;

        public TicketCategoryService(
            ITicketCategoryRepository repo,
            IEventRepository eventRepo,
            IMapper mapper)
        {
            _repo = repo;
            _eventRepo = eventRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TicketCategoryDto>> GetByEventAsync(int eventId)
        {
            var categories = await _repo.GetByEventIdAsync(eventId);
            return _mapper.Map<IEnumerable<TicketCategoryDto>>(categories);
        }

        public async Task<TicketCategoryDto> AddAsync(int eventId, CreateTicketCategoryDto dto, int organizerId)
        {
            var ev = await _eventRepo.GetByIdAsync(eventId)
                ?? throw new KeyNotFoundException($"Event {eventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (dto.Price < 0)
                throw new ArgumentException("Price must be >= 0.");

            var entity = new TicketCategory
            {
                EventId = eventId,
                Name = dto.Name,
                Price = dto.Price,
                QuantityAvailable = dto.QuantityAvailable,
                QuantitySold = 0
            };

            await _repo.AddAsync(entity);
            return _mapper.Map<TicketCategoryDto>(entity);
        }

        public async Task<TicketCategoryDto> UpdateAsync(int ticketCategoryId, CreateTicketCategoryDto dto, int organizerId)
        {
            var category = await _repo.GetByIdAsync(ticketCategoryId)
                ?? throw new KeyNotFoundException($"TicketCategory {ticketCategoryId} not found.");

            var ev = await _eventRepo.GetByIdAsync(category.EventId)
                ?? throw new KeyNotFoundException($"Event {category.EventId} not found.");

            if (ev.OrganizerId != organizerId)
                throw new UnauthorizedAccessException("You do not own this event.");

            if (dto.Price < 0)
                throw new ArgumentException("Price must be >= 0.");

            category.Name = dto.Name;
            category.Price = dto.Price;
            category.QuantityAvailable = dto.QuantityAvailable;

            await _repo.UpdateAsync(category);
            return _mapper.Map<TicketCategoryDto>(category);
        }
    }
}
