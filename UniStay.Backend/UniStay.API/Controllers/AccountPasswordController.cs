using UniStay.Application.Modules.Account.Password.Commands.Reset;
using UniStay.Application.Modules.Account.Password.Commands.SendResetToken;
using UniStay.Application.Modules.Account.Password.Commands.StartRecovery;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/account/password")]
public sealed class AccountPasswordController(ISender sender) : ControllerBase
{
    [HttpPost("send-email-token")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("password-reset-send")]
    public async Task<IActionResult> SendEmailToken([FromQuery] string email, CancellationToken ct)
    {
        var result = await sender.Send(new SendPasswordResetTokenCommand { Email = email }, ct);
        return Ok(result);
    }

    [HttpPost("start-recovery")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("password-reset-send")]
    public async Task<IActionResult> StartRecovery([FromQuery] string email, CancellationToken ct)
    {
        var result = await sender.Send(new StartPasswordRecoveryCommand { Email = email }, ct);
        return Ok(result);
    }

    [HttpPost("reset")]
    [AllowAnonymous]
    public async Task ResetPassword([FromBody] ResetPasswordCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }
}
