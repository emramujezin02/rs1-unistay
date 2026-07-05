namespace UniStay.Application.Modules.Housing.BedAssignments.Queries.List;

public sealed class ListBedAssignmentsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<ListBedAssignmentsQuery, PageResult<ListBedAssignmentsQueryDto>>
{
    public async Task<PageResult<ListBedAssignmentsQueryDto>> Handle(ListBedAssignmentsQuery request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can view bed assignments.");

        var query = context.BedAssignments
            .AsNoTracking()
            .Include(x => x.Bed)
            .ThenInclude(x => x.Room)
            .Include(x => x.Student)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            var q = request.Q.Trim();
            query = query.Where(x =>
                x.Student.Firstname.Contains(q) ||
                x.Student.Lastname.Contains(q) ||
                x.Bed.BedNumber.Contains(q) ||
                x.Bed.Room.RoomNumber.Contains(q));
        }

        if (request.BedId.HasValue)
            query = query.Where(x => x.BedId == request.BedId.Value);

        if (request.RoomId.HasValue)
            query = query.Where(x => x.Bed.RoomId == request.RoomId.Value);

        if (request.StudentId.HasValue)
            query = query.Where(x => x.StudentId == request.StudentId.Value);

        var projectedQuery = query
            .OrderByDescending(x => x.FromDate)
            .ThenBy(x => x.Bed.BedNumber)
            .Select(x => new ListBedAssignmentsQueryDto
            {
                AssignmentID = x.Id,
                BedID = x.BedId,
                BedNumber = x.Bed.BedNumber,
                RoomID = x.Bed.RoomId,
                RoomNumber = x.Bed.Room.RoomNumber,
                StudentID = x.StudentId,
                StudentName = x.Student.Firstname,
                StudenLName = x.Student.Lastname,
                StudentIdentifier = x.Student.Username,
                FromDate = x.FromDate,
                ToDate = x.ToDate
            });

        return await PageResult<ListBedAssignmentsQueryDto>.FromQueryableAsync(projectedQuery, request.Paging, ct);
    }
}


