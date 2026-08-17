using Microsoft.AspNetCore.Hosting;
using UniStay.Application.Abstractions;

namespace UniStay.Infrastructure.Services;

public sealed class LocalFileStorageService : IFileStorageService
{
    private readonly string _uploadsPath;

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _uploadsPath = Path.Combine(env.ContentRootPath, "uploads");
        Directory.CreateDirectory(_uploadsPath);
    }

    public async Task<StoredFileResult> SaveAsync(
        Stream content,
        string originalFileName,
        CancellationToken cancellationToken)
    {
        var ext = Path.GetExtension(originalFileName);
        var storedName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(_uploadsPath, storedName);

        await using var stream = File.Create(fullPath);
        await content.CopyToAsync(stream, cancellationToken);

        return new StoredFileResult(storedName, $"/uploads/{storedName}");
    }
}
