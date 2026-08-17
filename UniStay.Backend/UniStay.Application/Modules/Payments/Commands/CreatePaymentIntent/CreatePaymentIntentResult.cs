namespace UniStay.Application.Modules.Payments.Commands.CreatePaymentIntent;

public sealed record CreatePaymentIntentResult(
    string ClientSecret,
    decimal Amount);
