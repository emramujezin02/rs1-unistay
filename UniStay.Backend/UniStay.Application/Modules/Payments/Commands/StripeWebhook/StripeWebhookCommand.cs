namespace UniStay.Application.Modules.Payments.Commands.StripeWebhook;

public sealed record StripeWebhookCommand(
    string Payload,
    string Signature) : IRequest<StripeWebhookResult>;
