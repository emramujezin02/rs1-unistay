namespace UniStay.Application.Modules.Housing.BedAssignments.Commands.Create;

public sealed class CreateBedAssignmentCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<CreateBedAssignmentCommand, int>
{
    public async Task<int> Handle(CreateBedAssignmentCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can assign beds.");

        var bedExists = await context.Beds.AnyAsync(x => x.Id == request.BedID, ct);

        if (!bedExists)
            throw new UniStayNotFoundException("Bed does not exist.");

        var studentExists = await context.Users.AnyAsync(x => x.Id == request.StudentID, ct);

        if (!studentExists)
            throw new UniStayNotFoundException("Student does not exist.");

        var bedTaken = await context.BedAssignments.AnyAsync(x =>
            x.BedId == request.BedID &&
            x.ToDate > request.FromDate &&
            x.FromDate < request.ToDate,
            ct);

        if (bedTaken)
            throw new UniStayBusinessRuleException("BED_ALREADY_ASSIGNED", "Bed is already assigned in the selected date range.");

        var studentHasBed = await context.BedAssignments.AnyAsync(x =>
            x.StudentId == request.StudentID &&
            x.ToDate > request.FromDate &&
            x.FromDate < request.ToDate,
            ct);

        if (studentHasBed)
            throw new UniStayBusinessRuleException("STUDENT_ALREADY_HAS_BED", "Student already has a bed assigned for this period.");

        var assignment = new BedAssignmentEntity
        {
            BedId = request.BedID,
            StudentId = request.StudentID,
            FromDate = request.FromDate,
            ToDate = request.ToDate
        };

        context.BedAssignments.Add(assignment);
        await context.SaveChangesAsync(ct);

        return assignment.Id;
    }
}
