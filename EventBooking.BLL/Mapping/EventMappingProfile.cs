using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;

namespace EventBooking.BLL.Mapping
{
    public class EventMappingProfile : Profile
    {
        public EventMappingProfile()
        {
            CreateMap<Event, EventDto>().ReverseMap();
        }
    }
}
