namespace UniStay.Application.Modules.Housing.Faults.Commands.Create;

public sealed class CreateFaultCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    TimeProvider timeProvider)
    : IRequestHandler<CreateFaultCommand, int>
{
    public async Task<int> Handle(CreateFaultCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new UniStayBusinessRuleException("AUTH_REQUIRED", "User is not authenticated.");

        var reporterExists = await context.Users
            .AnyAsync(x => x.Id == currentUser.UserId.Value, ct);

        if (!reporterExists)
            throw new UniStayNotFoundException($"User with Id {currentUser.UserId.Value} not found.");

        var fault = new FaultEntity
        {
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            RoomId = request.RoomId,
            ReportedByUserId = currentUser.UserId.Value,
            ReportedAtUtc = timeProvider.GetUtcNow().UtcDateTime,
            IsResolved = false,
            Status = FaultEntity.Statuses.Open
        };

        context.Faults.Add(fault);
        await context.SaveChangesAsync(ct);

        return fault.Id;
    }
}
