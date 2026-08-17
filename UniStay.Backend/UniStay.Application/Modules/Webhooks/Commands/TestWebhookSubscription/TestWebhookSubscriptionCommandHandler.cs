namespace UniStay.Application.Modules.Webhooks.Commands.TestWebhookSubscription;

public sealed class TestWebhookSubscriptionCommandHandler(
    IAppDbContext context,
    IWebhookDispatcher dispatcher)
    : IRequestHandler<TestWebhookSubscriptionCommand, TestWebhookSubscriptionResult>
{
    public async Task<TestWebhookSubscriptionResult> Handle(
        TestWebhookSubscriptionCommand request,
        CancellationToken ct)
    {
        var subscription = await context.WebhookSubscriptions
            .FirstOrDefaultAsync(x => x.Id == request.SubscriptionId, ct)
            ?? throw new UniStayNotFoundException($"Webhook subscription {request.SubscriptionId} not found.");

        var originalEvents = subscription.Events;
        var originalIsActive = subscription.IsActive;

        try
        {
            subscription.Events = "webhook.test";
            subscription.IsActive = true;
            await context.SaveChangesAsync(ct);

            await dispatcher.DispatchAsync(
                "webhook.test",
                new { message = "This is a test delivery from UniStay." },
                ct);

            return new TestWebhookSubscriptionResult(true, null);
        }
        catch (Exception ex)
        {
            return new TestWebhookSubscriptionResult(false, ex.Message);
        }
        finally
        {
            subscription.Events = originalEvents;
            subscription.IsActive = originalIsActive;
            await context.SaveChangesAsync(CancellationToken.None);
        }
    }
}
