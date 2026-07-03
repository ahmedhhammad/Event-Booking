using EventBooking.DAL.Entities;

namespace EventBooking.DAL.Repositories
{
    public interface IInquiryRepository
    {
        Task AddAsync(Inquiry entity);
        Task<IEnumerable<Inquiry>> GetAllAsync();
    }
}
