using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using UniStay.Application.Abstractions;

namespace UniStay.Infrastructure.Services;

public sealed class WebhookDispatcher(
    IAppDbContext context,
    IHttpClientFactory httpClientFactory,
    ILogger<WebhookDispatcher> logger)
    : IWebhookDispatcher
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    public async Task DispatchAsync(
        string eventType,
        object payload,
        CancellationToken cancellationToken = default)
    {
        var activeSubscriptions = await context.WebhookSubscriptions
            .AsNoTracking()
            .Where(x => x.IsActive)
            .ToListAsync(cancellationToken);

        var targets = activeSubscriptions
            .Where(x => x.Events
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Contains(eventType, StringComparer.OrdinalIgnoreCase))
            .ToList();

        if (targets.Count == 0)
            return;

        var envelope = new
        {
            @event = eventType,
            timestamp = DateTime.UtcNow,
            data = payload
        };

        var json = JsonSerializer.Serialize(envelope, JsonOptions);
        var jsonBytes = Encoding.UTF8.GetBytes(json);
        var client = httpClientFactory.CreateClient("Webhooks");

        foreach (var subscription in targets)
        {
            try
            {
                var signature = ComputeSignature(jsonBytes, subscription.Secret);

                using var request = new HttpRequestMessage(HttpMethod.Post, subscription.Url);
                request.Content = new ByteArrayContent(jsonBytes);
                request.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                request.Headers.Add("X-UniStay-Event", eventType);
                request.Headers.Add("X-UniStay-Signature", $"sha256={signature}");

                using var response = await client.SendAsync(request, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    logger.LogInformation(
                        "Webhook delivered: event={Event} url={Url} status={Status}",
                        eventType,
                        subscription.Url,
                        (int)response.StatusCode);
                }
                else
                {
                    logger.LogWarning(
                        "Webhook delivery failed: event={Event} url={Url} status={Status}",
                        eventType,
                        subscription.Url,
                        (int)response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "Webhook delivery exception: event={Event} url={Url}",
                    eventType,
                    subscription.Url);
            }
        }
    }

    private static string ComputeSignature(byte[] body, string secret)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secret);
        using var hmac = new HMACSHA256(keyBytes);
        var hash = hmac.ComputeHash(body);
        return Convert.ToHexString(hash).ToLowerInvariant();
    }
}
