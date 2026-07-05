namespace UniStay.API.Models;

/// <summary>
/// API-layer DTO that wraps registration fields and the reCAPTCHA token.
/// </summary>
public sealed record RegisterRequest(
    string Username,
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string CaptchaToken);
