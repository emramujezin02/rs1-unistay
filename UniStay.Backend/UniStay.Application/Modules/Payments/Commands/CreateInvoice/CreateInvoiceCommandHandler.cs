using UniStay.Domain.Entities.Payments;

namespace UniStay.Application.Modules.Payments.Commands.CreateInvoice;

public sealed class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, CreateInvoiceResult>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public CreateInvoiceCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<CreateInvoiceResult> Handle(
        CreateInvoiceCommand request,
        CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can create invoices.");

        _ = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.StudentId, cancellationToken)
            ?? throw new UniStayNotFoundException($"Student {request.StudentId} not found.");

        var invoice = new InvoiceEntity
        {
            StudentId = request.StudentId,
            TotalAmount = request.Amount,
            IssuedAt = true,
            Paid = false,
            EmailSent = false
        };

        await _context.Invoices.AddAsync(invoice, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateInvoiceResult(invoice.Id);
    }
}
