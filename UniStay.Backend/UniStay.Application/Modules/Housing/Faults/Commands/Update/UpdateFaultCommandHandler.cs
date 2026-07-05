namespace UniStay.Application.Modules.Housing.Faults.Commands.Update;

public sealed class UpdateFaultCommandHandler(IAppDbContext context)
    : IRequestHandler<UpdateFaultCommand, Unit>
{
    public async Task<Unit> Handle(UpdateFaultCommand request, CancellationToken ct)
    {
        var fault = await context.Faults
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (fault is null)
            throw new UniStayNotFoundException($"Fault with Id {request.Id} not found.");

        var isResolved = request.IsResolved ?? request.ResolvedAtUtc.HasValue;

        fault.Title = request.Title.Trim();
        fault.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        fault.Status = request.Status.Trim();
        fault.Priority = string.IsNullOrWhiteSpace(request.Priority) ? null : request.Priority.Trim();
        fault.IsResolved = isResolved;
        fault.ResolvedAtUtc = isResolved ? request.ResolvedAtUtc : null;

        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
