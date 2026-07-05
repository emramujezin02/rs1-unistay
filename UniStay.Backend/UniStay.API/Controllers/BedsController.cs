using UniStay.Application.Modules.Housing.Beds.Queries.List;
using UniStay.Application.Modules.Housing.Beds.Queries.ListFree;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/beds")]
public sealed class BedsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListBedsQueryDto>> List([FromQuery] ListBedsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("free")]
    public async Task<PageResult<ListFreeBedsQueryDto>> ListFree([FromQuery] ListFreeBedsQuery query, CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }
}
