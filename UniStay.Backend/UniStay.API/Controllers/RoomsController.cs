using UniStay.Application.Modules.Housing.Rooms.Commands.Create;
using UniStay.Application.Modules.Housing.Rooms.Commands.Delete;
using UniStay.Application.Modules.Housing.Rooms.Commands.Update;
using UniStay.Application.Modules.Housing.Rooms.Queries.GetById;
using UniStay.Application.Modules.Housing.Rooms.Queries.List;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/rooms")]
public sealed class RoomsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateRoomCommand command, CancellationToken ct)
    {
        var id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateRoomCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteRoomCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<GetRoomByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetRoomByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<PageResult<ListRoomsQueryDto>> List([FromQuery] ListRoomsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
