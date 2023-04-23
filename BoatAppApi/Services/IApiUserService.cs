using BoatApi.Models;

namespace BoatAppApi.Services
{
    public interface IApiUserService
    {
        Task<BoatApiUser> AuthenticateAsync(string username, string password);

        Task<BoatApiUser> GetUserByIdAsync(string id);

        Task InvalidateSecurityStampAsync(BoatApiUser user);
    }
}
