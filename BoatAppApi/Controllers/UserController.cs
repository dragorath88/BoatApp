namespace BoatApi.Controllers
{
    using System;
    using System.Threading.Tasks;
    using BoatApi.Dtos;
    using BoatApi.Models;
    using BoatAppApi.Models;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// Controller for handling user-related requests.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly UserManager<BoatApiUser> _userManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserController"/> class.
        /// </summary>
        /// <param name="logger">The logger instance.</param>
        /// <param name="userManager">The user manager instance.</param>
        /// <param name="signInManager">The sign-in manager instance.</param>
        public UserController(ILogger<UserController> logger, UserManager<BoatApiUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        /// <summary>
        /// Creates a new user entity based on the provided data.
        /// </summary>
        /// <param name="userDto">The DTO containing the data for the new user.</param>
        /// <returns>An IActionResult representing the result of the request.</returns>
        [HttpPost]
        public async Task<IActionResult> Create(CreateApiUserDto userDto)
        {
            try
            {
                // Check if the provided username already exists
                if (await _userManager.FindByNameAsync(userDto.Username) != null)
                {
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "USERNAME_ALREADY_EXISTS",
                            Message = "The username already exists.",
                        });
                }

                // Create a new User entity based on the DTO
                var user = new BoatApiUser
                {
                    UserName = userDto.Username,
                    IsAdmin = userDto.IsAdmin,
                };

                // Create the new user using the UserManager
                var result = await _userManager.CreateAsync(user, userDto.Password);

                // Check if the user was created successfully
                if (result.Succeeded)
                {
                    // Retrieve the newly created user by their Id
                    user = await _userManager.FindByIdAsync(user.Id);

                    // Return a response with a success status code and the newly created User
                    return Ok(user);
                }
                else
                {
                    // If the user creation failed, return a response with the validation errors
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "VALIDATION_ERRORS",
                            Message = "Please check the error details for more information.",
                            Details = result.Errors,
                        });
                }
            }
            catch (Exception ex)
            {
                // Log any errors and return a 500 Internal Server Error response
                _logger.LogError(ex, "Error creating new user");
                return StatusCode(500);
            }
        }
    }
}