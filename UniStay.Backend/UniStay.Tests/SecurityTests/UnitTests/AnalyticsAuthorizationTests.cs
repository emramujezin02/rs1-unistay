using UniStay.Application.Modules.Communication.Analytics.Queries.GetSnapshot;
using UniStay.Tests.Services;

namespace UniStay.Tests.SecurityTests.UnitTests;

public class AnalyticsAuthorizationTests
{
    [Fact]
    public async Task Snapshot_Should_Reject_Student()
    {
        await using var db = CreateDb();
        var handler = new GetAnalyticsSnapshotQueryHandler(db, TimeProvider.System, new FakeAppCurrentUser(901));

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            handler.Handle(new GetAnalyticsSnapshotQuery(), CancellationToken.None));
    }

    [Fact]
    public async Task Snapshot_Should_Return_Data_For_Admin()
    {
        await using var db = CreateDb();
        var handler = new GetAnalyticsSnapshotQueryHandler(db, TimeProvider.System, new FakeAppCurrentUser(902, isAdmin: true));

        var snapshot = await handler.Handle(new GetAnalyticsSnapshotQuery(), CancellationToken.None);

        Assert.NotNull(snapshot);
        Assert.True(snapshot.TotalUsers >= 0);
        Assert.True(snapshot.TotalRooms >= 0);
    }

    private static DatabaseContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<DatabaseContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new DatabaseContext(options, TimeProvider.System);
    }
}
