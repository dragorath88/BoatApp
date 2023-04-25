using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BoatAppApi.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;

public class JwtService : IJwtService
{
    private const string RevokedTokensKey = "revokedTokens";
    private readonly IMemoryCache _cache;
    private readonly ILogger<JwtService> _logger;

    public JwtService(IMemoryCache cache, ILogger<JwtService> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    /// <summary>
    /// Generates a JWT token for the provided id with the given expiration time and secret key.
    /// </summary>
    /// <param name="userId">The user api id to create the token.</param>
    /// <param name="userName">The user api userName to create the token.</param>
    /// <param name="expiresInMinutes">The number of minutes until the token expires.</param>
    /// <param name="secretKey">The secret key used to sign the token.</param>
    /// <returns>The generated JWT token as a string.</returns>
    public string GenerateToken(string userId, string userName, int expiresInMinutes, string secretKey)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName),
            }),
            Expires = DateTimeOffset.UtcNow.AddMinutes(expiresInMinutes).UtcDateTime,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        _cache.Remove(GetRevokedTokensKey());
        return tokenString;
    }

    /// <summary>
    /// Validates a JWT token using the provided secret key.
    /// </summary>
    /// <param name="token">The JWT token to validate.</param>
    /// <param name="secretKey">The secret key used to sign the token.</param>
    /// <returns>The principal of the validated token.</returns>
    public ClaimsPrincipal VerifyToken(string token, string secretKey)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new ArgumentException("Token cannot be null or empty.", nameof(token));
        }

        if (string.IsNullOrEmpty(secretKey))
        {
            throw new ArgumentException("Secret key cannot be null or empty.", nameof(secretKey));
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.FromSeconds(30), // Allow for a small time difference between server and client machines
        };

        try
        {
            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            if (IsTokenRevoked(token))
            {
                throw new SecurityTokenException("Token has been revoked.");
            }

            return principal;
        }
        catch (SecurityTokenException ex)
        {
            // Log the exception here
            throw new SecurityTokenException("Token validation failed.", ex);
        }
    }

    /// <summary>
    /// Revokes the provided JWT token.
    /// </summary>
    /// <param name="token">The JWT token to revoke.</param>
    public void RevokeToken(string token)
    {
        _cache.GetOrCreate(GetRevokedTokensKey(), entry => new HashSet<string>());
        var revokedTokens = _cache.Get<HashSet<string>>(GetRevokedTokensKey());

        lock (revokedTokens)
        {
            revokedTokens.Add(token);
        }
    }

    /// <summary>
    /// Checks if the provided JWT token has been revoked.
    /// </summary>
    /// <param name="token">The JWT token to check.</param>
    /// <returns>True if the token has been revoked, false otherwise.</returns>
    public bool IsTokenRevoked(string token)
    {
        _cache.GetOrCreate(GetRevokedTokensKey(), entry => new HashSet<string>());
        var revokedTokens = _cache.Get<HashSet<string>>(GetRevokedTokensKey());

        return revokedTokens.Contains(token);
    }

    /// <summary>
    /// Gets the key for storing revoked tokens in the cache based on the current date.
    /// </summary>
    /// <returns>The key for storing revoked tokens in the cache.</returns>
    private string GetRevokedTokensKey()
    {
        return $"{RevokedTokensKey}-{DateTimeOffset.UtcNow:yyyyMMdd}";
    }
}
