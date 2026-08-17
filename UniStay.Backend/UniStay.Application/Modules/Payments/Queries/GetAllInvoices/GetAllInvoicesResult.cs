namespace UniStay.Application.Modules.Payments.Queries.GetAllInvoices;

public sealed record AllInvoiceItem(
    int InvoiceId,
    decimal TotalAmount,
    bool Paid,
    DateTime IssuedAt);

public sealed record GetAllInvoicesResult(IReadOnlyList<AllInvoiceItem> Invoices);
