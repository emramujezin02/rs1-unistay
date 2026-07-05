namespace UniStay.Application.Modules.Payments.Queries.GetInvoicesByUser;

public sealed class GetInvoicesByUserQueryHandler
    : IRequestHandler<GetInvoicesByUserQuery, GetInvoicesByUserResult>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public GetInvoicesByUserQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetInvoicesByUserResult> Handle(
        GetInvoicesByUserQuery request,
        CancellationToken cancellationToken)
    {
        var callerId = _currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in to view invoices.");

        var studentId = request.StudentId ?? callerId;

        if (!_currentUser.IsAdmin && studentId != callerId)
            throw new UnauthorizedAccessException("You are not authorised to access these invoices.");

        var items = await _context.Invoices
            .Where(i => i.StudentId == studentId)
            .OrderByDescending(i => i.Id)
            .Select(i => new InvoiceItem(
                i.Id,
                i.TotalAmount,
                i.Paid,
                i.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return new GetInvoicesByUserResult(items);
    }
}
