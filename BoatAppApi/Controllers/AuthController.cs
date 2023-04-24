namespace BoatApi.Controllers
{
    using BoatApi.Dtos;
    using BoatAppApi.Config;
    using BoatAppApi.Models;
    using BoatAppApi.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IApiUserService _apiUserService;
        private readonly IJwtService _jwtService;
        private readonly JwtSettings _jwtSettings;

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
        public async Task<IActionResult> AuthenticateAsync([FromBody] LoginDto loginDto)
        {
            try
            {
                var user = await _apiUserService.AuthenticateAsync(loginDto.UserName, loginDto.Password);

                if (user == null)
                {
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "INCORRECT_USERNAME_OR_PASSWORD",
                            Message = "Username or password is incorrect",
                        });
                }

                var token = _jwtService.GenerateToken(user.Id, _jwtSettings.ExpiresInMinutes, _jwtSettings.Secret);

                return Ok(new
                {
                    Token = token,
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
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
                var userId = User.Identity?.Name;
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "MISSING_USER_ID",
                            Message = "The user id is missing",
                        });
                }

                var user = await _apiUserService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return BadRequest(
                        new ErrorResponse
                        {
                            Code = "USER_NOT_EXISTS",
                            Message = "The user not exists",
                        });
                }

                var currentToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
                _jwtService.RevokeToken(currentToken);

                await _apiUserService.InvalidateSecurityStampAsync(user);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Refreshes the user's token.
        /// </summary>
        /// <returns>A new JWT token.</returns>
        [Authorize]
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            try
            {
                var currentToken = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", string.Empty);
                var principal = _jwtService.VerifyToken(currentToken, _jwtSettings.Secret);
                var identity = User?.Identity;
                var userId = identity?.Name;
                if (principal != null && identity != null && userId != null)
                {
                    if (_jwtService.IsTokenRevoked(currentToken))
                    {
                        return Unauthorized();
                    }

                    var newToken = _jwtService.GenerateToken(userId, _jwtSettings.ExpiresInMinutes, _jwtSettings.Secret);
                    return Ok(new { token = newToken });
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
