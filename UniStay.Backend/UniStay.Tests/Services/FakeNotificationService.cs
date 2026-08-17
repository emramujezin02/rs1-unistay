using UniStay.Application.Abstractions;

namespace UniStay.Tests.Services;

public sealed class FakeNotificationService : INotificationService
{
    public List<NotificationCall> Calls { get; } = [];

    public Task NotifyUserAsync(
        int userId,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default)
    {
        Calls.Add(new NotificationCall(userId, title, message, type));
        return Task.CompletedTask;
    }

    public Task NotifyUsersAsync(
        IEnumerable<int> userIds,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default)
    {
        Calls.AddRange(userIds.Select(userId => new NotificationCall(userId, title, message, type)));
        return Task.CompletedTask;
    }
}

public sealed record NotificationCall(int UserId, string Title, string Message, string Type);
