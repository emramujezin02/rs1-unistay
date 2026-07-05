namespace UniStay.Application.Modules.Payments.Queries.GetAllInvoices;

public sealed class GetAllInvoicesQueryHandler
    : IRequestHandler<GetAllInvoicesQuery, GetAllInvoicesResult>
{
    private readonly IAppDbContext _context;
    private readonly IAppCurrentUser _currentUser;

    public GetAllInvoicesQueryHandler(IAppDbContext context, IAppCurrentUser currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<GetAllInvoicesResult> Handle(
        GetAllInvoicesQuery request,
        CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can view all invoices.");

        var items = await _context.Invoices
            .OrderByDescending(i => i.Id)
            .Select(i => new AllInvoiceItem(
                i.Id,
                i.TotalAmount,
                i.Paid,
                i.CreatedAtUtc))
            .ToListAsync(cancellationToken);

        return new GetAllInvoicesResult(items);
    }
}
