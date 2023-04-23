const API_URL = process.env.API_URL || "https://localhost:7245/api";
const LOG_LEVEL = process.env.NODE_ENV === "production" ? "silent" : "debug";
// If is in production we check the certificate
const CHECK_CERTIFICATE = process.env.NODE_ENV === "production";

module.exports = {
  "/api/*": {
    target: API_URL,
    secure: CHECK_CERTIFICATE,
    changeOrigin: true,
    logLevel: LOG_LEVEL,
    pathRewrite: { "^/api": "" },
  },
};
