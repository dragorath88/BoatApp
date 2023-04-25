namespace BoatAppApi.Config
{
    /// <summary>
    /// Represents the settings used to configure JWT authentication.
    ///
    public class JwtSettings
    {
        /// <summary>
        /// Gets or sets the secret key used to sign JWT tokens.
        /// </summary>
        public string Secret { get; set; }

        /// <summary>
        /// Gets or sets the number of minutes after which a token will expire.
        /// </summary>
        public int ExpiresInMinutes { get; set; }

        /// <summary>
        /// Gets or sets the issuer of JWT tokens.
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        /// Gets or sets the audience of JWT tokens.
        /// </summary>
        public string Audience { get; set; }
    }
}