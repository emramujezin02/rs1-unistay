using UniStay.Application.Modules.Notifications.Queries.GetMyNotifications;
using UniStay.Tests.Services;

namespace UniStay.Tests.NotificationTests.UnitTests;

public class GetMyNotificationsQueryHandlerTests
{
    [Fact]
    public async Task Should_Return_My_Notifications()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new GetMyNotificationsQueryHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));

        var result = await handler.Handle(new GetMyNotificationsQuery(), CancellationToken.None);

        Assert.Equal(2, result.Notifications.Count);
        Assert.Equal(1, result.UnreadCount);
    }

    [Fact]
    public async Task Should_Throw_When_UserId_Is_Null()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new GetMyNotificationsQueryHandler(db, new FakeAppCurrentUser());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => handler.Handle(new GetMyNotificationsQuery(), CancellationToken.None));
    }
}
