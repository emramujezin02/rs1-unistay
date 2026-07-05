using UniStay.Application.Modules.Housing.Equipment.Commands.Create;
using UniStay.Application.Modules.Housing.Equipment.Commands.Delete;
using UniStay.Application.Modules.Housing.Equipment.Commands.Update;
using UniStay.Application.Modules.Housing.Equipment.Queries.GetById;
using UniStay.Application.Modules.Housing.Equipment.Queries.List;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class EquipmentController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateEquipmentCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateEquipmentCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteEquipmentCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetEquipmentByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetEquipmentByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListEquipmentQueryDto>> List([FromQuery] ListEquipmentQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("/api/EquipmentGetAllEndpoint")]
    public async Task<IReadOnlyList<EquipmentLegacyDto>> LegacyList(
        [FromQuery] string? name,
        [FromQuery] string? type,
        [FromQuery] int? minQty,
        [FromQuery] int? maxQty,
        [FromQuery] bool? availableOnly,
        CancellationToken ct)
    {
        var result = await sender.Send(new ListEquipmentQuery
        {
            Name = name,
            Type = type,
            MinQuantity = minQty,
            MaxQuantity = maxQty,
            AvailableOnly = availableOnly,
            Paging = new PageRequest { PageSize = 10000 }
        }, ct);

        return result.Items.Select(EquipmentLegacyDto.FromListDto).ToList();
    }

    [HttpGet("/api/EquipmentGetByIdEndpoint/{id:int}")]
    public async Task<EquipmentLegacyDto> LegacyGetById(int id, CancellationToken ct)
    {
        var equipment = await sender.Send(new GetEquipmentByIdQuery { Id = id }, ct);

        return EquipmentLegacyDto.FromGetByIdDto(equipment);
    }

    [HttpGet("/api/EquipmentGetOneEndpoint/{id:int}")]
    public async Task<EquipmentLegacyDto> LegacyGetOne(int id, CancellationToken ct)
    {
        var equipment = await sender.Send(new GetEquipmentByIdQuery { Id = id }, ct);

        return EquipmentLegacyDto.FromGetByIdDto(equipment);
    }

    [HttpPost("/api/EquipmentCreateEndpoint")]
    public async Task<ActionResult<EquipmentLegacyDto>> LegacyCreate(CreateEquipmentCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        var equipment = await sender.Send(new GetEquipmentByIdQuery { Id = id }, ct);

        return Ok(EquipmentLegacyDto.FromGetByIdDto(equipment));
    }

    [HttpPut("/api/EquipmentUpdateEndpoint/{id:int}")]
    public async Task<ActionResult<EquipmentLegacyDto>> LegacyUpdate(int id, UpdateEquipmentCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);

        var equipment = await sender.Send(new GetEquipmentByIdQuery { Id = id }, ct);
        return Ok(EquipmentLegacyDto.FromGetByIdDto(equipment));
    }

    [HttpDelete("/api/EquipmentDeleteEndpoint/{id:int}")]
    public async Task<ActionResult<object>> LegacyDelete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteEquipmentCommand { Id = id }, ct);

        return Ok(new { message = "Deleted", deletedId = id });
    }

    public sealed class EquipmentLegacyDto
    {
        public int EquipmentID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public int AvailableQuantity { get; set; }
        public string? RentalPrice { get; set; }
        public string? EquipmentType { get; set; }

        public static EquipmentLegacyDto FromListDto(ListEquipmentQueryDto equipment) => new()
        {
            EquipmentID = equipment.Id,
            Name = equipment.Name,
            Description = equipment.Description,
            Quantity = equipment.Quantity,
            AvailableQuantity = equipment.AvailableQuantity,
            RentalPrice = equipment.RentalPrice,
            EquipmentType = equipment.EquipmentType
        };

        public static EquipmentLegacyDto FromGetByIdDto(GetEquipmentByIdQueryDto equipment) => new()
        {
            EquipmentID = equipment.Id,
            Name = equipment.Name,
            Description = equipment.Description,
            Quantity = equipment.Quantity,
            AvailableQuantity = equipment.AvailableQuantity,
            RentalPrice = equipment.RentalPrice,
            EquipmentType = equipment.EquipmentType
        };
    }
}
