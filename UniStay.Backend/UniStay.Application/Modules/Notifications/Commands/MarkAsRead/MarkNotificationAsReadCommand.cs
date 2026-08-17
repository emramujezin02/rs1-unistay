namespace UniStay.Application.Modules.Notifications.Commands.MarkAsRead;

public sealed record MarkNotificationAsReadCommand(int NotificationId) : IRequest;
