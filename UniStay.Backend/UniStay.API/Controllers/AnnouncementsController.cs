using UniStay.Application.Modules.Announcements.Commands.CreateAnnouncement;
using UniStay.Application.Modules.Announcements.Commands.DeleteAnnouncement;
using UniStay.Application.Modules.Announcements.Queries.GetAnnouncementById;
using UniStay.Application.Modules.Announcements.Queries.GetAnnouncements;

namespace UniStay.API.Controllers;

[ApiController]
[Route("api/announcements")]
public sealed class AnnouncementsController(ISender sender) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CreateAnnouncementResult>> Create(
        [FromBody] CreateAnnouncementCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.AnnouncementId }, result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<GetAnnouncementsResult>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? audiences = null,
        CancellationToken ct = default)
    {
        var result = await sender.Send(new GetAnnouncementsQuery(pageNumber, pageSize, audiences), ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<GetAnnouncementByIdResult>> GetById(int id, CancellationToken ct)
    {
        var result = await sender.Send(new GetAnnouncementByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<ActionResult<DeleteAnnouncementResult>> Delete(int id, CancellationToken ct)
    {
        var result = await sender.Send(new DeleteAnnouncementCommand(id), ct);
        return Ok(result);
    }
}
