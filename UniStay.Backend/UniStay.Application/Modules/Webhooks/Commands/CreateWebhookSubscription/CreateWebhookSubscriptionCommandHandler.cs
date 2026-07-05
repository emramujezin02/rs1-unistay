using UniStay.Domain.Entities.Webhooks;

namespace UniStay.Application.Modules.Webhooks.Commands.CreateWebhookSubscription;

public sealed class CreateWebhookSubscriptionCommandHandler(IAppDbContext context)
    : IRequestHandler<CreateWebhookSubscriptionCommand, CreateWebhookSubscriptionResult>
{
    public async Task<CreateWebhookSubscriptionResult> Handle(
        CreateWebhookSubscriptionCommand request,
        CancellationToken ct)
    {
        var subscription = new WebhookSubscriptionEntity
        {
            Url = request.Url.Trim(),
            Secret = request.Secret.Trim(),
            Events = string.Join(",", request.Events.Select(x => x.Trim()).Where(x => x.Length > 0)),
            Description = request.Description.Trim(),
            IsActive = true
        };

        await context.WebhookSubscriptions.AddAsync(subscription, ct);
        await context.SaveChangesAsync(ct);

        return new CreateWebhookSubscriptionResult(subscription.Id);
    }
}
