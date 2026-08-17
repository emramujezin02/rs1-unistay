using UniStay.Domain.Entities.Applications;

namespace UniStay.Application.Modules.AccommodationApplications.Commands.CreateApplication;

public sealed class CreateApplicationCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    INotificationService notificationService,
    TimeProvider timeProvider)
    : IRequestHandler<CreateApplicationCommand, CreateApplicationResult>
{
    public async Task<CreateApplicationResult> Handle(CreateApplicationCommand request, CancellationToken ct)
    {
        var studentId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in to submit an application.");

        var studentExists = await context.Users.AnyAsync(x => x.Id == studentId, ct);
        if (!studentExists)
            throw new UniStayNotFoundException($"User with Id {studentId} not found.");

        if (request.PreferredRoomId.HasValue)
        {
            var preferredRoomExists = await context.Rooms.AnyAsync(x => x.Id == request.PreferredRoomId.Value, ct);
            if (!preferredRoomExists)
                throw new UniStayNotFoundException($"Room {request.PreferredRoomId.Value} not found.");
        }

        var hasPending = await context.AccommodationApplications.AnyAsync(
            x => x.StudentId == studentId && x.Status == ApplicationStatusType.Pending,
            ct);

        if (hasPending)
            throw new UniStayBusinessRuleException(
                "APPLICATION_PENDING_EXISTS",
                "You already have a pending application. Wait for a decision before submitting another.");

        var now = timeProvider.GetUtcNow().UtcDateTime;
        var application = new AccommodationApplicationEntity
        {
            StudentId = studentId,
            PreferredRoomType = request.PreferredRoomType.Trim(),
            PreferredRoomId = request.PreferredRoomId,
            YearOfStudy = request.YearOfStudy,
            GpaScore = request.GpaScore,
            PhoneNumber = request.PhoneNumber?.Trim(),
            SpecialRequirements = request.SpecialRequirements?.Trim(),
            DocumentNames = request.DocumentNames?.Trim(),
            Notes = request.Notes?.Trim(),
            AppliedAtUtc = now,
            Status = ApplicationStatusType.Pending
        };

        await context.AccommodationApplications.AddAsync(application, ct);
        await context.SaveChangesAsync(ct);

        var adminIds = await context.Users
            .Where(x => x.IsAdmin)
            .Select(x => x.Id)
            .ToListAsync(ct);

        if (adminIds.Count > 0)
        {
            await notificationService.NotifyUsersAsync(
                adminIds,
                "New Application Submitted",
                "A student has submitted a new accommodation application and is waiting for review.",
                "application.submitted",
                ct);
        }

        return new CreateApplicationResult(application.Id);
    }
}
