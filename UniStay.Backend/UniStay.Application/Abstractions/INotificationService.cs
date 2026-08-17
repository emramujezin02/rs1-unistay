namespace UniStay.Application.Abstractions;

public interface INotificationService
{
    Task NotifyUserAsync(
        int userId,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default);

    Task NotifyUsersAsync(
        IEnumerable<int> userIds,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default);
}
