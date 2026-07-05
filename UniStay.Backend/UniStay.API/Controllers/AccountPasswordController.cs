using UniStay.Application.Modules.Account.Password.Commands.Reset;
using UniStay.Application.Modules.Account.Password.Commands.SendResetToken;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/account/password")]
public sealed class AccountPasswordController(ISender sender) : ControllerBase
{
    [HttpPost("send-email-token")]
    [AllowAnonymous]
    public async Task SendEmailToken([FromQuery] string email, CancellationToken ct)
    {
        await sender.Send(new SendPasswordResetTokenCommand { Email = email }, ct);
    }

    [HttpPost("reset")]
    [AllowAnonymous]
    public async Task ResetPassword([FromBody] ResetPasswordCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }
}
