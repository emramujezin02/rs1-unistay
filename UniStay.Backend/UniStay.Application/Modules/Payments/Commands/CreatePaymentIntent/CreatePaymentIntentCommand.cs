namespace UniStay.Application.Modules.Payments.Commands.CreatePaymentIntent;

public sealed record CreatePaymentIntentCommand(int InvoiceId) : IRequest<CreatePaymentIntentResult>;
