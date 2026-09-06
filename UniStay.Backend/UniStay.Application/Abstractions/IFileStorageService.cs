namespace UniStay.Application.Abstractions;

public interface IFileStorageService
{
    Task<StoredFileResult> SaveAsync(
        Stream content,
        string originalFileName,
        CancellationToken cancellationToken);

    Task<StoredFileReadResult> OpenReadAsync(
        string fileId,
        CancellationToken cancellationToken);
}

public sealed record StoredFileResult(string FileId, string Url);

public sealed record StoredFileReadResult(Stream Content, string FileName, string ContentType);
