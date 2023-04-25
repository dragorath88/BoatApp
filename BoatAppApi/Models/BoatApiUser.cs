namespace BoatApi.Models
{
    using Microsoft.AspNetCore.Identity;

    /// <summary>
    /// Represents a user of the application.
    /// </summary>
    public class BoatApiUser : IdentityUser
    {
        // This property can be used to determine what actions a user is allowed to perform
        public bool IsAdmin { get; set; } = false;
    }
}
