using UniStay.Application.Abstractions;
using UniStay.Domain.Entities.Notifications;

namespace UniStay.Infrastructure.Services;

public sealed class NotificationService(
    IAppDbContext context,
    IFirebasePushService pushService) : INotificationService
{
    public async Task NotifyUserAsync(
        int userId,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default)
    {
        await context.Notifications.AddAsync(new NotificationEntity
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            IsRead = false
        }, cancellationToken);

        await context.SaveChangesAsync(cancellationToken);

        var fcmToken = await context.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => x.FcmToken)
            .FirstOrDefaultAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(fcmToken))
            await pushService.SendAsync(fcmToken, title, message, cancellationToken);
    }

    public async Task NotifyUsersAsync(
        IEnumerable<int> userIds,
        string title,
        string message,
        string type,
        CancellationToken cancellationToken = default)
    {
        var notifications = userIds
            .Distinct()
            .Select(userId => new NotificationEntity
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                IsRead = false
            })
            .ToList();

        if (notifications.Count == 0)
            return;

        await context.Notifications.AddRangeAsync(notifications, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        var userIdList = notifications.Select(x => x.UserId).ToList();
        var fcmTokens = await context.Users
            .AsNoTracking()
            .Where(x => userIdList.Contains(x.Id) && x.FcmToken != null)
            .Select(x => x.FcmToken!)
            .ToListAsync(cancellationToken);

        await Task.WhenAll(fcmTokens.Select(token =>
            pushService.SendAsync(token, title, message, cancellationToken)));
    }
}
