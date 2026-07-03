using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;

namespace EventBooking.BLL.Mapping
{
    public class EventMappingProfile : Profile
    {
        public EventMappingProfile()
        {
            // Existing — map Status enum → string so EventDto.Status is human-readable
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            // ReverseMap separately to avoid expression-tree limitation with out vars
            CreateMap<EventDto, Event>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ParseStatus(src.Status)));

            // Organizer cycle additions
            CreateMap<TicketCategory, TicketCategoryDto>().ReverseMap();
        }

        private static EventStatus ParseStatus(string status) =>
            Enum.TryParse<EventStatus>(status, out var result) ? result : EventStatus.Draft;
    }
}
