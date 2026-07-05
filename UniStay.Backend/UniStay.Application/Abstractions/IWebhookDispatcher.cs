namespace UniStay.Application.Abstractions;

public interface IWebhookDispatcher
{
    Task DispatchAsync(string eventType, object payload, CancellationToken cancellationToken = default);
}
