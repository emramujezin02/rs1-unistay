namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByStudent;

public sealed class GetBedAssignmentByStudentQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetBedAssignmentByStudentQuery, GetBedAssignmentByStudentQueryDto>
{
    public async Task<GetBedAssignmentByStudentQueryDto> Handle(GetBedAssignmentByStudentQuery request, CancellationToken ct)
    {
        var callerId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (!currentUser.IsAdmin && callerId != request.StudentId)
            throw new UnauthorizedAccessException("You are not authorised to view this bed assignment.");

        var assignment = await context.BedAssignments
            .AsNoTracking()
            .Include(x => x.Bed)
            .ThenInclude(x => x.Room)
            .Where(x => x.StudentId == request.StudentId)
            .OrderByDescending(x => x.FromDate)
            .Select(x => new GetBedAssignmentByStudentQueryDto
            {
                AssignmentID = x.Id,
                BedID = x.BedId,
                BedNumber = x.Bed.BedNumber,
                RoomID = x.Bed.RoomId,
                RoomNumber = x.Bed.Room.RoomNumber,
                Floor = x.Bed.Room.Floor,
                FromDate = x.FromDate,
                ToDate = x.ToDate
            })
            .FirstOrDefaultAsync(ct);

        return assignment ?? throw new UniStayNotFoundException("This student has no assigned bed.");
    }
}
