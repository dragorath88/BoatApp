namespace BoatApi.Dtos
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// DTO used to represent user registration details.
    /// </summary>
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [Compare(nameof(Password), ErrorMessage = "The passwords do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
