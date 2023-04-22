using System.ComponentModel.DataAnnotations;

namespace BoatApi.Dtos
{
    /// <summary>
    /// DTO used to create a new user entity.
    /// </summary>
    public class CreateUserDto
    {
        /// <summary>
        /// The username of the user.
        /// </summary>
        [Required]
        public string Username { get; set; }

        /// <summary>
        /// The password of the user.
        /// </summary>
        [Required]
        public string Password { get; set; }

        /// <summary>
        /// The role of the user.
        /// </summary>
        [Required]
        public bool IsAdmin { get; set; }
    }
}
