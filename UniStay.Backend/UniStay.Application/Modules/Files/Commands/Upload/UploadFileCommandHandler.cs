namespace UniStay.Application.Modules.Files.Commands.Upload;

public sealed class UploadFileCommandHandler : IRequestHandler<UploadFileCommand, UploadFileResult>
{
    private readonly IFileStorageService _fileStorage;

    public UploadFileCommandHandler(IFileStorageService fileStorage)
    {
        _fileStorage = fileStorage;
    }

    public async Task<UploadFileResult> Handle(
        UploadFileCommand request,
        CancellationToken cancellationToken)
    {
        var storedFile = await _fileStorage.SaveAsync(
            request.Content,
            request.FileName,
            cancellationToken);

        return new UploadFileResult(
            storedFile.FileId,
            request.FileName,
            storedFile.Url);
    }
}
