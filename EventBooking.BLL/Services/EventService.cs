using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _repo;
        private readonly IMapper _mapper;

        public EventService(IEventRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

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
    }
}
