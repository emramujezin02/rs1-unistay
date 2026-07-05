namespace UniStay.Application.Abstractions;

public interface IFirebasePushService
{
    Task SendAsync(string fcmToken, string title, string body, CancellationToken cancellationToken = default);
}
