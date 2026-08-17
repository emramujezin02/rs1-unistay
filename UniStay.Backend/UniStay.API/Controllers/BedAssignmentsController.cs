using UniStay.Application.Modules.Housing.BedAssignments.Commands.Create;
using UniStay.Application.Modules.Housing.BedAssignments.Commands.Delete;
using UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByRoom;
using UniStay.Application.Modules.Housing.BedAssignments.Queries.GetByStudent;
using UniStay.Application.Modules.Housing.BedAssignments.Queries.List;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/bed-assignments")]
public sealed class BedAssignmentsController(ISender sender) : ControllerBase
{
    [HttpPost("assign")]
    public async Task<ActionResult<object>> Assign(CreateBedAssignmentCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        return Ok(new { id, message = "Bed successfully assigned to student!" });
    }

    [HttpGet]
    public async Task<PageResult<ListBedAssignmentsQueryDto>> List([FromQuery] ListBedAssignmentsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("room/{roomId:int}")]
    public async Task<IReadOnlyList<GetBedAssignmentsByRoomQueryDto>> GetByRoom(int roomId, CancellationToken ct)
    {
        return await sender.Send(new GetBedAssignmentsByRoomQuery { RoomId = roomId }, ct);
    }

    [HttpGet("student/{studentId:int}")]
    public async Task<GetBedAssignmentByStudentQueryDto> GetByStudent(int studentId, CancellationToken ct)
    {
        return await sender.Send(new GetBedAssignmentByStudentQuery { StudentId = studentId }, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult<object>> Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteBedAssignmentCommand { Id = id }, ct);
        return Ok(new { message = "Bed assignment successfully removed." });
    }
}
