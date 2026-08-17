namespace UniStay.Application.Modules.Housing.Faults.Commands.Delete;

public sealed class DeleteFaultCommandHandler(IAppDbContext context, IAppCurrentUser currentUser)
    : IRequestHandler<DeleteFaultCommand, Unit>
{
    public async Task<Unit> Handle(DeleteFaultCommand request, CancellationToken ct)
    {
        if (currentUser.UserId is null)
            throw new UniStayBusinessRuleException("AUTH_REQUIRED", "User is not authenticated.");

        var fault = await context.Faults
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (fault is null)
            throw new UniStayNotFoundException($"Fault with Id {request.Id} not found.");

        context.Faults.Remove(fault);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
