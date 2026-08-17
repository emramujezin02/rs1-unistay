namespace UniStay.Application.Modules.Notifications.Commands.MarkAsRead;

public sealed class MarkNotificationAsReadCommandHandler(
    IAppDbContext context,
    IAppCurrentUser currentUser)
    : IRequestHandler<MarkNotificationAsReadCommand>
{
    public async Task Handle(MarkNotificationAsReadCommand request, CancellationToken ct)
    {
        var userId = currentUser.UserId
            ?? throw new UnauthorizedAccessException("You must be logged in.");

        var notification = await context.Notifications
            .FirstOrDefaultAsync(x => x.Id == request.NotificationId && x.UserId == userId, ct)
            ?? throw new UniStayNotFoundException($"Notification {request.NotificationId} not found.");

        if (notification.IsRead)
            return;

        notification.IsRead = true;
        await context.SaveChangesAsync(ct);
    }
}
