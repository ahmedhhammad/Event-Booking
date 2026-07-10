using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;

namespace EventBooking.BLL.Mapping
{
    public class EventMappingProfile : Profile
    {
        public EventMappingProfile()
        {
            // ── Existing ──
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
            CreateMap<EventDto, Event>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ParseStatus(src.Status)));

            // ── Organizer cycle ──
            CreateMap<TicketCategory, TicketCategoryDto>().ReverseMap();

            // ── Role-based additions ──
            CreateMap<Inquiry, InquiryDto>().ReverseMap();
            CreateMap<User, UserAdminDto>().ReverseMap();
            CreateMap<AdminActionLog, AdminActionLogDto>()
                .ForMember(dest => dest.AdminName, opt => opt.MapFrom(src => src.AdminUser != null ? src.AdminUser.Name : "System"));
        }

        private static EventStatus ParseStatus(string status) =>
            Enum.TryParse<EventStatus>(status, out var result) ? result : EventStatus.Draft;
    }
}
