using UniStay.Domain.Entities.Payments;

namespace UniStay.Application.Modules.Payments.Commands.StripeWebhook;

public sealed class StripeWebhookCommandHandler : IRequestHandler<StripeWebhookCommand, StripeWebhookResult>
{
    private readonly IAppDbContext _context;
    private readonly IStripeService _stripeService;
    private readonly TimeProvider _timeProvider;

    public StripeWebhookCommandHandler(
        IAppDbContext context,
        IStripeService stripeService,
        TimeProvider timeProvider)
    {
        _context = context;
        _stripeService = stripeService;
        _timeProvider = timeProvider;
    }

    public async Task<StripeWebhookResult> Handle(
        StripeWebhookCommand request,
        CancellationToken cancellationToken)
    {
        var stripeEvent = _stripeService.ParseWebhookEvent(request.Payload, request.Signature);

        if (stripeEvent is null)
            return new StripeWebhookResult(SignatureValid: false);

        if (stripeEvent.EventType == "payment_intent.succeeded")
            await HandlePaymentSucceededAsync(stripeEvent, cancellationToken);

        return new StripeWebhookResult(SignatureValid: true);
    }

    private async Task HandlePaymentSucceededAsync(
        StripeWebhookEvent stripeEvent,
        CancellationToken cancellationToken)
    {
        if (!stripeEvent.Metadata.TryGetValue("invoiceId", out var invoiceIdValue))
            return;

        if (!int.TryParse(invoiceIdValue, out var invoiceId))
            return;

        var invoice = await _context.Invoices
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == invoiceId, cancellationToken);

        if (invoice is null || invoice.Paid)
            return;

        invoice.Paid = true;

        var payment = new PaymentEntity
        {
            InvoiceId = invoice.Id,
            StudentId = invoice.StudentId,
            Amount = invoice.TotalAmount,
            PaymentDate = _timeProvider.GetUtcNow().UtcDateTime,
            PaymentMethod = "Stripe",
            PaymentStatus = "Succeeded",
            ReferenceNumber = stripeEvent.PaymentIntentId
        };

        await _context.Payments.AddAsync(payment, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
