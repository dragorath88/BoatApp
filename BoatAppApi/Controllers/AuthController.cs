namespace BoatApi.Controllers
{
    using System.Security.Claims;
    using BoatApi.Dtos;
    using BoatAppApi.Config;
    using BoatAppApi.Models;
    using BoatAppApi.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.IdentityModel.Tokens;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IApiUserService _apiUserService;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// Constructor for the <see cref="AuthController"/> class.
        /// </summary>
        /// <param name="apiUserService">An instance of the <see cref="IApiUserService"/> interface.</param>
        /// <param name="jwtService">An instance of the <see cref="IJwtService"/> interface.</param>
        /// <param name="jwtSettings">An instance of the <see cref="JwtSettings"/> class.</param>
        public AuthController(IApiUserService apiUserService, IJwtService jwtService, JwtSettings jwtSettings)
        {
            _apiUserService = apiUserService;
            _jwtService = jwtService;
            _jwtSettings = jwtSettings;
        }

        /// <summary>
        /// Authenticates the user and returns a JWT token.
        /// </summary>
        /// <param name="loginDto">The login credentials.</param>
        /// <returns>A JWT token.</returns>
        [HttpPost("authenticate")]
        public async Task<ActionResult<string>> AuthenticateAsync([FromBody] LoginDto loginDto)
        {
            try
            {
                // Attempt to authenticate the user with the given credentials.
                var user = await _apiUserService.AuthenticateAsync(loginDto.UserName, loginDto.Password);

                // If authentication fails, return a bad request with an error message.
                if (user == null)
                {
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "INCORRECT_USERNAME_OR_PASSWORD",
                            Message = "Username or password is incorrect",
                        });
                }

                // Generate a new JWT token for the user.
                var token = _jwtService.GenerateToken(user.Id, user.UserName, _jwtSettings.ExpiresInMinutes, _jwtSettings.Secret);

                // Return the token as a success response.
                return Ok(new
                {
                    Token = token,
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                // If the user is not authorized, return an unauthorized response with an error message.
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                // If an unexpected error occurs, return an internal server error response with the error message.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Revokes the user's token and invalidates the security stamp.
        /// </summary>
        /// <returns>An HTTP status code.</returns>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> LogoutAsync()
        {
            try
            {
                // Get the current token from the authorization header.
                var currentToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

                // Verify the token and get the user's principal.
                var principal = _jwtService.VerifyToken(currentToken, _jwtSettings.Secret);

                // Get the currently connected user.
                var connectedUser = User?.Identity;

                // Get the token's claims.
                var identity = principal?.Identity as ClaimsIdentity;
                var userIdClaim = identity?.FindFirst(ClaimTypes.NameIdentifier);
                var userNameClaim = identity?.FindFirst(ClaimTypes.Name);

                // If the user ID claim is null, return a bad request with an error message.
                if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
                {
                    return BadRequest(new ErrorResponse
                    {
                        Code = "MISSING_USER_ID",
                        Message = "The user ID is missing",
                    });
                }

                // If the user name claim is null, return a bad request with an error message.
                if (userNameClaim == null || string.IsNullOrEmpty(userNameClaim.Value))
                {
                    return BadRequest(new ErrorResponse
                    {
                        Code = "MISSING_USER_NAME",
                        Message = "The user name is missing",
                    });
                }

                // Prevent signing out another user.
                if (connectedUser?.Name != userNameClaim.Value)
                {
                    return Unauthorized();
                }

                // Get the user by ID.
                var user = await _apiUserService.GetUserByIdAsync(userIdClaim.Value);

                // If the user does not exist, return a bad request with an error message.
                if (user == null)
                {
                    return BadRequest(new ErrorResponse
                    {
                        Code = "USER_NOT_FOUND",
                        Message = "The user does not exist",
                    });
                }

                // Revoke the current token and invalidate the user's security stamp.
                _jwtService.RevokeToken(currentToken);
                await _apiUserService.InvalidateSecurityStampAsync(user);

                // Return an OK response.
                return Ok();
            }
            catch (SecurityTokenException ex)
            {
                // If the token is invalid, return an unauthorized response with an error message.
                return Unauthorized(new ErrorResponse
                {
                    Code = "INVALID_TOKEN",
                    Message = "The token is invalid",
                });
            }
            catch (Exception ex)
            {
                // If an unexpected error occurs, return an internal server error response with the error message.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Refreshes the user's token.
        /// </summary>
        /// <returns>A new JWT token.</returns>
        [Authorize]
        [HttpPost("refresh-token")]
        public ActionResult RefreshToken()
        {
            try
            {
                // Get the current token from the authorization header.
                var currentToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);

                // Verify the token and get the user's principal.
                var principal = _jwtService.VerifyToken(currentToken, _jwtSettings.Secret);

                // Get the currently logged-in user.
                var connectedUser = User?.Identity;

                // Get the token's claims.
                var identity = principal.Identity as ClaimsIdentity;
                var claims = identity?.Claims.ToList();

                // Return an unauthorized response if the claims list is null.
                if (claims == null)
                {
                    return Unauthorized();
                }

                // Get the user ID and name from the claims.
                var userId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                var userName = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

                // Return an unauthorized response if the user ID, user name, or logged-in user are null or not authenticated.
                if (userId == null || userName == null || connectedUser?.IsAuthenticated != true || connectedUser.Name != userName)
                {
                    return Unauthorized();
                }

                // Check if the current token has been revoked and return an unauthorized response if it has.
                if (_jwtService.IsTokenRevoked(currentToken))
                {
                    return Unauthorized();
                }

                // Generate a new token with the same user ID and user name and return it as a success response.
                var newToken = _jwtService.GenerateToken(userId, userName, _jwtSettings.ExpiresInMinutes, _jwtSettings.Secret);
                return Ok(new { token = newToken });
            }
            catch (Exception ex)
            {
                // If an unexpected error occurs, return an internal server error response with the error message.
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}