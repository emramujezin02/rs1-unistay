using UniStay.Application.Modules.Payments.Commands.CreatePaymentIntent;
using UniStay.Application.Modules.Payments.Commands.StripeWebhook;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/payments")]
public sealed class PaymentsController(ISender sender) : ControllerBase
{
    [HttpPost("create-intent")]
    [Authorize]
    public async Task<ActionResult<CreatePaymentIntentResult>> CreateIntent(
        [FromBody] CreatePaymentIntentCommand command,
        CancellationToken cancellationToken)
    {
        var result = await sender.Send(command, cancellationToken);
        return Ok(result);
    }

    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook(CancellationToken cancellationToken)
    {
        using var reader = new StreamReader(Request.Body);
        var payload = await reader.ReadToEndAsync(cancellationToken);
        var signature = Request.Headers["Stripe-Signature"].ToString();

        var result = await sender.Send(
            new StripeWebhookCommand(payload, signature),
            cancellationToken);

        return result.SignatureValid ? Ok() : BadRequest();
    }
}
