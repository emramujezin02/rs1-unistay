namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Delete;

public sealed class DeleteBedAssignmentCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<DeleteBedAssignmentCommand, Unit>
{
    public async Task<Unit> Handle(DeleteBedAssignmentCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can delete bed assignments.");

        var assignment = await context.BedAssignments.FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (assignment is null)
            throw new UniStayNotFoundException("Assignment not found.");

        context.BedAssignments.Remove(assignment);
        await context.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
