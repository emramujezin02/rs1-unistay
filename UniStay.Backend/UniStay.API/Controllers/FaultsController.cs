using UniStay.Application.Modules.Housing.Faults.Commands.Create;
using UniStay.Application.Modules.Housing.Faults.Commands.Delete;
using UniStay.Application.Modules.Housing.Faults.Commands.Update;
using UniStay.Application.Modules.Housing.Faults.Queries.GetById;
using UniStay.Application.Modules.Housing.Faults.Queries.List;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("[controller]")]
public class FaultsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateFaultCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);

        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(int id, UpdateFaultCommand command, CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteFaultCommand { Id = id }, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetFaultByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetFaultByIdQuery { Id = id }, ct);
    }

    [HttpGet]
    public async Task<PageResult<ListFaultsQueryDto>> List([FromQuery] ListFaultsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("/api/FaultGetAllEndpoint")]
    public async Task<IReadOnlyList<FaultLegacyDto>> LegacyList([FromQuery] ListFaultsQuery query, CancellationToken ct)
    {
        var result = await sender.Send(ToLegacyListQuery(query), ct);

        return result.Items.Select(FaultLegacyDto.FromListDto).ToList();
    }

    [HttpGet("/api/faults/{id:int}")]
    public async Task<FaultLegacyDto> LegacyGetById(int id, CancellationToken ct)
    {
        var fault = await sender.Send(new GetFaultByIdQuery { Id = id }, ct);

        return FaultLegacyDto.FromGetByIdDto(fault);
    }

    [HttpPost("/api/FaultCreateEndpoint")]
    public async Task<ActionResult<FaultLegacyDto>> LegacyCreate(CreateFaultCommand command, CancellationToken ct)
    {
        int id = await sender.Send(command, ct);
        var fault = await sender.Send(new GetFaultByIdQuery { Id = id }, ct);

        return Ok(FaultLegacyDto.FromGetByIdDto(fault));
    }

    [HttpPut("/api/FaultUpdateEndpoint/{id:int}")]
    public async Task<ActionResult<FaultLegacyDto>> LegacyUpdate(int id, FaultLegacyUpdateDto request, CancellationToken ct)
    {
        await sender.Send(new UpdateFaultCommand
        {
            Id = id,
            Title = request.Title,
            Description = request.Description,
            Status = request.Status,
            Priority = request.Priority,
            IsResolved = request.IsResolved,
            ResolvedAtUtc = request.ResolvedAt
        }, ct);

        var fault = await sender.Send(new GetFaultByIdQuery { Id = id }, ct);
        return Ok(FaultLegacyDto.FromGetByIdDto(fault));
    }

    [HttpDelete("/api/faults/{id:int}")]
    public async Task<ActionResult<object>> LegacyDelete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteFaultCommand { Id = id }, ct);

        return Ok(new { message = "Fault has been successfully deleted.", deletedId = id });
    }

    [HttpPost("/api/faults/filter")]
    public async Task<IReadOnlyList<FaultLegacyDto>> LegacyFilter(FaultLegacyFilterDto filter, CancellationToken ct)
    {
        var result = await sender.Send(new ListFaultsQuery
        {
            Title = filter.Title,
            ReportedByUserId = filter.ReportedBy,
            IsResolved = filter.IsResolved,
            From = filter.From,
            To = filter.To,
            Paging = new PageRequest { PageSize = 10000 }
        }, ct);

        return result.Items.Select(FaultLegacyDto.FromListDto).ToList();
    }

    private static ListFaultsQuery ToLegacyListQuery(ListFaultsQuery query) => new()
    {
        Title = query.Title,
        ReportedByUserId = query.ReportedByUserId,
        IsResolved = query.IsResolved,
        From = query.From,
        To = query.To,
        RoomId = query.RoomId,
        Paging = new PageRequest { PageSize = 10000 }
    };

    public sealed class FaultLegacyUpdateDto
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Status { get; set; }
        public string? Priority { get; set; }
        public bool? IsResolved { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public sealed class FaultLegacyFilterDto
    {
        public string? Title { get; set; }
        public int? ReportedBy { get; set; }
        public bool? IsResolved { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }

    public sealed class FaultLegacyDto
    {
        public int FaultID { get; set; }
        public string Title { get; set; } = string.Empty;
        public int ReportedByUserID { get; set; }
        public string? ReportedByUserName { get; set; }
        public string? ReportedByName { get; set; }
        public string? Description { get; set; }
        public bool IsResolved { get; set; }
        public DateTime ReportedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? Priority { get; set; }
        public int RoomID { get; set; }
        public string Status { get; set; } = string.Empty;

        public static FaultLegacyDto FromListDto(ListFaultsQueryDto fault) => new()
        {
            FaultID = fault.Id,
            Title = fault.Title,
            Description = fault.Description,
            Status = fault.Status,
            IsResolved = fault.IsResolved,
            ReportedAt = fault.ReportedAtUtc,
            ResolvedAt = fault.ResolvedAtUtc,
            Priority = fault.Priority,
            ReportedByUserID = fault.ReportedByUserId,
            ReportedByUserName = fault.ReportedByUserName,
            ReportedByName = fault.ReportedByUserName,
            RoomID = fault.RoomId
        };

        public static FaultLegacyDto FromGetByIdDto(GetFaultByIdQueryDto fault) => new()
        {
            FaultID = fault.Id,
            Title = fault.Title,
            Description = fault.Description,
            Status = fault.Status,
            IsResolved = fault.IsResolved,
            ReportedAt = fault.ReportedAtUtc,
            ResolvedAt = fault.ResolvedAtUtc,
            Priority = fault.Priority,
            ReportedByUserID = fault.ReportedByUserId,
            ReportedByUserName = fault.ReportedByUserName,
            ReportedByName = fault.ReportedByUserName,
            RoomID = fault.RoomId
        };
    }
}
