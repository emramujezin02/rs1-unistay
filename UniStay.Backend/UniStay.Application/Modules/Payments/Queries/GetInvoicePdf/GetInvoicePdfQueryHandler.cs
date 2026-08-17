namespace UniStay.Application.Modules.Payments.Queries.GetInvoicePdf;

public sealed class GetInvoicePdfQueryHandler : IRequestHandler<GetInvoicePdfQuery, GetInvoicePdfResult>
{
    private readonly IAppDbContext _context;
    private readonly IInvoicePdfService _pdfService;
    private readonly IAppCurrentUser _currentUser;

    public GetInvoicePdfQueryHandler(
        IAppDbContext context,
        IInvoicePdfService pdfService,
        IAppCurrentUser currentUser)
    {
        _context = context;
        _pdfService = pdfService;
        _currentUser = currentUser;
    }

    public async Task<GetInvoicePdfResult> Handle(
        GetInvoicePdfQuery request,
        CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId, cancellationToken)
            ?? throw new UniStayNotFoundException("Invoice not found.");

        var callerId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (!_currentUser.IsAdmin && invoice.StudentId != callerId)
            throw new UnauthorizedAccessException("You are not authorised to access this invoice.");

        if (!invoice.Paid)
            throw new UniStayBusinessRuleException("invoice.not_paid", "Invoice is not paid.");

        return new GetInvoicePdfResult(
            PdfBytes: _pdfService.Generate(invoice),
            FileName: $"invoice-{invoice.Id}.pdf");
    }
}
