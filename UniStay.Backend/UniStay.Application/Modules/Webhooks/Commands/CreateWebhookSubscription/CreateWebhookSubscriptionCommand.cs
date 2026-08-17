namespace UniStay.Application.Modules.Webhooks.Commands.CreateWebhookSubscription;

public sealed record CreateWebhookSubscriptionCommand(
    string Url,
    string Secret,
    IReadOnlyList<string> Events,
    string Description) : IRequest<CreateWebhookSubscriptionResult>;
