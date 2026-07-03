using AutoMapper;
using EventBooking.BLL.DTOs;
using EventBooking.DAL.Entities;
using EventBooking.DAL.Repositories;

namespace EventBooking.BLL.Services
{
    public class InquiryService : IInquiryService
    {
        private readonly IInquiryRepository _repo;
        private readonly IMapper _mapper;

        public InquiryService(IInquiryRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task SubmitAsync(CreateInquiryDto dto)
        {
            var entity = new Inquiry
            {
                Name = dto.Name,
                Email = dto.Email,
                Message = dto.Message,
                SubmittedAt = DateTime.UtcNow
            };
            await _repo.AddAsync(entity);
        }

        public async Task<IEnumerable<InquiryDto>> GetAllAsync()
        {
            var inquiries = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<InquiryDto>>(inquiries);
        }
    }
}
