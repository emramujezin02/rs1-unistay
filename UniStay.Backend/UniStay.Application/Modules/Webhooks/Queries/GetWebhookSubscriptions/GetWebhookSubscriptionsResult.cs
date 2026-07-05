namespace UniStay.Application.Modules.Webhooks.Queries.GetWebhookSubscriptions;

public sealed record GetWebhookSubscriptionsResult(IReadOnlyList<WebhookSubscriptionDto> Subscriptions);

public sealed record WebhookSubscriptionDto(
    int Id,
    string Url,
    string Description,
    IReadOnlyList<string> Events,
    bool IsActive,
    DateTime CreatedAtUtc);
