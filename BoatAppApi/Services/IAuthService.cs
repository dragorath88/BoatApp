namespace BoatAppApi.Services
{
    using System.Security.Claims;
    using BoatApi.Models;

    public interface IAuthService
    {
        Task<BoatApiUser?> AuthenticateAsync(string username, string password);

        string GenerateJwtToken(string username);

        ClaimsPrincipal VerifyJwtToken(string token);
    }
}
