namespace UniStay.Application.Modules.Notifications.Queries.GetMyNotifications;

public sealed class GetMyNotificationsQueryHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<GetMyNotificationsQuery, GetMyNotificationsResult>
{
    public async Task<GetMyNotificationsResult> Handle(GetMyNotificationsQuery request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var notifications = await context.Notifications
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .Take(50)
            .Select(x => new NotificationDto(
                x.Id,
                x.Title,
                x.Message,
                x.Type,
                x.IsRead,
                x.CreatedAtUtc))
            .ToListAsync(ct);

        var unreadCount = notifications.Count(x => !x.IsRead);

        return new GetMyNotificationsResult(notifications, unreadCount);
    }
}
