namespace UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;

internal sealed record ApplicationDocumentReference(string DisplayName, string FileId)
{
    public static ApplicationDocumentReference? TryFind(string? documentNames, string requestedFileId)
    {
        var normalizedRequest = NormalizeFileId(requestedFileId);
        if (normalizedRequest is null)
            return null;

        foreach (var entry in Parse(documentNames))
        {
            if (string.Equals(NormalizeFileId(entry.FileId), normalizedRequest, StringComparison.OrdinalIgnoreCase))
                return entry;
        }

        return null;
    }

    private static IEnumerable<ApplicationDocumentReference> Parse(string? documentNames)
    {
        if (string.IsNullOrWhiteSpace(documentNames))
            yield break;

        foreach (var rawEntry in documentNames.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            var parts = rawEntry.Split('|', 2, StringSplitOptions.TrimEntries);
            var displayName = parts[0];
            var fileId = parts.Length > 1 ? parts[1] : parts[0];
            var normalizedFileId = NormalizeFileId(fileId);

            if (!string.IsNullOrWhiteSpace(displayName) && normalizedFileId is not null)
                yield return new ApplicationDocumentReference(displayName, normalizedFileId);
        }
    }

    private static string? NormalizeFileId(string? fileId)
    {
        if (string.IsNullOrWhiteSpace(fileId))
            return null;

        var value = fileId.Trim();
        if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
            value = uri.AbsolutePath;

        value = value.Replace('\\', '/');
        if (value.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase))
            value = value["/uploads/".Length..];

        if (value.Contains('/'))
            value = value[(value.LastIndexOf('/') + 1)..];

        return string.IsNullOrWhiteSpace(value) ? null : value;
    }
}
