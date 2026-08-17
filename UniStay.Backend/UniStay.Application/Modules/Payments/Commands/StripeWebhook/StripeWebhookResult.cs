namespace UniStay.Application.Modules.Payments.Commands.StripeWebhook;

public sealed record StripeWebhookResult(bool SignatureValid);
