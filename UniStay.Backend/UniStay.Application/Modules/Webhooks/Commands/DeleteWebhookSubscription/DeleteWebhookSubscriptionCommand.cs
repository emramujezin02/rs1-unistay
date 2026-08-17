namespace UniStay.Application.Modules.Webhooks.Commands.DeleteWebhookSubscription;

public sealed record DeleteWebhookSubscriptionCommand(int SubscriptionId)
    : IRequest<DeleteWebhookSubscriptionResult>;
