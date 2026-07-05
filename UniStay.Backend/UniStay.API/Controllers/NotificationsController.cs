using UniStay.Application.Modules.Notifications.Commands.MarkAllAsRead;
using UniStay.Application.Modules.Notifications.Commands.MarkAsRead;
using UniStay.Application.Modules.Notifications.Commands.SaveFcmToken;
using UniStay.Application.Modules.Notifications.Queries.GetMyNotifications;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/notifications")]
public sealed class NotificationsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<GetMyNotificationsResult>> GetMine(CancellationToken ct)
    {
        var result = await sender.Send(new GetMyNotificationsQuery(), ct);
        return Ok(result);
    }

    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id, CancellationToken ct)
    {
        await sender.Send(new MarkNotificationAsReadCommand(id), ct);
        return NoContent();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken ct)
    {
        await sender.Send(new MarkAllNotificationsAsReadCommand(), ct);
        return NoContent();
    }

    [HttpPut("fcm-token")]
    public async Task<IActionResult> SaveFcmToken([FromBody] SaveFcmTokenRequest request, CancellationToken ct)
    {
        await sender.Send(new SaveFcmTokenCommand(request.Token), ct);
        return NoContent();
    }
}

public sealed record SaveFcmTokenRequest(string Token);
