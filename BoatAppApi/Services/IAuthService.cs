using BoatApi.Models;
using System.Security.Claims;

namespace BoatAppApi.Services
{
    public interface IAuthService
    {
        Task<BoatApiUser?> AuthenticateAsync(string username, string password);
        string GenerateJwtToken(string username);
        ClaimsPrincipal VerifyJwtToken(string token);
    }
}
