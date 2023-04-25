namespace BoatAppApi.Models
{
    using System.ComponentModel.DataAnnotations;
    using Microsoft.AspNetCore.Identity;

    /// <summary>
    /// Represents an error response returned by the API.
    /// </summary>
    public class ErrorResponse
    {
        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        [Required]
        public string Message { get; set; }

        /// <summary>
        /// Gets or sets the error code.
        /// </summary>
        [Required]
        public string Code { get; set; }

        /// <summary>
        /// Gets or sets additional details about the error.
        /// </summary>
        public IEnumerable<IdentityError> Details { get; set; } = Enumerable.Empty<IdentityError>();
    }
}