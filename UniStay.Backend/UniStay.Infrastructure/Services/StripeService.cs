using Microsoft.Extensions.Configuration;
using Stripe;
using UniStay.Application.Abstractions;

namespace UniStay.Infrastructure.Services;

public sealed class StripeService : IStripeService
{
    private readonly IConfiguration _configuration;

    public StripeService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<StripePaymentIntentResult> CreatePaymentIntentAsync(
        decimal amount,
        Dictionary<string, string> metadata,
        CancellationToken cancellationToken = default)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(amount * 100),
            Currency = "eur",
            PaymentMethodTypes = new List<string> { "card" },
            Metadata = metadata
        };

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(options, cancellationToken: cancellationToken);

        return new StripePaymentIntentResult(
            ClientSecret: intent.ClientSecret,
            Amount: amount);
    }

    public StripeWebhookEvent? ParseWebhookEvent(string payload, string signature)
    {
        var webhookSecret = _configuration["Stripe:WebhookSecret"];

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(payload, signature, webhookSecret);

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return new StripeWebhookEvent(
                    EventType: stripeEvent.Type,
                    PaymentIntentId: string.Empty,
                    Metadata: new Dictionary<string, string>());
            }

            return new StripeWebhookEvent(
                EventType: stripeEvent.Type,
                PaymentIntentId: intent.Id,
                Metadata: intent.Metadata ?? new Dictionary<string, string>());
        }
        catch
        {
            return null;
        }
    }
}
