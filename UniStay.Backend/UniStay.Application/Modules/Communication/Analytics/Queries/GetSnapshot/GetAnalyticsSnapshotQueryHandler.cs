namespace UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;

public sealed class GetAnalyticsSnapshotQueryHandler(
    IAppDbContext context,
    TimeProvider timeProvider,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetAnalyticsSnapshotQuery, GetAnalyticsSnapshotQueryDto>
{
    public async Task<GetAnalyticsSnapshotQueryDto> Handle(
        GetAnalyticsSnapshotQuery request,
        CancellationToken ct)
    {
        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can view analytics.");

        return await AnalyticsSnapshotProvider.GetAsync(
            context,
            timeProvider,
            ct);
    }
}