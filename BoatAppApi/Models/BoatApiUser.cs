using Microsoft.AspNetCore.Identity;

namespace BoatApi.Models
{
    /// <summary>
    /// Represents a user of the application.
    /// </summary>
    public class BoatApiUser : IdentityUser
    {
        #region Properties

        // This property can be used to determine what actions a user is allowed to perform
        public bool IsAdmin { get; set; } = false;

        #endregion
    }
}
