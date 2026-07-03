using EventBooking.BLL.DTOs;

namespace EventBooking.BLL.Services
{
    public interface IInquiryService
    {
        Task SubmitAsync(CreateInquiryDto dto);
        Task<IEnumerable<InquiryDto>> GetAllAsync(); // Admin only
    }
}
