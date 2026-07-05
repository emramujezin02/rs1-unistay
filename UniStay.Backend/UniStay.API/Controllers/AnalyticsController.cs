using UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;
using UniStay.Infrastructure.Hubs;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/analytics")]
public sealed class AnalyticsController(ISender sender) : ControllerBase
{
    [HttpGet("snapshot")]
    public async Task<GetAnalyticsSnapshotQueryDto> GetSnapshot(CancellationToken ct)
    {
        var snapshot = await sender.Send(new GetAnalyticsSnapshotQuery(), ct);
        snapshot.ActiveUsers = Math.Max(snapshot.ActiveUsers, ChatHub.GetActiveUserCount());
        return snapshot;
    }
}
