namespace UniStay.Application.Modules.Payments.Queries.GetInvoicePdf;

public sealed record GetInvoicePdfResult(
    byte[] PdfBytes,
    string FileName);
