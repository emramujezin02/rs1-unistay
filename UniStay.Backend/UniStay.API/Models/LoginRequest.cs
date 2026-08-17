namespace UniStay.API.Models;

/// <summary>
/// API-layer DTO that wraps login credentials and the reCAPTCHA token.
/// </summary>
public sealed record LoginRequest(
    string Email,
    string Password,
    bool RememberMe,
    string? Fingerprint,
    string CaptchaToken);
