using BoatApi.Models;
using BoatAppApi.Services;
using Microsoft.AspNetCore.Identity;

namespace BoatApi.Services
{
    /// <summary>
    /// Service for interacting with the API users.
    /// </summary>
    public class ApiUserService : IApiUserService
    {
        private readonly ILogger<ApiUserService> _logger;
        private readonly UserManager<BoatApiUser> _userManager;
        private readonly SignInManager<BoatApiUser> _signInManager;

        public ApiUserService(ILogger<ApiUserService> logger, UserManager<BoatApiUser> userManager, SignInManager<BoatApiUser> signInManager)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        /// <summary>
        /// Authenticates the user with the given credentials.
        /// </summary>
        /// <param name="username">The username of the user to authenticate.</param>
        /// <param name="password">The password of the user to authenticate.</param>
        /// <returns>The authenticated user if the credentials are valid, null otherwise.</returns>
        public async Task<BoatApiUser> AuthenticateAsync(string username, string password)
        {
            try
            {
                var result = await _signInManager.PasswordSignInAsync(username, password, false, false);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByNameAsync(username);
                    return user;
                }

                return null;
            }
            catch (Exception ex)
            {
                // Log the exception and rethrow it.
                _logger.LogError(ex, $"Error authenticating user {username}");
                throw;
            }
        }

        /// <summary>
        /// Retrieves the user with the specified id.
        /// </summary>
        /// <param name="id">The id of the user to retrieve.</param>
        /// <returns>The user with the specified id, or null if not found.</returns>
        public async Task<BoatApiUser> GetUserByIdAsync(string id)
        {
            try
            {
                return await _userManager.FindByIdAsync(id);
            }
            catch (Exception ex)
            {
                // Log the exception and rethrow it.
                _logger.LogError(ex, $"Error retrieving user {id}");
                throw;
            }
        }

        /// <summary>
        /// Invalidates the security stamp of the specified user.
        /// </summary>
        /// <param name="user">The user whose security stamp to invalidate.</param>
        public async Task InvalidateSecurityStampAsync(BoatApiUser user)
        {
            try
            {
                await _userManager.UpdateSecurityStampAsync(user);
            }
            catch (Exception ex)
            {
                // Log the exception and rethrow it.
                _logger.LogError(ex, $"Error updating security stamp for user {user.UserName}");
                throw;
            }
        }
    }
}
