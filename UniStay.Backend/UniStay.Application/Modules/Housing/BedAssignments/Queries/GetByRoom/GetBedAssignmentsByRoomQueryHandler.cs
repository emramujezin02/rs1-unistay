namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByRoom;

public sealed class GetBedAssignmentsByRoomQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetBedAssignmentsByRoomQuery, IReadOnlyList<GetBedAssignmentsByRoomQueryDto>>
{
    public async Task<IReadOnlyList<GetBedAssignmentsByRoomQueryDto>> Handle(GetBedAssignmentsByRoomQuery request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can view room bed assignments.");

        var roomExists = await context.Rooms.AnyAsync(x => x.Id == request.RoomId, ct);

        if (!roomExists)
            throw new UniStayNotFoundException($"Room with Id {request.RoomId} not found.");

        return await context.BedAssignments
            .AsNoTracking()
            .Include(x => x.Bed)
            .Include(x => x.Student)
            .Where(x => x.Bed.RoomId == request.RoomId)
            .OrderBy(x => x.Bed.BedNumber)
            .ThenBy(x => x.FromDate)
            .Select(x => new GetBedAssignmentsByRoomQueryDto
            {
                AssignmentID = x.Id,
                BedID = x.BedId,
                BedNumber = x.Bed.BedNumber,
                StudentID = x.StudentId,
                Name = x.Student.Firstname,
                LastName = x.Student.Lastname,
                FromDate = x.FromDate,
                ToDate = x.ToDate
            })
            .ToListAsync(ct);
    }
}
