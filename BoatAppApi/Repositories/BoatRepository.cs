namespace BoatApi.Repositories
{
    using BoatApi.Data;
    using BoatApi.Models;
    using Microsoft.EntityFrameworkCore;

    public class BoatRepository : IBoatRepository
    {
        private readonly BoatApiDbContext _dbContext;

        public BoatRepository(BoatApiDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Boat>> GetAllAsync()
        {
            return await _dbContext.Boats.ToListAsync();
        }

        public async Task<Boat?> GetByIdAsync(Guid id)
        {
            return await _dbContext.Boats.FindAsync(id);
        }

        public async Task<Boat> CreateAsync(Boat boat)
        {
            await _dbContext.Boats.AddAsync(boat);
            await _dbContext.SaveChangesAsync();

            return boat;
        }

        public async Task<Boat> UpdateAsync(Boat boat)
        {
            _dbContext.Boats.Update(boat);
            await _dbContext.SaveChangesAsync();

            return boat;
        }

        public async Task DeleteAsync(Guid id)
        {
            var boat = await GetByIdAsync(id);
            if (boat != null)
            {
                _dbContext.Boats.Remove(boat);
                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
