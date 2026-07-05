namespace UniStay.Application.Modules.Payments.Queries.GetInvoicesByUser;

public sealed record InvoiceItem(
    int InvoiceId,
    decimal TotalAmount,
    bool Paid,
    DateTime IssuedAt);

public sealed record GetInvoicesByUserResult(IReadOnlyList<InvoiceItem> Invoices);
