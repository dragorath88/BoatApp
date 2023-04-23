namespace BoatAppApi.Config
{
    // Represents the settings used to configure JWT authentication
    public class JwtSettings
    {
        // Gets or sets the secret key used to sign JWT tokens
        public string Secret { get; set; }

        // Gets or sets the number of minutes after which a token will expire
        public int ExpiresInMinutes { get; set; }

        // Gets or sets the issuer of JWT tokens
        public string Issuer { get; set; }

        // Gets or sets the audience of JWT tokens
        public string Audience { get; set; }
    }
}
