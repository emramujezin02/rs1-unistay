using UniStay.Application.Modules.HallReservations.Commands.CancelReservation;
using UniStay.Application.Modules.HallReservations.Commands.CreateReservation;
using UniStay.Application.Modules.HallReservations.Commands.UpdateReservationStatus;
using UniStay.Application.Modules.HallReservations.Queries.GetAllReservations;
using UniStay.Application.Modules.HallReservations.Queries.GetMyReservations;
using UniStay.Application.Modules.HallReservations.Queries.GetReservationById;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/halls/reservations")]
public sealed class HallReservationsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CreateReservationResult>> Create(
        [FromBody] CreateReservationCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.ReservationId }, result);
    }

    [HttpGet("my")]
    public async Task<ActionResult<GetMyReservationsResult>> GetMy(CancellationToken ct)
    {
        var result = await sender.Send(new GetMyReservationsQuery(), ct);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<GetAllReservationsResult>> GetAll(
        [FromQuery] int? hallId,
        [FromQuery] string? status,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await sender.Send(new GetAllReservationsQuery(hallId, status, pageNumber, pageSize), ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetReservationByIdResult>> GetById(int id, CancellationToken ct)
    {
        var result = await sender.Send(new GetReservationByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}/status")]
    public async Task<ActionResult<UpdateReservationStatusResult>> UpdateStatus(
        int id,
        [FromBody] UpdateReservationStatusRequest request,
        CancellationToken ct)
    {
        var result = await sender.Send(new UpdateReservationStatusCommand(id, request.Status), ct);
        return Ok(result);
    }

    [HttpPost("{id:int}/cancel")]
    public async Task<ActionResult<CancelReservationResult>> Cancel(int id, CancellationToken ct)
    {
        var result = await sender.Send(new CancelReservationCommand(id), ct);
        return Ok(result);
    }
}

public sealed record UpdateReservationStatusRequest(string Status);
