namespace UniStay.Application.Modules.AccommodationApplications.Queries.GetMyApplications;

public sealed class GetMyApplicationsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetMyApplicationsQuery, GetMyApplicationsResult>
{
    public async Task<GetMyApplicationsResult> Handle(GetMyApplicationsQuery request, CancellationToken ct)
    {
        var studentId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var applications = await context.AccommodationApplications
            .AsNoTracking()
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.AppliedAtUtc)
            .Select(x => new ApplicationListItemResult(
                x.Id,
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
                x.AssignedRoomId))
            .ToListAsync(ct);

        return new GetMyApplicationsResult(applications);
    }
}
