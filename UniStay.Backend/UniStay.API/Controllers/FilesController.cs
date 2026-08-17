using UniStay.Application.Modules.Files.Commands.Upload;

namespace UniStay.API.Controllers;

[ApiController]
[Authorize]
[Route("api/files")]
public sealed class FilesController(ISender sender) : ControllerBase
{
    [HttpPost("upload")]
    [RequestSizeLimit(UploadFileCommandValidator.MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = UploadFileCommandValidator.MaxFileSizeBytes)]
    public async Task<ActionResult<UploadFileResult>> Upload(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file is null)
            return BadRequest(new { message = "No file provided." });

        await using var content = file.OpenReadStream();

        var result = await sender.Send(
            new UploadFileCommand(content, file.FileName, file.Length),
            cancellationToken);

        return Ok(result);
    }
}
