namespace UniStay.Application.Modules.Webhooks.Commands.TestWebhookSubscription;

public sealed record TestWebhookSubscriptionCommand(int SubscriptionId)
    : IRequest<TestWebhookSubscriptionResult>;
