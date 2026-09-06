namespace UniStay.Application.Modules.Housing.Faults.Commands.Update;

public sealed class UpdateFaultCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    TimeProvider timeProvider)
    : IRequestHandler<UpdateFaultCommand, Unit>
{
    public async Task<Unit> Handle(UpdateFaultCommand request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var fault = await context.Faults
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (fault is null)
            throw new UniStayNotFoundException($"Fault with Id {request.Id} not found.");

        if (!currentUser.IsAdmin && !currentUser.IsEmployee && fault.ReportedByUserId != callerId)
            throw new UnauthorizedAccessException("You can update only your own faults.");

        var wasResolved = fault.IsResolved;
        var isResolved = request.IsResolved ?? IsResolvedStatus(request.Status);

        fault.Title = request.Title.Trim();
        fault.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        fault.Status = request.Status.Trim();
        fault.Priority = string.IsNullOrWhiteSpace(request.Priority) ? null : request.Priority.Trim();
        fault.IsResolved = isResolved;

        if (!wasResolved && isResolved)
            fault.ResolvedAtUtc = timeProvider.GetUtcNow().UtcDateTime;
        else if (!isResolved)
            fault.ResolvedAtUtc = null;

        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }

    private static bool IsResolvedStatus(string status) =>
        status.Trim().Equals(FaultEntity.Statuses.Resolved, StringComparison.OrdinalIgnoreCase);
}
