using UniStay.Application.Modules.Account.Invites.Commands.Send;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/InviteFriendEndpoint")]
public sealed class InvitesController(ISender sender) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<SendInviteCommandDto> Send(SendInviteCommand command, CancellationToken ct)
    {
        return await sender.Send(command, ct);
    }
}
