namespace UniStay.Application.Modules.Notifications.Queries.GetMyNotifications;

public sealed record NotificationDto(
    int Id,
    string Title,
    string Message,
    string Type,
    bool IsRead,
    DateTime CreatedAt);

public sealed record GetMyNotificationsResult(
    IReadOnlyList<NotificationDto> Notifications,
    int UnreadCount);
