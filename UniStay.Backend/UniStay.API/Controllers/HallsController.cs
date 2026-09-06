using UniStay.Application.Modules.Housing.Halls.Commands.Create;
using UniStay.Application.Modules.Housing.Halls.Commands.Delete;
using UniStay.Application.Modules.Housing.Halls.Commands.Update;
using UniStay.Application.Modules.Housing.Halls.Queries.GetById;
using UniStay.Application.Modules.Housing.Halls.Queries.List;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
[Route("api/halls")]
public class HallsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateHallCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateHallCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteHallCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetHallByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetHallByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListHallsQueryDto>> List([FromQuery] ListHallsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("/api/HallGetAllEndpoint")]
    public async Task<IReadOnlyList<HallLegacyDto>> LegacyList([FromQuery] ListHallsQuery query, CancellationToken ct)
    {
        var result = await sender.Send(ToLegacyListQuery(query), ct);

        return result.Items.Select(HallLegacyDto.FromListDto).ToList();
    }

    [HttpGet("/api/HallGetByIdEndpoint/{id:int}")]
    public async Task<HallLegacyDto> LegacyGetById(int id, CancellationToken ct)
    {
        var hall = await sender.Send(new GetHallByIdQuery { Id = id }, ct);

        return HallLegacyDto.FromGetByIdDto(hall);
    }

    [HttpPost("/api/HallCreateEndpoint")]
    public async Task<ActionResult<HallLegacyDto>> LegacyCreate(CreateHallCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        var hall = await sender.Send(new GetHallByIdQuery { Id = id }, ct);

        return Ok(HallLegacyDto.FromGetByIdDto(hall));
    }

    [HttpPut("/api/HallUpdateEndpoint/{id:int}")]
    public async Task<ActionResult<HallLegacyDto>> LegacyUpdate(int id, UpdateHallCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);

        var hall = await sender.Send(new GetHallByIdQuery { Id = id }, ct);
        return Ok(HallLegacyDto.FromGetByIdDto(hall));
    }

    [HttpDelete("/api/HallDeleteEndpoint/{id:int}")]
    public async Task<ActionResult<object>> LegacyDelete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteHallCommand { Id = id }, ct);

        return Ok(new { message = "Hall has been successfully deleted.", deletedId = id });
    }

    private static ListHallsQuery ToLegacyListQuery(ListHallsQuery query) => new()
    {
        Name = query.Name,
        MinCapacity = query.MinCapacity,
        MaxCapacity = query.MaxCapacity,
        IsAvailable = query.IsAvailable,
        Date = query.Date,
        Paging = new PageRequest { PageSize = 10000 }
    };

    public sealed class HallLegacyDto
    {
        public int HallID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string? Description { get; set; }
        public DateTime AvailableFrom { get; set; }
        public DateTime AvailableTo { get; set; }
        public bool IsAvailable { get; set; }

        public static HallLegacyDto FromListDto(ListHallsQueryDto hall) => new()
        {
            HallID = hall.Id,
            Name = hall.Name,
            Capacity = hall.Capacity,
            Description = hall.Description,
            AvailableFrom = hall.AvailableFrom,
            AvailableTo = hall.AvailableTo,
            IsAvailable = hall.IsAvailable
        };

        public static HallLegacyDto FromGetByIdDto(GetHallByIdQueryDto hall) => new()
        {
            HallID = hall.Id,
            Name = hall.Name,
            Capacity = hall.Capacity,
            Description = hall.Description,
            AvailableFrom = hall.AvailableFrom,
            AvailableTo = hall.AvailableTo,
            IsAvailable = hall.IsAvailable
        };
    }
}
