using UniStay.Application.Modules.Notifications.Commands.MarkAllAsRead;
using UniStay.Tests.Services;

namespace UniStay.Tests.NotificationTests.UnitTests;

public class MarkAllNotificationsAsReadCommandHandlerTests
{
    [Fact]
    public async Task Should_Mark_All_Notifications_As_Read()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new MarkAllNotificationsAsReadCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.StudentId));

        await handler.Handle(new MarkAllNotificationsAsReadCommand(), CancellationToken.None);

        var notifications = await db.Notifications
            .Where(x => x.UserId == ApplicationTestDatabaseContext.StudentId)
            .ToListAsync();
        Assert.NotEmpty(notifications);
        Assert.All(notifications, notification => Assert.True(notification.IsRead));
    }

    [Fact]
    public async Task Should_Throw_When_UserId_Is_Null()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new MarkAllNotificationsAsReadCommandHandler(db, new FakeAppCurrentUser());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => handler.Handle(new MarkAllNotificationsAsReadCommand(), CancellationToken.None));
    }
}
