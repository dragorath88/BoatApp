using BoatApi.Dtos;

namespace BoatApi.Services
{
    public interface IBoatService
    {
        Task<List<BoatDto>> GetAllAsync();
        Task<BoatDto> GetByIdAsync(Guid id);
        Task<BoatDto> CreateAsync(CreateBoatDto createBoatDto);
        Task<BoatDto> UpdateAsync(Guid id, UpdateBoatDto updateBoatDto);
        Task DeleteAsync(Guid id);
    }
}
