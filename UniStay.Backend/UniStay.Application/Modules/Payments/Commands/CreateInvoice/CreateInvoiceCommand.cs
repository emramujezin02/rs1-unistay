namespace UniStay.Application.Modules.Payments.Commands.CreateInvoice;

public sealed record CreateInvoiceCommand(
    int StudentId,
    decimal Amount) : IRequest<CreateInvoiceResult>;
