namespace BoatAppApi.Middleware
{
    using System;
    using System.Threading.Tasks;
    using BoatAppApi.Services;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.IdentityModel.Tokens;

    public class JwtAuthenticationMiddleware
    {
        private const string AuthorizationHeader = "Authorization";
        private const string BearerScheme = "Bearer";
        private const string TokenExpirationHeader = "X-Token-Expiration";

        private readonly RequestDelegate _next;
        private readonly ILogger<JwtAuthenticationMiddleware> _logger;
        private readonly IConfiguration _configuration;

        public JwtAuthenticationMiddleware(RequestDelegate next, ILogger<JwtAuthenticationMiddleware> logger, IConfiguration configuration)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Create a new scope and resolve IJwtService within the scope
                using var scope = context.RequestServices.CreateScope();
                var jwtService = scope.ServiceProvider.GetRequiredService<IJwtService>();

                // Extract the token from the Authorization header
                string token = ExtractToken(context.Request);
                if (token != null)
                {
                    // Check if the token is revoked
                    if (jwtService.IsTokenRevoked(token))
                    {
                        // Return a 401 Unauthorized response if the token is revoked
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        await context.Response.WriteAsync("Token is revoked.");
                        return;
                    }

                    // Verify the token and set the context User with the principal
                    var secretKey = _configuration.GetValue<string>("Jwt:Secret") ?? throw new ArgumentException("Jwt:Secret key cannot be null or empty.", nameof(_configuration));
                    var principal = jwtService.VerifyToken(token, secretKey);
                    context.User = principal;

                    // Set the token expiration time in the response header
                    DateTimeOffset expirationTime = jwtService.GetTokenExpirationTime(token);
                    context.Response.Headers[TokenExpirationHeader] = expirationTime.ToString("o");
                }
            }
            catch (SecurityTokenException ex)
            {
                // Log the error and return a 401 Unauthorized response if the token validation failed
                _logger.LogError(ex, "Token validation failed.");
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Token validation failed.");
                return;
            }
            catch (Exception ex)
            {
                // Log the error if an exception occurred while processing the JWT token
                _logger.LogError(ex, "An exception occurred while processing the JWT token.");
            }

            // Call the next middleware in the pipeline
            await _next(context);
        }

        private static string ExtractToken(HttpRequest request)
        {
            // Check if the Authorization header exists and starts with the Bearer scheme
            if (request.Headers.TryGetValue(AuthorizationHeader, out var headerValue) &&
                headerValue.ToString().StartsWith(BearerScheme + " ", StringComparison.OrdinalIgnoreCase))
            {
                // Extract the token from the Authorization header
                return headerValue.ToString().Substring(BearerScheme.Length + 1);
            }

            return null;
        }
    }
}
