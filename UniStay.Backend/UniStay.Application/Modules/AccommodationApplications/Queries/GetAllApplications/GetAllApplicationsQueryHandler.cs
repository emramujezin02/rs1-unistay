using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetAllApplications;

public sealed class GetAllApplicationsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetAllApplicationsQuery, GetAllApplicationsResult>
{
    public async Task<GetAllApplicationsResult> Handle(GetAllApplicationsQuery request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can view all applications.");

        var query = context.AccommodationApplications
            .AsNoTracking()
            .Include(x => x.Student)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status)
            && Enum.TryParse<ApplicationStatusType>(request.Status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(x => x.Status == parsedStatus);
        }

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var search = request.SearchTerm.Trim();
            query = query.Where(x =>
                EF.Functions.Like(x.Student!.Firstname, $"%{search}%") ||
                EF.Functions.Like(x.Student!.Lastname, $"%{search}%") ||
                EF.Functions.Like(x.Student!.Email, $"%{search}%") ||
                EF.Functions.Like(x.Student!.Username, $"%{search}%"));
        }

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(x => x.AppliedAtUtc)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new AdminApplicationListItemResult(
                x.Id,
                x.StudentId,
                x.Student != null ? x.Student.Username : string.Empty,
                x.Student != null ? x.Student.Email : string.Empty,
                x.PreferredRoomType,
                x.PreferredRoomId,
                x.YearOfStudy,
                x.GpaScore,
                x.PhoneNumber,
                x.SpecialRequirements,
                x.DocumentNames,
                x.Notes,
                x.Status.ToString(),
                x.AppliedAtUtc,
                x.DecisionAtUtc,
                x.AssignedRoomId,
                x.DecisionByUserId))
            .ToListAsync(ct);

        return new GetAllApplicationsResult(items, totalCount, request.PageNumber, request.PageSize);
    }
}
