namespace UniStay.Application.Abstractions;

public sealed record StripePaymentIntentResult(
    string ClientSecret,
    decimal Amount);

public sealed record StripeWebhookEvent(
    string EventType,
    string PaymentIntentId,
    Dictionary<string, string> Metadata);

public interface IStripeService
{
    Task<StripePaymentIntentResult> CreatePaymentIntentAsync(
        decimal amount,
        Dictionary<string, string> metadata,
        CancellationToken cancellationToken = default);

    StripeWebhookEvent? ParseWebhookEvent(string payload, string signature);
}
