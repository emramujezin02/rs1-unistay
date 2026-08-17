namespace UniStay.Application.Modules.Files.Commands.Upload;

public sealed record UploadFileCommand(
    Stream Content,
    string FileName,
    long Length) : IRequest<UploadFileResult>;
