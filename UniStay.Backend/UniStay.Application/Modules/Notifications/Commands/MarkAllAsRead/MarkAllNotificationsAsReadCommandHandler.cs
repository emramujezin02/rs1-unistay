namespace UniStay.Application.Modules.Notifications.Commands.MarkAllAsRead;

public sealed class MarkAllNotificationsAsReadCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<MarkAllNotificationsAsReadCommand>
{
    public async Task Handle(MarkAllNotificationsAsReadCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var unreadNotifications = await context.Notifications
            .Where(x => x.UserId == userId && !x.IsRead)
            .ToListAsync(ct);

        foreach (var notification in unreadNotifications)
            notification.IsRead = true;

        if (unreadNotifications.Count > 0)
            await context.SaveChangesAsync(ct);
    }
}
