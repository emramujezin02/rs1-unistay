namespace UniStay.Application.Modules.Webhooks.Commands.DeleteWebhookSubscription;

public sealed class DeleteWebhookSubscriptionCommandHandler(IAppDbContext context)
    : IRequestHandler<DeleteWebhookSubscriptionCommand, DeleteWebhookSubscriptionResult>
{
    public async Task<DeleteWebhookSubscriptionResult> Handle(
        DeleteWebhookSubscriptionCommand request,
        CancellationToken ct)
    {
        var subscription = await context.WebhookSubscriptions
            .FirstOrDefaultAsync(x => x.Id == request.SubscriptionId, ct)
            ?? throw new UniStayNotFoundException($"Webhook subscription {request.SubscriptionId} not found.");

        context.WebhookSubscriptions.Remove(subscription);
        await context.SaveChangesAsync(ct);

        return new DeleteWebhookSubscriptionResult(true);
    }
}
