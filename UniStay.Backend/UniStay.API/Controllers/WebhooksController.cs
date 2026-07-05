using UniStay.Application.Modules.Webhooks.Commands.CreateWebhookSubscription;
using UniStay.Application.Modules.Webhooks.Commands.DeleteWebhookSubscription;
using UniStay.Application.Modules.Webhooks.Commands.TestWebhookSubscription;
using UniStay.Application.Modules.Webhooks.Queries.GetWebhookSubscriptions;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/webhooks")]
public sealed class WebhooksController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<GetWebhookSubscriptionsResult>> GetAll(CancellationToken ct)
    {
        var result = await sender.Send(new GetWebhookSubscriptionsQuery(), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CreateWebhookSubscriptionResult>> Create(
        [FromBody] CreateWebhookSubscriptionCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetAll), result);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<DeleteWebhookSubscriptionResult>> Delete(int id, CancellationToken ct)
    {
        var result = await sender.Send(new DeleteWebhookSubscriptionCommand(id), ct);
        return Ok(result);
    }

    [HttpPost("{id:int}/test")]
    public async Task<ActionResult<TestWebhookSubscriptionResult>> Test(int id, CancellationToken ct)
    {
        var result = await sender.Send(new TestWebhookSubscriptionCommand(id), ct);
        return Ok(result);
    }
}
