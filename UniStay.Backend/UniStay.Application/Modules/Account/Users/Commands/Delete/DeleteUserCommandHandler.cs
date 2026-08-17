namespace UniStay.Application.Modules.Account.Users.Commands.Delete;

public sealed class DeleteUserCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<DeleteUserCommand, Unit>
{
    public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can delete users.");

        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct)
            ?? throw new UniStayNotFoundException($"User with Id {request.Id} not found.");

        var hasBedAssignment = await context.BedAssignments
            .AnyAsync(x => x.StudentId == request.Id, ct);

        if (hasBedAssignment)
            throw new UniStayBusinessRuleException("USER_HAS_BED_ASSIGNMENT", "User is assigned to a bed and cannot be deleted. Unassign the student first.");

        context.Users.Remove(user);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
