using UniStay.Application.Modules.Account.Invites.Commands.Send;
using UniStay.Application.Modules.Account.Invites.Queries.GetByToken;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/InviteFriendEndpoint")]
public sealed class InvitesController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize]
    [Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("invite-send")]
    public async Task<SendInviteCommandDto> Send(SendInviteCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }

    [HttpGet("by-token")]
    [AllowAnonymous]
    public async Task<GetInviteByTokenQueryDto> GetByToken([FromQuery] string token, CancellationToken ct)
    {
        return await sender.Send(new GetInviteByTokenQuery { Token = token }, ct);
    }
}
