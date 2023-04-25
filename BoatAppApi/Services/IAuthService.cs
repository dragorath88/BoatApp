namespace BoatAppApi.Services
{
    using System.Security.Claims;
    using BoatApi.Models;

    public interface IAuthService
    {
        Task<BoatApiUser?> AuthenticateAsync(string username, string password);

        string GenerateJwtToken(string userId, string userName);

        ClaimsPrincipal VerifyJwtToken(string token);
    }
}
