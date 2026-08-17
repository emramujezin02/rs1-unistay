namespace UniStay.Application.Abstractions;

/// <summary>
/// Verifies a Google reCAPTCHA v2 token with Google's siteverify API.
/// </summary>
public interface ICaptchaService
{
    Task<bool> VerifyAsync(string token, CancellationToken cancellationToken = default);
}
