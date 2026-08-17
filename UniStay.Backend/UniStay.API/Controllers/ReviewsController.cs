using UniStay.Application.Modules.Housing.Reviews.Commands.Create;
using UniStay.Application.Modules.Housing.Reviews.Commands.React;
using UniStay.Application.Modules.Housing.Reviews.Queries.ListByRoom;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/reviews")]
public sealed class ReviewsController(ISender sender) : ControllerBase
{
    [HttpGet("{roomId:int}")]
    [AllowAnonymous]
    public async Task<IReadOnlyList<ListRoomReviewsQueryDto>> GetByRoom(int roomId, CancellationToken ct)
    {
        return await sender.Send(new ListRoomReviewsQuery { RoomId = roomId }, ct);
    }

    [HttpPost("add")]
    public async Task<ActionResult<int>> Add(CreateRoomReviewCommand command, CancellationToken ct)
    {
        var id = await sender.Send(command, ct);
        return Ok(id);
    }

    [HttpPost("react")]
    public async Task React(ReactToRoomReviewCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }
}
