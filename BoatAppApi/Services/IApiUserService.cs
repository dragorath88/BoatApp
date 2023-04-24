namespace BoatAppApi.Services
{
    using BoatApi.Models;

    /// <summary>
    /// Defines methods for authentication and retrieving user information from the API.
    /// </summary>
    public interface IApiUserService
    {
        /// <summary>
        /// Authenticates a user based on their username and password.
        /// </summary>
        /// <param name="username">The username of the user.</param>
        /// <param name="password">The password of the user.</param>
        /// <returns>The authenticated <see cref="BoatApiUser"/> if successful, otherwise null.</returns>
        Task<BoatApiUser> AuthenticateAsync(string username, string password);

        /// <summary>
        /// Retrieves a user based on their ID.
        /// </summary>
        /// <param name="id">The ID of the user to retrieve.</param>
        /// <returns>The <see cref="BoatApiUser"/> with the specified ID if found, otherwise null.</returns>
        Task<BoatApiUser?> GetUserByIdAsync(string id);

        /// <summary>
        /// Invalidates the security stamp of a user, forcing them to re-authenticate.
        /// </summary>
        /// <param name="user">The user to invalidate the security stamp of.</param>
        /// <returns>The <see cref="BoatApiUser"/></returns>
        Task InvalidateSecurityStampAsync(BoatApiUser user);
    }
}
