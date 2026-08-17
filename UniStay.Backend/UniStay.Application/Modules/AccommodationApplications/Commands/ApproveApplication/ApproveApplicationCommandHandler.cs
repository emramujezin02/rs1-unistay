using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Commands.ApproveApplication;

public sealed class ApproveApplicationCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    INotificationService notificationService,
    TimeProvider timeProvider)
    : IRequestHandler<ApproveApplicationCommand, ApproveApplicationResult>
{
    public async Task<ApproveApplicationResult> Handle(ApproveApplicationCommand request, CancellationToken ct)
    {
        var adminId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        if (!currentUser.IsAdmin)
            throw new UnauthorizedAccessException("Only admins can approve applications.");

        var application = await context.AccommodationApplications
            .Include(x => x.Student)
            .FirstOrDefaultAsync(x => x.Id == request.ApplicationId, ct)
            ?? throw new UniStayNotFoundException($"Application {request.ApplicationId} not found.");

        if (application.Status != ApplicationStatusType.Pending)
            throw new UniStayBusinessRuleException(
                "APPLICATION_NOT_PENDING",
                $"Only Pending applications can be approved. Current status: {application.Status}.");

        var bed = await context.Beds
            .Include(x => x.Assignments)
            .FirstOrDefaultAsync(x => x.Id == request.BedId, ct)
            ?? throw new UniStayNotFoundException($"Bed {request.BedId} not found.");

        var today = timeProvider.GetUtcNow().UtcDateTime.Date;
        if (bed.Assignments.Any(x => x.ToDate.Date >= today))
            throw new UniStayBusinessRuleException("BED_NOT_AVAILABLE", "The selected bed has an active assignment.");

        var assignment = new BedAssignmentEntity
        {
            BedId = bed.Id,
            StudentId = application.StudentId,
            FromDate = today,
            ToDate = today.AddYears(1)
        };

        await context.BedAssignments.AddAsync(assignment, ct);

        application.Status = ApplicationStatusType.Approved;
        application.AssignedRoomId = bed.RoomId;
        application.DecisionAtUtc = timeProvider.GetUtcNow().UtcDateTime;
        application.DecisionByUserId = adminId;

        await context.SaveChangesAsync(ct);

        await notificationService.NotifyUserAsync(
            application.StudentId,
            "Application Approved",
            "Congratulations! Your accommodation application has been approved and a bed has been assigned to you.",
            "application.approved",
            ct);

        return new ApproveApplicationResult(application.Id, assignment.Id);
    }
}
