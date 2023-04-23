using System.Security.Claims;

namespace BoatAppApi.Services
{
    public interface IJwtService
    {
        string GenerateToken(string id, int expiresInMinutes, string secret);
        ClaimsPrincipal VerifyToken(string token, string secret);
        void RevokeToken(string token);
        bool IsTokenRevoked(string token);
    }
}
