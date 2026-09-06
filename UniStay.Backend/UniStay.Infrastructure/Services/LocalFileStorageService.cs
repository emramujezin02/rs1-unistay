using Microsoft.AspNetCore.Hosting;
using UniStay.Application.Abstractions;
using UniStay.Application.Common.Exceptions;

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

        return new StoredFileResult(storedName, storedName);
    }

    public Task<StoredFileReadResult> OpenReadAsync(
        string fileId,
        CancellationToken cancellationToken)
    {
        var storedName = NormalizeFileId(fileId);
        var fullPath = Path.GetFullPath(Path.Combine(_uploadsPath, storedName));
        var uploadsRoot = Path.GetFullPath(_uploadsPath);

        if (!fullPath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            throw new UniStayNotFoundException("File not found.");

        if (!File.Exists(fullPath))
            throw new UniStayNotFoundException("File not found.");

        Stream stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return Task.FromResult(new StoredFileReadResult(stream, storedName, GetContentType(storedName)));
    }

    private static string NormalizeFileId(string fileId)
    {
        if (string.IsNullOrWhiteSpace(fileId))
            throw new UniStayNotFoundException("File not found.");

        var value = fileId.Trim();
        if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
            value = uri.AbsolutePath;

        value = value.Replace('\\', '/');
        if (value.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            value = value["/uploads/".Length..];

        var storedName = Path.GetFileName(value);
        if (!string.Equals(value.Trim('/'), storedName, StringComparison.Ordinal) || string.IsNullOrWhiteSpace(storedName))
            throw new UniStayNotFoundException("File not found.");

        return storedName;
    }

    private static string GetContentType(string fileName)
    {
        return Path.GetExtension(fileName).ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            _ => "application/octet-stream"
        };
    }
}
