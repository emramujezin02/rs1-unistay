using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Commands.RejectApplication;

public sealed class RejectApplicationCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    INotificationService notificationService,
    TimeProvider timeProvider)
    : IRequestHandler<RejectApplicationCommand, RejectApplicationResult>
{
    public async Task<RejectApplicationResult> Handle(RejectApplicationCommand request, CancellationToken ct)
    {
        var adminId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can reject applications.");

        var application = await context.AccommodationApplications
            .FirstOrDefaultAsync(x => x.Id == request.ApplicationId, ct)
            ?? throw new UniStayNotFoundException($"Application {request.ApplicationId} not found.");

        if (application.Status != ApplicationStatusType.Pending)
            throw new UniStayBusinessRuleException(
                "APPLICATION_NOT_PENDING",
                $"Only Pending applications can be rejected. Current status: {application.Status}.");

        application.Status = ApplicationStatusType.Rejected;
        application.DecisionAtUtc = timeProvider.GetUtcNow().UtcDateTime;
        application.DecisionByUserId = adminId;

        await context.SaveChangesAsync(ct);

        await notificationService.NotifyUserAsync(
            application.StudentId,
            "Application Rejected",
            "Unfortunately your accommodation application has been reviewed and rejected. Please contact the administration for more information.",
            "application.rejected",
            ct);

        return new RejectApplicationResult(application.Id);
    }
}
