namespace UniStay.Application.Modules.Webhooks.Queries.GetWebhookSubscriptions;

public sealed class GetWebhookSubscriptionsQueryHandler(IAppDbContext context)
    : IRequestHandler<GetWebhookSubscriptionsQuery, GetWebhookSubscriptionsResult>
{
    public async Task<GetWebhookSubscriptionsResult> Handle(
        GetWebhookSubscriptionsQuery request,
        CancellationToken ct)
    {
        var subscriptions = await context.WebhookSubscriptions
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAtUtc)
            .Select(x => new WebhookSubscriptionDto(
                x.Id,
                x.Url,
                x.Description,
                x.Events.Split(',', StringSplitOptions.RemoveEmptyEntries),
                x.IsActive,
                x.CreatedAtUtc))
            .ToListAsync(ct);

        return new GetWebhookSubscriptionsResult(subscriptions);
    }
}
