using BoatApi.Models;
using BoatAppApi.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IJwtService _jwtService;
    private readonly UserManager<BoatApiUser> _userManager;
    private readonly SignInManager<BoatApiUser> _signInManager;
    private readonly string _secretKey;

    public AuthService(
        IConfiguration configuration,
        IJwtService jwtService,
        UserManager<BoatApiUser> userManager,
        SignInManager<BoatApiUser> signInManager)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        _jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
        _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        _signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
        _secretKey = configuration.GetValue<string>("Jwt:Secret") ?? throw new ArgumentException("Jwt:Secret key cannot be null or empty.", nameof(configuration));
    }

    /// <summary>
    /// Authenticates a user based on the provided username and password.
    /// </summary>
    /// <param name="username">The username of the user to authenticate.</param>
    /// <param name="password">The password of the user to authenticate.</param>
    /// <returns>The authenticated user, or null if authentication fails.</returns>
    public async Task<BoatApiUser?> AuthenticateAsync(string username, string password)
    {
        try
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return null;
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                return null;
            }

            return user;
        }
        catch (Exception ex)
        {
            // Log the exception here
            throw new Exception("An error occurred while authenticating the user.", ex);
        }
    }

    /// <summary>
    /// Generates a JWT token for the specified id.
    /// </summary>
    /// <param name="id">The id to generate a token.</param>
    /// <returns>The generated JWT token.</returns>
    public string GenerateJwtToken(string id)
    {
        if (string.IsNullOrEmpty(id))
        {
            throw new ArgumentException("id cannot be null or empty.", nameof(id));
        }

        try
        {
            var expiresInMinutes = _configuration.GetValue<int>("Jwt:ExpiresInMinutes");
            return _jwtService.GenerateToken(id, expiresInMinutes, _secretKey);
        }
        catch (Exception ex)
        {
            // Log the exception here
            throw new Exception("An error occurred while generating the JWT token.", ex);
        }
    }

    /// <summary>
    /// Verifies the specified JWT token.
    /// </summary>
    /// <param name="token">The JWT token to verify.</param>
    /// <returns>The claims principal associated with the JWT token.</returns>
    public ClaimsPrincipal VerifyJwtToken(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new ArgumentException("token cannot be null or empty.", nameof(token));
        }

        try
        {
            return _jwtService.VerifyToken(token, _secretKey);
        }
        catch (Exception ex)
        {
            // Log the exception here
            throw new Exception("An error occurred while verifying the JWT token.", ex);
        }
    }
}
