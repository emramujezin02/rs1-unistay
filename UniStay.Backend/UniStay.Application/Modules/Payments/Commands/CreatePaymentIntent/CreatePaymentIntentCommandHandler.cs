namespace UniStay.Application.Modules.Payments.Commands.CreatePaymentIntent;

public sealed class CreatePaymentIntentCommandHandler
    : IRequestHandler<CreatePaymentIntentCommand, CreatePaymentIntentResult>
{
    private readonly IAppDbContext _context;
    private readonly IStripeService _stripeService;

    public CreatePaymentIntentCommandHandler(
        IAppDbContext context,
        IStripeService stripeService)
    {
        _context = context;
        _stripeService = stripeService;
    }

    public async Task<CreatePaymentIntentResult> Handle(
        CreatePaymentIntentCommand request,
        CancellationToken cancellationToken)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId, cancellationToken);

        if (invoice is null)
            throw new UniStayNotFoundException("Invoice not found.");

        if (invoice.Paid)
            throw new UniStayBusinessRuleException("invoice.already_paid", "Invoice already paid.");

        var metadata = new Dictionary<string, string>
        {
            { "invoiceId", invoice.Id.ToString() },
            { "studentId", invoice.StudentId.ToString() }
        };

        var stripeResult = await _stripeService.CreatePaymentIntentAsync(
            invoice.TotalAmount,
            metadata,
            cancellationToken);

        return new CreatePaymentIntentResult(
            ClientSecret: stripeResult.ClientSecret,
            Amount: stripeResult.Amount);
    }
}
