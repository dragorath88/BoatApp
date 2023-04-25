namespace BoatAppApi.Services
{
    using System.Security.Claims;

    /// <summary>
    /// Provides methods to generate and verify JSON Web Tokens (JWT).
    /// </summary>
    public interface IJwtService
    {
        /// <summary>
        /// Generates a new JWT token for the given user ID and expiration time using the provided secret.
        /// </summary>
        /// <param name="userId">The ID of the user for which the token will be generated.</param>
        /// <param name="userName">The userName of the user for which the token will be generated.</param>
        /// <param name="expiresInMinutes">The number of minutes after which the token will expire.</param>
        /// <param name="secret">The secret key used to sign the token.</param>
        /// <returns>A new JWT token.</returns>
        string GenerateToken(string userId, string userName, int expiresInMinutes, string secret);

        /// <summary>
        /// Verifies the signature of the provided JWT token using the provided secret and returns a ClaimsPrincipal
        /// containing the claims from the token.
        /// </summary>
        /// <param name="token">The JWT token to verify.</param>
        /// <param name="secret">The secret key used to sign the token.</param>
        /// <returns>A ClaimsPrincipal containing the claims from the token if the signature is valid, otherwise null.</returns>
        ClaimsPrincipal VerifyToken(string token, string secret);

        /// <summary>
        /// Revokes the provided JWT token.
        /// </summary>
        /// <param name="token">The JWT token to revoke.</param>
        void RevokeToken(string token);

        /// <summary>
        /// Gets the expiration time of the provided JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The token's expiration time as a DateTimeOffset.</returns>
        DateTimeOffset GetTokenExpirationTime(string token);

        /// <summary>
        /// Checks if the provided JWT token has been revoked.
        /// </summary>
        /// <param name="token">The JWT token to check.</param>
        /// <returns>True if the token has been revoked, otherwise false.</returns>
        bool IsTokenRevoked(string token);
    }
}