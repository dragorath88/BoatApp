namespace BoatApi.Services
{
    using BoatApi.Dtos;

    public interface IBoatService
    {
        Task<List<BoatDto>> GetAllAsync();

        Task<BoatDto> GetByIdAsync(Guid id);

        Task<BoatDto> CreateAsync(CreateBoatDto createBoatDto);

        Task<BoatDto> UpdateAsync(Guid id, UpdateBoatDto updateBoatDto);

        Task DeleteAsync(Guid id);
    }
}
