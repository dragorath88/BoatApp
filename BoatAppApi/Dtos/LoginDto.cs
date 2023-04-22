using System.ComponentModel.DataAnnotations;

namespace BoatApi.Dtos
{
    /// <summary>
    /// DTO used to log in a user.
    /// </summary>
    public class LoginDto
    {
        #region Properties

        /// <summary>
        /// The username of the user.
        /// </summary>
        [Required]
        public string UserName { get; set; }

        /// <summary>
        /// The password of the user.
        /// </summary>
        [Required]
        public string Password { get; set; }

        #endregion
    }
}