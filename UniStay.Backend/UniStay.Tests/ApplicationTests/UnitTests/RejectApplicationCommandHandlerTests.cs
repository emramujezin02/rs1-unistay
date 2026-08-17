using Microsoft.Extensions.Time.Testing;
using UniStay.Application.Common.Exceptions;
using UniStay.Application.Modules.AccommodationApplications.Commands.RejectApplication;
using UniStay.Domain.Entities.Applications;
using UniStay.Tests.Services;

namespace UniStay.Tests.ApplicationTests.UnitTests;

public class RejectApplicationCommandHandlerTests
{
    [Fact]
    public async Task Should_Reject_Application()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var notifications = new FakeNotificationService();
        var handler = new RejectApplicationCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.AdminId, isAdmin: true),
            notifications,
            new FakeTimeProvider());

        var result = await handler.Handle(
            new RejectApplicationCommand(ApplicationTestDatabaseContext.ApplicationId),
            CancellationToken.None);

        Assert.Equal(ApplicationTestDatabaseContext.ApplicationId, result.ApplicationId);

        var application = await db.AccommodationApplications
            .FirstAsync(x => x.Id == ApplicationTestDatabaseContext.ApplicationId);
        Assert.Equal(ApplicationStatusType.Rejected, application.Status);
        Assert.NotNull(application.DecisionAtUtc);
        Assert.Equal(ApplicationTestDatabaseContext.AdminId, application.DecisionByUserId);

        var notification = Assert.Single(notifications.Calls);
        Assert.Equal(ApplicationTestDatabaseContext.StudentId, notification.UserId);
        Assert.Equal("Application Rejected", notification.Title);
        Assert.Equal("application.rejected", notification.Type);
    }

    [Fact]
    public async Task Should_Throw_When_Application_Is_Not_Pending()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new RejectApplicationCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.AdminId, isAdmin: true),
            new FakeNotificationService(),
            new FakeTimeProvider());
        var command = new RejectApplicationCommand(ApplicationTestDatabaseContext.ApplicationId);

        await handler.Handle(command, CancellationToken.None);
        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Contains("Only Pending applications can be rejected", exception.Message);
    }
}
