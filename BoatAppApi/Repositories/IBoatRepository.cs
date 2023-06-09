﻿namespace BoatApi.Repositories
{
    using BoatApi.Models;

    public interface IBoatRepository
    {
        Task<List<Boat>> GetAllAsync();

        Task<Boat?> GetByIdAsync(Guid id);

        Task<Boat> CreateAsync(Boat boat);

        Task<Boat> UpdateAsync(Boat boat);

        Task DeleteAsync(Guid id);
    }
}
