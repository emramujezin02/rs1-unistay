using Microsoft.Extensions.Time.Testing;
using UniStay.Application.Common.Exceptions;
using UniStay.Application.Modules.AccommodationApplications.Commands.ApproveApplication;
using UniStay.Domain.Entities.Applications;
using UniStay.Tests.Services;

namespace UniStay.Tests.ApplicationTests.UnitTests;

public class ApproveApplicationCommandHandlerTests
{
    [Fact]
    public async Task Should_Approve_Application_And_Create_BedAssignment()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var notifications = new FakeNotificationService();
        var handler = new ApproveApplicationCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.AdminId, isAdmin: true),
            notifications,
            new FakeTimeProvider());

        var result = await handler.Handle(
            new ApproveApplicationCommand(
                ApplicationTestDatabaseContext.ApplicationId,
                ApplicationTestDatabaseContext.BedId),
            CancellationToken.None);

        Assert.Equal(ApplicationTestDatabaseContext.ApplicationId, result.ApplicationId);
        Assert.True(result.BedAssignmentId > 0);

        var application = await db.AccommodationApplications
            .FirstAsync(x => x.Id == ApplicationTestDatabaseContext.ApplicationId);
        Assert.Equal(ApplicationStatusType.Approved, application.Status);

        var assignment = await db.BedAssignments
            .FirstOrDefaultAsync(x => x.BedId == ApplicationTestDatabaseContext.BedId);
        Assert.NotNull(assignment);
        Assert.Equal(ApplicationTestDatabaseContext.StudentId, assignment.StudentId);

        var notification = Assert.Single(notifications.Calls);
        Assert.Equal(ApplicationTestDatabaseContext.StudentId, notification.UserId);
        Assert.Equal("Application Approved", notification.Title);
        Assert.Equal("application.approved", notification.Type);
    }

    [Fact]
    public async Task Should_Throw_When_Application_Is_Not_Pending()
    {
        await using var db = ApplicationTestDatabaseContext.Create();
        var handler = new ApproveApplicationCommandHandler(
            db,
            new FakeAppCurrentUser(ApplicationTestDatabaseContext.AdminId, isAdmin: true),
            new FakeNotificationService(),
            new FakeTimeProvider());
        var command = new ApproveApplicationCommand(
            ApplicationTestDatabaseContext.ApplicationId,
            ApplicationTestDatabaseContext.BedId);

        await handler.Handle(command, CancellationToken.None);
        var exception = await Assert.ThrowsAsync<UniStayBusinessRuleException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Contains("Only Pending applications can be approved", exception.Message);
    }
}
