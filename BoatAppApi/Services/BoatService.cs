namespace BoatApi.Services
{
    using AutoMapper;
    using BoatApi.Dtos;
    using BoatApi.Models;
    using BoatApi.Repositories;

    public class BoatService : IBoatService
    {
        private readonly IMapper _mapper;
        private readonly IBoatRepository _boatRepository;

        public BoatService(IMapper mapper, IBoatRepository boatRepository)
        {
            _mapper = mapper;
            _boatRepository = boatRepository;
        }

        public async Task<List<BoatDto>> GetAllAsync()
        {
            try
            {
                var boats = await _boatRepository.GetAllAsync();

                return _mapper.Map<List<BoatDto>>(boats);
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }

        public async Task<BoatDto> GetByIdAsync(Guid id)
        {
            try
            {
                var boat = await _boatRepository.GetByIdAsync(id);
                return _mapper.Map<BoatDto>(boat);
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }

        public async Task<BoatDto> CreateAsync(CreateBoatDto createBoatDto)
        {
            try
            {
                var boat = _mapper.Map<Boat>(createBoatDto);

                var createdBoat = await _boatRepository.CreateAsync(boat);

                return _mapper.Map<BoatDto>(createdBoat);
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }

        public async Task<BoatDto> UpdateAsync(Guid id, UpdateBoatDto updateBoatDto)
        {
            try
            {
                var boat = await _boatRepository.GetByIdAsync(id);

                if (boat == null)
                {
                    throw new ApplicationException("Boat not found.");
                }

                _mapper.Map(updateBoatDto, boat);

                var updatedBoat = await _boatRepository.UpdateAsync(boat);

                return _mapper.Map<BoatDto>(updatedBoat);
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            try
            {
                await _boatRepository.DeleteAsync(id);
            }
            catch (Exception)
            {
                // Log the exception or handle it appropriately
                throw;
            }
        }
    }
}
