using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Assign;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Availability;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Create;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Delete;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Release;
using UniStay.Application.Modules.Housing.EquipmentItems.Commands.Update;
using UniStay.Application.Modules.Housing.EquipmentItems.Queries.GetById;
using UniStay.Application.Modules.Housing.EquipmentItems.Queries.ListByEquipment;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class EquipmentItemsController(ISender sender) : ControllerBase
{
    [HttpPost("equipment/{equipmentId:int}")]
    public async Task<ActionResult<int>> Create(int equipmentId, CreateEquipmentItemCommand command, CancellationToken ct)
    {
        command.EquipmentId = equipmentId;
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpGet("equipment/{equipmentId:int}")]
    public async Task<IReadOnlyList<ListEquipmentItemsByEquipmentQueryDto>> ListByEquipment(int equipmentId, CancellationToken ct)
    {
        return await sender.Send(new ListEquipmentItemsByEquipmentQuery { EquipmentId = equipmentId }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetEquipmentItemByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateEquipmentItemCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpPut("{id:int}/availability")]
    public async Task UpdateAvailability(int id, [FromQuery] bool isAvailable, CancellationToken ct)
    {
        await sender.Send(new UpdateEquipmentItemAvailabilityCommand { Id = id, IsAvailable = isAvailable }, ct);
    }

    [HttpPost("assign")]
    public async Task Assign(AssignEquipmentItemCommand command, CancellationToken ct)
    {
        await sender.Send(command, ct);
    }

    [HttpPost("{id:int}/release")]
    public async Task Release(int id, CancellationToken ct)
    {
        await sender.Send(new ReleaseEquipmentItemCommand { Id = id }, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteEquipmentItemCommand { Id = id }, ct);
    }

    [HttpGet("/api/equipment-items/by-equipment/{equipmentId:int}")]
    public async Task<IReadOnlyList<EquipmentItemLegacyDto>> LegacyListByEquipment(int equipmentId, CancellationToken ct)
    {
        var items = await sender.Send(new ListEquipmentItemsByEquipmentQuery { EquipmentId = equipmentId }, ct);

        return items.Select(EquipmentItemLegacyDto.FromListDto).ToList();
    }

    [HttpGet("/api/equipment-records/by-equipment/{equipmentId:int}")]
    public async Task<IReadOnlyList<EquipmentItemLegacyDto>> LegacyListRecordsByEquipment(int equipmentId, CancellationToken ct)
    {
        var items = await sender.Send(new ListEquipmentItemsByEquipmentQuery { EquipmentId = equipmentId }, ct);

        return items.Select(EquipmentItemLegacyDto.FromListDto).ToList();
    }

    [HttpGet("/api/equipment-items/{id:int}")]
    public async Task<EquipmentItemLegacyDto> LegacyGetById(int id, CancellationToken ct)
    {
        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);

        return EquipmentItemLegacyDto.FromGetByIdDto(item);
    }

    [HttpGet("/api/equipment-records/get/{id:int}")]
    public async Task<EquipmentItemLegacyDto> LegacyGetRecordById(int id, CancellationToken ct)
    {
        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);

        return EquipmentItemLegacyDto.FromGetByIdDto(item);
    }

    [HttpPost("/api/equipment-items/create/{equipmentId:int}")]
    public async Task<ActionResult<EquipmentItemLegacyDto>> LegacyCreate(int equipmentId, EquipmentItemLegacyWriteDto request, CancellationToken ct)
    {
        int id = await sender.Send(new CreateEquipmentItemCommand
        {
            EquipmentId = equipmentId,
            SerialNumber = request.SerialNumber,
            IsAvailable = request.IsAvailable,
            AssignedAtUtc = request.AssignedAt,
            ReturnedAtUtc = request.ReturnedAt,
            Location = request.Location
        }, ct);

        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);
        return Ok(EquipmentItemLegacyDto.FromGetByIdDto(item));
    }

    [HttpPut("/api/equipment-records/update/{id:int}")]
    public async Task<ActionResult<EquipmentItemLegacyDto>> LegacyUpdate(int id, EquipmentItemLegacyWriteDto request, CancellationToken ct)
    {
        await sender.Send(new UpdateEquipmentItemCommand
        {
            Id = id,
            SerialNumber = request.SerialNumber,
            IsAvailable = request.IsAvailable,
            AssignedAtUtc = request.AssignedAt,
            ReturnedAtUtc = request.ReturnedAt,
            Location = request.Location
        }, ct);

        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);
        return Ok(EquipmentItemLegacyDto.FromGetByIdDto(item));
    }

    [HttpPut("/api/equipment-records/{id:int}/availability")]
    public async Task<ActionResult<EquipmentItemLegacyDto>> LegacyUpdateAvailability(int id, [FromQuery] bool isAvailable, CancellationToken ct)
    {
        await sender.Send(new UpdateEquipmentItemAvailabilityCommand { Id = id, IsAvailable = isAvailable }, ct);

        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);
        return Ok(EquipmentItemLegacyDto.FromGetByIdDto(item));
    }

    [HttpPost("/api/equipment-records/assign")]
    public async Task<ActionResult<EquipmentItemLegacyDto>> LegacyAssign(EquipmentItemLegacyAssignDto request, CancellationToken ct)
    {
        await sender.Send(new AssignEquipmentItemCommand
        {
            EquipmentItemId = request.EquipmentRecordID,
            AssignedAtUtc = request.AssignedAt,
            ReturnedAtUtc = request.ReturnedAt,
            Location = request.Location,
            StudentId = request.StudentID,
            EmployeeId = request.EmployeeID
        }, ct);

        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = request.EquipmentRecordID }, ct);
        return Ok(EquipmentItemLegacyDto.FromGetByIdDto(item));
    }

    [HttpPost("/api/equipment-records/release/{id:int}")]
    public async Task<ActionResult<EquipmentItemLegacyDto>> LegacyRelease(int id, CancellationToken ct)
    {
        await sender.Send(new ReleaseEquipmentItemCommand { Id = id }, ct);

        var item = await sender.Send(new GetEquipmentItemByIdQuery { Id = id }, ct);
        return Ok(EquipmentItemLegacyDto.FromGetByIdDto(item));
    }

    [HttpDelete("/api/equipment-items/delete/{id:int}")]
    public async Task<ActionResult<object>> LegacyDelete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteEquipmentItemCommand { Id = id }, ct);

        return Ok(new { deletedId = id });
    }

    public sealed class EquipmentItemLegacyWriteDto
    {
        public string? SerialNumber { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? ReturnedAt { get; set; }
        public string? Location { get; set; }
    }

    public sealed class EquipmentItemLegacyAssignDto
    {
        public int EquipmentRecordID { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? ReturnedAt { get; set; }
        public string? Location { get; set; }
        public int? StudentID { get; set; }
        public int? EmployeeID { get; set; }
    }

    public sealed class EquipmentItemLegacyDto
    {
        public int RecordID { get; set; }
        public int EquipmentID { get; set; }
        public string? SerialNumber { get; set; }
        public bool IsAvailable { get; set; }
        public string? Location { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? ReturnedAt { get; set; }
        public int? StudentID { get; set; }
        public int? EmployeeID { get; set; }

        public static EquipmentItemLegacyDto FromListDto(ListEquipmentItemsByEquipmentQueryDto item) => new()
        {
            RecordID = item.Id,
            SerialNumber = item.SerialNumber,
            IsAvailable = item.IsAvailable,
            Location = item.Location,
            AssignedAt = item.AssignedAtUtc,
            ReturnedAt = item.ReturnedAtUtc
        };

        public static EquipmentItemLegacyDto FromGetByIdDto(GetEquipmentItemByIdQueryDto item) => new()
        {
            RecordID = item.Id,
            EquipmentID = item.EquipmentId,
            SerialNumber = item.SerialNumber,
            IsAvailable = item.IsAvailable,
            Location = item.Location,
            AssignedAt = item.AssignedAtUtc,
            ReturnedAt = item.ReturnedAtUtc,
            StudentID = item.StudentId,
            EmployeeID = item.EmployeeId
        };
    }
}
