namespace UniStay.Application.Modules.AccommodationApplications.Queries.DownloadDocument;

public sealed record DownloadApplicationDocumentResult(
    Stream Content,
    string FileName,
    string ContentType);
