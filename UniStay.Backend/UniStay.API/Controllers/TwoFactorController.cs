using UniStay.Application.Modules.Account.TwoFactor.Commands.Disable;
using UniStay.Application.Modules.Account.TwoFactor.Commands.Enable;
using UniStay.Application.Modules.Account.TwoFactor.Commands.SendCode;
using UniStay.Application.Modules.Account.TwoFactor.Commands.Verify;
using UniStay.Application.Modules.Auth.Commands.Login;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/account/2fa")]
public sealed class TwoFactorController(ISender sender) : ControllerBase
{
    [HttpPost("enable")]
    [Authorize]
    public async Task<EnableTwoFactorCommandDto> Enable(EnableTwoFactorCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }

    [HttpPost("disable")]
    [Authorize]
    public async Task Disable(DisableTwoFactorCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }

    [HttpPost("send-code")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("two-factor-send-code")]
    public async Task SendCode(SendTwoFactorCodeCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }

    [HttpPost("verify")]
    [AllowAnonymous]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("two-factor-verify")]
    public async Task<LoginCommandDto> Verify(VerifyTwoFactorCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }
}
