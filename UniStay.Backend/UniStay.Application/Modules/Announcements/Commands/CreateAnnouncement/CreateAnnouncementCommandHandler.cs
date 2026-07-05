namespace UniStay.Application.Modules.Announcements.Commands.CreateAnnouncement;

public sealed class CreateAnnouncementCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser,
    INotificationService notificationService,
    IWebhookDispatcher webhookDispatcher)
    : IRequestHandler<CreateAnnouncementCommand, CreateAnnouncementResult>
{
    public async Task<CreateAnnouncementResult> Handle(CreateAnnouncementCommand request, CancellationToken ct)
    {
        if (!currentUser.IsAdmin || currentUser.UserId is null)
            throw new UnauthorizedAccessException("Only admins can create announcements.");

        var adminExists = await context.Users
            .AnyAsync(x => x.Id == currentUser.UserId.Value, ct);

        if (!adminExists)
            throw new UniStayNotFoundException($"User with Id {currentUser.UserId.Value} not found.");

        var announcement = new AnnouncementEntity
        {
            Title = request.Title.Trim(),
            Content = request.Content.Trim(),
            ExpiresAtUtc = request.ExpiresAtUtc,
            Audience = request.Audience,
            CreatedByUserId = currentUser.UserId.Value
        };

        await context.Announcements.AddAsync(announcement, ct);
        await context.SaveChangesAsync(ct);

        await webhookDispatcher.DispatchAsync("announcement.published", new
        {
            announcementId = announcement.Id,
            title = announcement.Title,
            audience = announcement.Audience,
            publishedAt = announcement.CreatedAtUtc
        }, ct);

        var userIds = await context.Users
            .Where(x => x.Id != currentUser.UserId.Value)
            .Where(x =>
                request.Audience == AnnouncementEntity.Audiences.Everyone ||
                (request.Audience == AnnouncementEntity.Audiences.StudentsAndEmployees && (x.IsStudent || x.IsEmployee)) ||
                (request.Audience == AnnouncementEntity.Audiences.Students && x.IsStudent) ||
                (request.Audience == AnnouncementEntity.Audiences.Employees && x.IsEmployee))
            .Select(x => x.Id)
            .ToListAsync(ct);

        if (userIds.Count > 0)
        {
            await notificationService.NotifyUsersAsync(
                userIds,
                $"New Announcement: {announcement.Title}",
                "A new announcement has been published. Tap to view details.",
                "announcement.published",
                ct);
        }

        return new CreateAnnouncementResult(announcement.Id);
    }
}
