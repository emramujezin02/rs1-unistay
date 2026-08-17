using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;
using UniStay.Application.Abstractions;

namespace UniStay.Infrastructure.Services;

/// <summary>
/// Verifies a reCAPTCHA v2 token by calling Google's siteverify endpoint.
/// </summary>
public sealed class CaptchaService : ICaptchaService
{
    private const string VerifyUrl = "https://www.google.com/recaptcha/api/siteverify";

    private readonly HttpClient _http;
    private readonly string _secretKey;

    public CaptchaService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _http = httpClientFactory.CreateClient("Captcha");
        _secretKey = configuration["Recaptcha:SecretKey"]
            ?? throw new InvalidOperationException("Recaptcha:SecretKey is not configured.");
    }

    public async Task<bool> VerifyAsync(string token, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        var content = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("secret", _secretKey),
            new KeyValuePair<string, string>("response", token)
        });

        try
        {
            var response = await _http.PostAsync(VerifyUrl, content, cancellationToken);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync(cancellationToken);
            var result = JsonSerializer.Deserialize<RecaptchaResponse>(json);
            return result?.Success ?? false;
        }
        catch
        {
            return false;
        }
    }

    private sealed class RecaptchaResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("error-codes")]
        public string[]? ErrorCodes { get; set; }
    }
}
