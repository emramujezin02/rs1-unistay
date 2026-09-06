using UniStay.Application.Modules.AccommodationApplications.Commands.ApproveApplication;
using UniStay.Application.Modules.AccommodationApplications.Commands.CreateApplication;
using UniStay.Application.Modules.AccommodationApplications.Commands.RejectApplication;
using UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;
using UniStay.Application.Modules.AccommodationApplications.Queries.GetAllApplications;
using UniStay.Application.Modules.AccommodationApplications.Queries.GetApplicationById;
using UniStay.Application.Modules.AccommodationApplications.Queries.GetMyApplications;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/applications")]
public sealed class AccommodationApplicationsController(ISender sender) : ControllerBase
{
    [HttpGet("min-gpa")]
    [AllowAnonymous]
    public ActionResult<MinGpaResult> GetMinGpa()
    {
        return Ok(new MinGpaResult(MinimumGpa: 5.0));
    }

    [HttpPost]
    public async Task<ActionResult<CreateApplicationResult>> Create(
        [FromBody] CreateApplicationCommand command,
        CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.ApplicationId }, result);
    }

    [HttpPost("{id:int}/approve")]
    public async Task<ActionResult<ApproveApplicationResult>> Approve(
        int id,
        [FromBody] ApproveApplicationRequest request,
        CancellationToken ct)
    {
        var result = await sender.Send(new ApproveApplicationCommand(id, request.BedId), ct);
        return Ok(result);
    }

    [HttpPost("{id:int}/reject")]
    public async Task<ActionResult<RejectApplicationResult>> Reject(int id, CancellationToken ct)
    {
        var result = await sender.Send(new RejectApplicationCommand(id), ct);
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<ActionResult<GetMyApplicationsResult>> GetMy(CancellationToken ct)
    {
        var result = await sender.Send(new GetMyApplicationsQuery(), ct);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<GetAllApplicationsResult>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? searchTerm,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await sender.Send(new GetAllApplicationsQuery(status, searchTerm, pageNumber, pageSize), ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetApplicationByIdResult>> GetById(int id, CancellationToken ct)
    {
        var result = await sender.Send(new GetApplicationByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpGet("{id:int}/documents/{fileId}")]
    public async Task<IActionResult> DownloadDocument(int id, string fileId, CancellationToken ct)
    {
        var result = await sender.Send(new DownloadApplicationDocumentQuery(id, fileId), ct);
        return File(result.Content, result.ContentType, result.FileName);
    }
}

public sealed record ApproveApplicationRequest(int BedId);

public sealed record MinGpaResult(double MinimumGpa);
