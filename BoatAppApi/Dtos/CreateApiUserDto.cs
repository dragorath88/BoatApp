namespace BoatApi.Dtos
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// DTO used to create a new user entity.
    /// </summary>
    public class CreateApiUserDto
    {
        /// <summary>
        /// The username of the user.
        /// </summary>
        [Required]
        public string Username { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [Compare(nameof(Password), ErrorMessage = "The passwords do not match.")]
        public string ConfirmPassword { get; set; }

        /// <summary>
        /// The role of the user.
        /// </summary>
        public bool IsAdmin { get; set; } = false;
    }
}
