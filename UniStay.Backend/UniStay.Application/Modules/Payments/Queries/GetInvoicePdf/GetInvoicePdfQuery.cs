namespace UniStay.Application.Modules.Payments.Queries.GetInvoicePdf;

public sealed record GetInvoicePdfQuery(int InvoiceId) : IRequest<GetInvoicePdfResult>;
